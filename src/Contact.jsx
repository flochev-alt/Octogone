import { useState } from "react";
import { Mail, Copy, Check, AlertTriangle, Lightbulb, Camera, Handshake } from "lucide-react";

// Page « Contact » : une seule adresse e-mail (pas de formulaire, donc aucune donnée gardée par le site).
const EMAIL = "octogone.space@gmail.com";

const CONTENT = {
  fr: {
    title: "Contact",
    intro: "Une question, une remarque ? Écris-moi, je réponds en général sous quelques jours.",
    write: "Écrire un e-mail",
    copy: "Copier l'adresse",
    copied: "Adresse copiée",
    reasonsTitle: "Tu peux m'écrire pour :",
    reasons: [
      [AlertTriangle, "Signaler une erreur", "Une stat, un bilan ou un résultat faux ? Dis-moi le combattant et la bonne info, avec ta source si tu l'as."],
      [Lightbulb, "Proposer une idée", "Une rubrique, un combattant à ajouter, une amélioration du Simulateur…"],
      [Camera, "Une photo ou un contenu", "Tu es l'auteur d'une photo ou d'un contenu affiché sur le site et tu veux le faire corriger ou retirer."],
      [Handshake, "Un partenariat", "Médias, clubs, organisations ou annonceurs."],
    ],
    note: "Ton adresse e-mail sert seulement à te répondre. Elle n'est ni partagée ni utilisée pour autre chose.",
  },
  en: {
    title: "Contact",
    intro: "A question or a comment? Write to me, I usually reply within a few days.",
    write: "Send an email",
    copy: "Copy the address",
    copied: "Address copied",
    reasonsTitle: "You can write to me to:",
    reasons: [
      [AlertTriangle, "Report a mistake", "A wrong stat, record or result? Tell me the fighter and the right info, with your source if you have one."],
      [Lightbulb, "Suggest an idea", "A new section, a fighter to add, a Simulator improvement…"],
      [Camera, "A photo or content", "You are the author of a photo or content shown on the site and want it corrected or removed."],
      [Handshake, "A partnership", "Media, gyms, organisations or advertisers."],
    ],
    note: "Your email address is only used to reply to you. It is never shared or used for anything else.",
  },
  es: {
    title: "Contacto",
    intro: "¿Una pregunta o un comentario? Escríbeme, suelo responder en unos días.",
    write: "Enviar un e-mail",
    copy: "Copiar la dirección",
    copied: "Dirección copiada",
    reasonsTitle: "Puedes escribirme para:",
    reasons: [
      [AlertTriangle, "Señalar un error", "¿Una estadística, un récord o un resultado incorrecto? Dime el peleador y el dato correcto, con tu fuente si la tienes."],
      [Lightbulb, "Proponer una idea", "Una sección, un peleador que añadir, una mejora del Simulador…"],
      [Camera, "Una foto o un contenido", "Eres autor de una foto o de un contenido del sitio y quieres que se corrija o se retire."],
      [Handshake, "Una colaboración", "Medios, gimnasios, organizaciones o anunciantes."],
    ],
    note: "Tu dirección de e-mail solo sirve para responderte. No se comparte ni se usa para nada más.",
  },
};

export default function Contact({ lang = "fr" }) {
  const c = CONTENT[lang] || CONTENT.fr;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // presse-papiers indisponible : l'adresse reste affichée en clair
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-5 py-10 text-sm text-neutral-300 leading-relaxed">
      <h1 className="disp text-2xl mb-2">{c.title}</h1>
      <p className="mb-6">{c.intro}</p>

      <div className="rounded-2xl border border-amber-400/30 bg-neutral-900 p-5 mb-8">
        <div className="flex items-center gap-2 text-base font-semibold text-neutral-100 break-all">
          <Mail className="w-5 h-5 text-amber-400 shrink-0" /> {EMAIL}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <a href={`mailto:${EMAIL}?subject=Octogone`} className="tap flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 text-neutral-950 font-semibold py-2.5 hover:bg-amber-300">
            <Mail className="w-4 h-4" /> {c.write}
          </a>
          <button onClick={copy} className="tap flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-100 font-semibold py-2.5 hover:bg-neutral-700">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} {copied ? c.copied : c.copy}
          </button>
        </div>
      </div>

      <h2 className="disp text-base text-amber-400 mb-3">{c.reasonsTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {c.reasons.map(([Icon, title, text]) => (
          <div key={title} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="flex items-center gap-2 font-semibold text-neutral-100 mb-1">
              <Icon className="w-4 h-4 text-amber-400 shrink-0" /> {title}
            </div>
            <p className="text-xs text-neutral-400">{text}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-500">{c.note}</p>
    </div>
  );
}
