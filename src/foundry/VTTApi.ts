import { FoundryVTTToCVActor } from './implementations/foundry/FoundryVTTToCVActor';

export abstract class VTTApi<
  VTTActorType extends { id: string },
  CharactersVaultActorType extends { id: string },
> {
  abstract canUpload(): Promise<boolean>;

  abstract getActorById(id: string): VTTActorType | undefined;

  abstract getActorByIdOrThrow(id: string): VTTActorType;

  abstract getActors(): Promise<CharactersVaultActorType[]>;

  abstract createActor(): Promise<CharactersVaultActorType>;

  abstract updateActor({
    actorId,
    actorData,

    tokenPath,
    isNew,
  }: {
    actorId: string;
    actorData: CharactersVaultActorType;
    tokenPath?: string;
    isNew?: boolean;
  }): Promise<void>;

  abstract uploadToken(
    actor: CharactersVaultActorType,
    tokenAsBase64: string,
  ): Promise<{ path: string }>;

  abstract createItems<ItemType>(
    actorId: string,
    items: ItemType[],
  ): Promise<void>;

  abstract deleteItems(actorId: string, itemIds: string[]): Promise<void>;

  abstract buildFoundryActorData(actor: VTTActorType): FoundryVTTToCVActor;
}
