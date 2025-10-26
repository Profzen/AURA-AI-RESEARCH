import { User, Sparkles } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 p-4 ${isUser ? "bg-background" : "bg-card"} rounded-lg transition-fast`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? "bg-primary" : "bg-accent"
      }`}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Sparkles className="h-4 w-4 text-accent-foreground" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">
            {isUser ? "Vous" : "Assistant IA"}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {new Date(timestamp).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
