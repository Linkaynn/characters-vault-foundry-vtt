import { Connection, connectToChild } from 'penpal';
import { buildFoundryVTTApiDependingOnVersion } from '../foundry/implementations/foundry/utils/buildFoundryVTTApiDependingOnVersion';
import { FoundryVTTToCVActor } from '../foundry/implementations/foundry/FoundryVTTToCVActor';
import { FoundryV10UpVTTApi } from '../foundry/implementations/foundry/FoundryV10UpVTTApi';
import { FoundryV9VTTApi } from '../foundry/implementations/foundry/FoundryV9VTTApi';
import { FoundryV12VTTApi } from '../foundry/implementations/foundry/FoundryV12VTTApi';

export class IframeHandler {
  private connection: Connection;

  private foundryVttApi: FoundryV10UpVTTApi | FoundryV9VTTApi | FoundryV12VTTApi;

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

    this.foundryVttApi = buildFoundryVTTApiDependingOnVersion();
  }

  async start() {
    await this.connection.promise;
  }

  stop() {
    this.dispose();
  }

  private getActors = async (): Promise<FoundryVTTToCVActor[]> => {
    return await this.foundryVttApi.getActors();
  };

  private createActor = async () => {
    return await this.foundryVttApi.createActor();
  };

  private updateActor = async ({
    actor,
    tokenAsBase64,
    actions,
    isNew,
  }: {
    isNew: boolean;
    tokenAsBase64?: string;
    actor: FoundryVTTToCVActor;
    actions: any[];
  }) => {
    let tokenPath: string | undefined;

    if (tokenAsBase64) {
      if (await this.foundryVttApi.canUpload()) {
        tokenPath = (await this.foundryVttApi.uploadToken(actor, tokenAsBase64))
          .path;
      } else {
        this.foundryVttApi.notify(
          'warn',
          'No tienes permisos para subir los tokens de los personajes. Pídele a tu GM que lo haga por ti.',
        );
      }
    }

    await this.foundryVttApi.updateActor({
      actorId: actor.id,
      actorData: actor,
      isNew,
      tokenPath,
    });

    for (const action of actions) {
      if (action.type === 'delete' && action.ids.length > 0) {
        await this.foundryVttApi.deleteItems(actor.id, action.ids);
      }

      if (action.type === 'create' && action.data.length > 0) {
        await this.foundryVttApi.createItems(actor.id, action.data);
      }
    }
  };

  private dispose() {
    this.connection?.destroy();
  }
}
