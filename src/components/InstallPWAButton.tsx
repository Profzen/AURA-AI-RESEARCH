// src/components/InstallPWAButton.tsx
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"; // adapte si nécessaire

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const promptRef = useRef<any>(null);

  useEffect(() => {
    function onBeforeInstallPrompt(e: any) {
      // empêche le prompt natif
      e.preventDefault();
      // conserve l'événement pour le déclencher plus tard
      promptRef.current = e;
      setDeferredPrompt(e);
      setVisible(true);
      console.log("PWA: beforeinstallprompt capturé");
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  const onInstallClick = async () => {
    const p = promptRef.current || deferredPrompt;
    if (!p) return;

    // Affiche le prompt natif
    p.prompt();
    const choice = await p.userChoice;
    console.log("PWA install choice:", choice);

    // Si installé ou refusé, on masque notre bouton
    setVisible(false);
    setDeferredPrompt(null);
    promptRef.current = null;
  };

  if (!visible) return null;

  return (
    <Button size="sm" onClick={onInstallClick} aria-label="Installer l'application">
      Installer
    </Button>
  );
}
