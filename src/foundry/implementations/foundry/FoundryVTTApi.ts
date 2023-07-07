import { VTTApi } from '../../VTTApi';
import { dataURLtoFile } from '../../../utils/transformBase64DataUrlToFile';
import { FoundryVTTToCVActor } from './FoundryVTTToCVActor';

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
      console.log(uploadResult);

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
