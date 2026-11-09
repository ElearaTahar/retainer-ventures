import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      meta: {
        description:
          "Explore Final Fantasy XIV retainer ventures, manage your retainers, and track the rewards they bring back.",
      },
      appTitle: "FFXIV Retainer Ventures",
      header: {
        language: "Language",
        switchTheme: "Switch to {{theme}} theme",
        themes: {
          light: "light",
          dark: "dark",
        },
      },
      footer: {
        navigation: "Legal information",
        credit: "Created for the FFXIV community by Eleara Tahar (Louisoix).",
        disclaimer: "Independent fan project, not affiliated with Square Enix.",
      },
      legal: {
        title: "Legal notice",
        publisher: {
          title: "Website publisher",
          name: "Retainer Ventures",
        },
        publicationManager: {
          title: "Publication manager",
        },
        hosting: {
          title: "Hosting",
          description: "This website is hosted by:",
        },
        intellectualProperty: {
          title: "Intellectual property",
          sourceCode:
            "The original source code of Retainer Ventures is distributed under the MIT License.",
          thirdParty:
            "Third-party data, trademarks, graphics, icons, and other resources remain subject to the rights and licenses of their respective owners.",
        },
        ffxiv: {
          title: "Final Fantasy XIV",
          copyright: "FINAL FANTASY XIV © 2026 SQUARE ENIX CO., LTD.",
          disclaimer:
            "Retainer Ventures is an unofficial fan-made project and is not affiliated with or endorsed by Square Enix.",
        },
        liability: {
          title: "Liability",
          information:
            "The information provided by Retainer Ventures is for informational purposes only and may contain errors or incomplete data.",
          availability:
            "The publisher does not guarantee uninterrupted availability of the service and cannot be held liable for interruptions or malfunctions, to the extent permitted by law.",
        },
      },
      privacy: {
        title: "Privacy policy",
        overview: {
          title: "Overview",
          description:
            "Retainer Ventures is an independent web application for exploring Final Fantasy XIV ventures and tracking retainers. It does not require users to create an account.",
        },
        localData: {
          title: "Data stored locally",
          storage:
            "Retainer and venture tracking information is stored locally in your browser, primarily using IndexedDB. Some preferences, such as the interface language, may be saved in your browser's local storage (localStorage). This data is not synchronized with a Retainer Ventures server.",
          deletion:
            "You can delete this data by clearing the site's stored data in your browser settings. Doing so may result in the loss of your tracking information.",
        },
        thirdParties: {
          title: "Hosting",
          hosting:
            "Retainer Ventures is hosted by Railway. When you visit the website, technical data, such as your IP address, may be processed by the hosting provider to deliver the site and maintain its operation and security.",
        },
        analytics: {
          title: "Analytics",
          description:
            "Retainer Ventures does not currently use any analytics service. If one is introduced, this privacy policy will be updated to explain how it works and what data may be processed.",
        },
        rights: {
          title: "Data retention and rights",
          retention:
            "Tracking data stored in your browser remains there until you delete it, your browser removes it, or an application feature deletes it. Retainer Ventures does not keep a copy of this data on its servers.",
          contact:
            "For questions about privacy or exercising your rights regarding any personal data processed in connection with the website, you can contact the publisher using the address provided in the legal notice.",
        },
      },
      common: {
        loading: "Loading",
      },
      navigation: {
        main: "Main navigation",
        bell: "Ring the bell",
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
        history: {
          title: "My history",
          noResult: "No recorded result for this venture.",
          totalRuns_one: "{{count}} result",
          totalRuns_other: "{{count}} results",
          obtention_one: "Obtained once",
          obtention_other: "Obtained {{count}} times",
          total: "{{count}} in total",
          totalRewards_one: "{{count}} item obtained in total",
          totalRewards_other: "{{count}} items obtained in total",
          rewardsTitle: "Items obtained",
          otherRewardsTitle: "Other items obtained",
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
        editRunTitle: "Edit a result",
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
        noActiveRetainers:
          "No active retainers available. Activate or add a retainer to record a result.",
        noCompatibleRetainers:
          "No active retainers are eligible for this venture.",
        compatibleRetainersHint:
          "Only retainers eligible for this venture are shown.",
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
        editRun: "Edit the venture report",
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
      meta: {
        description:
          "Explorez les tâches des servants de Final Fantasy XIV, gérez vos servants et suivez les récompenses qu'ils rapportent.",
      },
      appTitle: "FFXIV Retainer Ventures",
      header: {
        language: "Langue",
        switchTheme: "Passer au thème {{theme}}",
        themes: {
          light: "clair",
          dark: "sombre",
        },
      },
      footer: {
        navigation: "Informations légales",
        credit: "Créé pour la communauté FFXIV par Eleara Tahar (Louisoix).",
        disclaimer: "Projet indépendant, non affilié à Square Enix.",
      },
      legal: {
        title: "Mentions légales",
        publisher: {
          title: "Éditeur du site",
          name: "Retainer Ventures",
        },
        publicationManager: {
          title: "Responsable de publication",
        },
        hosting: {
          title: "Hébergement",
          description: "Le site est hébergé par :",
        },
        intellectualProperty: {
          title: "Propriété intellectuelle",
          sourceCode:
            "Le code source original de Retainer Ventures est distribué sous licence MIT.",
          thirdParty:
            "Les données, marques, graphismes, icônes et autres ressources provenant de tiers restent soumis aux droits et licences de leurs titulaires respectifs.",
        },
        ffxiv: {
          title: "Final Fantasy XIV",
          copyright: "FINAL FANTASY XIV © 2026 SQUARE ENIX CO., LTD.",
          disclaimer:
            "Retainer Ventures est un projet non officiel créé par une fan, sans affiliation ni approbation de Square Enix.",
        },
        liability: {
          title: "Responsabilité",
          information:
            "Les informations proposées par Retainer Ventures sont fournies à titre indicatif et peuvent comporter des erreurs ou des données incomplètes.",
          availability:
            "L'éditeur ne garantit pas la disponibilité permanente du service et ne saurait être tenu responsable des interruptions ou dysfonctionnements, dans les limites prévues par la loi.",
        },
      },
      privacy: {
        title: "Politique de confidentialité",
        overview: {
          title: "Présentation",
          description:
            "Retainer Ventures est une application web indépendante permettant de consulter les tâches de servants de Final Fantasy XIV et de suivre ses servants. Elle fonctionne sans création de compte utilisateur.",
        },
        localData: {
          title: "Données stockées localement",
          storage:
            "Les informations de suivi des servants et des tâches sont enregistrées localement dans votre navigateur, notamment à l'aide d'IndexedDB. Certaines préférences, comme la langue de l'interface, peuvent être conservées dans le stockage local du navigateur (localStorage). Ces données ne sont pas synchronisées avec un serveur de Retainer Ventures.",
          deletion:
            "Vous pouvez supprimer ces données en effaçant les données du site depuis les paramètres de votre navigateur. Cette opération peut entraîner la perte de vos informations de suivi.",
        },
        thirdParties: {
          title: "Hébergement",
          hosting:
            "Retainer Ventures est hébergé par Railway. Lors de votre visite, des données techniques, telles que votre adresse IP, peuvent être traitées par l'hébergeur afin de fournir le site et d'assurer son fonctionnement et sa sécurité.",
        },
        analytics: {
          title: "Mesure d'audience",
          description:
            "Retainer Ventures n'utilise actuellement aucun outil de mesure d'audience. Si un tel outil est ajouté, cette politique de confidentialité sera mise à jour pour préciser son fonctionnement et les données éventuellement traitées.",
        },
        rights: {
          title: "Conservation et droits",
          retention:
            "Les données de suivi enregistrées dans votre navigateur y sont conservées jusqu'à leur suppression par vous-même, par votre navigateur ou par une fonctionnalité de l'application. Retainer Ventures ne conserve pas de copie de ces données sur ses serveurs.",
          contact:
            "Pour toute question concernant la confidentialité ou l'exercice de vos droits relatifs à d'éventuelles données personnelles traitées dans le cadre du fonctionnement du site, vous pouvez contacter l'éditeur à l'adresse indiquée dans les mentions légales.",
        },
      },
      common: {
        loading: "Chargement",
      },
      navigation: {
        main: "Navigation principale",
        bell: "Faire sonner la cloche",
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
        history: {
          title: "Mon historique",
          noResult: "Aucun résultat enregistré pour cette tâche.",
          totalRuns_one: "{{count}} réalisation",
          totalRuns_other: "{{count}} réalisations",
          obtention_one: "{{count}} obtention",
          obtention_other: "{{count}} obtentions",
          total: "{{count}} au total",
          totalRewards_one: "{{count}} objet obtenu au total",
          totalRewards_other: "{{count}} objets obtenus au total",
          rewardsTitle: "Objets rapportés",
          otherRewardsTitle: "Autres objets rapportés",
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
        editRunTitle: "Modifier un résultat",
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
        noActiveRetainers:
          "Aucun servant actif disponible. Activez ou ajoutez un servant pour enregistrer un résultat.",
        noCompatibleRetainers:
          "Aucun servant actif n'est compatible avec cette tâche.",
        compatibleRetainersHint:
          "Seuls les servants compatibles avec cette tâche sont affichés.",
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
        editRun: "Modifier le rapport de tâche",
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

function updateDocumentMetadata() {
  document.documentElement.lang = i18n.resolvedLanguage ?? "en";

  const description = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );

  if (description) {
    description.content = i18n.t("meta.description");
  }
}

i18n.on("languageChanged", updateDocumentMetadata);
updateDocumentMetadata();

export default i18n;
