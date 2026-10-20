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
        backToTop: "Top",
        close: "Close",
        cancel: "Cancel",
        required: "Required",
        back: "Back",
        continue: "Continue",
        save: "Save",
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
          placeholder: "e.g. Iron Ore, Quick exploration…",
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
      ventureCategoryDescriptions: {
        targeted: "Send your retainer to gather specific resources.",
        exploration:
          "Send your retainer to explore an area, discover items, and earn more experience.",
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
        description:
          "Send your retainer on an exploration venture to earn experience and various rewards.",
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
        description:
          "A short venture, available to retainers of all classes, with a random reward.",
        knownRewards: "Known rewards",
        noKnownRewards: "No known rewards",
        unknownItem: "Unknown item ({{id}})",
        communityRewardsNotice:
          "Community-sourced rewards known to be obtainable from Quick Exploration. This list may be incomplete.",
      },
      myRetainers: {
        loading: "Loading retainers...",
        noRetainerTitle: "No registered retainer",
        noRetainerDescription:
          "Add your first retainer to start tracking its activities.",
        addRetainerButton: "Add a retainer",
        editRetainerButton: "Edit {{name}}",
        restoreRetainerButton: "Restore",
        archiveRetainerButton: "Archive",
        deleteRetainerButton: "Permanently delete",
        confirmDeleteRetainer:
          "Permanently delete {{name}}? This action cannot be undone.",
        retainerActionsMenu: "Retainer actions",
        addRetainerSubmitButton: "Add",
        editRetainerSubmitButton: "Save",
        recordRunButton: "Record a result",
        addRetainerTitle: "Add a retainer",
        editRetainerTitle: "Edit a retainer",
        recordRunTitle: "Record a result",
        name: "Name",
        type: "Type",
        level: "Level",
        ilvl: "Item level",
        gathering: "Gathering",
        perception: "Perception",
        saveError: "Something went wrong. Please try again.",
        saving: "Saving...",
        retainersNumber_one: "{{count}} retainer",
        retainersNumber_other: "{{count}} retainers",
        archivedRetainersNumber: "Archived retainers ({{count}})",
      },
      recordRun: {
        stepsNavigation: "Recording steps",
        steps: {
          retainer: "Retainer",
          type: "Venture type",
          venture: "Venture",
          result: "Result",
        },
        selectRetainerHint: "Who completed the venture?",
        selectVentureKindHint:
          "What venture type did <bold>{{name}}</bold> complete?",
        selectVentureHint: "Which venture did <bold>{{name}}</bold> complete?",
        levelFilterHint:
          "Only ventures available at level {{level}} are shown.",
        search: {
          label: "Search for a venture",
          placeholder: "Search for a venture name…",
          noResults: "No ventures found.",
        },
        requirements: {
          gathering: "Gathering",
          itemLevel: "Item level",
          unmet: "{{stat}}: {{current}} / {{required}} required",
        },
        quantities: {
          targeted: "How many did {{retainerName}} bring back?",
          other: "What did {{retainerName}} bring back?",
        },
        saveError: "Could not save the result. Please try again.",
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
        backToTop: "En haut",
        close: "Fermer",
        cancel: "Annuler",
        required: "Obligatoire",
        back: "Retour",
        continue: "Continuer",
        save: "Enregistrer",
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
          placeholder: "Ex. : Minerai de fer, Tâche improvisée…",
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
        combat: "Combattant",
        miner: "Mineur",
        botanist: "Botaniste",
        fisher: "Pêcheur",
      },
      ventureCategoryDescriptions: {
        targeted: "Envoyez votre servant récupérer des ressources spécifiques.",
        exploration:
          "Envoyez votre servant explorer une zone pour découvrir des objets et gagner davantage d'expérience.",
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
        description:
          "Envoyez votre servant en exploration pour obtenir de l'expérience et diverses récompenses.",
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
        description:
          "Une expédition courte, accessible à toutes les classes de servants, avec une récompense aléatoire.",
        knownRewards: "Récompenses connues",
        noKnownRewards: "Aucune récompense connue",
        unknownItem: "Objet inconnu ({{id}})",
        communityRewardsNotice:
          "Récompenses issues de données communautaires et connues comme pouvant être obtenues avec une tâche improvisée. Cette liste peut être incomplète.",
      },
      myRetainers: {
        loading: "Chargement des servants...",
        noRetainerTitle: "Aucun servant enregistré",
        noRetainerDescription:
          "Ajoutez votre premier servant pour commencer à suivre ses activités.",
        addRetainerButton: "Ajouter un servant",
        editRetainerButton: "Modifier {{name}}",
        restoreRetainerButton: "Restaurer",
        archiveRetainerButton: "Archiver",
        deleteRetainerButton: "Supprimer définitivement",
        confirmDeleteRetainer:
          "Supprimer définitivement {{name}} ? Cette action est irréversible.",
        retainerActionsMenu: "Actions du servant",
        addRetainerSubmitButton: "Ajouter",
        editRetainerSubmitButton: "Enregistrer",
        recordRunButton: "Enregistrer un résultat",
        addRetainerTitle: "Ajouter un servant",
        editRetainerTitle: "Modifier un servant",
        recordRunTitle: "Enregistrer un résultat",
        name: "Nom",
        type: "Type",
        level: "Niveau",
        ilvl: "Niveau d'objet",
        gathering: "Collecte",
        perception: "Discernement",
        saveError: "Une erreur est survenue. Veuillez réessayer.",
        saving: "Enregistrement...",
        retainersNumber_one: "{{count}} servant",
        retainersNumber_other: "{{count}} servants",
        archivedRetainersNumber: "Servants archivés ({{count}})",
      },
      recordRun: {
        stepsNavigation: "Étapes de l'enregistrement",
        steps: {
          retainer: "Servant",
          type: "Type de tâche",
          venture: "Tâche",
          result: "Résultat",
        },
        selectRetainerHint: "Qui a réalisé cette tâche ?",
        selectVentureKindHint:
          "Quel type de tâche a été réalisé par <bold>{{name}}</bold> ?",
        selectVentureHint:
          "Quelle tâche a été réalisée par <bold>{{name}}</bold> ?",
        levelFilterHint:
          "Seules les tâches accessibles au niveau {{level}} sont affichées.",
        search: {
          label: "Rechercher une tâche",
          placeholder: "Chercher une tâche…",
          noResults: "Aucune tâche trouvée.",
        },
        requirements: {
          gathering: "Collecte",
          itemLevel: "Niveau d'objet",
          unmet: "{{stat}} : {{current}} / {{required}} requis",
        },
        quantities: {
          targeted: "Combien {{retainerName}} en a-t-il rapporté ?",
          other: "Qu'a rapporté {{retainerName}} ?",
        },
        saveError: "Impossible d'enregistrer le résultat. Veuillez réessayer.",
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
