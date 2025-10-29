import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    translation: {
      header: {
        title: "AURA Research AI",
        subtitle: "Assistant scientifique intelligent",
      },
      settings: {
        title: "Paramètres",
        description: "Personnalisez votre profil et préférences.",
        name: "Nom",
        namePlaceholder: "Votre nom",
        language: "Langue",
        profile: "Type de profil",
        save: "Enregistrer",
        cancel: "Annuler",
        logout: "Se déconnecter",
        saved: "Paramètres sauvegardés",
        disconnected: "Déconnecté",
        profileOptions: {
          researcher: "Chercheur",
          student: "Étudiant",
          marketer: "Marketeur",
          designer: "Designer",
          dev: "Développeur",
          other: "Autre",
        },
      },
      chat: {
        roles: {
          user: "Vous",
          assistant: "Assistant",
        },
        actions: {
          new: "Nouvelle",
          copy: "Copier",
          copied: "Copié",
          export: "Exporter",
        },
        status: {
          generating: "Génération en cours...",
        },
        empty: {
          title: "Commencez une nouvelle conversation",
          description:
            "Posez une question ou décrivez votre besoin pour démarrer une conversation avec l'IA.",
        },
        suggestions: {
          summarize: "Résumer un article scientifique",
          generate: "Générer des idées de recherche",
          rephrase: "Reformuler un paragraphe",
        },
        conversation: "Conversation",
        placeholder: "Décrivez ce que vous souhaitez générer...",
      },
      sidebar: {
        dashboard: "Tableau de bord",
        projects: "Projets",
        assistant: "Assistant IA",
        library: "Bibliothèque",
        history: "Historique",
        clear: "Effacer l'historique",
        delete: "Supprimer la conversation",
        search: "Rechercher...",
        noResults: "Aucun résultat trouvé",
        noConversations: "Aucune conversation pour le moment",
        dashboardContent:
          "Vue d'ensemble de vos activités de recherche, performances et indicateurs clés.",
        projectsContent:
          "Espace projet : gérez vos recherches, suivez vos expérimentations et organisez vos documents.",
        libraryContent:
          "Bibliothèque : retrouvez vos publications, articles et références classées par thématique.",
      },
      error: {
        title: "Une erreur est survenue",
        reload: "Recharger la page",
      },
    },
  },
  en: {
    translation: {
      header: {
        title: "AURA Research AI",
        subtitle: "Intelligent scientific assistant",
      },
      settings: {
        title: "Settings",
        description: "Customize your profile and preferences.",
        name: "Name",
        namePlaceholder: "Your name",
        language: "Language",
        profile: "Profile type",
        save: "Save",
        cancel: "Cancel",
        logout: "Logout",
        saved: "Settings saved",
        disconnected: "Logged out",
        profileOptions: {
          researcher: "Researcher",
          student: "Student",
          marketer: "Marketer",
          designer: "Designer",
          dev: "Developer",
          other: "Other",
        },
      },
      chat: {
        roles: {
          user: "You",
          assistant: "Assistant",
        },
        actions: {
          new: "New",
          copy: "Copy",
          copied: "Copied",
          export: "Export",
        },
        status: {
          generating: "Generating...",
        },
        empty: {
          title: "Start a new conversation",
          description:
            "Ask a question or describe your need to start a conversation with the AI.",
        },
        suggestions: {
          summarize: "Summarize a scientific article",
          generate: "Generate research ideas",
          rephrase: "Rephrase a paragraph",
        },
        conversation: "Conversation",
        placeholder: "Describe what you want to generate...",
      },
      sidebar: {
        dashboard: "Dashboard",
        projects: "Projects",
        assistant: "AI Assistant",
        library: "Library",
        history: "History",
        clear: "Clear history",
        delete: "Delete conversation",
        search: "Search...",
        noResults: "No results found",
        noConversations: "No conversations yet",
        dashboardContent:
          "Overview of your research activities, performance and key indicators.",
        projectsContent:
          "Project area: manage your research, track experiments and organize documents.",
        libraryContent:
          "Library: find your publications, articles and categorized references.",
      },
      error: {
        title: "An error occurred",
        reload: "Reload page",
      },
    },
  },
};

// langue initiale
let initialLanguage = "fr";
try {
  const stored = localStorage.getItem("userSettings");
  if (stored) {
    const { language } = JSON.parse(stored);
    if (language) initialLanguage = language;
  }
} catch {
  // ignore
}

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export default i18n;
