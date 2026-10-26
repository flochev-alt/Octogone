import { isVipCode } from "./_vip.js";

// Vérifie un code VIP sans jamais le révéler : répond seulement { vip: true | false }.
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ vip: isVipCode(req.body?.code) });
}
