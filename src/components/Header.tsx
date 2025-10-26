import { Menu, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

export function Header({ onToggleSidebar, onOpenSettings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">IA Générative</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Assistant scientifique intelligent
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="transition-fast hover:text-primary"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
