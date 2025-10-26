import { Copy, Download, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useState } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  isGenerating: boolean;
  onNewConversation: () => void;
}

export function ChatArea({ messages, isGenerating, onNewConversation }: ChatAreaProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyConversation = async () => {
    const conversationText = messages
      .map((msg) => `${msg.role === "user" ? "Vous" : "Assistant"}: ${msg.content}`)
      .join("\n\n");
    
    await navigator.clipboard.writeText(conversationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadConversation = () => {
    const conversationText = messages
      .map((msg) => `${msg.role === "user" ? "Vous" : "Assistant"} (${new Date(msg.timestamp).toLocaleString("fr-FR")}):\n${msg.content}`)
      .join("\n\n---\n\n");
    
    const blob = new Blob([conversationText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (messages.length === 0 && !isGenerating) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Commencez une nouvelle conversation</h3>
            <p className="text-muted-foreground text-sm">
              Posez une question ou décrivez votre besoin pour démarrer une conversation avec l'IA.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-card">
        <h3 className="font-semibold">Conversation</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewConversation}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyConversation}
            className="gap-2"
            disabled={messages.length === 0}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copié
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copier
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadConversation}
            className="gap-2"
            disabled={messages.length === 0}
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          
          {isGenerating && (
            <div className="flex gap-4 p-4 bg-card rounded-lg">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 rounded-full border-2 border-accent-foreground border-t-transparent animate-spin" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-sm">Assistant IA</span>
                <p className="text-sm text-muted-foreground mt-1 animate-pulse">Génération en cours...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
