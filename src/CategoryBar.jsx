import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Barre de catégories qui défile : flèches sur les bords (iPad/PC) et pastille active recentrée au clic.
// Chaque pastille doit porter data-cat avec le nom de sa catégorie.
export default function CategoryBar({ active, children }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  useEffect(() => {
    const el = ref.current;
    const pill = active && el?.querySelector(`[data-cat="${CSS.escape(active)}"]`);
    if (!pill) return;
    const left = pill.offsetLeft - (el.clientWidth - pill.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);
  const scrollBy = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.7, behavior: "smooth" });
  return (
    <div className="relative mb-6">
      <div ref={ref} onScroll={update} className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {children}
      </div>
      {[["left", -1, ChevronLeft], ["right", 1, ChevronRight]].map(([side, dir, Icon]) => (
        <div
          key={side}
          className={`pointer-events-none absolute top-0 bottom-1 w-14 flex items-center ${side === "left" ? "left-0 justify-start bg-gradient-to-r" : "right-0 justify-end bg-gradient-to-l"} from-neutral-950 via-neutral-950/80 to-transparent transition-opacity duration-200 ${edges[side] ? "opacity-100" : "opacity-0"}`}
        >
          <button
            onClick={() => scrollBy(dir)}
            aria-label={side === "left" ? "←" : "→"}
            tabIndex={edges[side] ? 0 : -1}
            className={`tap hidden sm:flex w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 items-center justify-center text-neutral-200 hover:border-amber-400 hover:text-amber-400 ${edges[side] ? "pointer-events-auto" : ""}`}
          >
            <Icon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
