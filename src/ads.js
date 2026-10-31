// Publicité Google AdSense. Tout est éteint tant que la variable ADSENSE_CLIENT (identifiant pub-…)
// n'est pas réglée dans Vercel : pas de script, pas d'emplacement, notre propre bandeau cookies.
// Une fois réglée : le script AdSense est dans le <head> (vite.config.js), il charge aussi le bandeau
// cookies certifié de Google (« Confidentialité et messages »), qui remplace le nôtre.
/* global __ADSENSE_CLIENT__, __ADSENSE_SLOT__ */
export const ADSENSE_CLIENT = typeof __ADSENSE_CLIENT__ === "string" ? __ADSENSE_CLIENT__ : "";
export const ADSENSE_SLOT = typeof __ADSENSE_SLOT__ === "string" ? __ADSENSE_SLOT__ : "";
export const adsEnabled = Boolean(ADSENSE_CLIENT);

// Aperçu des emplacements sans compte AdSense : ouvrir le site avec ?pubdemo=1 (gardé pour la visite).
export const adsDemo = (() => {
  if (typeof window === "undefined") return false;
  try {
    const p = new URLSearchParams(window.location.search).get("pubdemo");
    if (p === "1") sessionStorage.setItem("octogone-pubdemo", "1");
    if (p === "0") sessionStorage.removeItem("octogone-pubdemo");
    return sessionStorage.getItem("octogone-pubdemo") === "1";
  } catch {
    return false;
  }
})();

// Rouvre le bandeau cookies de Google (lien « Cookies » du bas de page). Renvoie false s'il n'est pas chargé
// (bloqueur de pub, par exemple) : on rouvre alors notre propre bandeau.
export function showGoogleConsent() {
  if (!adsEnabled || typeof window.__tcfapi !== "function") return false;
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  window.googlefc.callbackQueue.push(() => window.googlefc.showRevocationMessage());
  return true;
}
