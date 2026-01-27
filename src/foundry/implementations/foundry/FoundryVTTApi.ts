import { VTTApi } from '../../VTTApi';
import { dataURLtoFile } from '../../../utils/transformBase64DataUrlToFile';
import { FoundryVTTToCVActor } from './FoundryVTTToCVActor';

export type FoundryRollRequest = {
  label: string;
  diceType: 'd100' | 'd10' | 'd100-no-explode';
  modifier: number;
  canPifia: boolean;
  pifiaContext?: { modifier: number; hasGoodLuck: boolean; hasBadLuck: boolean };
  isGmOnly: boolean;
  characterName?: string;
};

export type FoundryRollResult = {
  success: boolean;
  error?: string;
};

type BaseActor = {
  id: string;
  name: string;
  token: {
    name: string;
    img: string;
  };

  flags: Record<string, any>;

  permission: number;

  createEmbeddedDocuments: (type: string, data: any[]) => Promise<void>;
  deleteEmbeddedDocuments: (type: string, ids: string[]) => Promise<void>;

  update: (data: any) => Promise<void>;
};

declare const Dialog: new (
  options: {
    title: string;
    content: string;
    buttons: Record<string, () => void>;
    default: string;
    render: (value: boolean) => void;
    close: () => void;
  },
  defaultDialogOptions: {
    width: number;
    height: number;
    classes: string[];
  },
) => { render: (value: boolean) => void };

declare const ui: {
  notifications?: {
    error: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
  };
};

declare const FilePicker: {
  createDirectory: (options: string, folderPath: string) => Promise<any>;
  upload: (
    options: string,
    tokenFolderPath: string,
    file: File,
  ) => Promise<any>;

  UploadResult: {
    path: string;
  };
};

declare const Actor: {
  create: <T extends BaseActor>(data: any) => Promise<T>;
  update: <T extends BaseActor>(data: any) => Promise<T>;
};

declare const game: {
  actors: BaseActor[];

  user: {
    id: string;
    isGM: boolean;
    can: (permission: string) => boolean;
  };
};

declare const Roll: {
  new (formula: string): {
    evaluate: (options?: { async: boolean }) => Promise<{
      total: number;
      toMessage: (
        data?: { flavor?: string; speaker?: { alias?: string } },
        options?: { rollMode?: string },
      ) => Promise<void>;
    }>;
  };
};

declare const CONST: {
  DICE_ROLL_MODES: {
    PUBLIC: string;
    PRIVATE: string;
    BLIND: string;
    SELF: string;
  };
};

export abstract class FoundryVTTApi<T extends BaseActor> extends VTTApi<
  T,
  FoundryVTTToCVActor
> {
  abstract createItems<ItemType>(
    actorId: string,
    items: ItemType[],
  ): Promise<void>;

  abstract buildFoundryActorData(actor: T): FoundryVTTToCVActor;

  async deleteItems(actorId: string, itemIds: string[]): Promise<void> {
    await this.getActorByIdOrThrow(actorId).deleteEmbeddedDocuments(
      'Item',
      itemIds,
    );
  }

  async getActors(): Promise<FoundryVTTToCVActor[]> {
    if (game.actors) {
      return game.actors
        .filter((a) => a.permission === 3)
        .map((a) => this.buildFoundryActorData(a as T));
    }

    return [];
  }

  async createActor(): Promise<FoundryVTTToCVActor> {
    const actor = await Actor.create({
      name: 'Dummy actor (Characters Vault)',
      type: 'character',
    });

    if (!actor) {
      throw new Error('Error creating actor');
    }

    return this.buildFoundryActorData(actor as T);
  }

  abstract updateActor({
    actorId,
    actorData,

    tokenPath,
    isNew,
  }: {
    actorId: string;
    actorData: FoundryVTTToCVActor;
    tokenPath?: string;
    isNew?: boolean;
  }): Promise<void>;

  async uploadToken(
    actor: FoundryVTTToCVActor,
    tokenAsBase64: string,
  ): Promise<{ path: string }> {
    const result = await this.uploadCharacterToken(tokenAsBase64, actor);

    if (!result) {
      throw new Error('Error uploading token');
    }

    return result;
  }

  openDialog(options: (typeof Dialog)['prototype']['options']) {
    return new Dialog(options, {
      width: 1250,
      height: 850,
      classes: ['characters-vault__iframe'],
    });
  }

  notify(type: string, message: string) {
    if (type === 'warm') {
      ui.notifications?.warn(message);
    }

    if (type === 'error') {
      ui.notifications?.error(message);
    }

    if (type === 'info') {
      ui.notifications?.info(message);
    }
  }

  async executeRoll(request: FoundryRollRequest): Promise<FoundryRollResult> {
    try {
      // Build formula based on dice type
      // 'd100' = exploding dice (1d100xa in Foundry)
      // 'd100-no-explode' = non-exploding (1d100)
      // 'd10' = 1d10
      let formula: string;
      switch (request.diceType) {
        case 'd100':
          formula = '1d100xa';
          break;
        case 'd100-no-explode':
          formula = '1d100';
          break;
        case 'd10':
          formula = '1d10';
          break;
        default:
          formula = '1d100';
      }

      // Add modifier to formula
      if (request.modifier !== 0) {
        const sign = request.modifier > 0 ? '+' : '';
        formula = `${formula}${sign}${request.modifier}`;
      }

      // Create and evaluate the roll
      const roll = new Roll(formula);
      const result = await roll.evaluate({ async: true });

      // Build speaker info
      const speaker = request.characterName
        ? { alias: request.characterName }
        : undefined;

      // Determine roll mode based on isGmOnly
      const rollMode = request.isGmOnly
        ? CONST.DICE_ROLL_MODES.BLIND
        : CONST.DICE_ROLL_MODES.PUBLIC;

      // Send roll to chat
      await result.toMessage(
        {
          flavor: request.label,
          speaker,
        },
        { rollMode },
      );

      return { success: true };
    } catch (error) {
      console.error('Error executing roll in Foundry:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async canUpload(): Promise<boolean> {
    return !!game.user?.can('FILES_UPLOAD');
  }

  private async uploadCharacterToken(
    tokenAsBase64: string,
    actor: FoundryVTTToCVActor,
  ): Promise<{ path: string }> {
    const tokenFolderPath = `characters-vault/${this.getUser().id}`;
    const file = dataURLtoFile(tokenAsBase64, `${actor.id}.png`);

    await this.createFolder(tokenFolderPath);

    const uploadResult = await FilePicker.upload('data', tokenFolderPath, file);

    if (uploadResult) {
      const r = uploadResult as typeof FilePicker.UploadResult;

      return { path: r.path };
    } else {
      throw new Error('Error uploading token');
    }
  }

  private getUser() {
    return game.user;
  }

  private async createFolder(folderPath: string) {
    const folders = folderPath.split('/');

    let currentFolder = '';

    for (const folder of folders) {
      currentFolder += `${folder}/`;

      try {
        await FilePicker.createDirectory('data', currentFolder);
      } catch (e) {
        console.log(e);
      }
    }
  }

  getActorById(id: string): T | undefined {
    return game.actors.find((a) => a.id === id) as T | undefined;
  }

  getActorByIdOrThrow(id: string): T {
    const actor = this.getActorById(id);

    if (!actor) {
      throw new Error('Actor not found');
    }

    return actor;
  }
}
