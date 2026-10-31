// Accès VIP (analyses IA illimitées) : Flo ouvre une fois octogone.space/?vip=SON_CODE sur un appareil.
// Le code n'est pas dans ce fichier : le serveur le compare à la variable VIP_CODE de Vercel.
// S'il est bon, on le garde dans ce navigateur pour l'envoyer avec chaque demande d'analyse.
const VIP_KEY = "octogone-vip-code";

export function getVipCode() {
  try {
    return localStorage.getItem(VIP_KEY);
  } catch {
    return null;
  }
}

async function checkCode(code) {
  try {
    const r = await fetch("/api/vip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return r.ok && (await r.json()).vip === true;
  } catch {
    return false;
  }
}

// Saisie du code à la main : sur iPhone, l'appli installée ne partage pas la mémoire de Safari,
// donc le code donné par le lien ?vip= n'y est pas. Renvoie true si le code est bon (et le garde).
export async function activateVip(code) {
  const clean = String(code || "").trim();
  if (!clean || !(await checkCode(clean))) return false;
  try {
    localStorage.setItem(VIP_KEY, clean);
  } catch {
    // stockage indisponible : l'accès vaut pour cette visite seulement
  }
  return true;
}

// À appeler au chargement : lit ?vip= dans l'adresse, l'efface de la barre d'adresse,
// puis renvoie { vip, tried } : vip vaut true si ce navigateur a un code VIP valide,
// tried vaut true si un code venait d'être donné dans l'adresse (pour afficher « activé » ou « incorrect »).
export async function initVip() {
  const tried = new URLSearchParams(window.location.search).has("vip");
  return { vip: await checkVip(), tried };
}

async function checkVip() {
  try {
    localStorage.removeItem("octogone-vip"); // ancien système, désactivé
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("vip")?.trim();
    if (fromUrl) {
      params.delete("vip");
      const qs = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash);
      if (await checkCode(fromUrl)) {
        localStorage.setItem(VIP_KEY, fromUrl);
        return true;
      }
    }
    const stored = getVipCode();
    if (!stored) return false;
    if (await checkCode(stored)) return true;
    localStorage.removeItem(VIP_KEY);
    return false;
  } catch {
    return false;
  }
}
