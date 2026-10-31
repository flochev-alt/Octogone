// Pronostic chiffré du Simulateur : un score par combattant (bilan, frappe, lutte, finitions),
// puis la part de chacun dans le total. Partagé par le Simulateur, les pages d'événement et /api/pick.
export function computeScore(f) {
  const winRate = (f.victoires / (f.victoires + f.defaites)) * 100;
  const striking = f.striking ?? 50;
  const tdAcc = f.tdAcc ?? 30;
  const tdDef = f.tdDef ?? 65;
  const finishRate = (f.ko ?? 20) + (f.sub ?? 15);
  return winRate * 0.45 + striking * 0.2 + tdAcc * 0.1 + tdDef * 0.15 + finishRate * 0.1;
}

export function duelOdds(a, b) {
  const scoreA = computeScore(a);
  const scoreB = computeScore(b);
  const total = scoreA + scoreB;
  return { probA: Math.round((scoreA / total) * 100), probB: Math.round((scoreB / total) * 100) };
}
