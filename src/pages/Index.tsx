import React, { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { PromptInput } from "@/components/PromptInput";
import { ChatArea, Message } from "@/components/ChatArea";
import { HistorySidebar, ConversationItem } from "@/components/HistorySidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import SettingsPanel from "@/components/SettingsPanel";
import { toast } from "sonner";
import { ProfileSelector, type UserProfile } from "@/components/ProfileSelector";

interface UserSettings {
  profile: UserProfile;
  language?: string;
  name?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const STORAGE_KEYS = {
  CONVERSATIONS: "conversations",
  CURRENT_CONVERSATION: "currentConversation",
  SIDEBAR_STATE: "sidebarState",
  USER_SETTINGS: "userSettings"
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Pour les conversations, on convertit les dates
      if (key === STORAGE_KEYS.CONVERSATIONS && Array.isArray(parsed)) {
        return parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: Array.isArray(conv.messages) 
            ? conv.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))
            : []
        })) as T;
      }
      return parsed;
    }
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
  }
  return defaultValue;
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(() => 
    loadFromStorage(STORAGE_KEYS.CONVERSATIONS, [])
  );
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => 
    loadFromStorage(STORAGE_KEYS.CURRENT_CONVERSATION, null)
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => 
    loadFromStorage(STORAGE_KEYS.SIDEBAR_STATE, false)
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>(() => {
    const settings = loadFromStorage<UserSettings>(STORAGE_KEYS.USER_SETTINGS, { profile: "researcher" });
    return settings.profile;
  });

  // Effet pour sauvegarder les conversations
  React.useEffect(() => {
    if (conversations.length > 0) {
      saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
    }
  }, [conversations]);

  // Effet pour sauvegarder la conversation courante
  React.useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_CONVERSATION, currentConversationId);
  }, [currentConversationId]);

  // Effet pour sauvegarder l'état de la sidebar
  React.useEffect(() => {
    saveToStorage(STORAGE_KEYS.SIDEBAR_STATE, isSidebarOpen);
  }, [isSidebarOpen]);

  const handleProfileChange = (profile: UserProfile) => {
    setSelectedProfile(profile);
    try {
      const currentSettings = loadFromStorage(STORAGE_KEYS.USER_SETTINGS, {});
      saveToStorage(STORAGE_KEYS.USER_SETTINGS, { ...currentSettings, profile });
      toast.success("Profil mis à jour");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const currentConversation = conversations.find((c) => c.id === currentConversationId);
  const currentMessages = currentConversation?.messages || [];

  // Deterministic rotation for mock responses: use a ref index that increments each call
  const mockTemplateIndexRef = useRef(0);
  const generateMockResponse = (prompt: string, profile: string) => {
    const templates: Array<(p: string) => string> = [
      (p: string) => `Voici une synthèse initiale pour : "${p}".\n\nPoints clés :\n• Contexte et enjeux\n• Méthodologie possible\n• Questions ouvertes à approfondir.\n\nSouhaitez-vous que je développe un plan détaillé ?`,
      (p: string) => `Merci pour votre question : "${p}".\n\nRéponse rapide :\n- Hypothèse plausible\n- Approche expérimentale suggérée\n- Résumé des bénéfices attendus\n\nJe peux aussi fournir des références fictives si nécessaire.`,
      (p: string) => `Réponse (style ${profile || "assistant"}):\nJ'ai analysé votre demande "${p}" et je propose :\n1) Objectifs clairs\n2) Méthodes adaptées\n3) Limites et alternatives\n\nDites-moi si vous voulez un exemple concret.`,
      (p: string) => `Extrait généré pour "${p}":\n- Résumé en 3 lignes\n- Liste d'actions prioritaires\n- Suggestions de suivi\n\nSouhaitez un format différent (bullet points, abstract, ou paragraphe) ?`,
      (p: string) => `Brève réponse : Pour "${p}", je recommanderais de commencer par un état de l'art succinct, puis d'expérimenter une approche pilote et d'évaluer les métriques clés. Voulez-vous un exemple de protocole ?`,
    ];

    const idx = mockTemplateIndexRef.current % templates.length;
    mockTemplateIndexRef.current = mockTemplateIndexRef.current + 1;
    return templates[idx](prompt);
  };

  const handleSendMessage = async (prompt: string) => {
    if (isGenerating) return;
    
    try {
      let conversationId = currentConversationId;
      
      // Create new conversation if none exists
      if (!conversationId) {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""),
          messages: [],
          timestamp: new Date(),
        };
        setConversations((prev) => [newConversation, ...prev]);
        conversationId = newConversation.id;
        setCurrentConversationId(conversationId);
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: prompt,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, userMessage] }
            : conv
        )
      );

      setIsGenerating(true);

      try {
        // Simulate AI response
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateMockResponse(prompt, selectedProfile as unknown as string),
          timestamp: new Date(),
        };

        // Make sure we're not unmounted before updating state
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? { ...conv, messages: [...conv.messages, assistantMessage], timestamp: new Date() }
              : conv
          )
        );

        toast.success("Réponse générée");
      } finally {
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setIsGenerating(false);
      toast.error("Une erreur est survenue");
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    toast.info("Nouvelle conversation");
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setIsSidebarOpen(false);
    toast.info("Conversation chargée");
  };

  const handleClearHistory = () => {
    try {
      setConversations([]);
      setCurrentConversationId(null);
      // Effacer les conversations du stockage local
      localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
      toast.success("Historique effacé");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Erreur lors de l'effacement de l'historique");
    }
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleDeleteConversation = (id: string) => {
    try {
      setConversations((prev) => {
        const newConversations = prev.filter((conv) => conv.id !== id);
        // Sauvegarder immédiatement dans le localStorage
        saveToStorage(STORAGE_KEYS.CONVERSATIONS, newConversations);
        return newConversations;
      });
      
      if (currentConversationId === id) {
        setCurrentConversationId(null);
        saveToStorage(STORAGE_KEYS.CURRENT_CONVERSATION, null);
      }
      
      toast.success("Conversation supprimée");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  const conversationItems: ConversationItem[] = conversations.map((conv) => ({
    id: conv.id,
    title: conv.title,
    timestamp: conv.timestamp,
    messageCount: conv.messages.length,
  }));

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onOpenSettings={handleOpenSettings}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-border">
          <HistorySidebar
            conversations={conversationItems}
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onClearHistory={handleClearHistory}
            onDeleteConversation={handleDeleteConversation}
          />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <HistorySidebar
              conversations={conversationItems}
              currentConversationId={currentConversationId}
              onSelectConversation={handleSelectConversation}
              onClearHistory={handleClearHistory}
              onDeleteConversation={handleDeleteConversation}
            />
          </SheetContent>
        </Sheet>

        {/* Settings Sheet */}
        <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <SheetContent side="right" className="p-0 w-full sm:w-[400px]">
            <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 overflow-hidden">
            <ChatArea
              messages={currentMessages}
              isGenerating={isGenerating}
              onNewConversation={handleNewConversation}
            />
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-background p-1.5 sm:p-2">
            <div className="container max-w-4xl mx-auto space-y-1.5">
              <ProfileSelector
                selectedProfile={selectedProfile}
                onProfileChange={handleProfileChange}
              />
              <PromptInput onSubmit={handleSendMessage} isGenerating={isGenerating} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
