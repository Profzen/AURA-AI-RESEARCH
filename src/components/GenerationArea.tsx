import { Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GenerationAreaProps {
  content: string;
  isGenerating: boolean;
}

export function GenerationArea({ content, isGenerating }: GenerationAreaProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `generation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!content && !isGenerating) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4">
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
            <h3 className="text-lg font-semibold mb-2">Prêt à générer</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Décrivez votre besoin dans le champ ci-dessus et laissez l'IA créer du contenu
              adapté à vos exigences scientifiques.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-ai-md">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold">Résultat généré</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
              disabled={isGenerating || !content}
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
              onClick={handleDownload}
              className="gap-2"
              disabled={isGenerating || !content}
            >
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </div>

        <div className="p-6 min-h-[400px]">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Génération en cours...</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
