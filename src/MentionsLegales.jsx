export default function MentionsLegales() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10 text-sm text-neutral-300 leading-relaxed">
      <h1 className="disp text-2xl mb-8">Mentions légales</h1>

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">Éditeur du site</h2>
        <p>
          Le site Octogone (octogone.space) est édité à titre personnel et non professionnel par Flo C.
          <br />
          Contact : <a href="mailto:octogone.space@gmail.com" className="text-amber-400 hover:underline">octogone.space@gmail.com</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">Directeur de la publication</h2>
        <p>Flo C.</p>
      </section>

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc.
          <br />
          340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
          <br />
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">vercel.com</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">Propriété intellectuelle</h2>
        <p>
          L'ensemble des éléments du site (design, textes, structure, logo) est la propriété de son éditeur, sauf mention contraire.
          Les données statistiques relatives aux combattants proviennent de sources publiques (Octagon API) et de recherches manuelles vérifiées.
          Les noms, images et marques appartenant à des tiers (UFC, combattants, organisations) restent la propriété de leurs détenteurs respectifs.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="disp text-base text-amber-400 mb-2">Données personnelles</h2>
        <p>
          Le site ne propose ni compte utilisateur, ni formulaire de collecte de données personnelles.
          Seules des informations techniques non identifiantes sont conservées localement dans le navigateur du visiteur
          (préférence de langue, compteur d'utilisation quotidienne du simulateur IA), sans transmission à un serveur tiers à des fins de suivi.
        </p>
      </section>

      <section>
        <h2 className="disp text-base text-amber-400 mb-2">Contact</h2>
        <p>
          Pour toute question relative au site ou à son contenu :{" "}
          <a href="mailto:octogone.space@gmail.com" className="text-amber-400 hover:underline">octogone.space@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
