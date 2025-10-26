import { useState } from "react";
import { Header } from "@/components/Header";
import { PromptInput } from "@/components/PromptInput";
import { ChatArea, Message } from "@/components/ChatArea";
import { HistorySidebar, ConversationItem } from "@/components/HistorySidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentConversation = conversations.find((c) => c.id === currentConversationId);
  const currentMessages = currentConversation?.messages || [];

  const handleSendMessage = async (prompt: string) => {
    // Create new conversation if none exists
    if (!currentConversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""),
        messages: [],
        timestamp: new Date(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
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
        conv.id === (currentConversationId || Date.now().toString())
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      )
    );

    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Merci pour votre question : "${prompt}"\n\nCeci est une réponse simulée de l'IA. Dans une implémentation réelle, ce texte serait généré par un modèle d'IA générative qui analyserait votre demande et fournirait une réponse pertinente et détaillée.\n\nL'assistant IA peut :\n• Analyser et synthétiser des informations complexes\n• Fournir des explications claires et structurées\n• Adapter son style de réponse à vos besoins\n• Maintenir le contexte de la conversation\n\nN'hésitez pas à poser des questions de suivi pour approfondir le sujet.`,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, assistantMessage], timestamp: new Date() }
            : conv
        )
      );

      setIsGenerating(false);
      toast.success("Réponse générée");
    }, 2000);
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
    setConversations([]);
    setCurrentConversationId(null);
    toast.success("Historique effacé");
  };

  const handleOpenSettings = () => {
    toast.info("Paramètres - À implémenter");
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
            />
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
          <div className="border-t border-border bg-background p-4">
            <div className="container max-w-4xl mx-auto">
              <PromptInput onSubmit={handleSendMessage} isGenerating={isGenerating} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
