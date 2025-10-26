import { useState } from "react";
import { Send, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

export function PromptInput({ onSubmit, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input logic would go here
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-card border border-border rounded-lg shadow-ai-md transition-fast hover:shadow-ai-lg">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Décrivez ce que vous souhaitez générer..."
          className="min-h-[120px] resize-none border-0 focus-visible:ring-0 text-base p-6 pr-24"
          disabled={isGenerating}
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoiceInput}
            className={`transition-fast ${
              isListening ? "text-destructive" : "text-muted-foreground hover:text-primary"
            }`}
            disabled={isGenerating}
          >
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating}
            className="gap-2 transition-fast"
            size="default"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Génération...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Générer
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {[
          "Résumer un article scientifique",
          "Générer des idées de recherche",
          "Reformuler un paragraphe",
        ].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => setPrompt(suggestion)}
            disabled={isGenerating}
            className="text-xs transition-fast hover:bg-accent"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
