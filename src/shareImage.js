// Image « mon pronostic » du Simulateur, dessinée sur un canvas (1080 x 1350, format portrait des réseaux) :
// les deux combattants, les probabilités, le favori, l'accroche de l'IA et l'adresse du site.
import { initialsOf } from "./FighterAvatar.jsx";

const W = 1080;
const H = 1350;
const GOLD = "#fbbf24";
const GOLD_DARK = "#d97706";
const INK = "#0a0a0a";

// Photo chargée en « crossOrigin » (Wikimedia l'autorise) pour pouvoir exporter le canvas ; sinon, initiales.
function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
    setTimeout(() => resolve(null), 6000);
  });
}

function octagon(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (i * Math.PI) / 4;
    ctx[i ? "lineTo" : "moveTo"](cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Texte réduit jusqu'à tenir dans la largeur donnée.
function fitText(ctx, text, maxWidth, size, weight, family) {
  let s = size;
  do {
    ctx.font = `${weight} ${s}px ${family}`;
    s -= 2;
  } while (ctx.measureText(text).width > maxWidth && s > 16);
}

// Découpe un texte en lignes ; la dernière se termine par « … » s'il en reste.
function wrap(ctx, text, maxWidth, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    let last = lines[maxLines - 1];
    while (ctx.measureText(`${last}…`).width > maxWidth && last.includes(" ")) last = last.slice(0, last.lastIndexOf(" "));
    lines.length = maxLines;
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

function portrait(ctx, img, name, cx, cy, r, gold) {
  ctx.save();
  if (gold) {
    ctx.shadowColor = "rgba(251,191,36,0.55)";
    ctx.shadowBlur = 50;
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
  ctx.fillStyle = gold ? GOLD : "#525252";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  if (img) {
    // Comme sur le site : la photo remplit le cercle, cadrée en haut (le visage).
    const s = Math.max((2 * r) / img.width, (2 * r) / img.height);
    const w = img.width * s;
    const h = img.height * s;
    ctx.fillStyle = INK;
    ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    ctx.drawImage(img, cx - w / 2, cy - r, w, h);
  } else {
    const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    if (gold) g.addColorStop(0, "#fcd34d"), g.addColorStop(1, GOLD_DARK);
    else g.addColorStop(0, "#404040"), g.addColorStop(1, INK);
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    ctx.fillStyle = gold ? INK : "#fcd34d";
    ctx.font = `800 ${Math.round(r * 0.7)}px Archivo, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initialsOf(name), cx, cy + 4);
  }
  ctx.restore();
}

async function draw(canvas, d, withPhotos) {
  const { fighterA: A, fighterB: B, probA, probB, category, analysis, text } = d;
  const ctx = canvas.getContext("2d");
  const [imgA, imgB] = withPhotos ? await Promise.all([loadImage(d.photoA), loadImage(d.photoB)]) : [null, null];

  // Fond noir, halo doré et grand octogone en filigrane.
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  const halo = ctx.createRadialGradient(W / 2, 420, 40, W / 2, 420, 760);
  halo.addColorStop(0, "rgba(251,191,36,0.22)");
  halo.addColorStop(1, "rgba(251,191,36,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(251,191,36,0.10)";
  ctx.lineWidth = 3;
  octagon(ctx, W / 2, 470, 560);
  ctx.stroke();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 6;
  roundRect(ctx, 24, 24, W - 48, H - 48, 36);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // En-tête : OCTOGONE + catégorie.
  ctx.fillStyle = GOLD;
  ctx.font = "800 58px Archivo, sans-serif";
  ctx.letterSpacing = "10px";
  ctx.fillText("OCTOGONE", W / 2 + 5, 120);
  ctx.letterSpacing = "6px";
  ctx.font = "600 26px Inter, sans-serif";
  ctx.fillStyle = "#a3a3a3";
  ctx.fillText(`${text.myPick} · ${category}`.toUpperCase(), W / 2 + 3, 168);
  ctx.letterSpacing = "0px";

  // Les deux coins.
  const cy = 370;
  const r = 150;
  portrait(ctx, imgA, A.nom, 270, cy, r, true);
  portrait(ctx, imgB, B.nom, W - 270, cy, r, false);

  ctx.save();
  octagon(ctx, W / 2, cy, 66);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.font = "800 46px Archivo, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("VS", W / 2, cy + 3);
  ctx.restore();

  const nameY = cy + r + 72;
  [[A, 270, "#fafafa"], [B, W - 270, "#e5e5e5"]].forEach(([f, x, color]) => {
    ctx.fillStyle = color;
    fitText(ctx, f.nom, 420, 46, 800, "Archivo, sans-serif");
    ctx.fillText(f.nom, x, nameY);
    ctx.fillStyle = "#a3a3a3";
    ctx.font = "600 30px 'IBM Plex Mono', monospace";
    ctx.fillText(`${f.victoires}-${f.defaites}-${f.nuls}`, x, nameY + 46);
  });

  // Probabilités.
  const barY = nameY + 180;
  ctx.font = "600 84px 'IBM Plex Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillStyle = GOLD;
  ctx.fillText(`${probA}%`, 90, barY - 24);
  ctx.textAlign = "right";
  ctx.fillStyle = "#d4d4d4";
  ctx.fillText(`${probB}%`, W - 90, barY - 24);
  const bw = W - 180;
  roundRect(ctx, 90, barY, bw, 26, 13);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "#737373";
  ctx.fillRect(90, barY, bw, 26);
  const g = ctx.createLinearGradient(90, 0, 90 + bw, 0);
  g.addColorStop(0, GOLD_DARK);
  g.addColorStop(1, "#fcd34d");
  ctx.fillStyle = g;
  ctx.fillRect(90, barY, (bw * probA) / 100, 26);
  ctx.restore();

  // Favori (celui de l'IA s'il y en a un, sinon celui des stats), puis fin probable et confiance.
  const favName = analysis?.favori || (probA === probB ? null : probA > probB ? A.nom : B.nom);
  let y = barY + 104;
  ctx.textAlign = "center";
  if (favName) {
    const label = `🏆  ${text.favorite(favName)}`;
    fitText(ctx, label, W - 260, 40, 800, "Archivo, sans-serif");
    const tw = ctx.measureText(label).width + 80;
    roundRect(ctx, (W - tw) / 2, y - 48, tw, 74, 37);
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.fillText(label, W / 2, y + 2);
    y += 76;
  }
  const chips = [analysis?.tendance && `${text.finish} : ${text.finishLabels[analysis.tendance] || analysis.tendance}`,
    analysis?.confiance && `${text.confidence} : ${text.confidenceLabels[analysis.confiance] || analysis.confiance}`].filter(Boolean);
  if (chips.length) {
    ctx.font = "600 28px Inter, sans-serif";
    ctx.fillStyle = "#fcd34d";
    ctx.fillText(chips.join("   ·   "), W / 2, y);
    y += 40;
  }

  // Accroche de l'IA, en italique et entre guillemets.
  if (analysis?.accroche) {
    ctx.font = "italic 500 34px Inter, sans-serif";
    ctx.fillStyle = "#f5f5f5";
    const lines = wrap(ctx, `« ${analysis.accroche} »`, W - 220, 3);
    y += 24;
    lines.forEach((l) => {
      ctx.fillText(l, W / 2, y);
      y += 48;
    });
  }

  // Pied : invitation et adresse du site.
  ctx.fillStyle = "#d4d4d4";
  ctx.font = "500 30px Inter, sans-serif";
  ctx.fillText(text.cta, W / 2, H - 150);
  ctx.fillStyle = GOLD;
  ctx.font = "800 54px Archivo, sans-serif";
  ctx.fillText("octogone.space", W / 2, H - 92);
  ctx.fillStyle = "#737373";
  ctx.font = "400 20px Inter, sans-serif";
  ctx.fillText(text.disclaimer, W / 2, H - 52);
}

// Renvoie un fichier PNG prêt à partager ou à télécharger.
export async function makeShareImage(data) {
  await Promise.all(
    ["800 58px Archivo", "600 30px 'IBM Plex Mono'", "500 30px Inter", "italic 500 34px Inter"].map((f) => document.fonts?.load(f).catch(() => {}))
  );
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const toBlob = () => new Promise((res, rej) => {
    try { canvas.toBlob((b) => (b ? res(b) : rej(new Error("blob"))), "image/png"); } catch (e) { rej(e); }
  });
  await draw(canvas, data, true);
  let blob;
  try {
    blob = await toBlob();
  } catch {
    // Une photo a « sali » le canvas (pas d'autorisation CORS) : on redessine avec les initiales.
    await draw(canvas, data, false);
    blob = await toBlob();
  }
  const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
  return new File([blob], `octogone-${slug(data.fighterA.nom)}-vs-${slug(data.fighterB.nom)}.png`, { type: "image/png" });
}
