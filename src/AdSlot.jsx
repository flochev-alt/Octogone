import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, ADSENSE_SLOT, adsEnabled, adsDemo } from "./ads.js";

// Un emplacement de pub, toujours en dehors des boutons et des fiches pour éviter les clics par erreur
// (règle AdSense). La hauteur est réservée pour que la page ne saute pas quand la pub arrive ;
// si Google n'a rien à afficher, l'emplacement disparaît (data-ad-status="unfilled", voir index.css).
// Pas de pub pour le VIP : Flo ne risque pas de cliquer sur ses propres pubs (interdit par AdSense).
const LABEL = { fr: "Publicité", en: "Advertisement", es: "Publicidad" };

export default function AdSlot({ lang = "fr", vip = false, className = "" }) {
  const ref = useRef(null);
  const live = adsEnabled && Boolean(ADSENSE_SLOT) && !vip;

  useEffect(() => {
    if (!live || !ref.current || ref.current.dataset.pushed) return;
    ref.current.dataset.pushed = "1";
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // script bloqué (bloqueur de pub) : l'emplacement reste vide et se replie
    }
  }, [live]);

  if (!live && !adsDemo) return null;

  return (
    <aside className={`ad-slot w-full max-w-5xl mx-auto px-5 my-6 ${className}`} aria-label={LABEL[lang] || LABEL.fr}>
      <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1 text-center">{LABEL[lang] || LABEL.fr}</div>
      {live ? (
        <ins
          ref={ref}
          className="adsbygoogle block min-h-[100px] sm:min-h-[90px]"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex items-center justify-center min-h-[100px] sm:min-h-[90px] rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 text-xs text-neutral-500">
          Emplacement de pub (aperçu)
        </div>
      )}
    </aside>
  );
}
