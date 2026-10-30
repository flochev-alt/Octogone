// Fiches des légendes (catégorie "Legendes") : qui il/elle est, palmarès, retraite.
// Vérifié le 2026-10-30 : Wikipédia (fiche du combattant) + Sherdog (bilan, dernier combat),
// presse MMA pour les retraites récentes (ESPN, CBS Sports, MMA News, Al Jazeera).
// retired: null = toujours en activité.

export const LEGENDS = {
  "Khabib Nurmagomedov": {
    bio: {
      fr: "L'« Aigle » du Daghestan, lutteur et samboïste à la pression étouffante. Il a pris sa retraite invaincu, un cas unique au sommet de l'UFC.",
      en: "\"The Eagle\" from Dagestan, a wrestler and sambo fighter with suffocating pressure. He retired unbeaten, a one-of-a-kind feat at the top of the UFC.",
      es: "\"El Águila\" de Daguestán, luchador y sambista de presión asfixiante. Se retiró invicto, algo único en la cima de la UFC.",
    },
    titles: [
      { fr: "Champion UFC des poids légers (2018-2021), 3 défenses", en: "UFC Lightweight Champion (2018-2021), 3 defenses", es: "Campeón de peso ligero de la UFC (2018-2021), 3 defensas" },
      { fr: "Double champion du monde de sambo de combat (2009, 2010)", en: "Two-time combat sambo world champion (2009, 2010)", es: "Doble campeón mundial de sambo de combate (2009, 2010)" },
      { fr: "Invaincu : 29 victoires, 0 défaite", en: "Unbeaten: 29 wins, 0 losses", es: "Invicto: 29 victorias, 0 derrotas" },
    ],
    retired: { fr: "Retraite annoncée le 24 octobre 2020, après l'UFC 254", en: "Retirement announced on October 24, 2020, after UFC 254", es: "Retirada anunciada el 24 de octubre de 2020, tras UFC 254" },
  },
  "Georges St-Pierre": {
    bio: {
      fr: "« GSP », le Québécois venu du karaté, devenu l'un des combattants les plus complets de l'histoire. Il a dominé les poids welters pendant des années.",
      en: "\"GSP\", the Quebec karateka who became one of the most complete fighters in history. He ruled the welterweight division for years.",
      es: "\"GSP\", el karateca de Quebec que se convirtió en uno de los peleadores más completos de la historia. Dominó el peso wélter durante años.",
    },
    titles: [
      { fr: "Champion UFC des poids welters (2006-2007, puis 2008-2013), 9 défenses", en: "UFC Welterweight Champion (2006-2007, then 2008-2013), 9 defenses", es: "Campeón wélter de la UFC (2006-2007 y 2008-2013), 9 defensas" },
      { fr: "Champion UFC des poids moyens (2017)", en: "UFC Middleweight Champion (2017)", es: "Campeón de peso medio de la UFC (2017)" },
    ],
    retired: { fr: "Retraite officielle le 21 février 2019 (dernier combat en 2017)", en: "Officially retired on February 21, 2019 (last fight in 2017)", es: "Retirada oficial el 21 de febrero de 2019 (última pelea en 2017)" },
  },
  "Conor McGregor": {
    bio: {
      fr: "« The Notorious », l'Irlandais qui a fait exploser la popularité de l'UFC. Puissance du bras gauche et sens du spectacle hors norme.",
      en: "\"The Notorious\", the Irishman who made the UFC's popularity explode. A lethal left hand and an unmatched showman.",
      es: "\"The Notorious\", el irlandés que disparó la popularidad de la UFC. Una zurda letal y un showman sin igual.",
    },
    titles: [
      { fr: "Champion UFC des poids plumes (2015-2016)", en: "UFC Featherweight Champion (2015-2016)", es: "Campeón pluma de la UFC (2015-2016)" },
      { fr: "Champion UFC des poids légers (2016-2018) : premier double champion simultané de l'UFC", en: "UFC Lightweight Champion (2016-2018): first simultaneous two-division UFC champion", es: "Campeón ligero de la UFC (2016-2018): primer doble campeón simultáneo de la UFC" },
    ],
    retired: null,
  },
  "Jon Jones": {
    bio: {
      fr: "« Bones », considéré par beaucoup comme le plus grand de tous les temps. Champion à 23 ans, il n'a jamais été battu sur le plan sportif : sa seule défaite est une disqualification.",
      en: "\"Bones\", seen by many as the greatest of all time. Champion at 23, he was never beaten on merit: his only loss is a disqualification.",
      es: "\"Bones\", considerado por muchos el mejor de todos los tiempos. Campeón a los 23 años, nunca fue vencido deportivamente: su única derrota es una descalificación.",
    },
    titles: [
      { fr: "Champion UFC des mi-lourds (2011-2015, puis 2018-2020)", en: "UFC Light Heavyweight Champion (2011-2015, then 2018-2020)", es: "Campeón semipesado de la UFC (2011-2015 y 2018-2020)" },
      { fr: "Champion UFC des poids lourds (2023-2025)", en: "UFC Heavyweight Champion (2023-2025)", es: "Campeón de peso pesado de la UFC (2023-2025)" },
      { fr: "Record UFC de 12 défenses de titre", en: "UFC record 12 title defenses", es: "Récord UFC de 12 defensas de título" },
    ],
    retired: { fr: "Retraite annoncée le 21 juin 2025 (dernier combat en novembre 2024)", en: "Retirement announced on June 21, 2025 (last fight in November 2024)", es: "Retirada anunciada el 21 de junio de 2025 (última pelea en noviembre de 2024)" },
  },
  "Fedor Emelianenko": {
    bio: {
      fr: "« Le Dernier Empereur », samboïste russe. Pendant près de 10 ans au PRIDE, il est resté invaincu et passait pour le meilleur poids lourd de la planète.",
      en: "\"The Last Emperor\", a Russian sambo fighter. For nearly 10 years in PRIDE he went unbeaten and was seen as the best heavyweight on the planet.",
      es: "\"El Último Emperador\", sambista ruso. Durante casi 10 años en PRIDE fue invicto y se le consideraba el mejor peso pesado del planeta.",
    },
    titles: [
      { fr: "Champion PRIDE des poids lourds (2003-2007)", en: "PRIDE Heavyweight Champion (2003-2007)", es: "Campeón de peso pesado de PRIDE (2003-2007)" },
      { fr: "Champion WAMMA des poids lourds (2008)", en: "WAMMA Heavyweight Champion (2008)", es: "Campeón de peso pesado de WAMMA (2008)" },
      { fr: "Champion RINGS des poids lourds", en: "RINGS Heavyweight Champion", es: "Campeón de peso pesado de RINGS" },
    ],
    retired: { fr: "Dernier combat le 4 février 2023 (Bellator 290)", en: "Last fight on February 4, 2023 (Bellator 290)", es: "Última pelea el 4 de febrero de 2023 (Bellator 290)" },
  },
  "Anderson Silva": {
    bio: {
      fr: "« The Spider », le Brésilien au striking spectaculaire. Il a régné sur les poids moyens de l'UFC pendant près de 7 ans.",
      en: "\"The Spider\", the Brazilian with spectacular striking. He ruled the UFC middleweight division for almost 7 years.",
      es: "\"The Spider\", el brasileño de golpeo espectacular. Reinó en el peso medio de la UFC durante casi 7 años.",
    },
    titles: [
      { fr: "Champion UFC des poids moyens (2006-2013), record de 10 défenses consécutives", en: "UFC Middleweight Champion (2006-2013), record 10 consecutive defenses", es: "Campeón de peso medio de la UFC (2006-2013), récord de 10 defensas seguidas" },
      { fr: "Champion Cage Rage (2004-2006) et Shooto (2001) des poids moyens", en: "Cage Rage (2004-2006) and Shooto (2001) Middleweight Champion", es: "Campeón de peso medio de Cage Rage (2004-2006) y Shooto (2001)" },
    ],
    retired: { fr: "Dernier combat MMA le 31 octobre 2020", en: "Last MMA fight on October 31, 2020", es: "Última pelea de MMA el 31 de octubre de 2020" },
  },
  "Demetrious Johnson": {
    bio: {
      fr: "« Mighty Mouse », le premier champion des poids mouches de l'UFC. Rapide, technique et complet, il a aussi brillé au ONE Championship.",
      en: "\"Mighty Mouse\", the first UFC flyweight champion. Fast, technical and complete, he also shone in ONE Championship.",
      es: "\"Mighty Mouse\", el primer campeón mosca de la UFC. Rápido, técnico y completo, también brilló en ONE Championship.",
    },
    titles: [
      { fr: "Champion UFC des poids mouches (2012-2018), 11 défenses", en: "UFC Flyweight Champion (2012-2018), 11 defenses", es: "Campeón mosca de la UFC (2012-2018), 11 defensas" },
      { fr: "Champion ONE des poids mouches (2022)", en: "ONE Flyweight Champion (2022)", es: "Campeón mosca de ONE (2022)" },
      { fr: "Vainqueur du Grand Prix ONE des poids mouches (2019)", en: "ONE Flyweight World Grand Prix winner (2019)", es: "Ganador del Grand Prix mosca de ONE (2019)" },
    ],
    retired: { fr: "Retraite annoncée le 6 septembre 2024 (dernier combat en mai 2023)", en: "Retirement announced on September 6, 2024 (last fight in May 2023)", es: "Retirada anunciada el 6 de septiembre de 2024 (última pelea en mayo de 2023)" },
  },
  "Daniel Cormier": {
    bio: {
      fr: "« DC », ancien lutteur olympique américain. Il a été champion dans deux catégories en même temps à l'UFC.",
      en: "\"DC\", a former US Olympic wrestler. He held UFC titles in two divisions at the same time.",
      es: "\"DC\", exluchador olímpico estadounidense. Fue campeón de la UFC en dos categorías a la vez.",
    },
    titles: [
      { fr: "Champion UFC des mi-lourds (2015-2018)", en: "UFC Light Heavyweight Champion (2015-2018)", es: "Campeón semipesado de la UFC (2015-2018)" },
      { fr: "Champion UFC des poids lourds (2018-2019)", en: "UFC Heavyweight Champion (2018-2019)", es: "Campeón de peso pesado de la UFC (2018-2019)" },
    ],
    retired: { fr: "Retraite après son dernier combat, le 15 août 2020 (UFC 252)", en: "Retired after his last fight, on August 15, 2020 (UFC 252)", es: "Retirado tras su última pelea, el 15 de agosto de 2020 (UFC 252)" },
  },
  "Randy Couture": {
    bio: {
      fr: "« The Natural », lutteur gréco-romain et pionnier de l'UFC. Champion jusqu'à plus de 40 ans dans deux catégories.",
      en: "\"The Natural\", a Greco-Roman wrestler and UFC pioneer. A champion in two divisions well past the age of 40.",
      es: "\"The Natural\", luchador grecorromano y pionero de la UFC. Campeón en dos categorías pasados los 40 años.",
    },
    titles: [
      { fr: "Champion UFC des poids lourds (3 règnes : 1997, 2000-2002, 2007-2008)", en: "UFC Heavyweight Champion (3 reigns: 1997, 2000-2002, 2007-2008)", es: "Campeón de peso pesado de la UFC (3 reinados: 1997, 2000-2002, 2007-2008)" },
      { fr: "Champion UFC des mi-lourds (2003-2004, puis 2004-2005)", en: "UFC Light Heavyweight Champion (2003-2004, then 2004-2005)", es: "Campeón semipesado de la UFC (2003-2004 y 2004-2005)" },
    ],
    retired: { fr: "Retraite le 30 avril 2011, après l'UFC 129", en: "Retired on April 30, 2011, after UFC 129", es: "Retirado el 30 de abril de 2011, tras UFC 129" },
  },
  "Chuck Liddell": {
    bio: {
      fr: "« The Iceman », la crête la plus célèbre de l'UFC. Un cogneur redouté qui a porté l'UFC vers le grand public dans les années 2000.",
      en: "\"The Iceman\", the UFC's most famous mohawk. A feared knockout artist who carried the UFC into the mainstream in the 2000s.",
      es: "\"The Iceman\", la cresta más famosa de la UFC. Un pegador temido que llevó la UFC al gran público en los años 2000.",
    },
    titles: [
      { fr: "Champion UFC des mi-lourds (2005-2007), 4 défenses", en: "UFC Light Heavyweight Champion (2005-2007), 4 defenses", es: "Campeón semipesado de la UFC (2005-2007), 4 defensas" },
    ],
    retired: { fr: "Dernier combat le 24 novembre 2018, retraite définitive annoncée en mars 2020", en: "Last fight on November 24, 2018, final retirement announced in March 2020", es: "Última pelea el 24 de noviembre de 2018, retirada definitiva anunciada en marzo de 2020" },
  },
  "Matt Hughes": {
    bio: {
      fr: "Le fermier de l'Illinois, lutteur à la force brute. Il a dominé les poids welters de l'UFC au début des années 2000.",
      en: "The Illinois farm boy, a wrestler with raw power. He dominated the UFC welterweight division in the early 2000s.",
      es: "El granjero de Illinois, luchador de fuerza bruta. Dominó el peso wélter de la UFC a principios de los 2000.",
    },
    titles: [
      { fr: "Champion UFC des poids welters (2001-2004, puis 2004-2006), 7 défenses", en: "UFC Welterweight Champion (2001-2004, then 2004-2006), 7 defenses", es: "Campeón wélter de la UFC (2001-2004 y 2004-2006), 7 defensas" },
    ],
    retired: { fr: "Dernier combat le 24 septembre 2011, retraite officialisée en janvier 2013", en: "Last fight on September 24, 2011, retirement made official in January 2013", es: "Última pelea el 24 de septiembre de 2011, retirada oficial en enero de 2013" },
  },
  "B.J. Penn": {
    bio: {
      fr: "« The Prodigy », l'Hawaïen ceinture noire de jiu-jitsu en un temps record. Il a été champion dans deux catégories de l'UFC.",
      en: "\"The Prodigy\", the Hawaiian who earned his jiu-jitsu black belt in record time. He won UFC titles in two divisions.",
      es: "\"The Prodigy\", el hawaiano que logró su cinturón negro de jiu-jitsu en tiempo récord. Fue campeón en dos categorías de la UFC.",
    },
    titles: [
      { fr: "Champion UFC des poids welters (2004)", en: "UFC Welterweight Champion (2004)", es: "Campeón wélter de la UFC (2004)" },
      { fr: "Champion UFC des poids légers (2008-2010)", en: "UFC Lightweight Champion (2008-2010)", es: "Campeón ligero de la UFC (2008-2010)" },
    ],
    retired: { fr: "Dernier combat le 11 mai 2019 (UFC 237)", en: "Last fight on May 11, 2019 (UFC 237)", es: "Última pelea el 11 de mayo de 2019 (UFC 237)" },
  },
  "Ronda Rousey": {
    bio: {
      fr: "Judokate médaillée olympique, elle a ouvert les portes de l'UFC aux femmes. Spécialiste de la clé de bras, souvent gagnée en quelques secondes.",
      en: "An Olympic medal-winning judoka, she opened the UFC's doors to women. An armbar specialist who often won in seconds.",
      es: "Judoca medallista olímpica, abrió las puertas de la UFC a las mujeres. Especialista en la palanca de brazo, a menudo ganada en segundos.",
    },
    titles: [
      { fr: "Première championne UFC des poids coqs (2013-2015), 6 défenses", en: "First UFC Women's Bantamweight Champion (2013-2015), 6 defenses", es: "Primera campeona gallo de la UFC (2013-2015), 6 defensas" },
      { fr: "Championne Strikeforce des poids coqs (2012)", en: "Strikeforce Women's Bantamweight Champion (2012)", es: "Campeona gallo de Strikeforce (2012)" },
    ],
    retired: { fr: "Retraite en 2016, puis un dernier combat le 16 mai 2026 (victoire en 17 s contre Gina Carano)", en: "Retired in 2016, then one last fight on May 16, 2026 (17-second win over Gina Carano)", es: "Retirada en 2016 y una última pelea el 16 de mayo de 2026 (victoria en 17 s ante Gina Carano)" },
  },
  "José Aldo": {
    bio: {
      fr: "« Scarface », le Brésilien aux low kicks dévastateurs. Premier champion des poids plumes de l'UFC, longtemps intouchable.",
      en: "\"Scarface\", the Brazilian with devastating leg kicks. The first UFC featherweight champion, untouchable for years.",
      es: "\"Scarface\", el brasileño de low kicks devastadoras. Primer campeón pluma de la UFC, intocable durante años.",
    },
    titles: [
      { fr: "Dernier champion WEC des poids plumes (2009-2010)", en: "Last WEC Featherweight Champion (2009-2010)", es: "Último campeón pluma de WEC (2009-2010)" },
      { fr: "Premier champion UFC des poids plumes (2010-2015), 7 défenses", en: "First UFC Featherweight Champion (2010-2015), 7 defenses", es: "Primer campeón pluma de la UFC (2010-2015), 7 defensas" },
      { fr: "De nouveau champion UFC des poids plumes (2016-2017)", en: "UFC Featherweight Champion again (2016-2017)", es: "De nuevo campeón pluma de la UFC (2016-2017)" },
    ],
    retired: { fr: "Retraite annoncée le 10 mai 2025, après l'UFC 315", en: "Retirement announced on May 10, 2025, after UFC 315", es: "Retirada anunciada el 10 de mayo de 2025, tras UFC 315" },
  },
  "Wanderlei Silva": {
    bio: {
      fr: "« The Axe Murderer », le Brésilien ultra-agressif devenu l'icône du PRIDE au Japon.",
      en: "\"The Axe Murderer\", the ultra-aggressive Brazilian who became PRIDE's icon in Japan.",
      es: "\"The Axe Murderer\", el brasileño ultraagresivo que se convirtió en el icono de PRIDE en Japón.",
    },
    titles: [
      { fr: "Champion PRIDE des poids moyens (2001-2007), 4 défenses", en: "PRIDE Middleweight Champion (2001-2007), 4 defenses", es: "Campeón de peso medio de PRIDE (2001-2007), 4 defensas" },
      { fr: "Champion IVC des mi-lourds (1999)", en: "IVC Light Heavyweight Champion (1999)", es: "Campeón semipesado de IVC (1999)" },
    ],
    retired: { fr: "Dernier combat le 29 septembre 2018, retraite annoncée le 1er septembre 2022", en: "Last fight on September 29, 2018, retirement announced on September 1, 2022", es: "Última pelea el 29 de septiembre de 2018, retirada anunciada el 1 de septiembre de 2022" },
  },
};
