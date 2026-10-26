// Textes des mentions légales dans les 3 langues du site. La version française fait foi.
const CONTENT = {
  fr: {
    title: "Mentions légales",
    note: null,
    publisherTitle: "Éditeur du site",
    publisher: "Le site Octogone (octogone.space) est édité à titre personnel et non professionnel par Flo C.",
    contactLabel: "Contact",
    directorTitle: "Directeur de la publication",
    hostingTitle: "Hébergement",
    hosting: "Le site est hébergé par Vercel Inc.",
    country: "États-Unis",
    ipTitle: "Propriété intellectuelle",
    ip: "L'ensemble des éléments du site (design, textes, structure, logo) est la propriété de son éditeur, sauf mention contraire. Les données statistiques relatives aux combattants proviennent de sources publiques (ufc-fr.com, UFC.com, Wikipédia, Octagon API) et de recherches manuelles vérifiées. Les noms, images et marques appartenant à des tiers (UFC, combattants, organisations) restent la propriété de leurs détenteurs respectifs.",
    dataTitle: "Données personnelles",
    data: "Le site ne propose ni compte utilisateur, ni formulaire de collecte de données personnelles. Seules des informations techniques non identifiantes sont conservées localement dans le navigateur du visiteur (préférence de langue, compteur d'utilisation quotidienne du simulateur IA), sans transmission à un serveur tiers à des fins de suivi.",
    contactTitle: "Contact",
    contact: "Pour toute question relative au site ou à son contenu :",
  },
  en: {
    title: "Legal notice",
    note: "Translation provided for convenience; the French version is the reference.",
    publisherTitle: "Publisher",
    publisher: "Octogone (octogone.space) is published on a personal, non-professional basis by Flo C.",
    contactLabel: "Contact",
    directorTitle: "Publication director",
    hostingTitle: "Hosting",
    hosting: "The site is hosted by Vercel Inc.",
    country: "United States",
    ipTitle: "Intellectual property",
    ip: "All elements of the site (design, text, structure, logo) belong to its publisher unless stated otherwise. Fighter statistics come from public sources (ufc-fr.com, UFC.com, Wikipedia, Octagon API) and verified manual research. Names, images and trademarks belonging to third parties (UFC, fighters, organizations) remain the property of their respective owners.",
    dataTitle: "Personal data",
    data: "The site offers no user account and no form collecting personal data. Only non-identifying technical information is stored locally in the visitor's browser (language preference, daily usage counter for the AI simulator), with no transfer to a third-party server for tracking purposes.",
    contactTitle: "Contact",
    contact: "For any question about the site or its content:",
  },
  es: {
    title: "Aviso legal",
    note: "Traducción ofrecida para mayor comodidad; la versión francesa es la de referencia.",
    publisherTitle: "Editor del sitio",
    publisher: "El sitio Octogone (octogone.space) lo edita a título personal y no profesional Flo C.",
    contactLabel: "Contacto",
    directorTitle: "Director de la publicación",
    hostingTitle: "Alojamiento",
    hosting: "El sitio está alojado por Vercel Inc.",
    country: "Estados Unidos",
    ipTitle: "Propiedad intelectual",
    ip: "Todos los elementos del sitio (diseño, textos, estructura, logotipo) pertenecen a su editor, salvo indicación contraria. Las estadísticas de los combatientes proceden de fuentes públicas (ufc-fr.com, UFC.com, Wikipedia, Octagon API) y de investigaciones manuales verificadas. Los nombres, imágenes y marcas de terceros (UFC, combatientes, organizaciones) siguen siendo propiedad de sus respectivos titulares.",
    dataTitle: "Datos personales",
    data: "El sitio no ofrece cuentas de usuario ni formularios de recogida de datos personales. Solo se guarda en el navegador del visitante información técnica no identificativa (preferencia de idioma, contador de uso diario del simulador IA), sin transmisión a un servidor de terceros con fines de seguimiento.",
    contactTitle: "Contacto",
    contact: "Para cualquier pregunta sobre el sitio o su contenido:",
  },
};

export default function MentionsLegales({ lang = "fr" }) {
  const c = CONTENT[lang] || CONTENT.fr;
  return (
    <div className="max-w-2xl mx-auto px-5 py-10 text-sm text-neutral-300 leading-relaxed">
      <h1 className="disp text-2xl mb-2">{c.title}</h1>
      {c.note && <p className="text-xs text-neutral-500 mb-6">{c.note}</p>}
      {!c.note && <div className="mb-6" />}

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">{c.publisherTitle}</h2>
        <p>
          {c.publisher}
          <br />
          {c.contactLabel}{lang === "fr" ? " :" : ":"} <a href="mailto:octogone.space@gmail.com" className="text-amber-400 hover:underline">octogone.space@gmail.com</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">{c.directorTitle}</h2>
        <p>Flo C.</p>
      </section>

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">{c.hostingTitle}</h2>
        <p>
          {c.hosting}
          <br />
          340 S Lemon Ave #4133, Walnut, CA 91789, {c.country}
          <br />
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">vercel.com</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">{c.ipTitle}</h2>
        <p>{c.ip}</p>
      </section>

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">{c.dataTitle}</h2>
        <p>{c.data}</p>
      </section>

      <section>
        <h2 className="disp text-base text-amber-400 mb-2">{c.contactTitle}</h2>
        <p>
          {c.contact}{" "}
          <a href="mailto:octogone.space@gmail.com" className="text-amber-400 hover:underline">octogone.space@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
