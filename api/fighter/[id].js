export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const r = await fetch(`https://api.octagon-api.com/fighter/${id}`);
    if (!r.ok) throw new Error("Combattant introuvable");
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: "Impossible de récupérer les données de ce combattant." });
  }
}
