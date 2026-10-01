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
