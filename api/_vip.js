import { timingSafeEqual } from "crypto";

// Le code VIP n'existe que côté serveur, dans la variable d'environnement VIP_CODE (réglages Vercel) :
// il n'apparaît jamais dans le code envoyé aux visiteurs.
export function isVipCode(code) {
  const expected = process.env.VIP_CODE;
  if (!expected || typeof code !== "string" || !code) return false;
  const a = Buffer.from(code);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
