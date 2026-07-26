export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(501).json({
      error: "ANTHROPIC_API_KEY non configurée. Ajoute-la dans Vercel > Settings > Environment Variables.",
    });
  }

  const { fighterA, fighterB, probA, probB } = req.body;

  const prompt = `Tu es un analyste MMA expert. Rédige une analyse détaillée et approfondie de ce duel hypothétique, en français, en 7-9 phrases, sans inventer de détails que je ne te donne pas.

${fighterA.nom} (${fighterA.victoires}-${fighterA.defaites}, striking ${fighterA.striking ?? "?"}%, TD accuracy ${fighterA.tdAcc ?? "?"}%, TD defense ${fighterA.tdDef ?? "?"}%) vs ${fighterB.nom} (${fighterB.victoires}-${fighterB.defaites}, striking ${fighterB.striking ?? "?"}%, TD accuracy ${fighterB.tdAcc ?? "?"}%, TD defense ${fighterB.tdDef ?? "?"}%).

Probabilité calculée : ${fighterA.nom} ${probA}% / ${fighterB.nom} ${probB}%.

Structure ton analyse ainsi :
1. Le style de chaque combattant et ce qu'il cherche à imposer dans ce duel précis (2-3 phrases)
2. Où se situe l'avantage stylistique clé (striking vs grappling, gestion de la distance, allonge, prise de risque) et pourquoi (2-3 phrases)
3. Le scénario qui donnerait le plus de fil à retordre à chacun des deux combattants (1-2 phrases)
4. Une conclusion nuancée sur ce qui pourrait faire basculer ce duel dans un sens ou dans l'autre (1-2 phrases)

Ne donne aucun pronostic de méthode de victoire ou de round précis, et ne mentionne jamais de cotes, de paris, ou de conseil de mise — reste uniquement sur l'analyse stylistique et technique.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("Anthropic API error");
    const data = await response.json();
    const analysis = data.content?.[0]?.text || "Analyse indisponible.";
    res.status(200).json({ analysis });
  } catch (e) {
    res.status(502).json({ error: "Impossible de générer l'analyse pour le moment." });
  }
}
