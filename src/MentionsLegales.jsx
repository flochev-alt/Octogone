// Textes des mentions légales dans les 3 langues du site. La version française fait foi.
// Chaque section : un titre et un ou plusieurs paragraphes. Revue juridique d'octobre 2026 :
// LCEN (éditeur, hébergeur), RGPD (données, droits, CNIL), cookies, marques, photos libres, paris sportifs.
const EMAIL = "octogone.space@gmail.com";

const CONTENT = {
  fr: {
    title: "Mentions légales et confidentialité",
    note: null,
    updated: "Dernière mise à jour : 30 octobre 2026",
    contactLabel: "Contact",
    sections: [
      ["Éditeur du site", [
        "Le site Octogone (octogone.space) est édité à titre personnel et non professionnel par Flo C., dont l'identité complète a été communiquée à l'hébergeur, conformément à l'article 6 de la loi pour la confiance dans l'économie numérique (LCEN).",
      ], true],
      ["Directeur de la publication", ["Flo C."]],
      ["Hébergement", [
        "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com). Les données affichées (combattants, actualités, analyses) sont stockées chez Supabase Inc. (supabase.com).",
      ]],
      ["Site non officiel", [
        "Octogone est un site de fan indépendant. Il n'est ni affilié, ni approuvé, ni sponsorisé par l'UFC (Zuffa LLC, TKO Group Holdings), la PFL, la KSW, ni par aucune autre organisation, ligue ou combattant cité. « UFC », « Ultimate Fighting Championship », « The Octagon » et les autres noms d'organisations sont des marques appartenant à leurs propriétaires ; ils sont cités uniquement pour désigner les événements et les combattants dont parle le site.",
      ]],
      ["Propriété intellectuelle", [
        "L'ensemble des éléments propres au site (design, textes, structure, logo, simulateur) est la propriété de son éditeur, sauf mention contraire. Toute reproduction sans accord est interdite.",
        "Les données statistiques relatives aux combattants proviennent de sources publiques (ufc-fr.com, UFC.com, Tapology, Wikipédia, Octagon API) et de recherches manuelles vérifiées.",
        "Les photos des combattants sont hébergées sur Wikimedia Commons, sous licences libres (Creative Commons ou domaine public) ; certaines proviennent à l'origine de Flickr. L'auteur et la licence de chaque photo sont indiqués partout où elle apparaît (fiche du combattant, Simulateur, image « Partager mon pronostic »), avec un lien vers le fichier d'origine. Aucune photo n'est modifiée, en dehors d'un recadrage rond.",
        "Les posts et vidéos X intégrés dans la rubrique Médias restent la propriété de leurs auteurs ; ils sont affichés grâce au lecteur officiel de X, avec un lien vers le compte d'origine.",
      ]],
      ["Simulateur, analyse IA et paris sportifs", [
        "Les probabilités du Simulateur sont des estimations calculées automatiquement à partir des statistiques publiques des combattants. L'analyse de duel est générée par une intelligence artificielle (modèle Claude, d'Anthropic) et peut contenir des erreurs.",
        "Ces contenus sont fournis à titre de divertissement et d'information. Ils ne constituent en aucun cas un conseil ou une incitation à parier. Octogone n'a aucun lien avec un opérateur de paris et ne perçoit rien sur les paris.",
        "Les jeux d'argent et de hasard sont interdits aux mineurs. Jouer comporte des risques : endettement, dépendance… Appelle le 09 74 75 13 13 (Joueurs Info Service, appel non surtaxé) ou rends-toi sur joueurs-info-service.fr.",
      ]],
      ["Responsabilité", [
        "Les informations du site sont publiées de bonne foi et vérifiées autant que possible, mais elles peuvent contenir des erreurs ou ne plus être à jour (résultats, classements, dates d'événements). Pour signaler une erreur, écris à l'adresse ci-dessous.",
      ]],
      ["Données personnelles (RGPD)", [
        "Le responsable du traitement est l'éditeur du site (contact ci-dessous). Le site ne propose ni compte utilisateur ni formulaire, et ne vend aucune donnée.",
        "Sur ton appareil uniquement : ta langue, ton choix concernant les cookies, ton compteur d'analyses IA du jour et, le cas échéant, ton accès VIP sont gardés dans ton navigateur. Ils ne sont pas envoyés au site, et tu peux les effacer à tout moment en vidant les données du site dans ton navigateur.",
        "Adresse IP : comme pour tout site, elle est reçue par l'hébergeur pour afficher les pages, et par les services qui fournissent les données et les photos (Supabase, Wikimedia). Pour limiter à 5 le nombre d'analyses IA gratuites par jour, elle est aussi gardée dans la mémoire du serveur pendant au plus 24 heures, sans autre usage (intérêt légitime : sécurité et bon fonctionnement du site). Seules les statistiques des combattants sont envoyées à l'IA, jamais de donnée te concernant.",
        "Mesure d'audience et contenus X : seulement avec ton accord (voir « Cookies » ci-dessous).",
        "Certains prestataires (Vercel, Supabase, Google, X, Anthropic) sont situés aux États-Unis ; ces transferts sont encadrés par le cadre de protection des données UE–États-Unis (Data Privacy Framework) ou par les clauses contractuelles types de la Commission européenne.",
        "Tu disposes d'un droit d'accès, de rectification, d'effacement, d'opposition et de limitation sur tes données : il suffit d'écrire à l'adresse ci-dessous. Tu peux aussi adresser une réclamation à la CNIL (cnil.fr).",
      ]],
      ["Cookies", [
        "Aucun cookie n'est déposé sans ton accord. Le bandeau affiché à ta première visite propose « Accepter » et « Refuser » avec le même poids.",
        "Si tu acceptes : le site utilise Google Analytics (Google Ireland Ltd) pour mesurer son audience. Des cookies « _ga » sont déposés pour 13 mois au plus, et des données de navigation (pages vues, appareil, pays approximatif) sont transmises à Google. Les vidéos et posts X de la rubrique Médias s'affichent aussi directement ; X dépose alors ses propres cookies, régis par sa politique de confidentialité.",
        "Si tu refuses : aucune mesure d'audience, et chaque post X est remplacé par un bouton ; il ne se charge que si tu cliques dessus.",
        "Ton choix est gardé 13 mois et peut être modifié à tout moment via le lien « Cookies » en bas de page.",
      ]],
      ["Contact", ["Pour toute question relative au site, à son contenu ou à tes données :"], true],
    ],
  },
  en: {
    title: "Legal notice and privacy",
    note: "Translation provided for convenience; the French version is the reference.",
    updated: "Last updated: 30 October 2026",
    contactLabel: "Contact",
    sections: [
      ["Publisher", [
        "Octogone (octogone.space) is published on a personal, non-professional basis by Flo C., whose full identity has been given to the host, as allowed by article 6 of the French LCEN law.",
      ], true],
      ["Publication director", ["Flo C."]],
      ["Hosting", [
        "The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (vercel.com). The data shown (fighters, news, analyses) is stored by Supabase Inc. (supabase.com).",
      ]],
      ["Unofficial site", [
        "Octogone is an independent fan site. It is not affiliated with, endorsed or sponsored by the UFC (Zuffa LLC, TKO Group Holdings), the PFL, KSW or any other organization, league or fighter mentioned. \"UFC\", \"Ultimate Fighting Championship\", \"The Octagon\" and other organization names are trademarks of their owners; they are only used to refer to the events and fighters the site covers.",
      ]],
      ["Intellectual property", [
        "All elements specific to the site (design, text, structure, logo, simulator) belong to its publisher unless stated otherwise. Reproduction without permission is prohibited.",
        "Fighter statistics come from public sources (ufc-fr.com, UFC.com, Tapology, Wikipedia, Octagon API) and verified manual research.",
        "Fighter photos are hosted on Wikimedia Commons under free licences (Creative Commons or public domain); some originally come from Flickr. Each photo's author and licence are shown wherever it appears (fighter profile, Simulator, \"Share my prediction\" image), with a link to the original file. No photo is altered apart from a round crop.",
        "X posts and videos embedded in the Media section remain the property of their authors; they are shown through X's official player, with a link to the original account.",
      ]],
      ["Simulator, AI analysis and betting", [
        "The Simulator's probabilities are estimates computed automatically from the fighters' public statistics. The duel analysis is generated by artificial intelligence (Claude model, by Anthropic) and may contain errors.",
        "This content is provided for entertainment and information. It is in no way betting advice or an incentive to bet. Octogone has no link with any betting operator and earns nothing from bets.",
        "Gambling is prohibited for minors. Gambling involves risks: debt, addiction… In France, call 09 74 75 13 13 (Joueurs Info Service, free of surcharge) or visit joueurs-info-service.fr.",
      ]],
      ["Liability", [
        "The information on the site is published in good faith and checked as far as possible, but it may contain errors or be out of date (results, rankings, event dates). To report an error, write to the address below.",
      ]],
      ["Personal data (GDPR)", [
        "The data controller is the site's publisher (contact below). The site offers no user account and no form, and sells no data.",
        "On your device only: your language, your cookie choice, today's AI analysis counter and, if any, your VIP access are kept in your browser. They are not sent to the site, and you can erase them at any time by clearing the site's data in your browser.",
        "IP address: as with any website, it is received by the host to serve the pages, and by the services that provide the data and photos (Supabase, Wikimedia). To limit free AI analyses to 5 per day, it is also kept in the server's memory for at most 24 hours, with no other use (legitimate interest: security and proper operation of the site). Only fighter statistics are sent to the AI, never any data about you.",
        "Audience measurement and X content: only with your consent (see \"Cookies\" below).",
        "Some providers (Vercel, Supabase, Google, X, Anthropic) are based in the United States; these transfers are covered by the EU–US Data Privacy Framework or by the European Commission's standard contractual clauses.",
        "You have the right to access, rectify, erase, object to and restrict the processing of your data: just write to the address below. You can also lodge a complaint with the CNIL (cnil.fr).",
      ]],
      ["Cookies", [
        "No cookie is set without your consent. The banner shown on your first visit offers \"Accept\" and \"Refuse\" with equal weight.",
        "If you accept: the site uses Google Analytics (Google Ireland Ltd) to measure its audience. \"_ga\" cookies are set for up to 13 months, and browsing data (pages viewed, device, approximate country) is sent to Google. X videos and posts in the Media section are also shown directly; X then sets its own cookies, governed by its privacy policy.",
        "If you refuse: no audience measurement, and each X post is replaced by a button; it only loads if you click it.",
        "Your choice is kept for 13 months and can be changed at any time via the \"Cookies\" link at the bottom of the page.",
      ]],
      ["Contact", ["For any question about the site, its content or your data:"], true],
    ],
  },
  es: {
    title: "Aviso legal y privacidad",
    note: "Traducción ofrecida para mayor comodidad; la versión francesa es la de referencia.",
    updated: "Última actualización: 30 de octubre de 2026",
    contactLabel: "Contacto",
    sections: [
      ["Editor del sitio", [
        "El sitio Octogone (octogone.space) lo edita a título personal y no profesional Flo C., cuya identidad completa se ha comunicado al proveedor de alojamiento, conforme al artículo 6 de la ley francesa LCEN.",
      ], true],
      ["Director de la publicación", ["Flo C."]],
      ["Alojamiento", [
        "El sitio está alojado por Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Estados Unidos (vercel.com). Los datos mostrados (combatientes, noticias, análisis) se guardan en Supabase Inc. (supabase.com).",
      ]],
      ["Sitio no oficial", [
        "Octogone es un sitio de fans independiente. No está afiliado, aprobado ni patrocinado por la UFC (Zuffa LLC, TKO Group Holdings), la PFL, la KSW ni ninguna otra organización, liga o combatiente citado. «UFC», «Ultimate Fighting Championship», «The Octagon» y los demás nombres de organizaciones son marcas de sus propietarios; se citan únicamente para designar los eventos y combatientes de los que trata el sitio.",
      ]],
      ["Propiedad intelectual", [
        "Todos los elementos propios del sitio (diseño, textos, estructura, logotipo, simulador) pertenecen a su editor, salvo indicación contraria. Se prohíbe su reproducción sin autorización.",
        "Las estadísticas de los combatientes proceden de fuentes públicas (ufc-fr.com, UFC.com, Tapology, Wikipedia, Octagon API) y de investigaciones manuales verificadas.",
        "Las fotos de los combatientes están alojadas en Wikimedia Commons con licencias libres (Creative Commons o dominio público); algunas proceden originalmente de Flickr. El autor y la licencia de cada foto se indican allí donde aparece (ficha del combatiente, Simulador, imagen «Compartir mi pronóstico»), con un enlace al archivo original. Ninguna foto se modifica, salvo un recorte redondo.",
        "Los posts y vídeos de X integrados en la sección Media siguen siendo propiedad de sus autores; se muestran con el reproductor oficial de X, con un enlace a la cuenta original.",
      ]],
      ["Simulador, análisis IA y apuestas", [
        "Las probabilidades del Simulador son estimaciones calculadas automáticamente a partir de las estadísticas públicas de los combatientes. El análisis del duelo lo genera una inteligencia artificial (modelo Claude, de Anthropic) y puede contener errores.",
        "Estos contenidos se ofrecen como entretenimiento e información. En ningún caso son un consejo ni una incitación a apostar. Octogone no tiene relación con ningún operador de apuestas y no gana nada con ellas.",
        "Los juegos de azar están prohibidos a menores. Jugar conlleva riesgos: deudas, adicción… En Francia, llama al 09 74 75 13 13 (Joueurs Info Service, sin recargo) o visita joueurs-info-service.fr.",
      ]],
      ["Responsabilidad", [
        "La información del sitio se publica de buena fe y se verifica en la medida de lo posible, pero puede contener errores o no estar actualizada (resultados, clasificaciones, fechas de eventos). Para señalar un error, escribe a la dirección de abajo.",
      ]],
      ["Datos personales (RGPD)", [
        "El responsable del tratamiento es el editor del sitio (contacto abajo). El sitio no ofrece cuentas de usuario ni formularios, y no vende ningún dato.",
        "Solo en tu dispositivo: tu idioma, tu elección sobre las cookies, tu contador de análisis IA del día y, en su caso, tu acceso VIP se guardan en tu navegador. No se envían al sitio, y puedes borrarlos en cualquier momento eliminando los datos del sitio en tu navegador.",
        "Dirección IP: como en cualquier sitio web, la recibe el proveedor de alojamiento para mostrar las páginas, y los servicios que suministran los datos y las fotos (Supabase, Wikimedia). Para limitar a 5 los análisis IA gratuitos al día, también se guarda en la memoria del servidor durante 24 horas como máximo, sin ningún otro uso (interés legítimo: seguridad y buen funcionamiento del sitio). A la IA solo se envían las estadísticas de los combatientes, nunca datos sobre ti.",
        "Medición de audiencia y contenidos de X: solo con tu consentimiento (ver «Cookies» abajo).",
        "Algunos proveedores (Vercel, Supabase, Google, X, Anthropic) están en Estados Unidos; estas transferencias se basan en el Marco de Privacidad de Datos UE-EE. UU. o en las cláusulas contractuales tipo de la Comisión Europea.",
        "Tienes derecho de acceso, rectificación, supresión, oposición y limitación sobre tus datos: basta con escribir a la dirección de abajo. También puedes presentar una reclamación ante la CNIL (cnil.fr).",
      ]],
      ["Cookies", [
        "No se instala ninguna cookie sin tu consentimiento. El banner que aparece en tu primera visita ofrece «Aceptar» y «Rechazar» con el mismo peso.",
        "Si aceptas: el sitio usa Google Analytics (Google Ireland Ltd) para medir su audiencia. Se instalan cookies «_ga» durante 13 meses como máximo y se envían a Google datos de navegación (páginas vistas, dispositivo, país aproximado). Los vídeos y posts de X de la sección Media también se muestran directamente; X instala entonces sus propias cookies, regidas por su política de privacidad.",
        "Si rechazas: no hay medición de audiencia, y cada post de X se sustituye por un botón; solo se carga si haces clic en él.",
        "Tu elección se conserva 13 meses y puede cambiarse en cualquier momento con el enlace «Cookies» al pie de página.",
      ]],
      ["Contacto", ["Para cualquier pregunta sobre el sitio, su contenido o tus datos:"], true],
    ],
  },
};

const Mail = () => (
  <a href={`mailto:${EMAIL}`} className="text-amber-400 hover:underline">{EMAIL}</a>
);

export default function MentionsLegales({ lang = "fr" }) {
  const c = CONTENT[lang] || CONTENT.fr;
  return (
    <div className="w-full max-w-2xl mx-auto px-5 py-10 text-sm text-neutral-300 leading-relaxed">
      <h1 className="disp text-2xl mb-2">{c.title}</h1>
      {c.note && <p className="text-xs text-neutral-500">{c.note}</p>}
      <p className="text-xs text-neutral-500 mb-6">{c.updated}</p>

      {c.sections.map(([title, paragraphs, withEmail]) => (
        <section key={title} className="mb-8 last:mb-0">
          <h2 className="disp text-base text-amber-400 mb-2">{title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-2 last:mb-0">
              {p}
              {withEmail && i === paragraphs.length - 1 && (
                <>
                  <br />
                  {c.contactLabel}{lang === "fr" ? " :" : ":"} <Mail />
                </>
              )}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
