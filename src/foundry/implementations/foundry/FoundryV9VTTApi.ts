import { FoundryVTTToCVActor } from './FoundryVTTToCVActor';
import { FoundryVTTApi } from './FoundryVTTApi';
import { ABFV9ActorDataSourceData } from './FoundryV9VTTActor.types';
import { getFoundryVersion } from './utils/buildFoundryVTTApiDependingOnVersion';

type FoundryV9Actor = {
  id: string;
  name: string;
  token: {
    name: string;
    img: string;
  };

  data: {
    data: ABFV9ActorDataSourceData;
    flags: Record<string, any>;
  };

  flags: Record<string, any>;

  permission: number;

  createEmbeddedDocuments: (type: string, data: any[]) => Promise<void>;
  deleteEmbeddedDocuments: (type: string, ids: string[]) => Promise<void>;

  update: (data: any) => Promise<void>;
};

export class FoundryV9VTTApi extends FoundryVTTApi<FoundryV9Actor> {
  async createItems<ItemType>(
    actorId: string,
    items: ItemType[],
  ): Promise<void> {
    await this.getActorByIdOrThrow(actorId).createEmbeddedDocuments(
      'Item',
      items.map((d: any) => ({
        type: d.type,
        name: d.name,
        data: d.data,
        flags: d.flags,
      })),
    );
  }

  async updateActor({
    actorId,
    actorData,
    tokenPath,
    isNew,
  }: {
    actorId: string;
    actorData: FoundryVTTToCVActor;
    tokenPath?: string;
    isNew?: boolean;
  }): Promise<void> {
    const actorToBeUpdated = this.getActorByIdOrThrow(actorId);

    const clonedActorData = JSON.parse(JSON.stringify(actorData));

    this.normalizeItemsToV9(clonedActorData);

    await actorToBeUpdated.update({
      img: tokenPath,

      name: clonedActorData.name,

      data: clonedActorData.data,

      token: {
        img: tokenPath,
        name: isNew ? clonedActorData.name : actorToBeUpdated.token?.name,
      },

      flags: {
        ...actorToBeUpdated.flags,
        ...clonedActorData.flags,
      },
    });
  }

  buildFoundryActorData(actor: FoundryV9Actor): FoundryVTTToCVActor {
    const cvActor: FoundryVTTToCVActor = {
      id: actor.id,
      name: actor.name ?? 'Unknown',
      vtt: 'foundry',
      vttVersion: getFoundryVersion(),
      data: actor.data.data,
      flags: actor.data.flags,
    };
    this.normalizeItemsFromV9(cvActor);

    return cvActor;
  }

  private normalizeItemsToV9(cvActor: FoundryVTTToCVActor) {
    const assignDataFromSystem = (i: any) => ({ ...i, data: i.data });

    cvActor.data.general.advantages =
      cvActor.data.general.advantages.map(assignDataFromSystem);
    cvActor.data.general.contacts =
      cvActor.data.general.contacts.map(assignDataFromSystem);
    cvActor.data.general.inventory =
      cvActor.data.general.inventory.map(assignDataFromSystem);
    cvActor.data.general.disadvantages =
      cvActor.data.general.disadvantages.map(assignDataFromSystem);
    cvActor.data.general.elan =
      cvActor.data.general.elan.map(assignDataFromSystem);
    cvActor.data.general.languages.others =
      cvActor.data.general.languages.others.map(assignDataFromSystem);
    cvActor.data.general.levels =
      cvActor.data.general.levels.map(assignDataFromSystem);

    cvActor.data.secondaries.secondarySpecialSkills =
      cvActor.data.secondaries.secondarySpecialSkills.map(assignDataFromSystem);

    cvActor.data.combat.combatSpecialSkills =
      cvActor.data.combat.combatSpecialSkills.map(assignDataFromSystem);
    cvActor.data.combat.combatTables =
      cvActor.data.combat.combatTables.map(assignDataFromSystem);
    cvActor.data.combat.ammo =
      cvActor.data.combat.ammo.map(assignDataFromSystem);
    cvActor.data.combat.weapons =
      cvActor.data.combat.weapons.map(assignDataFromSystem);
    cvActor.data.combat.armors =
      cvActor.data.combat.armors.map(assignDataFromSystem);

    cvActor.data.mystic.spells =
      cvActor.data.mystic.spells.map(assignDataFromSystem);
    cvActor.data.mystic.spellMaintenances =
      cvActor.data.mystic.spellMaintenances.map(assignDataFromSystem);
    cvActor.data.mystic.selectedSpells =
      cvActor.data.mystic.selectedSpells.map(assignDataFromSystem);
    cvActor.data.mystic.summons =
      cvActor.data.mystic.summons.map(assignDataFromSystem);
    cvActor.data.mystic.metamagics =
      cvActor.data.mystic.metamagics.map(assignDataFromSystem);

    cvActor.data.domine.kiSkills =
      cvActor.data.domine.kiSkills.map(assignDataFromSystem);
    cvActor.data.domine.nemesisSkills =
      cvActor.data.domine.nemesisSkills.map(assignDataFromSystem);
    cvActor.data.domine.arsMagnus =
      cvActor.data.domine.arsMagnus.map(assignDataFromSystem);
    cvActor.data.domine.martialArts =
      cvActor.data.domine.martialArts.map(assignDataFromSystem);
    cvActor.data.domine.creatures =
      cvActor.data.domine.creatures.map(assignDataFromSystem);
    cvActor.data.domine.specialSkills =
      cvActor.data.domine.specialSkills.map(assignDataFromSystem);
    cvActor.data.domine.techniques =
      cvActor.data.domine.techniques.map(assignDataFromSystem);

    cvActor.data.psychic.psychicPowers =
      cvActor.data.psychic.psychicPowers.map(assignDataFromSystem);
    cvActor.data.psychic.psychicDisciplines =
      cvActor.data.psychic.psychicDisciplines.map(assignDataFromSystem);
    cvActor.data.psychic.mentalPatterns =
      cvActor.data.psychic.mentalPatterns.map(assignDataFromSystem);
    cvActor.data.psychic.innatePsychicPowers =
      cvActor.data.psychic.innatePsychicPowers.map(assignDataFromSystem);
  }

  private normalizeItemsFromV9(cvActor: FoundryVTTToCVActor) {
    const assignDataFromSystem = (i: any) => ({ ...i, data: i.data });

    cvActor.data.general.advantages =
      cvActor.data.general.advantages.map(assignDataFromSystem);
    cvActor.data.general.contacts =
      cvActor.data.general.contacts.map(assignDataFromSystem);
    cvActor.data.general.inventory =
      cvActor.data.general.inventory.map(assignDataFromSystem);
    cvActor.data.general.disadvantages =
      cvActor.data.general.disadvantages.map(assignDataFromSystem);
    cvActor.data.general.elan =
      cvActor.data.general.elan.map(assignDataFromSystem);
    cvActor.data.general.languages.others =
      cvActor.data.general.languages.others.map(assignDataFromSystem);
    cvActor.data.general.levels =
      cvActor.data.general.levels.map(assignDataFromSystem);

    cvActor.data.secondaries.secondarySpecialSkills =
      cvActor.data.secondaries.secondarySpecialSkills.map(assignDataFromSystem);

    cvActor.data.combat.combatSpecialSkills =
      cvActor.data.combat.combatSpecialSkills.map(assignDataFromSystem);
    cvActor.data.combat.combatTables =
      cvActor.data.combat.combatTables.map(assignDataFromSystem);
    cvActor.data.combat.ammo =
      cvActor.data.combat.ammo.map(assignDataFromSystem);
    cvActor.data.combat.weapons =
      cvActor.data.combat.weapons.map(assignDataFromSystem);
    cvActor.data.combat.armors =
      cvActor.data.combat.armors.map(assignDataFromSystem);

    cvActor.data.mystic.spells =
      cvActor.data.mystic.spells.map(assignDataFromSystem);
    cvActor.data.mystic.spellMaintenances =
      cvActor.data.mystic.spellMaintenances.map(assignDataFromSystem);
    cvActor.data.mystic.selectedSpells =
      cvActor.data.mystic.selectedSpells.map(assignDataFromSystem);
    cvActor.data.mystic.summons =
      cvActor.data.mystic.summons.map(assignDataFromSystem);
    cvActor.data.mystic.metamagics =
      cvActor.data.mystic.metamagics.map(assignDataFromSystem);

    cvActor.data.domine.kiSkills =
      cvActor.data.domine.kiSkills.map(assignDataFromSystem);
    cvActor.data.domine.nemesisSkills =
      cvActor.data.domine.nemesisSkills.map(assignDataFromSystem);
    cvActor.data.domine.arsMagnus =
      cvActor.data.domine.arsMagnus.map(assignDataFromSystem);
    cvActor.data.domine.martialArts =
      cvActor.data.domine.martialArts.map(assignDataFromSystem);
    cvActor.data.domine.creatures =
      cvActor.data.domine.creatures.map(assignDataFromSystem);
    cvActor.data.domine.specialSkills =
      cvActor.data.domine.specialSkills.map(assignDataFromSystem);
    cvActor.data.domine.techniques =
      cvActor.data.domine.techniques.map(assignDataFromSystem);

    cvActor.data.psychic.psychicPowers =
      cvActor.data.psychic.psychicPowers.map(assignDataFromSystem);
    cvActor.data.psychic.psychicDisciplines =
      cvActor.data.psychic.psychicDisciplines.map(assignDataFromSystem);
    cvActor.data.psychic.mentalPatterns =
      cvActor.data.psychic.mentalPatterns.map(assignDataFromSystem);
    cvActor.data.psychic.innatePsychicPowers =
      cvActor.data.psychic.innatePsychicPowers.map(assignDataFromSystem);
  }
}
