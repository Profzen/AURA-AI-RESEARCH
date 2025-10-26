import { History, Trash2, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export interface ConversationItem {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
}

interface HistorySidebarProps {
  conversations: ConversationItem[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onClearHistory: () => void;
}

export function HistorySidebar({ 
  conversations, 
  currentConversationId,
  onSelectConversation, 
  onClearHistory 
}: HistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Conversations</h2>
          </div>
          {conversations.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="pl-9 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            {searchQuery ? "Aucun résultat trouvé" : "Aucune conversation pour le moment"}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-fast group ${
                  currentConversationId === conv.id 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary">
                      {conv.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{conv.messageCount} messages</span>
                      <span>•</span>
                      <span>
                        {new Date(conv.timestamp).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
