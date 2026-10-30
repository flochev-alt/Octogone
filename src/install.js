// Appli installable : enregistre le service worker et garde l'invitation d'installation du navigateur
// (Chrome, Edge, Android) pour le bouton « Installer l'appli » du pied de page.
import { useEffect, useState } from "react";

let deferred = null;
const listeners = new Set();
const notify = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    window.gtag?.("event", "app_installed");
    notify();
  });
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  }
}

const standalone = () =>
  typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);

// iPhone / iPad (y compris les iPad qui se présentent comme un Mac) : pas d'invitation automatique,
// on explique le geste « Sur l'écran d'accueil ».
const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

export function useInstall() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => listeners.delete(l);
  }, []);
  if (standalone()) return { mode: null };
  if (deferred) {
    return {
      mode: "prompt",
      install: async () => {
        const e = deferred;
        deferred = null;
        notify();
        e.prompt();
        await e.userChoice.catch(() => {});
      },
    };
  }
  return { mode: isIOS() ? "ios" : null };
}
