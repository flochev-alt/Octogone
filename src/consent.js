// Consentement Google Analytics (règles CNIL) : GA n'est chargé qu'après un clic sur « Accepter ».
// Le choix est gardé 13 mois maximum dans le navigateur, puis le bandeau réapparaît.
export const GA_ID = "G-CPSXS1KMLW";
const CONSENT_KEY = "octogone-consent";
const MAX_AGE_MS = 13 * 30 * 24 * 3600 * 1000;

export function getConsent() {
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    if (!stored || Date.now() - stored.date > MAX_AGE_MS) return null;
    return stored.value; // "accepted" | "refused"
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, date: Date.now() }));
  } catch {
    // stockage indisponible (navigation privée) : le choix vaut pour cette visite seulement
  }
  if (value === "accepted") loadAnalytics();
  else disableAnalytics();
}

export function loadAnalytics() {
  if (typeof window === "undefined") return;
  window[`ga-disable-${GA_ID}`] = false;
  if (document.getElementById("ga-script")) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

// Retrait du consentement : on coupe la mesure et on efface les cookies _ga déjà posés.
function disableAnalytics() {
  if (typeof window === "undefined") return;
  window[`ga-disable-${GA_ID}`] = true;
  const domain = window.location.hostname.replace(/^www\./, "");
  document.cookie.split(";").map((c) => c.trim().split("=")[0]).filter((n) => n.startsWith("_ga")).forEach((n) => {
    document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`;
  });
}
