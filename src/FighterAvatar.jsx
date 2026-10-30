import { useState } from "react";

// Portrait rond d'un combattant : sa photo si on en a une (libre de droits, champ `photo`),
// sinon un médaillon à ses initiales (dégradé doré pour un champion, sombre et cerclé d'or sinon).
// Anneau doré pour un champion, un n°1 ou une affiche mise en avant.
export const initialsOf = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function FighterAvatar({ name, photo, size = 44, gold = false, className = "" }) {
  // Photo introuvable (fichier supprimé de Commons, réseau) : on revient aux initiales.
  const [failed, setFailed] = useState(null);
  const showPhoto = photo && failed !== photo;
  return (
    <div
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      className={`disp relative shrink-0 rounded-full overflow-hidden flex items-center justify-center border-2 ${
        gold ? "border-amber-400" : "border-neutral-700"
      } ${
        showPhoto
          ? "bg-neutral-950"
          : gold
            ? "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-neutral-950"
            : "bg-gradient-to-br from-neutral-700 via-neutral-900 to-neutral-950 text-amber-300"
      } ${className}`}
    >
      {showPhoto ? (
        <img src={photo} alt={name} loading="lazy" onError={() => setFailed(photo)} className="w-full h-full object-cover object-top" />
      ) : (
        <>
          <span aria-hidden="true" className={`absolute inset-[3px] rounded-full border ${gold ? "border-neutral-950/20" : "border-amber-400/25"}`} />
          <span aria-hidden="true" className="relative drop-shadow-sm">{initialsOf(name)}</span>
        </>
      )}
    </div>
  );
}
