// Champions des autres ligues (hors UFC) — affichés dans l'onglet Combattants, jamais dans le Simulateur.
// Bilans vérifiés sur 2 sources (fiche Wikipédia + fiche Sherdog), 5 derniers combats du plus récent au plus ancien.
// Résultats 2026 complétés par cagesidepress.com, lowkickmma.com, thegruelingtruth.com. Vérifié le 2026-10-30.
// Même forme que fightersData.js (rang 0 = champion) pour réutiliser la fiche combattant.

const f = (r, opponent, method, event, date) => ({ result: r, opponent, method, event, date });
const DU = "Décision unanime", DP = "Décision partagée", DM = "Décision majoritaire", SUB = "Soumission";

export const LEAGUES = [
  { id: "PFL", name: "PFL", url: "https://pflmma.com" },
  { id: "KSW", name: "KSW", url: "https://www.kswmma.com" },
  // Scène française : les sites des ligues ne tiennent pas de liste de champions à jour,
  // on n'affiche que les ceintures confirmées par 2 sources (vérifié le 2026-10-30).
  { id: "ARES", name: "ARES", url: "https://www.aresfighting.com", note: { fr: "Seules les ceintures confirmées par 2 sources sont affichées.", en: "Only belts confirmed by 2 sources are shown.", es: "Solo se muestran los cinturones confirmados por 2 fuentes." } },
  { id: "Hexagone MMA", name: "Hexagone MMA", url: "https://hexagonemma.fr", note: { fr: "Seules les ceintures confirmées par 2 sources sont affichées.", en: "Only belts confirmed by 2 sources are shown.", es: "Solo se muestran los cinturones confirmados por 2 fuentes." } },
];

export const LEAGUE_FIGHTERS = [
  // --- PFL ---
  {
    id: "pfl-nemkov", ligue: "PFL", nom: "Vadim Nemkov", categorie: "Poids lourd", rang: 0,
    victoires: 20, defaites: 2, nuls: 0, nc: 1, naissance: "1992-06-20", pays: { fr: "Russie", en: "Russia", es: "Rusia" },
    recent: [
      f("V", "Renan Ferreira", SUB, "PFL Lyon", "2025-12-13"),
      f("V", "Timothy Johnson", SUB, "PFL Champions Series 1", "2025-01-25"),
      f("V", "Bruno Cappelozza", SUB, "PFL vs. Bellator", "2024-02-24"),
      f("V", "Yoel Romero", DU, "Bellator 297", "2023-06-16"),
      f("V", "Corey Anderson", DU, "Bellator 288", "2022-11-18"),
    ],
  },
  {
    id: "pfl-anderson", ligue: "PFL", nom: "Corey Anderson", categorie: "Poids mi-lourd", rang: 0,
    victoires: 20, defaites: 6, nuls: 0, nc: 1, naissance: "1989-09-22", pays: { fr: "États-Unis", en: "United States", es: "Estados Unidos" },
    recent: [
      f("V", "Dovletdzhan Yagshimuradov", DU, "PFL Champions Series 3", "2025-10-03"),
      f("V", "Denis Goltsov", "TKO", "PFL Champions Series 2", "2025-07-19"),
      f("V", "Karl Moore", DU, "Bellator Champions Series 1", "2024-03-22"),
      f("V", "Phil Davis", DP, "Bellator 297", "2023-06-16"),
      f("D", "Vadim Nemkov", DU, "Bellator 288", "2022-11-18"),
    ],
  },
  {
    id: "pfl-van-steenis", ligue: "PFL", nom: "Costello van Steenis", categorie: "Poids moyen", rang: 0,
    victoires: 18, defaites: 3, nuls: 0, nc: 0, naissance: "1992-07-26", pays: { fr: "Pays-Bas", en: "Netherlands", es: "Países Bajos" },
    note: { fr: "Champion intérimaire : Johnny Eblen", en: "Interim champion: Johnny Eblen", es: "Campeón interino: Johnny Eblen" },
    recent: [
      f("V", "Fabian Edwards", "KO", "PFL Madrid", "2026-03-20"),
      f("V", "Johnny Eblen", SUB, "PFL Champions Series 2", "2025-07-19"),
      f("V", "João Vitor Dantas", "KO", "PFL 10", "2024-11-29"),
      f("V", "Gregory Babene", SUB, "Bellator Champions Series 2", "2024-05-17"),
      f("D", "Douglas Lima", DU, "Bellator 296", "2023-05-12"),
    ],
  },
  {
    id: "pfl-jean", ligue: "PFL", nom: "Thad Jean", categorie: "Poids welter", rang: 0,
    victoires: 12, defaites: 0, nuls: 0, nc: 0, naissance: "1998-07-16", pays: { fr: "États-Unis", en: "United States", es: "Estados Unidos" },
    recent: [
      f("V", "Ernesto Rodriguez", "TKO", "PFL Washington DC", "2026-07-25"),
      f("V", "Logan Storley", DU, "PFL 8", "2025-08-01"),
      f("V", "Jason Jackson", DP, "PFL 5", "2025-06-12"),
      f("V", "Mukhamed Berkhamov", "KO", "PFL 1", "2025-04-03"),
      f("V", "Chris Brown", DU, "PFL 8", "2024-08-16"),
    ],
  },
  {
    id: "pfl-usman", ligue: "PFL", nom: "Usman Nurmagomedov", categorie: "Poids leger", rang: 0,
    victoires: 22, defaites: 0, nuls: 0, nc: 1, naissance: "1998-04-17", pays: { fr: "Russie", en: "Russia", es: "Rusia" },
    recent: [
      f("V", "Archie Colgan", "KO", "PFL New York", "2026-07-31"),
      f("V", "Alfie Davis", SUB, "PFL Dubaï", "2026-02-07"),
      f("V", "Paul Hughes", DU, "PFL Champions Series 3", "2025-10-03"),
      f("V", "Paul Hughes", DM, "PFL Champions Series 1", "2025-01-25"),
      f("V", "Alexandr Shabliy", DU, "Bellator Champions Series 4", "2024-09-07"),
    ],
  },
  {
    id: "pfl-shaydullaev", ligue: "PFL", nom: "Razhabali Shaydullaev", categorie: "Poids plume", rang: 0,
    victoires: 20, defaites: 0, nuls: 0, nc: 0, naissance: "2000-10-11", pays: { fr: "Kirghizistan", en: "Kyrgyzstan", es: "Kirguistán" },
    note: { fr: "Aussi champion RIZIN", en: "Also RIZIN champion", es: "También campeón de RIZIN" },
    recent: [
      f("V", "A.J. McKee", DU, "Super RIZIN 5", "2026-09-10"),
      f("V", "Yuta Kubo", "TKO", "RIZIN Landmark 13", "2026-04-12"),
      f("V", "Mikuru Asakura", "TKO", "RIZIN", "2025-12-31"),
      f("V", "Viktor Kolesnik", "TKO", "RIZIN 51", "2025-09-28"),
      f("V", "Kleber Koike Erbst", "KO", "RIZIN", "2025-05-04"),
    ],
  },
  {
    id: "pfl-cyborg", ligue: "PFL", nom: "Cris Cyborg", categorie: "Poids plume feminin", rang: 0, female: true,
    victoires: 30, defaites: 2, nuls: 0, nc: 1, naissance: "1985-07-09", pays: { fr: "Brésil", en: "Brazil", es: "Brasil" },
    recent: [
      f("V", "Ketlen Vieira", DU, "PFL Tampa", "2026-08-22"),
      f("V", "Sara Collins", SUB, "PFL Lyon", "2025-12-13"),
      f("V", "Larissa Pacheco", DU, "PFL Super Fights", "2024-10-19"),
      f("V", "Cat Zingano", "TKO", "Bellator 300", "2023-10-07"),
      f("V", "Arlene Blencowe", DU, "Bellator 279", "2022-04-23"),
    ],
  },
  {
    id: "pfl-bishop", ligue: "PFL", nom: "Jena Bishop", categorie: "Poids mouche feminin", rang: 0, female: true,
    victoires: 12, defaites: 3, nuls: 0, nc: 0, naissance: "1986-02-22", pays: { fr: "États-Unis", en: "United States", es: "Estados Unidos" },
    recent: [
      f("V", "Liz Carmouche", DU, "PFL Chicago", "2026-10-16"),
      f("V", "Ariane Lipski", SUB, "PFL San Diego", "2026-06-27"),
      f("V", "Borena Tsertsvadze", SUB, "PFL Chicago", "2026-04-11"),
      f("D", "Liz Carmouche", "KO", "PFL 9", "2025-08-15"),
      f("V", "Ekaterina Shakalova", SUB, "PFL 6", "2025-06-20"),
    ],
  },

  // --- KSW ---
  {
    id: "ksw-de-fries", ligue: "KSW", nom: "Phil De Fries", categorie: "Poids lourd", rang: 0,
    victoires: 29, defaites: 6, nuls: 0, nc: 1, naissance: "1986-04-21", pays: { fr: "Angleterre", en: "England", es: "Inglaterra" },
    note: { fr: "Champion intérimaire : Štefan Vojčák", en: "Interim champion: Štefan Vojčák", es: "Campeón interino: Štefan Vojčák" },
    recent: [
      f("V", "Marcin Wójcik", SUB, "KSW 117", "2026-04-18"),
      f("V", "Štefan Vojčák", "TKO", "KSW 111", "2025-10-18"),
      f("V", "Arkadiusz Wrzosek", SUB, "KSW 107", "2025-06-14"),
      f("V", "Darko Stošić", "TKO", "KSW 100", "2024-11-16"),
      f("V", "Augusto Sakai", DU, "KSW 95", "2024-06-07"),
    ],
  },
  {
    id: "ksw-lesko", ligue: "KSW", nom: "Bartosz Leśko", categorie: "Poids mi-lourd", rang: 0,
    victoires: 17, defaites: 6, nuls: 2, nc: 0, naissance: "1996-04-28", pays: { fr: "Pologne", en: "Poland", es: "Polonia" },
    recent: [
      f("V", "Rafał Haratyk", DU, "KSW 120", "2026-07-18"),
      f("V", "Bartosz Szewczyk", DU, "KSW 116", "2026-03-14"),
      f("D", "Rafał Haratyk", DU, "KSW 111", "2025-10-18"),
      f("V", "Maciej Różański", DU, "KSW 104", "2025-03-08"),
      f("V", "Dominik Humburger", DU, "KSW 98", "2024-09-14"),
    ],
  },
  {
    id: "ksw-pawlak", ligue: "KSW", nom: "Paweł Pawlak", categorie: "Poids moyen", rang: 0,
    victoires: 26, defaites: 4, nuls: 1, nc: 0, naissance: "1989-02-08", pays: { fr: "Pologne", en: "Poland", es: "Polonia" },
    note: { fr: "Champion intérimaire : Piotr Kuberski", en: "Interim champion: Piotr Kuberski", es: "Campeón interino: Piotr Kuberski" },
    recent: [
      f("V", "Mamed Khalidov", "TKO", "KSW 117", "2026-04-18"),
      f("V", "Laïd Zerhouni", SUB, "KSW 113", "2025-12-20"),
      f("V", "Damian Janikowski", DU, "KSW 96", "2024-07-20"),
      f("V", "Michał Materla", DU, "KSW 89", "2023-12-16"),
      f("V", "Tomasz Romanowski", "TKO", "KSW 83", "2023-06-03"),
    ],
  },
  {
    id: "ksw-bartosinski", ligue: "KSW", nom: "Adrian Bartosiński", categorie: "Poids welter", rang: 0,
    victoires: 18, defaites: 1, nuls: 0, nc: 0, naissance: "1995-08-26", pays: { fr: "Pologne", en: "Poland", es: "Polonia" },
    recent: [
      f("V", "Madars Fleminas", DP, "KSW 116", "2026-03-14"),
      f("V", "Muslim Tulshaev", "TKO", "KSW 113", "2025-12-20"),
      f("V", "Andrzej Grzebyk", DU, "KSW 105", "2025-04-26"),
      f("D", "Mamed Khalidov", SUB, "KSW 100", "2024-11-16"),
      f("V", "Igor Michaliszyn", SUB, "KSW 94", "2024-05-11"),
    ],
  },
  {
    id: "ksw-kaczmarczyk", ligue: "KSW", nom: "Patryk Kaczmarczyk", categorie: "Poids plume", rang: 0,
    victoires: 14, defaites: 3, nuls: 0, nc: 0, naissance: "1998-06-23", pays: { fr: "Pologne", en: "Poland", es: "Polonia" },
    recent: [
      f("V", "Leo Brichta", SUB, "KSW 119", "2026-06-20"),
      f("V", "Adam Soldaev", SUB, "KSW 112", "2025-11-15"),
      f("V", "Ahmed Vila", DU, "KSW 102", "2025-01-25"),
      f("D", "Robert Ruchała", "KO", "KSW 94", "2024-05-11"),
      f("V", "Daniel Rutkowski", DU, "KSW 88", "2023-11-11"),
    ],
  },
  {
    id: "ksw-yakymenko", ligue: "KSW", nom: "Vitalii Yakymenko", categorie: "Poids coq", rang: 0,
    victoires: 12, defaites: 2, nuls: 0, nc: 0, naissance: "1996-08-30", pays: { fr: "Ukraine", en: "Ukraine", es: "Ucrania" },
    recent: [
      f("V", "Marcello Morelli", SUB, "KSW 122", "2026-10-10"),
      f("V", "Sebastian Przybysz", DP, "KSW 115", "2026-02-21"),
      f("V", "Rogério Bontorin", "TKO", "KSW 110", "2025-09-20"),
      f("D", "Jan Ciepłowski", DU, "FEN 57", "2024-11-23"),
      f("V", "Farid Alibabazade", SUB, "FEN 54", "2024-05-17"),
    ],
  },
  {
    id: "ksw-luzar", ligue: "KSW", nom: "Sara Luzar-Smajić", categorie: "Poids coq feminin", rang: 0, female: true,
    victoires: 7, defaites: 3, nuls: 0, nc: 0, naissance: "1995-05-15", pays: { fr: "Croatie", en: "Croatia", es: "Croacia" },
    recent: [
      f("V", "Wiktoria Czyżewska", DU, "KSW 118", "2026-05-16"),
      f("V", "Ivana Petrović", DP, "FNC 26", "2025-12-20"),
      f("V", "Annabruna Radoš", DU, "FNC Knockout 1", "2025-05-03"),
      f("D", "Danielle Misteli", SUB, "Oktagon 66", "2025-02-01"),
      f("D", "Emilia Czerwińska", DU, "KSW 72", "2022-07-23"),
    ],
  },

  // --- ARES (sources : aresfighting.com, mma-official.com, Sherdog, Fight Matrix, ESPN) ---
  {
    id: "ares-lessou", ligue: "ARES", nom: "Xavier Lessou", categorie: "Poids lourd", rang: 0,
    victoires: 6, defaites: 2, nuls: 0, nc: 0, naissance: null, pays: { fr: "Cameroun", en: "Cameroon", es: "Camerún" },
    recent: [
      f("V", "Moreno Kacapor", DP, "ARES 37", "2026-01-09"),
      f("V", "Paweł Biernat", SUB, "ARES 28", "2025-01-18"),
      f("V", "Sofiane Boukichou", SUB, "ARES 24", "2024-09-05"),
      f("V", "Rony Bouzy", "TKO", "ARES 17", "2023-11-17"),
      f("V", "Badr Medkouri", DU, "ARES 13", "2023-03-09"),
    ],
  },
  {
    id: "ares-augen", ligue: "ARES", nom: "Virgil Augen", categorie: "Poids moyen", rang: 0,
    victoires: 9, defaites: 0, nuls: 0, nc: 0, naissance: null, pays: { fr: "France", en: "France", es: "Francia" },
    recent: [
      f("V", "Henrique Shiguemoto", SUB, "ARES 37", "2026-01-09"),
      f("V", "Moacir Rocha", SUB, "ARES 27", "2024-11-23"),
      f("V", "Vladislav Gutu", SUB, "ARES 20", "2024-04-18"),
      f("V", "Henrique Shiguemoto", DU, "ARES 18", "2023-12-15"),
      f("V", "Mantas Kondratavičius", SUB, "ARES 16", "2023-06-23"),
    ],
  },

  // --- Hexagone MMA (sources : hexagonemma.fr, mma-official.com, Sherdog, Fight Matrix, ufcalendar, combatreg) ---
  {
    id: "hx-goi", ligue: "Hexagone MMA", nom: "Léopold Goi", categorie: "Poids mouche", rang: 0,
    victoires: 9, defaites: 3, nuls: 0, nc: 0, naissance: "1997-02-08", pays: { fr: "France", en: "France", es: "Francia" },
    recent: [
      f("V", "Samba Sima", "TKO", "Hexagone MMA 48", "2026-10-24"),
      f("D", "Romero Reis", "KO", "Hexagone MMA 40", "2026-02-28"),
      f("V", "Ilie Meryacre", "KO", "Hexagone MMA 30", "2025-06-07"),
      f("V", "Maximilien Vallot", SUB, "Hexagone MMA 21", "2024-11-23"),
      f("V", "Martin McNulty", DU, "Hexagone MMA 16", "2024-05-24"),
    ],
  },
  {
    id: "hx-kobakhidze", ligue: "Hexagone MMA", nom: "Nika Kobakhidze", categorie: "Poids plume", rang: 0,
    victoires: 8, defaites: 3, nuls: 0, nc: 0, naissance: "1995-04-20", pays: { fr: "Géorgie", en: "Georgia", es: "Georgia" },
    recent: [
      f("V", "Magomed Abdulaev", SUB, "Hexagone MMA 44", "2026-05-29"),
      f("V", "Guillaume Delattre", "TKO", "Hexagone MMA 40", "2026-02-28"),
      f("D", "Brandon Brachet", DP, "Hexagone MMA 27", "2025-04-25"),
      f("V", "Hasni Mohammadi", SUB, "KOF 8", "2024-10-11"),
      f("V", "Alperen Bulut", DU, "KOF 6", "2024-06-01"),
    ],
  },
  {
    id: "hx-soares", ligue: "Hexagone MMA", nom: "Thalita Soares", categorie: "Poids mouche feminin", rang: 0, female: true,
    victoires: 11, defaites: 5, nuls: 0, nc: 0, naissance: "1992-07-20", pays: { fr: "Brésil", en: "Brazil", es: "Brasil" },
    recent: [
      f("V", "Tatiane Aguiar", "TKO", "Shooto Brasil 137", "2026-05-29"),
      f("V", "Alexandra Tekenah", "TKO", "Hexagone MMA 37", "2026-01-09"),
      f("V", "Daiane Cardoso", DU, "Hexagone MMA 33", "2025-08-29"),
      f("V", "Kate Bacik", SUB, "Hexagone MMA 22", "2024-12-21"),
      f("D", "Yana Gadelha", SUB, "Shooto Brasil 125", "2024-09-20"),
    ],
  },
];

// Ceintures sans titulaire, avec le combat qui doit l'attribuer.
export const VACANT = [
  { ligue: "PFL", categorie: "Poids coq", fight: "Taylor Lapilus vs. Mitch McKee", event: "PFL Lyon", date: "2026-12-19" },
  { ligue: "KSW", categorie: "Poids leger", fight: "Valeriu Mircea vs. Marcin Held", event: "KSW 123", date: "2026-11-21" },
];
