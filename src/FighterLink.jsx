import { findFighter } from "./events.js";

// Nom d'un combattant : lien vers sa fiche s'il est dans notre base, simple texte sinon.
export default function FighterLink({ name, fighters, onFighter, className = "" }) {
  const f = onFighter && findFighter(fighters, name);
  if (!f) return <span className={className}>{name}</span>;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onFighter(f); }}
      className={`tap text-left underline decoration-amber-400/40 underline-offset-2 hover:decoration-amber-400 hover:text-amber-300 ${className}`}
    >
      {name}
    </button>
  );
}
