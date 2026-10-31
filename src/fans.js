// « Les fans contre l'IA » : partagé entre le site et api/vote.js.
// Un combat est repéré par la date de l'événement et les deux noms (simplifiés, triés) : le même duel
// se retrouve ainsi sur la page de l'événement à venir puis sur celle des résultats.
import { norm, sameName, resultSides, findFighter, cardOf } from "./events.js";

const DAY = 864e5;

export function fanKey(iso, a, b) {
  const [nom1, nom2] = [a, b].sort((x, y) => norm(x).localeCompare(norm(y)));
  return { cle: `${iso}|${norm(nom1)}|${norm(nom2)}`, nom1, nom2 };
}

// Les votes ferment au début de la carte (start), sinon le soir de l'événement (22 h, heure de Paris).
export const voteCloses = (e) => (e.start ? Date.parse(e.start) : Date.parse(`${e.iso}T21:00:00Z`));
export const votingOpen = (e, now) => now < voteCloses(e);

// Seul le prochain événement (le plus proche dont les votes ne sont pas fermés) est ouvert au vote :
// les fans reviennent chaque semaine pour voter sur le suivant.
export const nextVoteEvent = (events, now) =>
  events.filter((e) => cardOf(e).length && votingOpen(e, now)).sort((a, b) => voteCloses(a) - voteCloses(b))[0] || null;

// On vote seulement sur la carte principale (main event compris) et quand les deux combattants sont
// dans notre base : l'IA peut alors toujours donner son favori, il y a un vrai duel Fans contre IA.
export const votableFight = (f, fighters) => (f.part || "main") === "main" && Boolean(findFighter(fighters, f.a) && findFighter(fighters, f.b));

// Ligne de votes d'un combat (la date peut différer d'un jour entre l'affiche et les résultats).
export function findRow(rows, iso, a, b) {
  const t = Date.parse(iso);
  return rows.find(
    (r) =>
      Math.abs(Date.parse(r.iso) - t) <= DAY &&
      ((sameName(r.nom1, a) && sameName(r.nom2, b)) || (sameName(r.nom1, b) && sameName(r.nom2, a)))
  ) || null;
}

// Pourcentages des fans pour a et b (dans cet ordre).
export function fanShare(row, a) {
  const total = (row?.votes1 || 0) + (row?.votes2 || 0);
  if (!total) return null;
  const pa = sameName(row.nom1, a) ? row.votes1 : row.votes2;
  const pctA = Math.round((pa / total) * 100);
  return { a: pctA, b: 100 - pctA, total };
}

// Choix des fans (le plus voté ; égalité = pas de choix) et de l'IA pour un combat.
export function fanPick(row) {
  if (!row || row.votes1 === row.votes2) return null;
  return row.votes1 > row.votes2 ? row.nom1 : row.nom2;
}

// Verdict d'un résultat « A def. B » : fans et IA avaient-ils raison ? (null = pas de pronostic)
export function verdictOf(rows, iso, fight) {
  const s = resultSides(fight);
  if (!s?.winner) return null;
  const row = findRow(rows, iso, s.winner, s.loser);
  if (!row) return null;
  const fans = fanPick(row);
  return {
    row,
    fans: fans ? sameName(fans, s.winner) : null,
    ia: row.ia_favori ? sameName(row.ia_favori, s.winner) : null,
  };
}

// Score Fans – IA sur une liste de cartes passées (un point par bon pronostic).
export function scoreOf(rows, cards) {
  const score = { fans: 0, ia: 0, fights: 0 };
  for (const c of cards) {
    for (const r of c.results || []) {
      const v = verdictOf(rows, c.iso, r.fight);
      if (!v || v.fans === null || v.ia === null) continue; // score seulement là où fans et IA ont tous deux un favori
      score.fights++;
      if (v.fans) score.fans++;
      if (v.ia) score.ia++;
    }
  }
  return score;
}
