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
        browseVentures: "Browse ventures",
        types: "Venture types",
        search: {
          title: "Looking for something specific?",
          label: "Search ventures, items or rewards",
          resultsTitle: "Search results",
          resultsFor_one: '{{count}} result for "{{query}}"',
          resultsFor_other: '{{count}} results for "{{query}}"',
          navigation: "Navigation",
          ventures: "Ventures",
          destinationColumn: "Destination",
          ventureColumn: "Venture",
          durationColumn: "Duration",
          costColumn: "Cost",
          matchingRewards_one: "Matching reward:",
          matchingRewards_other: "Matching rewards:",
          noResults: 'No results for "{{query}}"',
          noResultsHint: "Try searching for a venture, item or reward name.",
          clear: "Clear search",
        },
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
      durationHours_one: "{{count}} hour",
      durationHours_other: "{{count}} hours",
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
      quickExplorationVenture: {
        title: "Quick exploration",
        description: "A short venture with unpredictable rewards",
        knownRewards: "Known rewards",
        noKnownRewards: "No known rewards",
        unknownItem: "Unknown item ({{id}})",
        communityRewardsNotice:
          "Community-sourced rewards known to be obtainable from Quick Exploration. This list may be incomplete.",
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
        browseVentures: "Parcourez les tâches de servant",
        types: "Types de tâches",
        search: {
          title: "Vous cherchez quelque chose de précis ?",
          label: "Rechercher des tâches, objets ou récompenses",
          resultsTitle: "Résultats de recherche",
          resultsFor_one: "{{count}} résultat pour « {{query}} »",
          resultsFor_other: "{{count}} résultats pour « {{query}} »",
          navigation: "Navigation",
          ventures: "Tâches",
          destinationColumn: "Destination",
          ventureColumn: "Tâche",
          durationColumn: "Durée",
          costColumn: "Coût",
          matchingRewards_one: "Récompense correspondante :",
          matchingRewards_other: "Récompenses correspondantes :",
          noResults: "Aucun résultat pour « {{query}} »",
          noResultsHint:
            "Essayez de rechercher une tâche, un objet ou une récompense.",
          clear: "Effacer la recherche",
        },
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
      durationHours_one: "{{count}} heure",
      durationHours_other: "{{count}} heures",
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
      quickExplorationVenture: {
        title: "Tâche improvisée",
        description: "Une expédition courte aux récompenses imprévisibles",
        knownRewards: "Récompenses connues",
        noKnownRewards: "Aucune récompense connue",
        unknownItem: "Objet inconnu ({{id}})",
        communityRewardsNotice:
          "Récompenses issues de données communautaires et connues comme pouvant être obtenues avec une tâche improvisée. Cette liste peut être incomplète.",
      },
    },
  },
};

function getBrowserLanguage() {
  return navigator.language.startsWith("fr") ? "fr" : "en";
}

const storedLanguage = localStorage.getItem("language");
const initialLanguage =
  storedLanguage === "en" || storedLanguage === "fr"
    ? storedLanguage
    : getBrowserLanguage();

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

document.documentElement.lang = initialLanguage;

i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language;
});

export default i18n;
