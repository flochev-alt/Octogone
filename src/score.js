// Pronostic chiffré du Simulateur : un score par combattant (bilan, frappe, lutte, finitions),
// puis la part de chacun dans le total. Partagé par le Simulateur, les pages d'événement et /api/pick.
export const WEIGHTS = [
  { key: "winRate", w: 0.45 },
  { key: "striking", w: 0.2 },
  { key: "tdDef", w: 0.15 },
  { key: "tdAcc", w: 0.1 },
  { key: "finish", w: 0.1 },
];

// Détail du score (affiché dans « Comment on calcule ? ») ; une stat manquante prend une valeur moyenne.
export function computeParts(f) {
  const values = {
    winRate: (f.victoires / (f.victoires + f.defaites)) * 100,
    striking: f.striking ?? 50,
    tdDef: f.tdDef ?? 65,
    tdAcc: f.tdAcc ?? 30,
    finish: (f.ko ?? 20) + (f.sub ?? 15),
  };
  const missing = f.striking == null || f.tdDef == null || f.tdAcc == null || f.ko == null || f.sub == null;
  const total = WEIGHTS.reduce((s, { key, w }) => s + values[key] * w, 0);
  return { values, total, missing };
}

export function computeScore(f) {
  return computeParts(f).total;
}

export function duelOdds(a, b) {
  const scoreA = computeScore(a);
  const scoreB = computeScore(b);
  const total = scoreA + scoreB;
  return { probA: Math.round((scoreA / total) * 100), probB: Math.round((scoreB / total) * 100) };
}
