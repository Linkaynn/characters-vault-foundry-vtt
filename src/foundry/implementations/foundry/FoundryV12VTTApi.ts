import { ABFActorV12DataSourceData } from './FoundryV12VTTActor.types';
import { FoundryVTTToCVActor } from './FoundryVTTToCVActor';
import { FoundryVTTApi } from './FoundryVTTApi';
import { getFoundryVersion } from './utils/buildFoundryVTTApiDependingOnVersion';

type FoundryV12Actor = {
  id: string;
  name: string;
  type: string;
  img: string;
  system: ABFActorV12DataSourceData;
  token: {
    name: string;
    img: string;
  };
  prototypeToken: {
    name: string;
    img: string;
    displayName: number;
    actorLink: boolean;
    appendNumber: boolean;
    prependAdjective: boolean;
    width: number;
    height: number;
    texture: {
      src: string;
      anchorX: number;
      anchorY: number;
      offsetX: number;
      offsetY: number;
      fit: string;
      scaleX: number;
      scaleY: number;
      rotation: number;
      tint: string;
      alphaThreshold: number;
    };
    hexagonalShape: number;
    lockRotation: boolean;
    rotation: number;
    alpha: number;
    disposition: number;
    displayBars: number;
    bar1: {
      attribute: string;
    };
    bar2: {
      attribute: string | null;
    };
    light: {
      negative: boolean;
      priority: number;
      alpha: number;
      angle: number;
      bright: number;
      color: string | null;
      coloration: number;
      dim: number;
      attenuation: number;
      luminosity: number;
      saturation: number;
      contrast: number;
      shadows: number;
      animation: {
        type: string | null;
        speed: number;
        intensity: number;
        reverse: boolean;
      };
      darkness: {
        min: number;
        max: number;
      };
    };
    sight: {
      enabled: boolean;
      range: number;
      angle: number;
      visionMode: string;
      color: string | null;
      attenuation: number;
      brightness: number;
      saturation: number;
      contrast: number;
    };
    detectionModes: any[];
    occludable: {
      radius: number;
    };
    ring: {
      enabled: boolean;
      colors: {
        ring: string | null;
        background: string | null;
      };
      effects: number;
      subject: {
        scale: number;
        texture: string | null;
      };
    };
    flags: Record<string, any>;
    randomImg: boolean;
  };
  items: any[];
  effects: any[];
  folder: string | null;
  flags: Record<string, any>;
  _stats: {
    coreVersion: string;
    systemId: string;
    systemVersion: string;
    createdTime: number;
    modifiedTime: number;
    lastModifiedBy: string;
  };
  permission: number;

  createEmbeddedDocuments: (type: string, data: any[]) => Promise<void>;
  deleteEmbeddedDocuments: (type: string, ids: string[]) => Promise<void>;
  update: (data: any) => Promise<void>;
};

export class FoundryV12VTTApi extends FoundryVTTApi<FoundryV12Actor> {
  async createItems<ItemType>(
    actorId: string,
    items: ItemType[],
  ): Promise<void> {
    await this.getActorByIdOrThrow(actorId).createEmbeddedDocuments(
      'Item',
      items.map((d: any) => ({
        type: d.type,
        name: d.name,
        system: d.data,
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

    this.normalizeItemsToV12(clonedActorData);

    await actorToBeUpdated.update({
      img: tokenPath,
      name: clonedActorData.name,
      system: clonedActorData.data,
      token: {
        img: tokenPath,
        name: isNew ? clonedActorData.name : actorToBeUpdated.token?.name,
      },
      prototypeToken: {
        img: tokenPath,
        name: isNew ? clonedActorData.name : actorToBeUpdated.prototypeToken?.name,
      },
      flags: {
        ...actorToBeUpdated.flags,
        ...clonedActorData.flags,
      },
    });
  }

  buildFoundryActorData(actor: FoundryV12Actor): FoundryVTTToCVActor {
    const cvActor: FoundryVTTToCVActor = {
      id: actor.id,
      name: actor.name ?? 'Unknown',
      vtt: 'foundry',
      vttVersion: getFoundryVersion(),
      data: actor.system,
      flags: actor.flags,
    };

    this.normalizeItemsFromV12(cvActor);

    return cvActor;
  }

  private normalizeItemsToV12(cvActor: FoundryVTTToCVActor) {
    const assignDataFromSystem = (i: any) => ({ ...i, system: i.data });

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

  private normalizeItemsFromV12(cvActor: FoundryVTTToCVActor) {
    const assignDataFromSystem = (i: any) => ({ ...i, data: i.system });

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