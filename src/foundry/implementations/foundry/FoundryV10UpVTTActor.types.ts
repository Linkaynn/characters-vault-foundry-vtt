// Extracted from https://github.com/AnimaBeyondDevelop/AnimaBeyondFoundry

export type NumberField = { value: number };
export type StringField = { value: string };
export type BooleanField = { value: boolean };

export type DerivedField = {
  base: NumberField;
  final: NumberField;
};

export type SpecialField = {
  special: NumberField;
  final: NumberField;
};

export enum ABFItems {
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

export type ABFV10UpItemBaseDataSource<T, D> = {
  _id: string;
  type: T;
  name: string;
  system: D;
  flags?: Record<string, any>;
};

export enum WeaponEquippedHandType {
  ONE_HANDED = 'one-handed',
  TWO_HANDED = 'two-handed',
}

export enum WeaponKnowledgeType {
  KNOWN = 'known',
  SIMILAR = 'similar',
  MIXED = 'mixed',
  DIFFERENT = 'different',
}

export enum WeaponCritic {
  CUT = 'cut',
  IMPACT = 'impact',
  THRUST = 'thrust',
  HEAT = 'heat',
  ELECTRICITY = 'electricity',
  COLD = 'cold',
  ENERGY = 'energy',
}

export enum NoneWeaponCritic {
  NONE = '-',
}

export type OptionalWeaponCritic = WeaponCritic | NoneWeaponCritic;

export enum WeaponManageabilityType {
  ONE_HAND = 'one_hand',
  TWO_HAND = 'two_hands',
  ONE_OR_TWO_HAND = 'one_or_two_hands',
}

export enum WeaponShotType {
  SHOT = 'shot',
  THROW = 'throw',
}

export enum WeaponSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  BIG = 'big',
}

export enum WeaponSizeProportion {
  NORMAL = 'normal',
  ENORMOUS = 'enormous',
  GIANT = 'giant',
}

export type WeaponItemData = {
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

export type WeaponDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.WEAPON,
  WeaponItemData
>;

export type AmmoItemData = {
  amount: NumberField;
  damage: DerivedField;
  critic: { value: WeaponCritic };
  integrity: DerivedField;
  breaking: DerivedField;
  presence: DerivedField;
  quality: NumberField;
  special: StringField;
};

export type AmmoDataSource = ABFV10UpItemBaseDataSource<ABFItems.AMMO, AmmoItemData>;

export type LevelItemData = {
  level: number;
};

export type LevelDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.LEVEL,
  LevelItemData
>;

export enum ABFArmorLocation {
  COMPLETE = 'complete',
  NIGHTDRESS = 'nightdress',
  BREASTPLATE = 'breastplate',
  HEAD = 'head',
}

export enum ABFArmorType {
  SOFT = 'soft',
  HARD = 'hard',
  NATURAL = 'natural',
}

export type ArmorItemData = {
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

export type ArmorDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.ARMOR,
  ArmorItemData
>;

export type CombatSpecialSkillItemData = Record<string, never>;

export type CombatSpecialSkillDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.COMBAT_SPECIAL_SKILL,
  CombatSpecialSkillItemData
>;

export type CombatTableItemData = Record<string, never>;

export type CombatTableDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.COMBAT_TABLE,
  CombatTableItemData
>;

export type ArsMagnusItemData = Record<string, never>;

export type ArsMagnusDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.ARS_MAGNUS,
  ArsMagnusItemData
>;

export type CreatureItemData = {
  fire: { value: unknown };
  water: { value: unknown };
  earth: { value: unknown };
  wood: { value: unknown };
  metal: { value: unknown };
};

export type CreatureDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.CREATURE,
  CreatureItemData
>;

export type CreatureChange = {
  name: string;
  system: CreatureItemData;
};

export type KiSkillItemData = Record<string, never>;

export type KiSkillDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.KI_SKILL,
  KiSkillItemData
>;

export type MartialArtItemData = {
  grade: { value: string };
};

export type MartialArtDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.MARTIAL_ART,
  MartialArtItemData
>;

export type NemesisSkillItemData = Record<string, never>;

export type NemesisSkillDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.NEMESIS_SKILL,
  NemesisSkillItemData
>;

export type SpecialSkillItemData = Record<string, never>;

export type SpecialSkillDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.SPECIAL_SKILL,
  SpecialSkillItemData
>;

export type TechniqueItemData = {
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

export type TechniqueDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.TECHNIQUE,
  TechniqueItemData
>;

export type AdvantageItemData = Record<string, never>;

export type AdvantageDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.ADVANTAGE,
  AdvantageItemData
>;

export type ContactItemData = {
  description: { value: string };
};

export type ContactDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.CONTACT,
  ContactItemData
>;

export type DisadvantageItemData = Record<string, never>;

export type DisadvantageDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.DISADVANTAGE,
  DisadvantageItemData
>;

export type ElanItemData = {
  level: { value: string };
};

export type ElanDataSource = ABFV10UpItemBaseDataSource<ABFItems.ELAN, ElanItemData>;

export type ElanPowerItemData = {
  level: { value: number };
};

export type ElanPowerDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.ELAN_POWER,
  ElanPowerItemData
>;

export type InventoryItemItemData = {
  amount: { value: number };
  weight: { value: number };
};

export type InventoryItemDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.INVENTORY_ITEM,
  InventoryItemItemData
>;

export type LanguageItemData = Record<string, never>;

export type LanguageDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.LANGUAGE,
  LanguageItemData
>;

export type NoteItemData = Record<string, never>;

export type NoteDataSource = ABFV10UpItemBaseDataSource<ABFItems.NOTE, NoteItemData>;

export type TitleItemData = Record<string, never>;

export type TitleDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.TITLE,
  TitleItemData
>;

export type MetamagicItemData = {
  grade: { value: number };
};

export type MetamagicDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.METAMAGIC,
  MetamagicItemData
>;

export type SelectedSpellItemData = {
  cost: { value: number };
};

export type SelectedSpellDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.SELECTED_SPELL,
  SelectedSpellItemData
>;

export enum ABFSpellGradeNames {
  BASE = 'anima.ui.mystic.spell.grade.base.title',
  INTERMEDIATE = 'anima.ui.mystic.spell.grade.intermediate.title',
  ADVANCED = 'anima.ui.mystic.spell.grade.advanced.title',
  ARCANE = 'anima.ui.mystic.spell.grade.arcane.title',
}

export type SpellGrade = {
  name: { value: ABFSpellGradeNames };
  intRequired: { value: number };
  zeon: { value: number };
  maintenanceCost: { value: number };
  description: { value: string };
};

export type SpellItemData = {
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

export type SpellDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.SPELL,
  SpellItemData
>;

export type SpellMaintenanceItemData = {
  cost: { value: number };
};

export type SpellMaintenanceDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.SPELL_MAINTENANCE,
  SpellMaintenanceItemData
>;

export type SummonItemData = Record<string, never>;

export type SummonDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.SUMMON,
  SummonItemData
>;

export type InnatePsychicPowerItemData = {
  effect: { value: string };
  value: { value: number };
};

export type InnatePsychicPowerDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.INNATE_PSYCHIC_POWER,
  InnatePsychicPowerItemData
>;

export type MentalPatternItemData = {
  bonus: { value: number };
  penalty: { value: number };
};

export type MentalPatternDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.MENTAL_PATTERN,
  MentalPatternItemData
>;

export type PsychicDisciplineItemData = Record<string, never>;

export type PsychicDisciplineDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.PSYCHIC_DISCIPLINE,
  PsychicDisciplineItemData
>;

export enum ABFPsychicPowerActionTypes {
  ACTIVE = 'active',
  PASSIVE = 'passive',
}

export type PsychicPowerItemData = {
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

export type PsychicPowerDataSource = ABFV10UpItemBaseDataSource<
  ABFItems.PSYCHIC_POWER,
  PsychicPowerItemData
>;

export type ABFActorV10UpDataSourceData = {
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
