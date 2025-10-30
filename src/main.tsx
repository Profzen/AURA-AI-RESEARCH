import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import App from "./App.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./index.css";

// ✅ Import correct pour PWA
import { registerSW } from "virtual:pwa-register";

// ✅ Enregistrement du Service Worker
registerSW({
  onNeedRefresh() {
    console.log("Nouvelle version disponible. Rafraîchissez la page pour l'appliquer.");
  },
  onOfflineReady() {
    console.log("L'application est prête à être utilisée hors ligne !");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <App />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
