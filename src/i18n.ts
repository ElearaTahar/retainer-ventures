import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appTitle: "FFXIV Retainer Ventures",
      header: {
        language: "Language",
        switchTheme: "Switch to {{theme}} theme",
        themes: {
          light: "light",
          dark: "dark",
        },
      },
      navigation: {
        breadcrumb: "Breadcrumb",
        main: "Main navigation",
        ventures: "Ventures",
        ventureCategories: "Venture categories",
        retainers: "My Retainers",
      },
      notFound: {
        title: "Page not found",
        description: "The requested page does not exist.",
        backToVentures: "Back to Ventures",
      },
      ventures: {
        chooseRetainerType: "Choose a retainer type",
        retainerTypes: "Retainer types",
      },
      retainerTypes: {
        combat: "Combat",
        miner: "Miner",
        botanist: "Botanist",
        fisher: "Fisher",
      },
      level: "Level {{level}}",
      abbreviatedLevel: "Lv. {{level}}",
      ventureCost_one: "{{count}} venture",
      ventureCost_other: "{{count}} ventures",
      targetedVenture: {
        categories: {
          hunting: "Hunting",
          mining: "Mining",
          botany: "Botany",
          fishing: "Fishing",
        },
        description: "Short ventures targeting specific items",
        durationSummary: "40 min to 60 min depending on the retainer level",
        details: {
          experience: "Experience",
          requirement: "Requirement",
          gathering: "Gathering {{value}}",
          duration: "Duration",
          yieldStats: {
            "item-level": "Retainer iLvl",
            perception: "Perception",
          },
          possibleQuantities: "Possible quantities",
          quantity: "Quantity",
          unknownItem: "Unknown item #{{id}}",
          minutesShort: "{{minutes}}m",
        },
      },
      explorationVenture: {
        categories: {
          field: "Field Exploration",
          highland: "Highland Exploration",
          woodland: "Woodland Exploration",
          waterside: "Waterside Exploration",
        },
        description: "Exploration ventures for this retainer type.",
        durationSummary: "18 hours",
        communityRewardsNotice:
          "Possible rewards are based on community data and may be incomplete.",
        details: {
          requirement: "REQUIREMENT",
          experience: "EXPERIENCE",
          itemLevelRequirement: "Retainer item level {{value}}",
          gatheringRequirement: "Gathering {{value}}",
        },
        rewards: {
          allaganPieces: "ALLAGAN PIECES",
          jobItems: {
            combat: "CRAFTING MATERIALS",
            miner: "MINING ITEMS",
            botanist: "BOTANY ITEMS",
            fisher: "FISHING ITEMS",
          },
          minions: "MINIONS",
          otherItems: "OTHER ITEMS",
        },
        unknownItem: "Unknown item ({{id}})",
        noKnownRewards: "No known rewards",
      },
    },
  },
  fr: {
    translation: {
      appTitle: "FFXIV Retainer Ventures",
      header: {
        language: "Langue",
        switchTheme: "Passer au thème {{theme}}",
        themes: {
          light: "clair",
          dark: "sombre",
        },
      },
      navigation: {
        breadcrumb: "Fil d’Ariane",
        main: "Navigation principale",
        ventures: "Tâches",
        ventureCategories: "Catégories de tâches",
        retainers: "Mes servants",
      },
      notFound: {
        title: "Page introuvable",
        description: "La page demandée n’existe pas.",
        backToVentures: "Retour aux tâches",
      },
      ventures: {
        chooseRetainerType: "Choisissez un type de servant",
        retainerTypes: "Types de servants",
      },
      retainerTypes: {
        combat: "Combat",
        miner: "Mineur",
        botanist: "Botaniste",
        fisher: "Pêcheur",
      },
      level: "Niveau {{level}}",
      abbreviatedLevel: "Niv. {{level}}",
      ventureCost_one: "{{count}} jeton de tâche",
      ventureCost_other: "{{count}} jetons de tâche",
      targetedVenture: {
        categories: {
          hunting: "Travail d'incursion",
          mining: "Travail de mineur",
          botany: "Travail de botaniste",
          fishing: "Travail de pêche",
        },
        description: "Missions courtes ciblant des objets spécifiques",
        durationSummary: "40 à 60 min selon le niveau du servant",
        details: {
          experience: "Expérience",
          requirement: "Prérequis",
          gathering: "Collecte {{value}}",
          duration: "Durée",
          yieldStats: {
            "item-level": "Niv. objet du servant",
            perception: "Discernement",
          },
          possibleQuantities: "Quantités possibles",
          quantity: "Quantité",
          unknownItem: "Objet inconnu n°{{id}}",
          minutesShort: "{{minutes}} min",
        },
      },
      explorationVenture: {
        categories: {
          field: "Exploration en plaine",
          highland: "Exploration en montagne",
          woodland: "Exploration en forêt",
          waterside: "Exploration en rivage",
        },
        description: "Tâches d'exploration pour ce type de servant.",
        durationSummary: "18 heures",
        communityRewardsNotice:
          "Les récompenses possibles reposent sur des données communautaires et peuvent être incomplètes.",
        details: {
          requirement: "PRÉREQUIS",
          experience: "EXPÉRIENCE",
          itemLevelRequirement: "Niv. objet du servant {{value}}",
          gatheringRequirement: "Collecte {{value}}",
        },
        rewards: {
          allaganPieces: "PIÈCES ALLAGOISES",
          jobItems: {
            combat: "MATÉRIAUX D'ARTISANAT",
            miner: "OBJETS DE MINEUR",
            botanist: "OBJETS DE BOTANISTE",
            fisher: "OBJETS DE PÊCHE",
          },
          minions: "MASCOTTES",
          otherItems: "AUTRES OBJETS",
        },
        unknownItem: "Objet inconnu ({{id}})",
        noKnownRewards: "Aucune récompense connue",
      },
    },
  },
};

const storedLanguage = localStorage.getItem("language");
const initialLanguage =
  storedLanguage === "en" || storedLanguage === "fr" ? storedLanguage : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: ["en", "fr"],
  nonExplicitSupportedLngs: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
