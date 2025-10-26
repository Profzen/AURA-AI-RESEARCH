import { History, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: Date;
  preview: string;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export function HistorySidebar({ history, onSelectItem, onClearHistory }: HistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter(
    (item) =>
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Historique</h2>
          </div>
          {history.length > 0 && (
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
        {filteredHistory.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            {searchQuery ? "Aucun résultat trouvé" : "Aucun historique pour le moment"}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-fast group"
              >
                <p className="font-medium text-sm line-clamp-1 mb-1 group-hover:text-primary">
                  {item.prompt}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {item.preview}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.timestamp).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
