// Portrait rond d'un combattant : sa photo si on en a une (libre de droits, champ `photo`),
// sinon ses initiales. Anneau doré pour un champion, un n°1 ou une affiche mise en avant.
export const initialsOf = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function FighterAvatar({ name, photo, size = 44, gold = false, className = "" }) {
  return (
    <div
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      className={`disp shrink-0 rounded-full overflow-hidden flex items-center justify-center border-2 ${
        gold ? "border-amber-400 bg-[#241c08] text-amber-400" : "border-neutral-700 bg-neutral-950 text-neutral-300"
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
