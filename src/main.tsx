import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <App />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
);
