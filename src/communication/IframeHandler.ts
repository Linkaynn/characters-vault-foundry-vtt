import { Connection, connectToChild } from 'penpal';
import type { AsyncMethodReturns } from 'penpal/lib/types';
import { buildFoundryVTTApiDependingOnVersion } from '../foundry/implementations/foundry/utils/buildFoundryVTTApiDependingOnVersion';
import { FoundryVTTToCVActor } from '../foundry/implementations/foundry/FoundryVTTToCVActor';
import { FoundryV10UpVTTApi } from '../foundry/implementations/foundry/FoundryV10UpVTTApi';
import { FoundryV9VTTApi } from '../foundry/implementations/foundry/FoundryV9VTTApi';
import { FoundryV12VTTApi } from '../foundry/implementations/foundry/FoundryV12VTTApi';
import type {
  FoundryRollRequest,
  FoundryRollResult,
} from '../foundry/implementations/foundry/FoundryVTTApi';

// Methods exposed by Characters Vault (child) that Foundry can call
type ChildMethods = {
  getCurrentPath: () => string;
  navigateToPath: (path: string) => void;
};

export class IframeHandler {
  private connection: Connection<ChildMethods>;

  private child: AsyncMethodReturns<ChildMethods> | undefined;

  private foundryVttApi: FoundryV10UpVTTApi | FoundryV9VTTApi | FoundryV12VTTApi;

  constructor(
    private readonly iframeId: string,
    private readonly iframeOrigin: string,
  ) {
    const element = document.getElementById(this.iframeId) as HTMLIFrameElement;

    if (!element || !element.contentWindow) {
      throw new Error(`Element with id ${this.iframeId} not found`);
    }

    this.connection = connectToChild<ChildMethods>({
      iframe: element,

      childOrigin: this.iframeOrigin,

      methods: {
        createActor: this.createActor,
        updateActor: this.updateActor,
        getActors: this.getActors,
        executeRoll: this.executeRoll,
      },
    });

    this.foundryVttApi = buildFoundryVTTApiDependingOnVersion();
  }

  async start() {
    this.child = await this.connection.promise;
  }

  stop() {
    this.dispose();
  }

  async getCurrentPath(): Promise<string> {
    if (!this.child) return '';
    try {
      return await this.child.getCurrentPath();
    } catch {
      return '';
    }
  }

  async navigateToPath(path: string): Promise<void> {
    if (!this.child) return;
    try {
      await this.child.navigateToPath(path);
    } catch {
      // Ignore navigation errors
    }
  }

  private getActors = async (): Promise<FoundryVTTToCVActor[]> => {
    return await this.foundryVttApi.getActors();
  };

  private executeRoll = async (
    request: FoundryRollRequest,
  ): Promise<FoundryRollResult> => {
    return await this.foundryVttApi.executeRoll(request);
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
