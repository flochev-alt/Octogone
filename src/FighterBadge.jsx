// Écusson octogonal d'un combattant : sa photo si on en a une (libre de droits, champ `photo`),
// sinon ses initiales. Doré pour un champion ou une affiche mise en avant.
const OCTAGON = "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)";

const initialsOf = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function FighterBadge({ name, photo, size = 40, gold = false, base = "bg-neutral-950", className = "" }) {
  return (
    <div
      style={{ width: size, height: size, clipPath: OCTAGON, fontSize: Math.round(size * 0.34) }}
      className={`disp shrink-0 flex items-center justify-center overflow-hidden ${
        gold ? "bg-gradient-to-br from-amber-300 to-amber-600 text-neutral-950" : `${base} text-amber-400`
      } ${className}`}
    >
      {photo ? (
        <img src={photo} alt={name} loading="lazy" className="w-full h-full object-cover object-top" />
      ) : (
        <span aria-hidden="true">{initialsOf(name)}</span>
      )}
    </div>
  );
}
