import { useEffect, useRef } from "react";

// Cage octogonale en 3D (CSS, sans bibliothèque) : 8 grillages dorés autour d'un tapis,
// qui tournent lentement derrière le titre de l'accueil. La souris (ou le doigt) incline la scène.
const SIDES = Array.from({ length: 8 }, (_, i) => i * 45);

export default function Cage3D() {
  const tilt = useRef(null);

  useEffect(() => {
    const el = tilt.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e) => {
      const p = e.touches ? e.touches[0] : e;
      target.x = (p.clientX / window.innerWidth - 0.5) * 2;
      target.y = (p.clientY / window.innerHeight - 0.5) * 2;
    };
    // Téléphone incliné (Android ; sur iPhone l'accès aux capteurs demande une autorisation, on s'en passe).
    const onTilt = (e) => {
      if (e.gamma == null) return;
      target.x = Math.max(-1, Math.min(1, e.gamma / 30));
      target.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    // Mouvement amorti, pour une inclinaison douce.
    const loop = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      el.style.transform = `rotateX(${-current.y * 8}deg) rotateY(${current.x * 12}deg)`;
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return (
    <div className="cage-stage" aria-hidden="true">
      <div ref={tilt} className="cage-tilt">
        <div className="cage-view">
          <div className="cage-spin">
            {/* Logo au centre du tapis, comme le logo de l'organisation dans une vraie cage. */}
            <div className="cage-floor">
              <span className="cage-logo">O<span className="cage-logo-dot" /></span>
            </div>
            {SIDES.map((a, i) => (
              <div key={a} className="cage-side" style={{ transform: `rotateY(${a}deg) translateZ(var(--apothem))` }}>
                <span className="cage-post" />
                {/* Bandeau « sponsor » un grillage sur deux, lisible de l'extérieur comme de l'intérieur. */}
                {i % 2 === 0 && (
                  <>
                    <span className="cage-ad">octogone.space</span>
                    <span className="cage-ad cage-ad-back">octogone.space</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
