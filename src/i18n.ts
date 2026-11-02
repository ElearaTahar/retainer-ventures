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
        main: "Main navigation",
        ventures: "Ventures",
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
        title: "What venture should you send your retainer on today?",
        description:
          "Explore retainer ventures in Final Fantasy XIV and discover the rewards they can bring back.",
        resultsTitle: "Available ventures",
        resultsCount_one: "{{count}} venture",
        resultsCount_other: "{{count}} ventures",
        search: {
          label: "Search for a venture or reward",
          placeholder: "e.g. Iron Ore, Quick exploration…",
          resultsFor_one: "{{count}} venture found",
          resultsFor_other: "{{count}} ventures found",
          matchingRewards_one: "Matching reward:",
          matchingRewards_other: "Matching rewards:",
          noResults: "No ventures found",
          noResultsHint: "Try adjusting your search or filters.",
        },
      },
      retainerTypes: {
        all: "All",
        combat: "Combat",
        miner: "Miner",
        botanist: "Botanist",
        fisher: "Fisher",
      },
      ventureCategories: {
        all: "All",
        targeted: "Targeted",
        exploration: "Exploration",
        quick: "Quick exploration",
      },
      ventureFilters: {
        retainerType: "Retainer type",
        category: "Venture category",
        rewards: "Rewards",
        hasMinion: "With minion",
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
        title: "Targeted ventures",
        description: "Send your retainer to gather specific resources.",
        durationSummary: "40 to 60 min",
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
        title: "Exploration ventures",
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
        localStorageNotice:
          "Your retainers and their reports are stored only in this browser. They aren't synced across devices and may be lost if you clear your browser data.",
        addRetainerButton: "Add a retainer",
        editRetainerButton: "Edit {{name}}",
        restoreRetainerButton: "Restore",
        archiveRetainerButton: "Archive",
        deleteRetainerButton: "Permanently delete",
        confirmDeleteRetainer:
          "Permanently delete {{name}}? This action cannot be undone.",
        notProvided: "Not provided",
        retainerActionsMenu: "Retainer actions",
        addRetainerSubmitButton: "Add",
        editRetainerSubmitButton: "Save",
        recordRunButton: "Record a result",
        repeatLastRunButton: "Repeat last venture",
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
          itemLabel: "Quantity for {{itemLabel}}",
        },
        rewards: {
          showMore: "Show more rewards",
          showLess: "Show less",
          remove: "Remove",
          searchLabel: "Search for an item",
          searchPlaceholder: "Search for another item",
          removeItem: "Remove {{itemName}}",
          unrecognizedWarning_one:
            "This item is not among the known rewards. You can still save it.",
          unrecognizedWarning_other:
            "These items are not among the known rewards. You can still save them.",
        },
        saveError: "Could not save the result. Please try again.",
      },
      ventureRuns: {
        title: "Venture reports",
        empty:
          "No venture reports yet. Record a venture result to see it here.",
        unknownRetainer: "Unknown retainer",
        unknownVenture: "Unknown venture",
        runsNumber_one: "{{count}} report",
        runsNumber_other: "{{count}} reports",
        filteredRunsNumber: "{{count}} report out of {{total}}",
        filteredRunsNumber_other: "{{count}} reports out of {{total}}",
        deleteRun: "Delete the venture report",
        confirmDeleteRun:
          "Delete the {{ventureName}} result for {{retainerName}}?",
        errorDeleteRun: "Could not delete the result. Please try again.",
        showMore: "Show more",
        allRetainers: "All retainers",
        selectedRetainers_one: "{{count}} retainer selected",
        selectedRetainers_other: "{{count}} retainers selected",
        noFilteredRuns_one: "No reports for the selected retainer.",
        noFilteredRuns_other: "No reports for the selected retainers.",
        resetFilter: "Reset filter",
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
        main: "Navigation principale",
        ventures: "Tâches",
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
        title: "Quelle tâche confier à votre servant aujourd'hui ?",
        description:
          "Explorez les tâches de servants de Final Fantasy XIV et découvrez les récompenses qu'ils peuvent rapporter.",
        resultsTitle: "Tâches disponibles",
        resultsCount_one: "{{count}} tâche",
        resultsCount_other: "{{count}} tâches",
        search: {
          label: "Rechercher une tâche ou une récompense",
          placeholder: "Ex. : Minerai de fer, Tâche improvisée…",
          resultsFor_one: "{{count}} tâche trouvée",
          resultsFor_other: "{{count}} tâches trouvées",
          matchingRewards_one: "Récompense correspondante :",
          matchingRewards_other: "Récompenses correspondantes :",
          noResults: "Aucune tâche trouvée",
          noResultsHint: "Essayez de modifier votre recherche ou vos filtres.",
        },
      },
      retainerTypes: {
        all: "Tous",
        combat: "Combattant",
        miner: "Mineur",
        botanist: "Botaniste",
        fisher: "Pêcheur",
      },
      ventureCategories: {
        all: "Toutes",
        targeted: "Ciblées",
        exploration: "Exploration",
        quick: "Improvisée",
      },
      ventureFilters: {
        retainerType: "Type de servant",
        category: "Catégorie de tâche",
        rewards: "Récompenses",
        hasMinion: "Avec mascotte",
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
        title: "Tâches ciblées",
        description:
          "Envoyez votre servant récupérer des ressources spécifiques.",
        durationSummary: "40 à 60 min",
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
        title: "Tâches d'exploration",
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
        localStorageNotice:
          "Vos servants et leurs rapports sont enregistrés uniquement dans ce navigateur. Ils ne sont pas synchronisés entre vos appareils et peuvent être perdus si vous effacez les données du navigateur.",
        addRetainerButton: "Ajouter un servant",
        editRetainerButton: "Modifier {{name}}",
        restoreRetainerButton: "Restaurer",
        archiveRetainerButton: "Archiver",
        deleteRetainerButton: "Supprimer définitivement",
        confirmDeleteRetainer:
          "Supprimer définitivement {{name}} ? Cette action est irréversible.",
        notProvided: "Non renseigné",
        retainerActionsMenu: "Actions du servant",
        addRetainerSubmitButton: "Ajouter",
        editRetainerSubmitButton: "Enregistrer",
        recordRunButton: "Enregistrer un résultat",
        repeatLastRunButton: "Répéter la dernière tâche",
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
          itemLabel: "Quantité pour {{itemLabel}}",
        },
        rewards: {
          showMore: "Voir plus de récompenses",
          showLess: "Voir moins",
          remove: "Supprimer",
          searchLabel: "Rechercher un objet",
          searchPlaceholder: "Rechercher un autre objet",
          removeItem: "Supprimer {{itemName}}",
          unrecognizedWarning_one:
            "Cet objet ne figure pas parmi les récompenses connues. L'enregistrement reste possible.",
          unrecognizedWarning_other:
            "Ces objets ne figurent pas parmi les récompenses connues. L'enregistrement reste possible.",
        },
        saveError: "Impossible d'enregistrer le résultat. Veuillez réessayer.",
      },
      ventureRuns: {
        title: "Rapports de tâches",
        empty:
          "Aucun rapport de tâche pour le moment. Enregistrez le résultat d'une tâche pour le retrouver ici.",
        unknownRetainer: "Servant inconnu",
        unknownVenture: "Tâche inconnue",
        runsNumber_one: "{{count}} rapport",
        runsNumber_other: "{{count}} rapports",
        filteredRunsNumber: "{{count}} rapport sur {{total}}",
        filteredRunsNumber_other: "{{count}} rapports sur {{total}}",
        deleteRun: "Supprimer le rapport de tâche",
        confirmDeleteRun:
          "Supprimer le résultat de la tâche {{ventureName}} de {{retainerName}} ?",
        errorDeleteRun:
          "Impossible de supprimer le résultat. Veuillez réessayer.",
        showMore: "Afficher plus",
        allRetainers: "Tous les servants",
        selectedRetainers_one: "{{count}} servant sélectionné",
        selectedRetainers_other: "{{count}} servants sélectionnés",
        noFilteredRuns_one: "Aucun rapport pour le servant sélectionné.",
        noFilteredRuns_other: "Aucun rapport pour les servants sélectionnés.",
        resetFilter: "Réinitialiser",
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
