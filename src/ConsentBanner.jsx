import { useEffect, useState } from "react";
import { T } from "./i18n.js";
import { getConsent, setConsent, loadAnalytics, listenGoogleConsent } from "./consent.js";
import { adsEnabled, showGoogleConsent } from "./ads.js";

// Bandeau cookies : « Accepter » et « Refuser » ont le même poids, comme l'exige la CNIL.
// Rouvert depuis le lien « Cookies » du pied de page (prop `forceOpen`).
// Avec la pub active, c'est le bandeau certifié de Google qui s'affiche à la place de celui-ci ;
// le nôtre ne revient que si celui de Google n'a pas pu se charger (bloqueur de pub).
const GOOGLE_WAIT_MS = 4000;

export default function ConsentBanner({ lang = "fr", forceOpen = false, onClose = () => {}, onLegal = () => {} }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  // "waiting" : on attend le bandeau de Google ; "google" : il est là ; "own" : on utilise le nôtre.
  const [mode, setMode] = useState(adsEnabled ? "waiting" : "own");

  useEffect(() => {
    if (mode !== "waiting") return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (listenGoogleConsent()) {
        clearInterval(timer);
        setMode("google");
      } else if (tries * 250 >= GOOGLE_WAIT_MS) {
        clearInterval(timer);
        setMode("own");
      }
    }, 250);
    return () => clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    if (mode !== "own") return;
    const consent = getConsent();
    if (consent === "accepted") loadAnalytics();
    if (consent === null) setOpen(true);
  }, [mode]);

  useEffect(() => {
    if (!forceOpen) return;
    if (mode !== "own" && showGoogleConsent()) onClose();
    else setOpen(true);
  }, [forceOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (value) => {
    setConsent(value);
    setOpen(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5" role="dialog" aria-label={t.cookiesTitle}>
      <div className="max-w-2xl mx-auto rounded-2xl border border-neutral-800 bg-neutral-900/95 backdrop-blur p-4 sm:p-5 shadow-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="text-sm font-semibold text-neutral-100 mb-1">{t.cookiesTitle}</div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          {t.cookiesText}{" "}
          <button onClick={onLegal} className="underline hover:text-neutral-200">{t.legal}</button>
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => choose("refused")}
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-100 text-sm font-semibold py-2.5 hover:bg-neutral-700"
          >
            {t.cookiesRefuse}
          </button>
          <button
            onClick={() => choose("accepted")}
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-100 text-sm font-semibold py-2.5 hover:bg-neutral-700"
          >
            {t.cookiesAccept}
          </button>
        </div>
      </div>
    </div>
  );
}
