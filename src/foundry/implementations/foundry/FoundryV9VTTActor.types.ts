// Extracted from https://github.com/AnimaBeyondDevelop/AnimaBeyondFoundry

import { BooleanField, DerivedField, NumberField, SpecialField, StringField } from './FoundryV10UpVTTActor.types';

enum ABFItems {
  SECONDARY_SPECIAL_SKILL = 'skill',
  SPELL = 'spell',
  SPELL_MAINTENANCE = 'spellMaintenance',
  SELECTED_SPELL = 'selectedSpell',
  METAMAGIC = 'metamagic',
  SUMMON = 'summon',
  LEVEL = 'level',
  LANGUAGE = 'language',
  ELAN = 'elan',
  ELAN_POWER = 'elan_power',
  TITLE = 'title',
  ADVANTAGE = 'advantage',
  DISADVANTAGE = 'disadvantage',
  CONTACT = 'contact',
  NOTE = 'note',
  PSYCHIC_DISCIPLINE = 'psychicDiscipline',
  MENTAL_PATTERN = 'mentalPattern',
  INNATE_PSYCHIC_POWER = 'innatePsychicPower',
  PSYCHIC_POWER = 'psychicPower',
  KI_SKILL = 'kiSkill',
  NEMESIS_SKILL = 'nemesisSkill',
  ARS_MAGNUS = 'arsMagnus',
  MARTIAL_ART = 'martialArt',
  CREATURE = 'creature',
  SPECIAL_SKILL = 'specialSkill',
  TECHNIQUE = 'technique',
  COMBAT_SPECIAL_SKILL = 'combatSpecialSkill',
  COMBAT_TABLE = 'combatTable',
  AMMO = 'ammo',
  WEAPON = 'weapon',
  ARMOR = 'armor',
  INVENTORY_ITEM = 'inventoryItem',
}

type ABFV9ItemBaseDataSource<T, D> = {
  _id: string;
  type: T;
  name: string;
  data: D;
  flags?: Record<string, any>;
};

enum WeaponEquippedHandType {
  ONE_HANDED = 'one-handed',
  TWO_HANDED = 'two-handed',
}

enum WeaponKnowledgeType {
  KNOWN = 'known',
  SIMILAR = 'similar',
  MIXED = 'mixed',
  DIFFERENT = 'different',
}

enum WeaponCritic {
  CUT = 'cut',
  IMPACT = 'impact',
  THRUST = 'thrust',
  HEAT = 'heat',
  ELECTRICITY = 'electricity',
  COLD = 'cold',
  ENERGY = 'energy',
}

enum NoneWeaponCritic {
  NONE = '-',
}

type OptionalWeaponCritic = WeaponCritic | NoneWeaponCritic;

enum WeaponManageabilityType {
  ONE_HAND = 'one_hand',
  TWO_HAND = 'two_hands',
  ONE_OR_TWO_HAND = 'one_or_two_hands',
}

enum WeaponShotType {
  SHOT = 'shot',
  THROW = 'throw',
}

enum WeaponSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  BIG = 'big',
}

enum WeaponSizeProportion {
  NORMAL = 'normal',
  ENORMOUS = 'enormous',
  GIANT = 'giant',
}

type WeaponItemData = {
  equipped: BooleanField;
  isShield: BooleanField;
  special: StringField;
  integrity: DerivedField;
  breaking: DerivedField;
  attack: SpecialField;
  block: SpecialField;
  damage: DerivedField;
  initiative: DerivedField;
  presence: DerivedField;
  size: { value: WeaponSize };
  sizeProportion: { value: WeaponSizeProportion };
  strRequired: {
    oneHand: DerivedField;
    twoHands: DerivedField;
  };
  quality: NumberField;
  oneOrTwoHanded: { value: WeaponEquippedHandType };
  knowledgeType: { value: WeaponKnowledgeType };
  manageabilityType: { value: WeaponManageabilityType };
  shotType: { value: WeaponShotType };
  hasOwnStr: BooleanField;
  isRanged: BooleanField;
  ammoId?: string;
  ammo?: AmmoDataSource;
  range: DerivedField;
  cadence: StringField;
  reload: DerivedField;
  weaponStrength: DerivedField;
  critic: {
    primary: { value: WeaponCritic };
    secondary: { value: OptionalWeaponCritic };
  };
};

type WeaponDataSource = ABFV9ItemBaseDataSource<
  ABFItems.WEAPON,
  WeaponItemData
>;

type AmmoItemData = {
  amount: NumberField;
  damage: DerivedField;
  critic: { value: WeaponCritic };
  integrity: DerivedField;
  breaking: DerivedField;
  presence: DerivedField;
  quality: NumberField;
  special: StringField;
};

type AmmoDataSource = ABFV9ItemBaseDataSource<ABFItems.AMMO, AmmoItemData>;

type LevelItemData = {
  level: number;
};

type LevelDataSource = ABFV9ItemBaseDataSource<
  ABFItems.LEVEL,
  LevelItemData
>;

enum ABFArmorLocation {
  COMPLETE = 'complete',
  NIGHTDRESS = 'nightdress',
  BREASTPLATE = 'breastplate',
  HEAD = 'head',
}

enum ABFArmorType {
  SOFT = 'soft',
  HARD = 'hard',
  NATURAL = 'natural',
}

type ArmorItemData = {
  cut: DerivedField;
  impact: DerivedField;
  thrust: DerivedField;
  heat: DerivedField;
  electricity: DerivedField;
  cold: DerivedField;
  energy: DerivedField;
  integrity: DerivedField;
  presence: DerivedField;
  wearArmorRequirement: DerivedField;
  movementRestriction: DerivedField;
  naturalPenalty: DerivedField;
  isEnchanted: { value: boolean };
  type: { value: ABFArmorType };
  localization: { value: ABFArmorLocation };
  quality: { value: number };
  equipped: { value: boolean };
};

type ArmorDataSource = ABFV9ItemBaseDataSource<
  ABFItems.ARMOR,
  ArmorItemData
>;

type CombatSpecialSkillItemData = Record<string, never>;

type CombatSpecialSkillDataSource = ABFV9ItemBaseDataSource<
  ABFItems.COMBAT_SPECIAL_SKILL,
  CombatSpecialSkillItemData
>;

type CombatTableItemData = Record<string, never>;

type CombatTableDataSource = ABFV9ItemBaseDataSource<
  ABFItems.COMBAT_TABLE,
  CombatTableItemData
>;

type ArsMagnusItemData = Record<string, never>;

type ArsMagnusDataSource = ABFV9ItemBaseDataSource<
  ABFItems.ARS_MAGNUS,
  ArsMagnusItemData
>;

type CreatureItemData = {
  fire: { value: unknown };
  water: { value: unknown };
  earth: { value: unknown };
  wood: { value: unknown };
  metal: { value: unknown };
};

type CreatureDataSource = ABFV9ItemBaseDataSource<
  ABFItems.CREATURE,
  CreatureItemData
>;

type KiSkillItemData = Record<string, never>;

type KiSkillDataSource = ABFV9ItemBaseDataSource<
  ABFItems.KI_SKILL,
  KiSkillItemData
>;

type MartialArtItemData = {
  grade: { value: string };
};

type MartialArtDataSource = ABFV9ItemBaseDataSource<
  ABFItems.MARTIAL_ART,
  MartialArtItemData
>;

type NemesisSkillItemData = Record<string, never>;

type NemesisSkillDataSource = ABFV9ItemBaseDataSource<
  ABFItems.NEMESIS_SKILL,
  NemesisSkillItemData
>;

type SpecialSkillItemData = Record<string, never>;

type SpecialSkillDataSource = ABFV9ItemBaseDataSource<
  ABFItems.SPECIAL_SKILL,
  SpecialSkillItemData
>;

type TechniqueItemData = {
  description: { value: string };
  level: { value: number };
  strength: { value: number };
  agility: { value: number };
  dexterity: { value: number };
  constitution: { value: number };
  willPower: { value: number };
  power: { value: number };
  martialKnowledge: { value: number };
};

type TechniqueDataSource = ABFV9ItemBaseDataSource<
  ABFItems.TECHNIQUE,
  TechniqueItemData
>;

type AdvantageItemData = Record<string, never>;

type AdvantageDataSource = ABFV9ItemBaseDataSource<
  ABFItems.ADVANTAGE,
  AdvantageItemData
>;

type ContactItemData = {
  description: { value: string };
};

type ContactDataSource = ABFV9ItemBaseDataSource<
  ABFItems.CONTACT,
  ContactItemData
>;

type DisadvantageItemData = Record<string, never>;

type DisadvantageDataSource = ABFV9ItemBaseDataSource<
  ABFItems.DISADVANTAGE,
  DisadvantageItemData
>;

type ElanItemData = {
  level: { value: string };
};

type ElanDataSource = ABFV9ItemBaseDataSource<ABFItems.ELAN, ElanItemData>;

type InventoryItemItemData = {
  amount: { value: number };
  weight: { value: number };
};

type InventoryItemDataSource = ABFV9ItemBaseDataSource<
  ABFItems.INVENTORY_ITEM,
  InventoryItemItemData
>;

type LanguageItemData = Record<string, never>;

type LanguageDataSource = ABFV9ItemBaseDataSource<
  ABFItems.LANGUAGE,
  LanguageItemData
>;

type NoteItemData = Record<string, never>;

type NoteDataSource = ABFV9ItemBaseDataSource<ABFItems.NOTE, NoteItemData>;

type TitleItemData = Record<string, never>;

type TitleDataSource = ABFV9ItemBaseDataSource<
  ABFItems.TITLE,
  TitleItemData
>;

type MetamagicItemData = {
  grade: { value: number };
};

type MetamagicDataSource = ABFV9ItemBaseDataSource<
  ABFItems.METAMAGIC,
  MetamagicItemData
>;

type SelectedSpellItemData = {
  cost: { value: number };
};

type SelectedSpellDataSource = ABFV9ItemBaseDataSource<
  ABFItems.SELECTED_SPELL,
  SelectedSpellItemData
>;

enum ABFSpellGradeNames {
  BASE = 'anima.ui.mystic.spell.grade.base.title',
  INTERMEDIATE = 'anima.ui.mystic.spell.grade.intermediate.title',
  ADVANCED = 'anima.ui.mystic.spell.grade.advanced.title',
  ARCANE = 'anima.ui.mystic.spell.grade.arcane.title',
}

type SpellGrade = {
  name: { value: ABFSpellGradeNames };
  intRequired: { value: number };
  zeon: { value: number };
  maintenanceCost: { value: number };
  description: { value: string };
};

type SpellItemData = {
  description: { value: string };
  level: { value: number };
  via: { value: string };
  spellType: { value: string };
  actionType: { value: string };
  hasDailyMaintenance: { value: boolean };
  grades: {
    base: SpellGrade;
    intermediate: SpellGrade;
    advanced: SpellGrade;
    arcane: SpellGrade;
  };
};

type SpellDataSource = ABFV9ItemBaseDataSource<
  ABFItems.SPELL,
  SpellItemData
>;

type SpellMaintenanceItemData = {
  cost: { value: number };
};

type SpellMaintenanceDataSource = ABFV9ItemBaseDataSource<
  ABFItems.SPELL_MAINTENANCE,
  SpellMaintenanceItemData
>;

type SummonItemData = Record<string, never>;

type SummonDataSource = ABFV9ItemBaseDataSource<
  ABFItems.SUMMON,
  SummonItemData
>;

type InnatePsychicPowerItemData = {
  effect: { value: string };
  value: { value: number };
};

type InnatePsychicPowerDataSource = ABFV9ItemBaseDataSource<
  ABFItems.INNATE_PSYCHIC_POWER,
  InnatePsychicPowerItemData
>;

type MentalPatternItemData = {
  bonus: { value: number };
  penalty: { value: number };
};

type MentalPatternDataSource = ABFV9ItemBaseDataSource<
  ABFItems.MENTAL_PATTERN,
  MentalPatternItemData
>;

type PsychicDisciplineItemData = Record<string, never>;

type PsychicDisciplineDataSource = ABFV9ItemBaseDataSource<
  ABFItems.PSYCHIC_DISCIPLINE,
  PsychicDisciplineItemData
>;

enum ABFPsychicPowerActionTypes {
  ACTIVE = 'active',
  PASSIVE = 'passive',
}

type PsychicPowerItemData = {
  description: { value: string };
  level: { value: number };
  effects: {
    20: { value: string };
    40: { value: string };
    80: { value: string };
    120: { value: string };
    140: { value: string };
    180: { value: string };
    240: { value: string };
    280: { value: string };
    320: { value: string };
    440: { value: string };
  };
  actionType: { value: ABFPsychicPowerActionTypes };
  hasMaintenance: { value: boolean };
  bonus: { value: number };
};

type PsychicPowerDataSource = ABFV9ItemBaseDataSource<
  ABFItems.PSYCHIC_POWER,
  PsychicPowerItemData
>;

export type ABFV9ActorDataSourceData = {
  version: number;
  ui: {
    contractibleItems: Record<string, string>;
    tabVisibility: {
      mystic: BooleanField;
      domine: BooleanField;
      psychic: BooleanField;
    };
  };
  general: {
    settings: {
      openRolls: NumberField;
      fumbles: NumberField;
      openOnDoubles: BooleanField;
      defenseType: {
        value: '' | 'resistance' | 'mass';
      };
    };
    modifiers: {
      physicalActions: NumberField;
      allActions: {
        base: NumberField;
        final: NumberField;
      };
      naturalPenalty: {
        byArmors: NumberField;
        byWearArmorRequirement: NumberField;
      };
      extraDamage: NumberField;
    };
    destinyPoints: {
      base: NumberField;
      final: NumberField;
    };
    presence: DerivedField;
    aspect: {
      hair: StringField;
      eyes: StringField;
      height: StringField;
      weight: StringField;
      age: StringField;
      gender: StringField;
      race: StringField;
      ethnicity: StringField;
      appearance: StringField;
      size: NumberField;
    };
    advantages: AdvantageDataSource[];
    contacts: ContactDataSource[];
    inventory: InventoryItemDataSource[];
    money: {
      cooper: NumberField;
      silver: NumberField;
      gold: NumberField;
    };
    description: {
      value: string;
    };
    disadvantages: DisadvantageDataSource[];
    elan: ElanDataSource[];
    experience: {
      current: NumberField;
      next: NumberField;
    };
    languages: {
      base: StringField;
      others: LanguageDataSource[];
    };
    levels: LevelDataSource[];
    notes: NoteDataSource[];
    titles: TitleDataSource[];
  };

  characteristics: {
    primaries: {
      agility: {
        value: number;
        mod: number;
      };
      constitution: {
        value: number;
        mod: number;
      };
      dexterity: {
        value: number;
        mod: number;
      };
      strength: {
        value: number;
        mod: number;
      };
      intelligence: {
        value: number;
        mod: number;
      };
      perception: {
        value: number;
        mod: number;
      };
      power: {
        value: number;
        mod: number;
      };
      willPower: {
        value: number;
        mod: number;
      };
    };
    secondaries: {
      lifePoints: {
        value: number;
        max: number;
      };
      initiative: {
        base: NumberField;
        final: NumberField;
      };
      fatigue: {
        value: number;
        max: number;
      };
      regenerationType: {
        mod: NumberField;
        final: NumberField;
      };
      regeneration: {
        normal: {
          value: number;
          period: string;
        };
        resting: {
          value: number;
          period: string;
        };
        recovery: {
          value: number;
          period: string;
        };
      };
      movementType: {
        mod: NumberField;
        final: NumberField;
      };
      movement: {
        maximum: NumberField;
        running: NumberField;
      };
      resistances: {
        physical: {
          base: NumberField;
          final: NumberField;
        };
        disease: {
          base: NumberField;
          final: NumberField;
        };
        poison: {
          base: NumberField;
          final: NumberField;
        };
        magic: {
          base: NumberField;
          final: NumberField;
        };
        psychic: {
          base: NumberField;
          final: NumberField;
        };
      };
    };
  };

  secondaries: {
    athletics: {
      acrobatics: {
        base: NumberField;
        final: NumberField;
      };
      athleticism: {
        base: NumberField;
        final: NumberField;
      };
      ride: {
        base: NumberField;
        final: NumberField;
      };
      swim: {
        base: NumberField;
        final: NumberField;
      };
      climb: {
        base: NumberField;
        final: NumberField;
      };
      jump: {
        base: NumberField;
        final: NumberField;
      };
      piloting: {
        base: NumberField;
        final: NumberField;
      };
    };
    vigor: {
      composure: {
        base: NumberField;
        final: NumberField;
      };
      featsOfStrength: {
        base: NumberField;
        final: NumberField;
      };
      withstandPain: {
        base: NumberField;
        final: NumberField;
      };
    };
    perception: {
      notice: {
        base: NumberField;
        final: NumberField;
      };
      search: {
        base: NumberField;
        final: NumberField;
      };
      track: {
        base: NumberField;
        final: NumberField;
      };
    };
    intellectual: {
      animals: {
        base: NumberField;
        final: NumberField;
      };
      science: {
        base: NumberField;
        final: NumberField;
      };
      law: {
        base: NumberField;
        final: NumberField;
      };
      herbalLore: {
        base: NumberField;
        final: NumberField;
      };
      history: {
        base: NumberField;
        final: NumberField;
      };
      tactics: {
        base: NumberField;
        final: NumberField;
      };
      medicine: {
        base: NumberField;
        final: NumberField;
      };
      memorize: {
        base: NumberField;
        final: NumberField;
      };
      navigation: {
        base: NumberField;
        final: NumberField;
      };
      occult: {
        base: NumberField;
        final: NumberField;
      };
      appraisal: {
        base: NumberField;
        final: NumberField;
      };
      magicAppraisal: {
        base: NumberField;
        final: NumberField;
      };
    };
    social: {
      style: {
        base: NumberField;
        final: NumberField;
      };
      intimidate: {
        base: NumberField;
        final: NumberField;
      };
      leadership: {
        base: NumberField;
        final: NumberField;
      };
      persuasion: {
        base: NumberField;
        final: NumberField;
      };
      trading: {
        base: NumberField;
        final: NumberField;
      };
      streetwise: {
        base: NumberField;
        final: NumberField;
      };
      etiquette: {
        base: NumberField;
        final: NumberField;
      };
    };
    subterfuge: {
      lockPicking: {
        base: NumberField;
        final: NumberField;
      };
      disguise: {
        base: NumberField;
        final: NumberField;
      };
      hide: {
        base: NumberField;
        final: NumberField;
      };
      theft: {
        base: NumberField;
        final: NumberField;
      };
      stealth: {
        base: NumberField;
        final: NumberField;
      };
      trapLore: {
        base: NumberField;
        final: NumberField;
      };
      poisons: {
        base: NumberField;
        final: NumberField;
      };
    };
    creative: {
      art: {
        base: NumberField;
        final: NumberField;
      };
      dance: {
        base: NumberField;
        final: NumberField;
      };
      forging: {
        base: NumberField;
        final: NumberField;
      };
      runes: {
        base: NumberField;
        final: NumberField;
      };
      alchemy: {
        base: NumberField;
        final: NumberField;
      };
      animism: {
        base: NumberField;
        final: NumberField;
      };
      music: {
        base: NumberField;
        final: NumberField;
      };
      sleightOfHand: {
        base: NumberField;
        final: NumberField;
      };
      ritualCalligraphy: {
        base: NumberField;
        final: NumberField;
      };
      jewelry: {
        base: NumberField;
        final: NumberField;
      };
      tailoring: {
        base: NumberField;
        final: NumberField;
      };
      puppetMaking: {
        base: NumberField;
        final: NumberField;
      };
    };
    secondarySpecialSkills: SpecialSkillDataSource[];
  };

  combat: {
    attack: {
      base: NumberField;
      final: NumberField;
    };
    block: {
      base: NumberField;
      final: NumberField;
    };
    dodge: {
      base: NumberField;
      final: NumberField;
    };
    wearArmor: NumberField;
    totalArmor: {
      at: {
        cut: NumberField;
        impact: NumberField;
        thrust: NumberField;
        heat: NumberField;
        electricity: NumberField;
        cold: NumberField;
        energy: NumberField;
      };
    };
    combatSpecialSkills: CombatSpecialSkillDataSource[];
    combatTables: CombatTableDataSource[];
    ammo: AmmoDataSource[];
    weapons: WeaponDataSource[];
    armors: ArmorDataSource[];
  };

  mystic: {
    act: {
      main: {
        base: NumberField;
        final: NumberField;
      };
      alternative: {
        base: NumberField;
        final: NumberField;
      };
    };
    zeon: {
      accumulated: number;
      value: number;
      max: number;
    };
    zeonRegeneration: {
      base: NumberField;
      final: NumberField;
    };
    innateMagic: {
      main: NumberField;
      alternative: NumberField;
    };
    magicProjection: {
      base: NumberField;
      final: NumberField;
      imbalance: {
        offensive: {
          base: NumberField;
          final: NumberField;
        };
        defensive: {
          base: NumberField;
          final: NumberField;
        };
      };
    };
    magicLevel: {
      spheres: {
        essence: NumberField;
        water: NumberField;
        earth: NumberField;
        creation: NumberField;
        darkness: NumberField;
        necromancy: NumberField;
        light: NumberField;
        destruction: NumberField;
        air: NumberField;
        fire: NumberField;
        illusion: NumberField;
      };
      total: NumberField;
      used: NumberField;
    };
    summoning: {
      summon: {
        base: NumberField;
        final: NumberField;
      };
      banish: {
        base: NumberField;
        final: NumberField;
      };
      bind: {
        base: NumberField;
        final: NumberField;
      };
      control: {
        base: NumberField;
        final: NumberField;
      };
    };
    spells: SpellDataSource[];
    spellMaintenances: SpellMaintenanceDataSource[];
    selectedSpells: SelectedSpellDataSource[];
    summons: SummonDataSource[];
    metamagics: MetamagicDataSource[];
  };

  domine: {
    kiSkills: KiSkillDataSource[];
    nemesisSkills: NemesisSkillDataSource[];
    arsMagnus: ArsMagnusDataSource[];
    martialArts: MartialArtDataSource[];
    creatures: CreatureDataSource[];
    specialSkills: SpecialSkillDataSource[];
    techniques: TechniqueDataSource[];
    seals: {
      minor: {
        earth: {
          isActive: boolean;
        };
        metal: {
          isActive: boolean;
        };
        wind: {
          isActive: boolean;
        };
        water: {
          isActive: boolean;
        };
        wood: {
          isActive: boolean;
        };
      };
      major: {
        earth: {
          isActive: boolean;
        };
        metal: {
          isActive: boolean;
        };
        wind: {
          isActive: boolean;
        };
        water: {
          isActive: boolean;
        };
        wood: {
          isActive: boolean;
        };
      };
    };
    martialKnowledge: {
      used: NumberField;
      max: NumberField;
    };
    kiAccumulation: {
      strength: {
        accumulated: NumberField;
        base: NumberField;
        final: NumberField;
      };
      agility: {
        accumulated: NumberField;
        base: NumberField;
        final: NumberField;
      };
      dexterity: {
        accumulated: NumberField;
        base: NumberField;
        final: NumberField;
      };
      constitution: {
        accumulated: NumberField;
        base: NumberField;
        final: NumberField;
      };
      willPower: {
        accumulated: NumberField;
        base: NumberField;
        final: NumberField;
      };
      power: {
        accumulated: NumberField;
        base: NumberField;
        final: NumberField;
      };
      generic: {
        value: number;
        max: number;
      };
    };
  };

  psychic: {
    psychicPotential: {
      base: NumberField;
      final: NumberField;
    };
    psychicProjection: {
      base: NumberField;
      final: NumberField;
      imbalance: {
        offensive: {
          base: NumberField;
          final: NumberField;
        };
        defensive: {
          base: NumberField;
          final: NumberField;
        };
      };
    };
    psychicPoints: {
      value: number;
      max: number;
    };
    psychicPowers: PsychicPowerDataSource[];
    psychicDisciplines: PsychicDisciplineDataSource[];
    mentalPatterns: MentalPatternDataSource[];
    innatePsychicPower: {
      amount: NumberField;
    };
    innatePsychicPowers: InnatePsychicPowerDataSource[];
  };
};
