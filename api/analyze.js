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

  const prompt = `Tu es un analyste MMA expert. Analyse ce duel hypothétique en 3-4 phrases percutantes, en français, sans inventer de détails que je ne te donne pas.

${fighterA.nom} (${fighterA.victoires}-${fighterA.defaites}, striking ${fighterA.striking ?? "?"}%, TD accuracy ${fighterA.tdAcc ?? "?"}%, TD defense ${fighterA.tdDef ?? "?"}%) vs ${fighterB.nom} (${fighterB.victoires}-${fighterB.defaites}, striking ${fighterB.striking ?? "?"}%, TD accuracy ${fighterB.tdAcc ?? "?"}%, TD defense ${fighterB.tdDef ?? "?"}%).

Probabilité calculée : ${fighterA.nom} ${probA}% / ${fighterB.nom} ${probB}%.

Explique ce qui pourrait faire pencher la balance stylistiquement (striking vs grappling, allonge, etc.), sans donner de pronostic de méthode ou de round précis.`;

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
        max_tokens: 300,
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
