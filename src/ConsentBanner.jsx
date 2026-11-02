import { useEffect, useState } from "react";
import { T } from "./i18n.js";
import { getConsent, setConsent, loadAnalytics } from "./consent.js";

// Bandeau cookies : « Accepter » et « Refuser » ont le même poids, comme l'exige la CNIL.
// Rouvert depuis le lien « Cookies » du pied de page (prop `forceOpen`).
export default function ConsentBanner({ lang = "fr", forceOpen = false, onClose = () => {}, onLegal = () => {} }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === "accepted") loadAnalytics();
    if (consent === null) setOpen(true);
  }, []);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

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
