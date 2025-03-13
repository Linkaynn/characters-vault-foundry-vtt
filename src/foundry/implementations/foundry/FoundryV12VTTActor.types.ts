export type ABFActorV12DataSourceData = {
  version: number;
  ui: {
    contractibleItems: Record<string, any>;
    tabVisibility: {
      mystic: {
        value: boolean;
      };
      domine: {
        value: boolean;
      };
      psychic: {
        value: boolean;
      };
    };
  };
  automationOptions: {
    calculateFatigueModifier: {
      value: boolean;
    };
  };
  general: {
    settings: {
      openRolls: {
        value: number;
      };
      fumbles: {
        value: number;
      };
      openOnDoubles: {
        value: boolean;
      };
      perceiveMystic: {
        value: boolean;
      };
      perceivePsychic: {
        value: boolean;
      };
      inmaterial: {
        value: boolean;
      };
      inhuman: {
        value: boolean;
      };
      zen: {
        value: boolean;
      };
      defenseType: {
        value: string;
      };
    };
    modifiers: {
      physicalActions: {
        base: {
          value: number;
        };
        special: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      allActions: {
        base: {
          value: number;
        };
        special: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      naturalPenalty: {
        unreduced: {
          value: number;
        };
        reduction: {
          value: number;
        };
        special: {
          value: number;
        };
        final: {
          value: number;
        };
        base: {
          value: number;
        };
      };
      perceptionPenalty: {
        base: {
          value: number;
        };
        special: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      extraDamage: {
        value: number;
      };
    };
    destinyPoints: {
      base: {
        value: number;
      };
      final: {
        value: number;
      };
    };
    presence: {
      value: number;
      base: {
        value: number | null;
      };
    };
    aspect: {
      hair: {
        value: string;
      };
      eyes: {
        value: string;
      };
      height: {
        value: string;
      };
      weight: {
        value: string;
      };
      age: {
        value: string;
      };
      gender: {
        value: string;
      };
      race: {
        value: string;
      };
      ethnicity: {
        value: string;
      };
      appearance: {
        value: string;
      };
      size: {
        value: string;
      };
    };
    advantages: any[];
    contacts: any[];
    inventory: any[];
    money: {
      cooper: {
        value: number;
      };
      silver: {
        value: number;
      };
      gold: {
        value: number;
      };
    };
    description: {
      value: string;
      enriched: string;
    };
    disadvantages: any[];
    elan: any[];
    experience: {
      current: {
        value: number;
      };
      next: {
        value: number;
      };
    };
    languages: {
      base: {
        value: string;
      };
      others: any[];
    };
    levels: any[];
    notes: any[];
    titles: any[];
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
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      fatigue: {
        value: number;
        max: number;
      };
      regenerationType: {
        mod: {
          value: number;
        };
        final: {
          value: number;
        };
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
        mod: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      movement: {
        maximum: {
          value: number;
        };
        running: {
          value: number;
        };
      };
      resistances: {
        physical: {
          base: {
            value: number;
          };
          final: {
            value: number;
          };
        };
        disease: {
          base: {
            value: number;
          };
          final: {
            value: number;
          };
        };
        poison: {
          base: {
            value: number;
          };
          final: {
            value: number;
          };
        };
        magic: {
          base: {
            value: number;
          };
          final: {
            value: number;
          };
        };
        psychic: {
          base: {
            value: number;
          };
          final: {
            value: number;
          };
        };
      };
    };
  };
  secondaries: {
    athletics: {
      acrobatics: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      athleticism: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      ride: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      swim: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      climb: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      jump: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      piloting: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
    };
    vigor: {
      composure: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      featsOfStrength: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      withstandPain: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
    };
    perception: {
      notice: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      search: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      track: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
    };
    intellectual: {
      animals: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      science: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      law: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      herbalLore: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      history: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      tactics: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      medicine: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      memorize: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      navigation: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      occult: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      appraisal: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      magicAppraisal: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
    };
    social: {
      style: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      intimidate: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      leadership: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      persuasion: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      trading: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      streetwise: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      etiquette: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
    };
    subterfuge: {
      lockPicking: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      disguise: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      hide: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      theft: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      stealth: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      trapLore: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      poisons: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
    };
    creative: {
      art: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      dance: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      forging: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      runes: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      alchemy: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      animism: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      music: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      sleightOfHand: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      ritualCalligraphy: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      jewelry: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      tailoring: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
      puppetMaking: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
        attribute: {
          value: string;
        };
      };
    };
    secondarySpecialSkills: any[];
  };
  combat: {
    attack: {
      base: {
        value: number;
      };
      final: {
        value: number;
      };
    };
    block: {
      base: {
        value: number;
      };
      final: {
        value: number;
      };
    };
    dodge: {
      base: {
        value: number;
      };
      final: {
        value: number;
      };
    };
    wearArmor: {
      value: number;
    };
    totalArmor: {
      at: {
        cut: {
          value: number;
        };
        impact: {
          value: number;
        };
        thrust: {
          value: number;
        };
        heat: {
          value: number;
        };
        electricity: {
          value: number;
        };
        cold: {
          value: number;
        };
        energy: {
          value: number;
        };
      };
    };
    combatSpecialSkills: any[];
    combatTables: any[];
    ammo: any[];
    weapons: any[];
    armors: any[];
    supernaturalShields: any[];
  };
  mystic: {
    act: {
      main: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      via: any[];
    };
    zeon: {
      accumulated: number;
      value: number;
      max: number;
    };
    zeonMaintained: {
      value: number;
    };
    zeonRegeneration: {
      base: {
        value: number;
      };
      final: {
        value: number;
      };
    };
    innateMagic: {
      main: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      via: any[];
    };
    magicProjection: {
      base: {
        value: number;
      };
      final: {
        value: number;
      };
      imbalance: {
        offensive: {
          base: {
            value: number;
          };
          final: {
            value: number;
          };
        };
        defensive: {
          base: {
            value: number;
          };
          final: {
            value: number;
          };
        };
      };
    };
    magicLevel: {
      spheres: {
        essence: {
          value: number;
        };
        water: {
          value: number;
        };
        earth: {
          value: number;
        };
        creation: {
          value: number;
        };
        darkness: {
          value: number;
        };
        necromancy: {
          value: number;
        };
        light: {
          value: number;
        };
        destruction: {
          value: number;
        };
        air: {
          value: number;
        };
        fire: {
          value: number;
        };
        illusion: {
          value: number;
        };
      };
      total: {
        value: number;
      };
      used: {
        value: number;
      };
    };
    summoning: {
      summon: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      banish: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      bind: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      control: {
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
    };
    mysticSettings: {
      aptitudeForMagicDevelopment: boolean;
    };
    spells: any[];
    spellMaintenances: any[];
    selectedSpells: any[];
    summons: any[];
    metamagics: any[];
    preparedSpells: any[];
  };
  domine: {
    kiSkills: any[];
    nemesisSkills: any[];
    arsMagnus: any[];
    martialArts: any[];
    creatures: any[];
    specialSkills: any[];
    techniques: any[];
    seals: {
      minor: {
        fire: {
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
        fire: {
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
      used: {
        value: number;
      };
      max: {
        value: number;
      };
    };
    kiAccumulation: {
      strength: {
        accumulated: {
          value: number;
        };
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      agility: {
        accumulated: {
          value: number;
        };
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      dexterity: {
        accumulated: {
          value: number;
        };
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      constitution: {
        accumulated: {
          value: number;
        };
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      willPower: {
        accumulated: {
          value: number;
        };
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      power: {
        accumulated: {
          value: number;
        };
        base: {
          value: number;
        };
        final: {
          value: number;
        };
      };
      generic: {
        value: number;
        max: number;
      };
    };
  };
  psychic: {
    psychicPotential: {
      base: {
        value: number;
      };
      final: {
        value: number;
      };
    };
    psychicProjection: {
      base: {
        value: number;
      };
      final: {
        value: number;
      };
      imbalance: {
        offensive: {
          base: {
            value: number;
          };
          final: {
            value: number;
          };
        };
        defensive: {
          base: {
            value: number;
          };
          final: {
            value: number;
          };
        };
      };
    };
    psychicPoints: {
      value: number;
      max: number;
    };
    psychicSettings: {
      fatigueResistance: boolean;
    };
    psychicPowers: any[];
    psychicDisciplines: any[];
    mentalPatterns: any[];
    innatePsychicPower: {
      amount: {
        value: number;
      };
    };
    innatePsychicPowers: any[];
  };
}; 