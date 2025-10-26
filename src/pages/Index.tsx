import { useState } from "react";
import { Header } from "@/components/Header";
import { PromptInput } from "@/components/PromptInput";
import { GenerationArea } from "@/components/GenerationArea";
import { HistorySidebar } from "@/components/HistorySidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: Date;
  preview: string;
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGenerateContent = async (prompt: string) => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockContent = `Résultat généré pour : "${prompt}"\n\nCeci est un exemple de contenu généré par l'IA. Dans une implémentation réelle, ce texte serait remplacé par le résultat d'un modèle d'IA générative.\n\nLe contenu tiendrait compte du contexte scientifique et des exigences spécifiques formulées dans le prompt. Il serait structuré, précis et adapté aux besoins de recherche académique.\n\nParagraphe 2 : L'IA analyserait les données d'entrée, appliquerait les transformations nécessaires et générerait un contenu cohérent, pertinent et de qualité professionnelle.\n\nParagraphe 3 : Le résultat final respecterait les standards académiques et serait prêt à être utilisé, édité ou exporté selon vos besoins.`;
      
      setGeneratedContent(mockContent);
      setIsGenerating(false);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        prompt,
        timestamp: new Date(),
        preview: mockContent.substring(0, 100),
      };
      setHistory([newHistoryItem, ...history]);
      
      toast.success("Contenu généré avec succès !");
    }, 2000);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setGeneratedContent(item.preview);
    setIsSidebarOpen(false);
    toast.info("Historique restauré");
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast.success("Historique effacé");
  };

  const handleOpenSettings = () => {
    toast.info("Paramètres - À implémenter");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onOpenSettings={handleOpenSettings}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-border">
          <HistorySidebar
            history={history}
            onSelectItem={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
          />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <HistorySidebar
              history={history}
              onSelectItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <div className="text-center space-y-2 py-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                Bienvenue sur votre assistant IA
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Générez du contenu scientifique de qualité, résumez des articles, ou obtenez des
                idées innovantes pour vos recherches.
              </p>
            </div>

            <PromptInput onSubmit={handleGenerateContent} isGenerating={isGenerating} />

            <GenerationArea content={generatedContent} isGenerating={isGenerating} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
