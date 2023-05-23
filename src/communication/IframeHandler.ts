import { Connection, connectToChild } from 'penpal';
import { getActorsWithOwnerPermission } from '../utils/getActorsWithOwnerPermission';
import { uploadCharacterToken } from '../token/uploadCharacterToken';
import { canUpload } from '../utils/canUpload';

export type FoundryVTTActorData = {
  id: string;
  name: string;

  vtt: 'foundry';

  data: any;

  flags: Record<string, any>;
};

export class IframeHandler {
  private connection: Connection;

  constructor(
    private readonly iframeId: string,
    private readonly iframeOrigin: string,
  ) {
    const element = document.getElementById(this.iframeId) as HTMLIFrameElement;

    if (!element || !element.contentWindow) {
      throw new Error(`Element with id ${this.iframeId} not found`);
    }

    this.connection = connectToChild({
      iframe: element,

      childOrigin: this.iframeOrigin,

      methods: {
        createActor: this.createActor,
        updateActor: this.updateActor,
        getActors: this.getActors,
      },
    });
  }

  private getActors = async (): Promise<FoundryVTTActorData[]> => {
    const actors = [...getActorsWithOwnerPermission()];

    return actors.map(this.buildFoundryActorData);
  };

  private createActor = async () => {
    const newActor = await Actor.create({
      name: 'Dummy actor (Characters Vault)',
      type: 'character',
    });

    if (!newActor) {
      throw new Error('Error creating actor');
    }

    return this.buildFoundryActorData(newActor);
  };

  private updateActor = async ({
    actor,
    tokenAsBase64,
    actions,
    isNew,
  }: {
    isNew: boolean;
    tokenAsBase64?: string;
    actor: FoundryVTTActorData;
    actions: any[];
  }) => {
    let tokenPath: string | undefined;

    if (tokenAsBase64) {
      if (canUpload()) {
        tokenPath = (await uploadCharacterToken(tokenAsBase64, actor))?.path;
      } else {
        ui.notifications?.warn(
          'No tienes permisos para subir los tokens de los personajes. Pídele a tu GM que lo haga por ti.',
        );
      }
    }

    const actors = [...getActorsWithOwnerPermission()];

    const actorToBeUpdated = actors.find((a) => a.id === actor.id);

    if (actorToBeUpdated) {
      await actorToBeUpdated.update({
        img: tokenPath,

        name: actor.name,

        data: actor.data,

        token: {
          img: tokenPath,
          name: isNew ? actor.name : actorToBeUpdated.token?.name,
        },

        flags: {
          ...actorToBeUpdated.data.flags,
          ...actor.flags,
        },
      });

      for (const action of actions) {
        if (action.type === 'delete' && action.ids.length > 0) {
          await actorToBeUpdated.deleteEmbeddedDocuments('Item', action.ids);
        }

        if (action.type === 'create' && action.data.length > 0) {
          await actorToBeUpdated.createEmbeddedDocuments(
            'Item',
            action.data.map((d: any) => ({
              type: d.type,
              name: d.name,
              data: d.data,
              flags: d.flags,
            })),
          );
        }
      }
    }
  };

  async start() {
    await this.connection.promise;
  }

  stop() {
    this.dispose();
  }

  private buildFoundryActorData = (
    actor: StoredDocument<Actor>,
  ): FoundryVTTActorData => ({
    id: actor.id,
    name: actor.name ?? 'Unknown',
    vtt: 'foundry',
    data: actor.data.data,
    flags: actor.data.flags,
  });

  private dispose() {
    this.connection?.destroy();
  }
}
