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

// À appeler au chargement : lit ?vip= dans l'adresse, l'efface de la barre d'adresse,
// puis renvoie true si ce navigateur a un code VIP valide.
export async function initVip() {
  try {
    localStorage.removeItem("octogone-vip"); // ancien système, désactivé
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("vip");
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
