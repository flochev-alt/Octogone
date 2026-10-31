import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Publicité AdSense : identifiants lus dans les variables Vercel ADSENSE_CLIENT (pub-… ou ca-pub-…)
// et ADSENSE_SLOT (numéro de l'unité d'annonce). Ce ne sont pas des secrets : ils sont visibles
// dans le code de toute page avec de la pub. Vides = pub éteinte.
const pubId = (process.env.ADSENSE_CLIENT || "").trim().replace(/^ca-/, "");
const client = /^pub-\d{10,20}$/.test(pubId) ? `ca-${pubId}` : "";
const slot = /^\d{5,20}$/.test((process.env.ADSENSE_SLOT || "").trim()) ? process.env.ADSENSE_SLOT.trim() : "";

function adsense() {
  return {
    name: "octogone-adsense",
    // Balise de validation du site + script AdSense (qui charge aussi le bandeau cookies de Google).
    transformIndexHtml(html) {
      if (!client) return html;
      return html.replace(
        "</head>",
        `  <meta name="google-adsense-account" content="${client}" />\n    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>\n  </head>`
      );
    },
    // ads.txt : déclare Google comme seul vendeur autorisé des pubs du site.
    generateBundle() {
      if (!client) return;
      this.emitFile({ type: "asset", fileName: "ads.txt", source: `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n` });
    },
  };
}

export default defineConfig({
  plugins: [react(), adsense()],
  define: {
    __ADSENSE_CLIENT__: JSON.stringify(client),
    __ADSENSE_SLOT__: JSON.stringify(slot),
  },
});
