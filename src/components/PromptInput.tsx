import { useState } from "react";
import { Send, Mic, MicOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useTranslation } from "react-i18next";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

export function PromptInput({ onSubmit, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const { isListening, startListening, stopListening } = useVoiceInput();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt && !isGenerating) {
      try {
        setPrompt("");
        await onSubmit(trimmedPrompt);
      } catch (error) {
        console.error("Error submitting prompt:", error);
        // Restore prompt if submission failed
        setPrompt(trimmedPrompt);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        // Make sure component is still mounted before updating state
        setPrompt((prev) => prev ? prev + " " + transcript : transcript);
      });
    }
  };

  return (
    <div className="w-full px-2 sm:px-0 max-w-4xl mx-auto">
      <div className="relative bg-card border border-border rounded-lg shadow-ai-md transition-fast hover:shadow-ai-lg">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chat.placeholder")}
          className="min-h-[50px] sm:min-h-[70px] resize-none border-0 focus-visible:ring-0 text-sm sm:text-base p-2.5 sm:p-3 pr-[110px] sm:pr-[130px]"
          disabled={isGenerating}
        />
        
        <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoiceInput}
            className={`transition-fast h-7 w-7 sm:h-8 sm:w-8 ${
              isListening ? "text-destructive animate-pulse" : "text-muted-foreground hover:text-primary"
            }`}
            disabled={isGenerating}
            type="button"
          >
            <span className="flex items-center justify-center">
              {isListening ? 
                <MicOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : 
                <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              }
            </span>
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating}
            className="gap-1.5 transition-fast h-7 sm:h-8 text-xs sm:text-sm px-2.5 sm:px-3.5"
            size="default"
            type="button"
          >
            <span className="flex items-center gap-1.5">
              {isGenerating ? (
                <>
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-pulse" />
                  <span>...</span>
                </>
              ) : (
                <>
                  <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>Générer</span>
                </>
              )}
            </span>
          </Button>
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex gap-1.5 sm:gap-2 justify-start overflow-x-auto pb-1.5 no-scrollbar">
        {[
          t("chat.suggestions.summarize"),
          t("chat.suggestions.generate"),
          t("chat.suggestions.rephrase")
        ].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => setPrompt(suggestion)}
            disabled={isGenerating}
            className="text-xs transition-fast hover:bg-accent whitespace-nowrap flex-shrink-0 h-7 px-2.5"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
