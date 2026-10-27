// 5 derniers combats vérifiés (du plus récent au plus ancien), par id de combattant.
// Sources croisées : ufc.com (fiche athlète) + Wikipédia (tableau "Mixed martial arts record"),
// complétées par Sherdog / ufcalendar / presse MMA quand une page manque ou n'est pas à jour.
// result : "V" victoire, "D" défaite, "N" match nul, "NC" sans décision.
export const RECENT_FIGHTS = {
  // Islam Makhachev
  f001: [
    { opponent: "Ian Machado Garry", result: "V", method: "Décision unanime", event: "UFC 330" },
    { opponent: "Jack Della Maddalena", result: "V", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Renato Moicano", result: "V", method: "Soumission", event: "UFC 311" },
    { opponent: "Dustin Poirier", result: "V", method: "Soumission", event: "UFC 302" },
    { opponent: "Alexander Volkanovski", result: "V", method: "KO", event: "UFC 294" },
  ],
  // Alex Pereira
  f002: [
    { opponent: "Ciryl Gane", result: "D", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Magomed Ankalaev", result: "V", method: "TKO", event: "UFC 320" },
    { opponent: "Magomed Ankalaev", result: "D", method: "Décision unanime", event: "UFC 313" },
    { opponent: "Khalil Rountree Jr.", result: "V", method: "TKO", event: "UFC 307" },
    { opponent: "Jiří Procházka", result: "V", method: "TKO", event: "UFC 303" },
  ],
  // Justin Gaethje
  f003: [
    { opponent: "Ilia Topuria", result: "V", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Paddy Pimblett", result: "V", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Rafael Fiziev", result: "V", method: "Décision unanime", event: "UFC 313" },
    { opponent: "Max Holloway", result: "D", method: "KO", event: "UFC 300" },
    { opponent: "Dustin Poirier", result: "V", method: "KO", event: "UFC 291" },
  ],
  // Ilia Topuria
  f004: [
    { opponent: "Justin Gaethje", result: "D", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Charles Oliveira", result: "V", method: "KO", event: "UFC 317" },
    { opponent: "Max Holloway", result: "V", method: "KO", event: "UFC 308" },
    { opponent: "Alexander Volkanovski", result: "V", method: "KO", event: "UFC 298" },
    { opponent: "Josh Emmett", result: "V", method: "Décision unanime", event: "UFC on ABC : Emmett vs. Topuria" },
  ],
  // Alexander Volkanovski
  f005: [
    { opponent: "Movsar Evloev", result: "V", method: "TKO", event: "UFC 333" },
    { opponent: "Diego Lopes", result: "V", method: "Décision unanime", event: "UFC 325" },
    { opponent: "Diego Lopes", result: "V", method: "Décision unanime", event: "UFC 314" },
    { opponent: "Ilia Topuria", result: "D", method: "KO", event: "UFC 298" },
    { opponent: "Islam Makhachev", result: "D", method: "KO", event: "UFC 294" },
  ],
  // Petr Yan
  f006: [
    { opponent: "Merab Dvalishvili", result: "V", method: "Décision unanime", event: "UFC 333" },
    { opponent: "Merab Dvalishvili", result: "V", method: "Décision unanime", event: "UFC 323" },
    { opponent: "Marcus McGhee", result: "V", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Deiveson Figueiredo", result: "V", method: "Décision unanime", event: "UFC Fight Night : Yan vs. Figueiredo" },
    { opponent: "Song Yadong", result: "V", method: "Décision unanime", event: "UFC 299" },
  ],
  // Merab Dvalishvili
  f007: [
    { opponent: "Petr Yan", result: "D", method: "Décision unanime", event: "UFC 333" },
    { opponent: "Petr Yan", result: "D", method: "Décision unanime", event: "UFC 323" },
    { opponent: "Cory Sandhagen", result: "V", method: "Décision unanime", event: "UFC 320" },
    { opponent: "Sean O'Malley", result: "V", method: "Soumission", event: "UFC 316" },
    { opponent: "Umar Nurmagomedov", result: "V", method: "Décision unanime", event: "UFC 311" },
  ],
  // Joshua Van
  f008: [
    { opponent: "Alexandre Pantoja", result: "V", method: "Décision unanime", event: "UFC 331" },
    { opponent: "Tatsuro Taira", result: "V", method: "TKO", event: "UFC 328" },
    { opponent: "Alexandre Pantoja", result: "V", method: "TKO", event: "UFC 323" },
    { opponent: "Brandon Royval", result: "V", method: "Décision unanime", event: "UFC 317" },
    { opponent: "Bruno Silva", result: "V", method: "TKO", event: "UFC 316" },
  ],
  // Alexandre Pantoja
  f009: [
    { opponent: "Joshua Van", result: "D", method: "Décision unanime", event: "UFC 331" },
    { opponent: "Joshua Van", result: "D", method: "TKO", event: "UFC 323" },
    { opponent: "Kai Kara-France", result: "V", method: "Soumission", event: "UFC 317" },
    { opponent: "Kai Asakura", result: "V", method: "Soumission", event: "UFC 310" },
    { opponent: "Steve Erceg", result: "V", method: "Décision unanime", event: "UFC 301" },
  ],
  // Khamzat Chimaev
  f010: [
    { opponent: "Sean Strickland", result: "D", method: "Décision partagée", event: "UFC 328" },
    { opponent: "Dricus du Plessis", result: "V", method: "Décision unanime", event: "UFC 319" },
    { opponent: "Robert Whittaker", result: "V", method: "Soumission", event: "UFC 308" },
    { opponent: "Kamaru Usman", result: "V", method: "Décision majoritaire", event: "UFC 294" },
    { opponent: "Kevin Holland", result: "V", method: "Soumission", event: "UFC 279" },
  ],
  // Sean Strickland
  f011: [
    { opponent: "Khamzat Chimaev", result: "V", method: "Décision partagée", event: "UFC 328" },
    { opponent: "Anthony Hernandez", result: "V", method: "TKO", event: "UFC Fight Night : Strickland vs. Hernandez" },
    { opponent: "Dricus du Plessis", result: "D", method: "Décision unanime", event: "UFC 312" },
    { opponent: "Paulo Costa", result: "V", method: "Décision partagée", event: "UFC 302" },
    { opponent: "Dricus du Plessis", result: "D", method: "Décision partagée", event: "UFC 297" },
  ],
  // Tom Aspinall
  f012: [
    { opponent: "Ciryl Gane", result: "NC", method: "Sans décision", event: "UFC 321" },
    { opponent: "Curtis Blaydes", result: "V", method: "KO", event: "UFC 304" },
    { opponent: "Sergei Pavlovich", result: "V", method: "KO", event: "UFC 295" },
    { opponent: "Marcin Tybura", result: "V", method: "TKO", event: "UFC Fight Night : Aspinall vs. Tybura" },
    { opponent: "Curtis Blaydes", result: "D", method: "TKO", event: "UFC Fight Night : Blaydes vs. Aspinall" },
  ],
  // Ciryl Gane
  f013: [
    { opponent: "Alex Pereira", result: "V", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Tom Aspinall", result: "NC", method: "Sans décision", event: "UFC 321" },
    { opponent: "Alexander Volkov", result: "V", method: "Décision partagée", event: "UFC 310" },
    { opponent: "Serghei Spivac", result: "V", method: "TKO", event: "UFC Fight Night : Gane vs. Spivac" },
    { opponent: "Jon Jones", result: "D", method: "Soumission", event: "UFC 285" },
  ],
  // Jack Della Maddalena
  f014: [
    { opponent: "Carlos Prates", result: "D", method: "TKO", event: "UFC Fight Night : Della Maddalena vs. Prates" },
    { opponent: "Islam Makhachev", result: "D", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Belal Muhammad", result: "V", method: "Décision unanime", event: "UFC 315" },
    { opponent: "Gilbert Burns", result: "V", method: "KO", event: "UFC 299" },
    { opponent: "Kevin Holland", result: "V", method: "Décision partagée", event: "Noche UFC 2023" },
  ],
  // Magomed Ankalaev
  f015: [
    { opponent: "Bogdan Guskov", result: "V", method: "TKO", event: "UFC Fight Night : Ankalaev vs. Guskov" },
    { opponent: "Alex Pereira", result: "D", method: "TKO", event: "UFC 320" },
    { opponent: "Alex Pereira", result: "V", method: "Décision unanime", event: "UFC 313" },
    { opponent: "Aleksandar Rakić", result: "V", method: "Décision unanime", event: "UFC 308" },
    { opponent: "Johnny Walker", result: "V", method: "KO", event: "UFC Fight Night : Ankalaev vs. Walker 2" },
  ],
  // Kayla Harrison
  f016: [
    { opponent: "Julianna Peña", result: "V", method: "Soumission", event: "UFC 316" },
    { opponent: "Ketlen Vieira", result: "V", method: "Décision unanime", event: "UFC 307" },
    { opponent: "Holly Holm", result: "V", method: "Soumission", event: "UFC 300" },
    { opponent: "Aspen Ladd", result: "V", method: "Décision unanime", event: "PFL 10 (2023)" },
    { opponent: "Larissa Pacheco", result: "D", method: "Décision unanime", event: "PFL 10 (2022)" },
  ],
  // Valentina Shevchenko
  f017: [
    { opponent: "Zhang Weili", result: "V", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Manon Fiorot", result: "V", method: "Décision unanime", event: "UFC 315" },
    { opponent: "Alexa Grasso", result: "V", method: "Décision unanime", event: "UFC 306" },
    { opponent: "Alexa Grasso", result: "N", method: "Match nul partagé", event: "Noche UFC 2023" },
    { opponent: "Alexa Grasso", result: "D", method: "Soumission", event: "UFC 285" },
  ],
  // Mackenzie Dern
  f018: [
    { opponent: "Gillian Robertson", result: "V", method: "Décision unanime", event: "UFC 330" },
    { opponent: "Virna Jandiroba", result: "V", method: "Décision unanime", event: "UFC 321" },
    { opponent: "Amanda Ribas", result: "V", method: "Soumission", event: "UFC Fight Night : Dern vs. Ribas 2" },
    { opponent: "Loopy Godínez", result: "V", method: "Décision unanime", event: "UFC on ABC : Sandhagen vs. Nurmagomedov" },
    { opponent: "Amanda Lemos", result: "D", method: "Décision unanime", event: "UFC 298" },
  ],
  // Julianna Pena
  f019: [
    { opponent: "Kayla Harrison", result: "D", method: "Soumission", event: "UFC 316" },
    { opponent: "Raquel Pennington", result: "V", method: "Décision partagée", event: "UFC 307" },
    { opponent: "Amanda Nunes", result: "D", method: "Décision unanime", event: "UFC 277" },
    { opponent: "Amanda Nunes", result: "V", method: "Soumission", event: "UFC 269" },
    { opponent: "Sara McMann", result: "V", method: "Soumission", event: "UFC 257" },
  ],
  // Virna Jandiroba
  f020: [
    { opponent: "Tabatha Ricci", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moicano vs. Duncan" },
    { opponent: "Mackenzie Dern", result: "D", method: "Décision unanime", event: "UFC 321" },
    { opponent: "Yan Xiaonan", result: "V", method: "Décision unanime", event: "UFC 314" },
    { opponent: "Amanda Lemos", result: "V", method: "Soumission", event: "UFC on ESPN : Lemos vs. Jandiroba" },
    { opponent: "Loopy Godínez", result: "V", method: "Décision unanime", event: "UFC on ESPN : Blanchfield vs. Fiorot" },
  ],
  // Khabib Nurmagomedov
  f021: [
    { opponent: "Justin Gaethje", result: "V", method: "Soumission", event: "UFC 254" },
    { opponent: "Dustin Poirier", result: "V", method: "Soumission", event: "UFC 242" },
    { opponent: "Conor McGregor", result: "V", method: "Soumission", event: "UFC 229" },
    { opponent: "Al Iaquinta", result: "V", method: "Décision unanime", event: "UFC 223" },
    { opponent: "Edson Barboza", result: "V", method: "Décision unanime", event: "UFC 219" },
  ],
  // Georges St-Pierre
  f022: [
    { opponent: "Michael Bisping", result: "V", method: "Soumission", event: "UFC 217" },
    { opponent: "Johny Hendricks", result: "V", method: "Décision partagée", event: "UFC 167" },
    { opponent: "Nick Diaz", result: "V", method: "Décision unanime", event: "UFC 158" },
    { opponent: "Carlos Condit", result: "V", method: "Décision unanime", event: "UFC 154" },
    { opponent: "Jake Shields", result: "V", method: "Décision unanime", event: "UFC 129" },
  ],
  // Conor McGregor
  f023: [
    { opponent: "Max Holloway", result: "D", method: "TKO", event: "UFC 329" },
    { opponent: "Dustin Poirier", result: "D", method: "TKO", event: "UFC 264" },
    { opponent: "Dustin Poirier", result: "D", method: "TKO", event: "UFC 257" },
    { opponent: "Donald Cerrone", result: "V", method: "TKO", event: "UFC 246" },
    { opponent: "Khabib Nurmagomedov", result: "D", method: "Soumission", event: "UFC 229" },
  ],
  // Salahdine Parnasse
  f024: [
    { opponent: "Dan Hooker", result: "V", method: "TKO", event: "UFC Paris : Hooker vs. Parnasse" },
    { opponent: "Kenneth Cross", result: "V", method: "TKO", event: "MVP MMA : Rousey vs. Carano" },
    { opponent: "Marcin Held", result: "V", method: "TKO", event: "KSW 114" },
    { opponent: "Marian Ziółkowski", result: "V", method: "TKO", event: "KSW 106" },
    { opponent: "Wilson Varela", result: "V", method: "TKO", event: "KSW 101" },
  ],
  // Arman Tsarukyan
  f025: [
    { opponent: "Mauricio Ruffy", result: "V", method: "KO", event: "UFC 331" },
    { opponent: "Dan Hooker", result: "V", method: "Soumission", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Charles Oliveira", result: "V", method: "Décision partagée", event: "UFC 300" },
    { opponent: "Beneil Dariush", result: "V", method: "KO", event: "UFC on ESPN : Dariush vs. Tsarukyan" },
    { opponent: "Joaquim Silva", result: "V", method: "TKO", event: "UFC on ESPN : Vettori vs. Cannonier" },
  ],
  // Charles Oliveira
  f026: [
    { opponent: "Max Holloway", result: "V", method: "Décision unanime", event: "UFC 326" },
    { opponent: "Mateusz Gamrot", result: "V", method: "Soumission", event: "UFC Fight Night : Oliveira vs. Gamrot" },
    { opponent: "Ilia Topuria", result: "D", method: "KO", event: "UFC 317" },
    { opponent: "Michael Chandler", result: "V", method: "Décision unanime", event: "UFC 309" },
    { opponent: "Arman Tsarukyan", result: "D", method: "Décision partagée", event: "UFC 300" },
  ],
  // Max Holloway
  f027: [
    { opponent: "Conor McGregor", result: "V", method: "TKO", event: "UFC 329" },
    { opponent: "Charles Oliveira", result: "D", method: "Décision unanime", event: "UFC 326" },
    { opponent: "Dustin Poirier", result: "V", method: "Décision unanime", event: "UFC 318" },
    { opponent: "Ilia Topuria", result: "D", method: "KO", event: "UFC 308" },
    { opponent: "Justin Gaethje", result: "V", method: "KO", event: "UFC 300" },
  ],
  // Paddy Pimblett
  f028: [
    { opponent: "Benoît Saint-Denis", result: "V", method: "Soumission", event: "UFC 329" },
    { opponent: "Justin Gaethje", result: "D", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Michael Chandler", result: "V", method: "TKO", event: "UFC 314" },
    { opponent: "King Green", result: "V", method: "Soumission", event: "UFC 304" },
    { opponent: "Tony Ferguson", result: "V", method: "Décision unanime", event: "UFC 296" },
  ],
  // Benoit Saint-Denis
  f029: [
    { opponent: "Paddy Pimblett", result: "D", method: "Soumission", event: "UFC 329" },
    { opponent: "Dan Hooker", result: "V", method: "TKO", event: "UFC 325" },
    { opponent: "Beneil Dariush", result: "V", method: "KO", event: "UFC 322" },
    { opponent: "Mauricio Ruffy", result: "V", method: "Soumission", event: "UFC Fight Night : Imavov vs. Borralho" },
    { opponent: "Kyle Prepolec", result: "V", method: "Soumission", event: "UFC 315" },
  ],
  // Mateusz Gamrot
  f030: [
    { opponent: "Quillan Salkilld", result: "D", method: "Soumission", event: "UFC Fight Night : Gamrot vs. Salkilld" },
    { opponent: "Esteban Ribovics", result: "V", method: "Soumission", event: "UFC 327" },
    { opponent: "Charles Oliveira", result: "D", method: "Soumission", event: "UFC Fight Night : Oliveira vs. Gamrot" },
    { opponent: "Ľudovít Klein", result: "V", method: "Décision unanime", event: "UFC on ESPN : Gamrot vs. Klein" },
    { opponent: "Dan Hooker", result: "D", method: "Décision partagée", event: "UFC 305" },
  ],
  // Dan Hooker
  f031: [
    { opponent: "Salahdine Parnasse", result: "D", method: "TKO", event: "UFC Paris : Hooker vs. Parnasse" },
    { opponent: "Benoît Saint Denis", result: "D", method: "TKO", event: "UFC 325" },
    { opponent: "Arman Tsarukyan", result: "D", method: "Soumission", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Mateusz Gamrot", result: "V", method: "Décision partagée", event: "UFC 305" },
    { opponent: "Jalin Turner", result: "V", method: "Décision partagée", event: "UFC 290" },
  ],
  // Renato Moicano
  f032: [
    { opponent: "Chris Duncan", result: "V", method: "Soumission", event: "UFC Fight Night : Moicano vs. Duncan" },
    { opponent: "Beneil Dariush", result: "D", method: "Décision unanime", event: "UFC 317" },
    { opponent: "Islam Makhachev", result: "D", method: "Soumission", event: "UFC 311" },
    { opponent: "Benoît Saint Denis", result: "V", method: "TKO", event: "UFC Fight Night : Moicano vs. Saint Denis" },
    { opponent: "Jalin Turner", result: "V", method: "TKO", event: "UFC 300" },
  ],
  // Rafael Fiziev
  f033: [
    { opponent: "Manuel Torres", result: "V", method: "KO", event: "UFC Fight Night : Fiziev vs. Torres" },
    { opponent: "Mauricio Ruffy", result: "D", method: "TKO", event: "UFC 325" },
    { opponent: "Ignacio Bahamondes", result: "V", method: "Décision unanime", event: "UFC on ABC : Hill vs. Rountree Jr." },
    { opponent: "Justin Gaethje", result: "D", method: "Décision unanime", event: "UFC 313" },
    { opponent: "Mateusz Gamrot", result: "D", method: "TKO", event: "UFC Fight Night : Fiziev vs. Gamrot" },
  ],
  // Mauricio Ruffy
  f034: [
    { opponent: "Arman Tsarukyan", result: "D", method: "KO", event: "UFC 331" },
    { opponent: "Michael Chandler", result: "V", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Rafael Fiziev", result: "V", method: "TKO", event: "UFC 325" },
    { opponent: "Benoît Saint Denis", result: "D", method: "Soumission", event: "UFC Fight Night : Imavov vs. Borralho" },
    { opponent: "King Green", result: "V", method: "KO", event: "UFC 313" },
  ],
  // Beneil Dariush
  f035: [
    { opponent: "Quillan Salkilld", result: "D", method: "TKO", event: "UFC Fight Night : Della Maddalena vs. Prates" },
    { opponent: "Benoît Saint Denis", result: "D", method: "KO", event: "UFC 322" },
    { opponent: "Renato Moicano", result: "V", method: "Décision unanime", event: "UFC 317" },
    { opponent: "Arman Tsarukyan", result: "D", method: "KO", event: "UFC on ESPN : Dariush vs. Tsarukyan" },
    { opponent: "Charles Oliveira", result: "D", method: "TKO", event: "UFC 289" },
  ],
  // Quillan Salkilld
  f036: [
    { opponent: "Mateusz Gamrot", result: "V", method: "Soumission", event: "UFC Fight Night : Gamrot vs. Salkilld" },
    { opponent: "Beneil Dariush", result: "V", method: "TKO", event: "UFC Fight Night : Della Maddalena vs. Prates" },
    { opponent: "Jamie Mullarkey", result: "V", method: "Soumission", event: "UFC 325" },
    { opponent: "Nasrat Haqparast", result: "V", method: "KO", event: "UFC 321" },
    { opponent: "Yanal Ashmouz", result: "V", method: "Décision unanime", event: "UFC 316" },
  ],
  // Manuel Torres
  f037: [
    { opponent: "Rafael Fiziev", result: "D", method: "KO", event: "UFC Fight Night : Fiziev vs. Torres" },
    { opponent: "Grant Dawson", result: "V", method: "TKO", event: "UFC 323" },
    { opponent: "Drew Dober", result: "V", method: "TKO", event: "UFC on ESPN : Moreno vs. Erceg" },
    { opponent: "Ignacio Bahamondes", result: "D", method: "TKO", event: "UFC 306" },
    { opponent: "Chris Duncan", result: "V", method: "Soumission", event: "UFC Fight Night : Moreno vs. Royval 2" },
  ],
  // Natália Silva
  f038: [
    { opponent: "Wang Cong", result: "V", method: "Décision unanime", event: "UFC 332" },
    { opponent: "Rose Namajunas", result: "V", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Alexa Grasso", result: "V", method: "Décision unanime", event: "UFC 315" },
    { opponent: "Jéssica Andrade", result: "V", method: "Décision unanime", event: "UFC Fight Night : Burns vs. Brady" },
    { opponent: "Viviane Araújo", result: "V", method: "Décision unanime", event: "UFC Fight Night : Dolidze vs. Imavov" },
  ],
  // Sergei Pavlovich
  f039: [
    { opponent: "Tallison Teixeira", result: "V", method: "KO", event: "UFC Fight Night : Song vs. Figueiredo" },
    { opponent: "Waldo Cortes-Acosta", result: "V", method: "Décision unanime", event: "UFC Fight Night : Walker vs. Zhang" },
    { opponent: "Jairzinho Rozenstruik", result: "V", method: "Décision unanime", event: "UFC Fight Night : Adesanya vs. Imavov" },
    { opponent: "Alexander Volkov", result: "D", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. Aliskerov" },
    { opponent: "Tom Aspinall", result: "D", method: "KO", event: "UFC 295" },
  ],
  // Josh Hokit
  f040: [
    { opponent: "Derrick Lewis", result: "V", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Curtis Blaydes", result: "V", method: "Décision unanime", event: "UFC 327" },
    { opponent: "Denzel Freeman", result: "V", method: "TKO", event: "UFC 324" },
    { opponent: "Max Gimenis", result: "V", method: "TKO", event: "UFC Fight Night : Bonfim vs. Brown" },
    { opponent: "Guilherme Uriel", result: "V", method: "TKO", event: "Dana White's Contender Series 78" },
  ],
  // Curtis Blaydes
  f041: [
    { opponent: "Waldo Cortes-Acosta", result: "V", method: "Décision unanime", event: "Noche UFC : Silva vs. Delgado" },
    { opponent: "Josh Hokit", result: "D", method: "Décision unanime", event: "UFC 327" },
    { opponent: "Rizvan Kuniev", result: "V", method: "Décision partagée", event: "UFC on ABC : Hill vs. Rountree Jr." },
    { opponent: "Tom Aspinall", result: "D", method: "KO", event: "UFC 304" },
    { opponent: "Jailton Almeida", result: "V", method: "KO", event: "UFC 299" },
  ],
  // Waldo Cortes-Acosta
  f042: [
    { opponent: "Curtis Blaydes", result: "D", method: "Décision unanime", event: "Noche UFC : Silva vs. Delgado" },
    { opponent: "Alexander Volkov", result: "D", method: "Décision unanime", event: "UFC 328" },
    { opponent: "Derrick Lewis", result: "V", method: "TKO", event: "UFC 324" },
    { opponent: "Shamil Gaziev", result: "V", method: "KO", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Ante Delija", result: "V", method: "KO", event: "UFC Fight Night : Garcia vs. Onama" },
  ],
  // Rizvan Kuniev
  f043: [
    { opponent: "Alexander Volkov", result: "D", method: "Décision unanime", event: "UFC 333" },
    { opponent: "Tyrell Fortune", result: "V", method: "TKO", event: "UFC Fight Night : Ankalaev vs. Guskov" },
    { opponent: "Jailton Almeida", result: "V", method: "Décision unanime", event: "UFC Fight Night : Bautista vs. Oliveira" },
    { opponent: "Curtis Blaydes", result: "D", method: "Décision partagée", event: "UFC on ABC : Hill vs. Rountree Jr." },
    { opponent: "Hugo Cunha", result: "V", method: "TKO", event: "Dana White's Contender Series 68" },
  ],
  // Vitor Petrino
  f044: [
    { opponent: "Serghei Spivac", result: "V", method: "Décision unanime", event: "UFC Fight Night : Hernandez vs. Rodrigues" },
    { opponent: "Steven Asplund", result: "V", method: "Décision unanime", event: "UFC Fight Night : Emmett vs. Vallejos" },
    { opponent: "Thomas Petersen", result: "V", method: "KO", event: "UFC Fight Night : Oliveira vs. Gamrot" },
    { opponent: "Austen Lane", result: "V", method: "Soumission", event: "UFC on ESPN : Lewis vs. Teixeira" },
    { opponent: "Dustin Jacoby", result: "D", method: "KO", event: "UFC on ESPN : Covington vs. Buckley" },
  ],
  // Serghei Spivac
  f045: [
    { opponent: "Vitor Petrino", result: "D", method: "Décision unanime", event: "UFC Fight Night : Hernandez vs. Rodrigues" },
    { opponent: "Ante Delija", result: "V", method: "Décision unanime", event: "UFC Fight Night : Strickland vs. Hernandez" },
    { opponent: "Waldo Cortes-Acosta", result: "D", method: "Décision unanime", event: "UFC 316" },
    { opponent: "Jailton Almeida", result: "D", method: "TKO", event: "UFC 311" },
    { opponent: "Marcin Tybura", result: "V", method: "Soumission", event: "UFC on ESPN : Tybura vs. Spivac 2" },
  ],
  // Ante Delija
  f046: [
    { opponent: "Serghei Spivac", result: "D", method: "Décision unanime", event: "UFC Fight Night : Strickland vs. Hernandez" },
    { opponent: "Waldo Cortes-Acosta", result: "D", method: "KO", event: "UFC Fight Night : Garcia vs. Onama" },
    { opponent: "Marcin Tybura", result: "V", method: "KO", event: "UFC Fight Night : Imavov vs. Borralho" },
    { opponent: "Yorgan De Castro", result: "V", method: "TKO", event: "Fight Nation Championship 22" },
    { opponent: "Valentin Moldavsky", result: "D", method: "TKO", event: "PFL 1 (2024)" },
  ],
  // Derrick Lewis
  f047: [
    { opponent: "Josh Hokit", result: "D", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Waldo Cortes-Acosta", result: "D", method: "TKO", event: "UFC 324" },
    { opponent: "Tallison Teixeira", result: "V", method: "TKO", event: "UFC on ESPN : Lewis vs. Teixeira" },
    { opponent: "Rodrigo Nascimento", result: "V", method: "TKO", event: "UFC on ESPN : Lewis vs. Nascimento" },
    { opponent: "Jailton Almeida", result: "D", method: "Décision unanime", event: "UFC Fight Night : Almeida vs. Lewis" },
  ],
  // Alexander Volkov
  f048: [
    { opponent: "Rizvan Kuniev", result: "V", method: "Décision unanime", event: "UFC 333" },
    { opponent: "Waldo Cortes-Acosta", result: "V", method: "Décision unanime", event: "UFC 328" },
    { opponent: "Jailton Almeida", result: "V", method: "Décision partagée", event: "UFC 321" },
    { opponent: "Ciryl Gane", result: "D", method: "Décision partagée", event: "UFC 310" },
    { opponent: "Sergei Pavlovich", result: "V", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. Aliskerov" },
  ],
  // Valter Walker
  f049: [
    { opponent: "Thomas Petersen", result: "V", method: "Soumission", event: "UFC Fight Night : Ankalaev vs. Guskov" },
    { opponent: "Louie Sutherland", result: "V", method: "Soumission", event: "UFC 321" },
    { opponent: "Kennedy Nzechukwu", result: "V", method: "Soumission", event: "UFC on ESPN : Lewis vs. Teixeira" },
    { opponent: "Don'Tale Mayes", result: "V", method: "Soumission", event: "UFC Fight Night : Cannonier vs. Rodrigues" },
    { opponent: "Junior Tafa", result: "V", method: "Soumission", event: "UFC 305" },
  ],
  // Tyrell Fortune
  f050: [
    { opponent: "Rizvan Kuniev", result: "D", method: "TKO", event: "UFC Fight Night : Ankalaev vs. Guskov" },
    { opponent: "Marcin Tybura", result: "V", method: "Décision unanime", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Demoreo Dennis", result: "V", method: "TKO", event: "Lights Out Xtreme Fighting 27" },
    { opponent: "Tony Lopez", result: "V", method: "KO", event: "RUF MMA 64" },
    { opponent: "Myron Dennis", result: "V", method: "TKO", event: "Lights Out Xtreme Fighting 24" },
  ],
  // Mario Pinto
  f051: [
    { opponent: "Ryan Spann", result: "V", method: "TKO", event: "UFC Paris : Hooker vs. Parnasse" },
    { opponent: "Felipe Franco", result: "V", method: "Décision unanime", event: "UFC Fight Night : Evloev vs. Murphy" },
    { opponent: "Jhonata Diniz", result: "V", method: "TKO", event: "UFC Fight Night : Oliveira vs. Gamrot" },
    { opponent: "Austen Lane", result: "V", method: "KO", event: "UFC Fight Night : Kape vs. Almabayev" },
    { opponent: "Lucas Triverio Camacho", result: "V", method: "KO", event: "Dana White's Contender Series 75" },
  ],
  // Aleksandar Rakić
  f052: [
    { opponent: "Marcin Tybura", result: "V", method: "Décision unanime", event: "UFC Fight Night : Medić vs. Rodriguez" },
    { opponent: "Azamat Murzakanov", result: "D", method: "TKO", event: "UFC 321" },
    { opponent: "Magomed Ankalaev", result: "D", method: "Décision unanime", event: "UFC 308" },
    { opponent: "Jiří Procházka", result: "D", method: "TKO", event: "UFC 300" },
    { opponent: "Jan Błachowicz", result: "D", method: "TKO", event: "UFC on ESPN : Błachowicz vs. Rakić" },
  ],
  // Brando Pericic
  f053: [
    { opponent: "Shamil Gaziev", result: "V", method: "KO", event: "UFC Fight Night : Della Maddalena vs. Prates" },
    { opponent: "Louie Sutherland", result: "V", method: "TKO", event: "UFC Fight Night : Evloev vs. Murphy" },
    { opponent: "Elisha Ellison", result: "V", method: "KO", event: "UFC Fight Night : Ulberg vs. Reyes" },
    { opponent: "Orion Kenny", result: "V", method: "TKO", event: "Supremacy FC : Rebirth" },
    { opponent: "Tumanako Phillips", result: "V", method: "TKO", event: "Stealth Fighters League 1" },
  ],
  // Anthony Wint
  f054: [
    { opponent: "Lucas Armand", result: "V", method: "TKO", event: "UFC 332" },
    { opponent: "Terrance Chatman", result: "V", method: "Soumission", event: "UFC Fight Night : Hernandez vs. Rodrigues" },
    { opponent: "Matt Adams", result: "V", method: "TKO", event: "Dana White's Contender Series 87" },
    { opponent: "Jamahl Tatum", result: "V", method: "TKO", event: "Fury FC 117" },
    { opponent: "Miles Banks", result: "V", method: "KO", event: "Fury FC : Challenger Series 15" },
  ],
  // Carlos Ulberg
  f055: [
    { opponent: "Jiří Procházka", result: "V", method: "KO", event: "UFC 327" },
    { opponent: "Dominick Reyes", result: "V", method: "KO", event: "UFC Fight Night : Ulberg vs. Reyes" },
    { opponent: "Jan Błachowicz", result: "V", method: "Décision unanime", event: "UFC Fight Night : Edwards vs. Brady" },
    { opponent: "Volkan Oezdemir", result: "V", method: "Décision unanime", event: "UFC Fight Night : Yan vs. Figueiredo" },
    { opponent: "Alonzo Menifield", result: "V", method: "KO", event: "UFC on ESPN : Lewis vs. Nascimento" },
  ],
  // Jiří Procházka
  f056: [
    { opponent: "Carlos Ulberg", result: "D", method: "KO", event: "UFC 327" },
    { opponent: "Khalil Rountree Jr.", result: "V", method: "KO", event: "UFC 320" },
    { opponent: "Jamahal Hill", result: "V", method: "TKO", event: "UFC 311" },
    { opponent: "Alex Pereira", result: "D", method: "TKO", event: "UFC 303" },
    { opponent: "Aleksandar Rakić", result: "V", method: "TKO", event: "UFC 300" },
  ],
  // Khalil Rountree Jr.
  f057: [
    { opponent: "Jiří Procházka", result: "D", method: "KO", event: "UFC 320" },
    { opponent: "Jamahal Hill", result: "V", method: "Décision unanime", event: "UFC on ABC : Hill vs. Rountree Jr." },
    { opponent: "Alex Pereira", result: "D", method: "TKO", event: "UFC 307" },
    { opponent: "Anthony Smith", result: "V", method: "TKO", event: "UFC Fight Night : Song vs. Gutiérrez" },
    { opponent: "Chris Daukaus", result: "V", method: "TKO", event: "UFC on ESPN : Luque vs. dos Anjos" },
  ],
  // Navajo Stirling
  f058: [
    { opponent: "Jan Błachowicz", result: "V", method: "TKO", event: "UFC Fight Night : Medić vs. Rodriguez" },
    { opponent: "Ion Cuțelaba", result: "V", method: "TKO", event: "UFC Fight Night : Kape vs. Horiguchi" },
    { opponent: "Bruno Lopes", result: "V", method: "TKO", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Rodolfo Bellato", result: "V", method: "Décision unanime", event: "UFC Fight Night : Ulberg vs. Reyes" },
    { opponent: "Ivan Erslan", result: "V", method: "Décision unanime", event: "UFC 315" },
  ],
  // Paulo Costa
  f059: [
    { opponent: "Azamat Murzakanov", result: "V", method: "TKO", event: "UFC 327" },
    { opponent: "Roman Kopylov", result: "V", method: "Décision unanime", event: "UFC 318" },
    { opponent: "Sean Strickland", result: "D", method: "Décision partagée", event: "UFC 302" },
    { opponent: "Robert Whittaker", result: "D", method: "Décision unanime", event: "UFC 298" },
    { opponent: "Luke Rockhold", result: "V", method: "Décision unanime", event: "UFC 278" },
  ],
  // Jamahal Hill
  f060: [
    { opponent: "Khalil Rountree Jr.", result: "D", method: "Décision unanime", event: "UFC on ABC : Hill vs. Rountree Jr." },
    { opponent: "Jiří Procházka", result: "D", method: "TKO", event: "UFC 311" },
    { opponent: "Alex Pereira", result: "D", method: "KO", event: "UFC 300" },
    { opponent: "Glover Teixeira", result: "V", method: "Décision unanime", event: "UFC 283" },
    { opponent: "Thiago Santos", result: "V", method: "TKO", event: "UFC on ESPN : Santos vs. Hill" },
  ],
  // Azamat Murzakanov
  f061: [
    { opponent: "Dominick Reyes", result: "D", method: "KO", event: "UFC 333" },
    { opponent: "Paulo Costa", result: "D", method: "TKO", event: "UFC 327" },
    { opponent: "Aleksandar Rakić", result: "V", method: "TKO", event: "UFC 321" },
    { opponent: "Brendson Ribeiro", result: "V", method: "TKO", event: "UFC 316" },
    { opponent: "Alonzo Menifield", result: "V", method: "KO", event: "UFC on ABC : Sandhagen vs. Nurmagomedov" },
  ],
  // Jan Błachowicz
  f062: [
    { opponent: "Navajo Stirling", result: "D", method: "TKO", event: "UFC Fight Night : Medić vs. Rodriguez" },
    { opponent: "Bogdan Guskov", result: "N", method: "Match nul majoritaire", event: "UFC 323" },
    { opponent: "Carlos Ulberg", result: "D", method: "Décision unanime", event: "UFC Fight Night : Edwards vs. Brady" },
    { opponent: "Alex Pereira", result: "D", method: "Décision partagée", event: "UFC 291" },
    { opponent: "Magomed Ankalaev", result: "N", method: "Match nul partagé", event: "UFC 282" },
  ],
  // Dominick Reyes
  f063: [
    { opponent: "Azamat Murzakanov", result: "V", method: "KO", event: "UFC 333" },
    { opponent: "Johnny Walker", result: "V", method: "Décision partagée", event: "UFC 327" },
    { opponent: "Carlos Ulberg", result: "D", method: "KO", event: "UFC Fight Night : Ulberg vs. Reyes" },
    { opponent: "Nikita Krylov", result: "V", method: "KO", event: "UFC 314" },
    { opponent: "Anthony Smith", result: "V", method: "TKO", event: "UFC 310" },
  ],
  // Bogdan Guskov
  f064: [
    { opponent: "Magomed Ankalaev", result: "D", method: "TKO", event: "UFC Fight Night : Ankalaev vs. Guskov" },
    { opponent: "Jan Błachowicz", result: "N", method: "Match nul majoritaire", event: "UFC 323" },
    { opponent: "Nikita Krylov", result: "V", method: "KO", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Billy Elekana", result: "V", method: "Soumission", event: "UFC 311" },
    { opponent: "Ryan Spann", result: "V", method: "TKO", event: "UFC on ESPN : Nicolau vs. Perez" },
  ],
  // Johnny Walker
  f065: [
    { opponent: "Mick Parkin", result: "V", method: "KO", event: "UFC 332" },
    { opponent: "Dominick Reyes", result: "D", method: "Décision partagée", event: "UFC 327" },
    { opponent: "Zhang Mingyang", result: "V", method: "TKO", event: "UFC Fight Night : Walker vs. Zhang" },
    { opponent: "Volkan Oezdemir", result: "D", method: "KO", event: "UFC on ABC : Whittaker vs. Aliskerov" },
    { opponent: "Magomed Ankalaev", result: "D", method: "KO", event: "UFC Fight Night : Ankalaev vs. Walker 2" },
  ],
  // Alonzo Menifield
  f066: [
    { opponent: "Iwo Baraniewski", result: "V", method: "Décision partagée", event: "UFC 331" },
    { opponent: "Zhang Mingyang", result: "V", method: "TKO", event: "UFC Fight Night : Song vs. Figueiredo" },
    { opponent: "Volkan Oezdemir", result: "D", method: "KO", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Oumar Sy", result: "V", method: "Décision unanime", event: "UFC on ESPN : Usman vs. Buckley" },
    { opponent: "Julius Walker", result: "V", method: "Décision partagée", event: "UFC Fight Night : Cejudo vs. Song" },
  ],
  // Nikita Krylov
  f067: [
    { opponent: "Abdul Rakhman Yakhyaev", result: "D", method: "TKO", event: "UFC 333" },
    { opponent: "Robert Whittaker", result: "D", method: "TKO", event: "UFC 329" },
    { opponent: "Modestas Bukauskas", result: "V", method: "KO", event: "UFC 324" },
    { opponent: "Bogdan Guskov", result: "D", method: "KO", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Dominick Reyes", result: "D", method: "KO", event: "UFC 314" },
  ],
  // Robert Whittaker
  f068: [
    { opponent: "Nikita Krylov", result: "V", method: "TKO", event: "UFC 329" },
    { opponent: "Reinier de Ridder", result: "D", method: "Décision partagée", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Khamzat Chimaev", result: "D", method: "Soumission", event: "UFC 308" },
    { opponent: "Ikram Aliskerov", result: "V", method: "KO", event: "UFC on ABC : Whittaker vs. Aliskerov" },
    { opponent: "Paulo Costa", result: "V", method: "Décision unanime", event: "UFC 298" },
  ],
  // Reinier de Ridder
  f069: [
    { opponent: "Roman Dolidze", result: "V", method: "TKO", event: "UFC Fight Night : Hernandez vs. Rodrigues" },
    { opponent: "Caio Borralho", result: "D", method: "Décision unanime", event: "UFC 326" },
    { opponent: "Brendan Allen", result: "D", method: "TKO", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "Robert Whittaker", result: "V", method: "Décision partagée", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Bo Nickal", result: "V", method: "TKO", event: "UFC on ESPN : Sandhagen vs. Figueiredo" },
  ],
  // Muhammad Saidov
  f070: [
    { opponent: "Dustin Jacoby", result: "V", method: "TKO", event: "UFC Fight Night : Ankalaev vs. Guskov" },
    { opponent: "Luis Henrique da Silva", result: "V", method: "KO", event: "UAE Warriors 71" },
    { opponent: "Valmir da Silva", result: "V", method: "Décision unanime", event: "UAE Warriors 63" },
    { opponent: "Leonardo Guimarães", result: "V", method: "TKO", event: "MMA Series 87" },
    { opponent: "Ashraf Bashandy", result: "V", method: "KO", event: "MMA Series 75" },
  ],
  // Modestas Bukauskas
  f071: [
    { opponent: "Oumar Sy", result: "V", method: "TKO", event: "UFC Paris : Hooker vs. Parnasse" },
    { opponent: "Christian Edwards", result: "V", method: "Décision partagée", event: "UFC Fight Night : Allen vs. Costa" },
    { opponent: "Nikita Krylov", result: "D", method: "KO", event: "UFC 324" },
    { opponent: "Paul Craig", result: "V", method: "KO", event: "UFC Fight Night : Imavov vs. Borralho" },
    { opponent: "Ion Cuțelaba", result: "V", method: "Décision partagée", event: "UFC 315" },
  ],
  // Abdul Rakhman Yakhyaev
  f072: [
    { opponent: "Nikita Krylov", result: "V", method: "TKO", event: "UFC 333" },
    { opponent: "Julius Walker", result: "V", method: "KO", event: "UFC Fight Night : Fiziev vs. Torres" },
    { opponent: "Brendson Ribeiro", result: "V", method: "Soumission", event: "UFC Fight Night : Moicano vs. Duncan" },
    { opponent: "Rafael Cerqueira", result: "V", method: "Soumission", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Alik Lorenz", result: "V", method: "TKO", event: "Dana White's Contender Series 79" },
  ],
  // Dricus du Plessis
  f073: [
    { opponent: "Kamaru Usman", result: "V", method: "Décision unanime", event: "UFC Fight Night : Du Plessis vs. Usman" },
    { opponent: "Khamzat Chimaev", result: "D", method: "Décision unanime", event: "UFC 319" },
    { opponent: "Sean Strickland", result: "V", method: "Décision unanime", event: "UFC 312" },
    { opponent: "Israel Adesanya", result: "V", method: "Soumission", event: "UFC 305" },
    { opponent: "Sean Strickland", result: "V", method: "Décision partagée", event: "UFC 297" },
  ],
  // Nassourdine Imavov
  f074: [
    { opponent: "Caio Borralho", result: "V", method: "Décision unanime", event: "UFC Fight Night : Imavov vs. Borralho" },
    { opponent: "Israel Adesanya", result: "V", method: "TKO", event: "UFC Fight Night : Adesanya vs. Imavov" },
    { opponent: "Brendan Allen", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moicano vs. Saint Denis" },
    { opponent: "Jared Cannonier", result: "V", method: "TKO", event: "UFC on ESPN : Cannonier vs. Imavov" },
    { opponent: "Roman Dolidze", result: "V", method: "Décision majoritaire", event: "UFC Fight Night : Dolidze vs. Imavov" },
  ],
  // Brendan Allen
  f075: [
    { opponent: "Christian Leroy Duncan", result: "V", method: "Soumission", event: "UFC Fight Night : Allen vs. Duncan" },
    { opponent: "Edmen Shahbazyan", result: "V", method: "Décision unanime", event: "UFC Fight Night : Muhammad vs. Bonfim" },
    { opponent: "Reinier de Ridder", result: "V", method: "TKO", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "Marvin Vettori", result: "V", method: "Décision unanime", event: "UFC 318" },
    { opponent: "Anthony Hernandez", result: "D", method: "Décision unanime", event: "UFC Fight Night : Cejudo vs. Song" },
  ],
  // Caio Borralho
  f076: [
    { opponent: "Reinier de Ridder", result: "V", method: "Décision unanime", event: "UFC 326" },
    { opponent: "Nassourdine Imavov", result: "D", method: "Décision unanime", event: "UFC Fight Night : Imavov vs. Borralho" },
    { opponent: "Jared Cannonier", result: "V", method: "Décision unanime", event: "UFC on ESPN : Cannonier vs. Borralho" },
    { opponent: "Paul Craig", result: "V", method: "KO", event: "UFC 301" },
    { opponent: "Abusupiyan Magomedov", result: "V", method: "Décision unanime", event: "UFC Fight Night : Almeida vs. Lewis" },
  ],
  // Joe Pyfer
  f077: [
    { opponent: "Israel Adesanya", result: "V", method: "TKO", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Abusupiyan Magomedov", result: "V", method: "Soumission", event: "UFC 320" },
    { opponent: "Kelvin Gastelum", result: "V", method: "Décision unanime", event: "UFC 316" },
    { opponent: "Marc-André Barriault", result: "V", method: "KO", event: "UFC 303" },
    { opponent: "Jack Hermansson", result: "D", method: "Décision unanime", event: "UFC Fight Night : Hermansson vs. Pyfer" },
  ],
  // Gregory Rodrigues
  f078: [
    { opponent: "Anthony Hernandez", result: "V", method: "Décision unanime", event: "UFC Fight Night : Hernandez vs. Rodrigues" },
    { opponent: "Brunno Ferreira", result: "V", method: "KO", event: "UFC 326" },
    { opponent: "Roman Kopylov", result: "V", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Jack Hermansson", result: "V", method: "KO", event: "UFC 317" },
    { opponent: "Jared Cannonier", result: "D", method: "TKO", event: "UFC Fight Night : Cannonier vs. Rodrigues" },
  ],
  // Anthony Hernandez
  f079: [
    { opponent: "Gregory Rodrigues", result: "D", method: "Décision unanime", event: "UFC Fight Night : Hernandez vs. Rodrigues" },
    { opponent: "Sean Strickland", result: "D", method: "TKO", event: "UFC Fight Night : Strickland vs. Hernandez" },
    { opponent: "Roman Dolidze", result: "V", method: "Soumission", event: "UFC on ESPN : Dolidze vs. Hernandez" },
    { opponent: "Brendan Allen", result: "V", method: "Décision unanime", event: "UFC Fight Night : Cejudo vs. Song" },
    { opponent: "Michel Pereira", result: "V", method: "TKO", event: "UFC Fight Night : Hernandez vs. Pereira" },
  ],
  // Israel Adesanya
  f080: [
    { opponent: "Joe Pyfer", result: "D", method: "TKO", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Nassourdine Imavov", result: "D", method: "TKO", event: "UFC Fight Night : Adesanya vs. Imavov" },
    { opponent: "Dricus du Plessis", result: "D", method: "Soumission", event: "UFC 305" },
    { opponent: "Sean Strickland", result: "D", method: "Décision unanime", event: "UFC 293" },
    { opponent: "Alex Pereira", result: "V", method: "KO", event: "UFC 287" },
  ],
  // Christian Leroy Duncan
  f081: [
    { opponent: "Brendan Allen", result: "D", method: "Soumission", event: "UFC Fight Night : Allen vs. Duncan" },
    { opponent: "Jared Cannonier", result: "V", method: "Décision unanime", event: "UFC Fight Night : Du Plessis vs. Usman" },
    { opponent: "Roman Dolidze", result: "V", method: "Décision unanime", event: "UFC Fight Night : Evloev vs. Murphy" },
    { opponent: "Marco Tulio", result: "V", method: "KO", event: "UFC Fight Night : Bonfim vs. Brown" },
    { opponent: "Eryk Anders", result: "V", method: "TKO", event: "UFC on ESPN : Dolidze vs. Hernandez" },
  ],
  // Jared Cannonier
  f082: [
    { opponent: "Christian Leroy Duncan", result: "D", method: "Décision unanime", event: "UFC Fight Night : Du Plessis vs. Usman" },
    { opponent: "Michael Page", result: "D", method: "Décision unanime", event: "UFC 319" },
    { opponent: "Gregory Rodrigues", result: "V", method: "TKO", event: "UFC Fight Night : Cannonier vs. Rodrigues" },
    { opponent: "Caio Borralho", result: "D", method: "Décision unanime", event: "UFC on ESPN : Cannonier vs. Borralho" },
    { opponent: "Nassourdine Imavov", result: "D", method: "TKO", event: "UFC on ESPN : Cannonier vs. Imavov" },
  ],
  // Abusupiyan Magomedov
  f083: [
    { opponent: "Cam Rowston", result: "V", method: "Soumission", event: "UFC 333" },
    { opponent: "Michał Oleksiejczuk", result: "V", method: "Soumission", event: "UFC Fight Night : Fiziev vs. Torres" },
    { opponent: "Joe Pyfer", result: "D", method: "Soumission", event: "UFC 320" },
    { opponent: "Michel Pereira", result: "V", method: "Décision unanime", event: "UFC on ESPN : Machado Garry vs. Prates" },
    { opponent: "Brunno Ferreira", result: "V", method: "Soumission", event: "UFC 308" },
  ],
  // Ikram Aliskerov
  f084: [
    { opponent: "Brunno Ferreira", result: "V", method: "Décision unanime", event: "UFC Fight Night : Fiziev vs. Torres" },
    { opponent: "Park Jun-yong", result: "V", method: "Décision unanime", event: "UFC 321" },
    { opponent: "André Muniz", result: "V", method: "TKO", event: "UFC on ESPN : Machado Garry vs. Prates" },
    { opponent: "Robert Whittaker", result: "D", method: "KO", event: "UFC on ABC : Whittaker vs. Aliskerov" },
    { opponent: "Warlley Alves", result: "V", method: "TKO", event: "UFC 294" },
  ],
  // Bo Nickal
  f085: [
    { opponent: "Kyle Daukaus", result: "V", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Rodolfo Vieira", result: "V", method: "KO", event: "UFC 322" },
    { opponent: "Reinier de Ridder", result: "D", method: "TKO", event: "UFC on ESPN : Sandhagen vs. Figueiredo" },
    { opponent: "Paul Craig", result: "V", method: "Décision unanime", event: "UFC 309" },
    { opponent: "Cody Brundage", result: "V", method: "Soumission", event: "UFC 300" },
  ],
  // Sharabutdin Magomedov
  f086: [
    { opponent: "Michel Pereira", result: "V", method: "Décision unanime", event: "UFC Fight Night : Fiziev vs. Torres" },
    { opponent: "Marc-André Barriault", result: "V", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Michael Page", result: "D", method: "Décision unanime", event: "UFC Fight Night : Adesanya vs. Imavov" },
    { opponent: "Armen Petrosyan", result: "V", method: "KO", event: "UFC 308" },
    { opponent: "Michał Oleksiejczuk", result: "V", method: "Décision unanime", event: "UFC on ABC : Sandhagen vs. Nurmagomedov" },
  ],
  // Roman Kopylov
  f087: [
    { opponent: "Ateba Gautier", result: "V", method: "TKO", event: "UFC 332" },
    { opponent: "Marco Tulio", result: "V", method: "Décision unanime", event: "UFC 328" },
    { opponent: "Gregory Rodrigues", result: "D", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Paulo Costa", result: "D", method: "Décision unanime", event: "UFC 318" },
    { opponent: "Chris Curtis", result: "V", method: "TKO", event: "UFC Fight Night : Dern vs. Ribas 2" },
  ],
  // Edmen Shahbazyan
  f088: [
    { opponent: "Brunno Ferreira", result: "V", method: "Décision unanime", event: "UFC 331" },
    { opponent: "Brendan Allen", result: "D", method: "Décision unanime", event: "UFC Fight Night : Muhammad vs. Bonfim" },
    { opponent: "André Muniz", result: "V", method: "KO", event: "UFC 320" },
    { opponent: "Andre Petroski", result: "V", method: "Décision unanime", event: "UFC on ESPN : Usman vs. Buckley" },
    { opponent: "Dylan Budka", result: "V", method: "TKO", event: "UFC Fight Night : Cannonier vs. Rodrigues" },
  ],
  // Ian Machado Garry
  f089: [
    { opponent: "Islam Makhachev", result: "D", method: "Décision unanime", event: "UFC 330" },
    { opponent: "Belal Muhammad", result: "V", method: "Décision unanime", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Carlos Prates", result: "V", method: "Décision unanime", event: "UFC on ESPN : Machado Garry vs. Prates" },
    { opponent: "Shavkat Rakhmonov", result: "D", method: "Décision unanime", event: "UFC 310" },
    { opponent: "Michael Page", result: "V", method: "Décision unanime", event: "UFC 303" },
  ],
  // Carlos Prates
  f090: [
    { opponent: "Jack Della Maddalena", result: "V", method: "TKO", event: "UFC Fight Night : Della Maddalena vs. Prates" },
    { opponent: "Leon Edwards", result: "V", method: "KO", event: "UFC 322" },
    { opponent: "Geoff Neal", result: "V", method: "KO", event: "UFC 319" },
    { opponent: "Ian Machado Garry", result: "D", method: "Décision unanime", event: "UFC on ESPN : Machado Garry vs. Prates" },
    { opponent: "Neil Magny", result: "V", method: "KO", event: "UFC Fight Night : Magny vs. Prates" },
  ],
  // Michael Morales
  f091: [
    { opponent: "Sean Brady", result: "V", method: "TKO", event: "UFC 322" },
    { opponent: "Gilbert Burns", result: "V", method: "TKO", event: "UFC Fight Night : Burns vs. Morales" },
    { opponent: "Neil Magny", result: "V", method: "TKO", event: "UFC on ESPN : Cannonier vs. Borralho" },
    { opponent: "Jake Matthews", result: "V", method: "Décision unanime", event: "UFC Fight Night : Allen vs. Craig" },
    { opponent: "Max Griffin", result: "V", method: "Décision unanime", event: "UFC on ESPN : Strickland vs. Magomedov" },
  ],
  // Gabriel Bonfim
  f092: [
    { opponent: "Belal Muhammad", result: "V", method: "Décision unanime", event: "UFC Fight Night : Muhammad vs. Bonfim" },
    { opponent: "Randy Brown", result: "V", method: "TKO", event: "UFC Fight Night : Bonfim vs. Brown" },
    { opponent: "Stephen Thompson", result: "V", method: "Décision partagée", event: "UFC on ESPN : Lewis vs. Teixeira" },
    { opponent: "Khaos Williams", result: "V", method: "Soumission", event: "UFC Fight Night : Cannonier vs. Rodrigues" },
    { opponent: "Ange Loosa", result: "V", method: "Décision unanime", event: "UFC on ESPN : Namajunas vs. Cortez" },
  ],
  // Sean Brady
  f093: [
    { opponent: "Joaquin Buckley", result: "V", method: "Décision unanime", event: "UFC 328" },
    { opponent: "Michael Morales", result: "D", method: "TKO", event: "UFC 322" },
    { opponent: "Leon Edwards", result: "V", method: "Soumission", event: "UFC Fight Night : Edwards vs. Brady" },
    { opponent: "Gilbert Burns", result: "V", method: "Décision unanime", event: "UFC Fight Night : Burns vs. Brady" },
    { opponent: "Kelvin Gastelum", result: "V", method: "Soumission", event: "UFC on ESPN : Dariush vs. Tsarukyan" },
  ],
  // Belal Muhammad
  f094: [
    { opponent: "Gabriel Bonfim", result: "D", method: "Décision unanime", event: "UFC Fight Night : Muhammad vs. Bonfim" },
    { opponent: "Ian Machado Garry", result: "D", method: "Décision unanime", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Jack Della Maddalena", result: "D", method: "Décision unanime", event: "UFC 315" },
    { opponent: "Leon Edwards", result: "V", method: "Décision unanime", event: "UFC 304" },
    { opponent: "Gilbert Burns", result: "V", method: "Décision unanime", event: "UFC 288" },
  ],
  // Leon Edwards
  f095: [
    { opponent: "Carlos Prates", result: "D", method: "KO", event: "UFC 322" },
    { opponent: "Sean Brady", result: "D", method: "Soumission", event: "UFC Fight Night : Edwards vs. Brady" },
    { opponent: "Belal Muhammad", result: "D", method: "Décision unanime", event: "UFC 304" },
    { opponent: "Colby Covington", result: "V", method: "Décision unanime", event: "UFC 296" },
    { opponent: "Kamaru Usman", result: "V", method: "Décision majoritaire", event: "UFC 286" },
  ],
  // Kamaru Usman
  f096: [
    { opponent: "Dricus Du Plessis", result: "D", method: "Décision unanime", event: "UFC Fight Night : Du Plessis vs. Usman" },
    { opponent: "Joaquin Buckley", result: "V", method: "Décision unanime", event: "UFC on ESPN : Usman vs. Buckley" },
    { opponent: "Khamzat Chimaev", result: "D", method: "Décision majoritaire", event: "UFC 294" },
    { opponent: "Leon Edwards", result: "D", method: "Décision majoritaire", event: "UFC 286" },
    { opponent: "Leon Edwards", result: "D", method: "KO", event: "UFC 278" },
  ],
  // Joaquin Buckley
  f097: [
    { opponent: "Mike Malott", result: "D", method: "KO", event: "UFC Fight Night : Buckley vs. Malott" },
    { opponent: "Sean Brady", result: "D", method: "Décision unanime", event: "UFC 328" },
    { opponent: "Kamaru Usman", result: "D", method: "Décision unanime", event: "UFC on ESPN : Usman vs. Buckley" },
    { opponent: "Colby Covington", result: "V", method: "TKO", event: "UFC on ESPN : Covington vs. Buckley" },
    { opponent: "Stephen Thompson", result: "V", method: "KO", event: "UFC 307" },
  ],
  // Yaroslav Amosov
  f098: [
    { opponent: "Joel Álvarez", result: "V", method: "Soumission", event: "UFC 328" },
    { opponent: "Neil Magny", result: "V", method: "Soumission", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Curtis Millender", result: "V", method: "Soumission", event: "Cage Fury FC 140" },
    { opponent: "Jason Jackson", result: "D", method: "KO", event: "Bellator 301" },
    { opponent: "Logan Storley", result: "V", method: "Décision unanime", event: "Bellator 291" },
  ],
  // Uroš Medić
  f099: [
    { opponent: "Daniel Rodriguez", result: "V", method: "TKO", event: "UFC Fight Night : Medić vs. Rodriguez" },
    { opponent: "Geoff Neal", result: "V", method: "KO", event: "UFC Fight Night : Strickland vs. Hernandez" },
    { opponent: "Muslim Salikhov", result: "V", method: "TKO", event: "UFC Fight Night : Bonfim vs. Brown" },
    { opponent: "Gilbert Urbina", result: "V", method: "KO", event: "UFC on ESPN : Dolidze vs. Hernandez" },
    { opponent: "Punahele Soriano", result: "D", method: "KO", event: "UFC Fight Night : Dern vs. Ribas 2" },
  ],
  // Mike Malott
  f100: [
    { opponent: "Joaquin Buckley", result: "V", method: "KO", event: "UFC Fight Night : Buckley vs. Malott" },
    { opponent: "Gilbert Burns", result: "V", method: "TKO", event: "UFC Fight Night : Burns vs. Malott" },
    { opponent: "Kevin Holland", result: "V", method: "Décision unanime", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "Charles Radtke", result: "V", method: "KO", event: "UFC 315" },
    { opponent: "Trevin Giles", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Albazi" },
  ],
  // Daniel Rodriguez
  f101: [
    { opponent: "Uroš Medić", result: "D", method: "TKO", event: "UFC Fight Night : Medić vs. Rodriguez" },
    { opponent: "Kevin Holland", result: "V", method: "Décision unanime", event: "UFC 318" },
    { opponent: "Santiago Ponzinibbio", result: "V", method: "TKO", event: "UFC on ESPN : Sandhagen vs. Figueiredo" },
    { opponent: "Alex Morono", result: "V", method: "Décision partagée", event: "UFC Fight Night : Royval vs. Taira" },
    { opponent: "Kelvin Gastelum", result: "D", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. Aliskerov" },
  ],
  // Neil Magny
  f102: [
    { opponent: "Ramiz Brahimaj", result: "V", method: "TKO", event: "UFC 330" },
    { opponent: "Yaroslav Amosov", result: "D", method: "Soumission", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Jake Matthews", result: "V", method: "Soumission", event: "UFC Fight Night : Ulberg vs. Reyes" },
    { opponent: "Elizeu Zaleski dos Santos", result: "V", method: "TKO", event: "UFC on ESPN : Taira vs. Park" },
    { opponent: "Carlos Prates", result: "D", method: "KO", event: "UFC Fight Night : Magny vs. Prates" },
  ],
  // Kevin Holland
  f103: [
    { opponent: "Randy Brown", result: "V", method: "Décision unanime", event: "UFC 327" },
    { opponent: "Mike Malott", result: "D", method: "Décision unanime", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "Daniel Rodriguez", result: "D", method: "Décision unanime", event: "UFC 318" },
    { opponent: "Vicente Luque", result: "V", method: "Soumission", event: "UFC 316" },
    { opponent: "Gunnar Nelson", result: "V", method: "Décision unanime", event: "UFC Fight Night : Edwards vs. Brady" },
  ],
  // Tom Nolan
  f104: [
    { opponent: "Farès Ziam", result: "V", method: "Décision unanime", event: "UFC Fight Night : Muhammad vs. Bonfim" },
    { opponent: "Charlie Campbell", result: "V", method: "Soumission", event: "UFC Fight Night : Ulberg vs. Reyes" },
    { opponent: "Viacheslav Borshchev", result: "V", method: "Décision unanime", event: "UFC 312" },
    { opponent: "Alex Reyes", result: "V", method: "Décision unanime", event: "UFC 305" },
    { opponent: "Victor Martinez", result: "V", method: "TKO", event: "UFC Fight Night : Barboza vs. Murphy" },
  ],
  // Melquizael Costa
  f105: [
    { opponent: "Arnold Allen", result: "D", method: "Décision unanime", event: "UFC Fight Night : Allen vs. Costa" },
    { opponent: "Dan Ige", result: "V", method: "TKO", event: "UFC Fight Night : Strickland vs. Hernandez" },
    { opponent: "Morgan Charrière", result: "V", method: "KO", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Julian Erosa", result: "V", method: "Décision unanime", event: "UFC Fight Night : Burns vs. Morales" },
    { opponent: "Christian Rodriguez", result: "V", method: "Décision unanime", event: "UFC on ESPN : Moreno vs. Erceg" },
  ],
  // Brian Ortega
  f106: [
    { opponent: "Aljamain Sterling", result: "D", method: "Décision unanime", event: "UFC Fight Night : Walker vs. Zhang" },
    { opponent: "Diego Lopes", result: "D", method: "Décision unanime", event: "UFC 306" },
    { opponent: "Yair Rodríguez", result: "V", method: "Soumission", event: "UFC Fight Night : Moreno vs. Royval 2" },
    { opponent: "Yair Rodríguez", result: "D", method: "TKO", event: "UFC on ABC : Ortega vs. Rodríguez" },
    { opponent: "Alexander Volkanovski", result: "D", method: "Décision unanime", event: "UFC 266" },
  ],
  // Tofiq Musayev
  f107: [
    { opponent: "Ľudovít Klein", result: "V", method: "TKO", event: "UFC Fight Night : Medić vs. Rodriguez" },
    { opponent: "Ignacio Bahamondes", result: "V", method: "Décision unanime", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Myktybek Orolbai", result: "D", method: "Soumission", event: "UFC on ABC : Hill vs. Rountree Jr." },
    { opponent: "Koji Takeda", result: "V", method: "KO", event: "Rizin Landmark 7" },
    { opponent: "Akira Okada", result: "V", method: "KO", event: "Super Rizin 2" },
  ],
  // Grant Dawson
  f108: [
    { opponent: "Nurullo Aliev", result: "V", method: "Décision unanime", event: "UFC 333" },
    { opponent: "Mateusz Rębecki", result: "V", method: "Soumission", event: "UFC 328" },
    { opponent: "Manuel Torres", result: "D", method: "TKO", event: "UFC 323" },
    { opponent: "Carlos Diego Ferreira", result: "V", method: "Décision unanime", event: "UFC 311" },
    { opponent: "Rafa García", result: "V", method: "TKO", event: "UFC Fight Night : Royval vs. Taira" },
  ],
  // Esteban Ribovics
  f109: [
    { opponent: "King Green", result: "V", method: "TKO", event: "UFC 332" },
    { opponent: "Edson Barboza", result: "V", method: "TKO", event: "UFC 330" },
    { opponent: "Mateusz Gamrot", result: "D", method: "Soumission", event: "UFC 327" },
    { opponent: "Elves Brener", result: "V", method: "Décision unanime", event: "UFC on ESPN : Taira vs. Park" },
    { opponent: "Nasrat Haqparast", result: "D", method: "Décision partagée", event: "UFC Fight Night : Kape vs. Almabayev" },
  ],
  // Movsar Evloev
  f110: [
    { opponent: "Alexander Volkanovski", result: "D", method: "TKO", event: "UFC 333" },
    { opponent: "Lerone Murphy", result: "V", method: "Décision majoritaire", event: "UFC Fight Night : Evloev vs. Murphy" },
    { opponent: "Aljamain Sterling", result: "V", method: "Décision unanime", event: "UFC 310" },
    { opponent: "Arnold Allen", result: "V", method: "Décision unanime", event: "UFC 297" },
    { opponent: "Diego Lopes", result: "V", method: "Décision unanime", event: "UFC 288" },
  ],
  // Diego Lopes
  f111: [
    { opponent: "Steve Garcia", result: "V", method: "KO", event: "UFC Freedom 250" },
    { opponent: "Alexander Volkanovski", result: "D", method: "Décision unanime", event: "UFC 325" },
    { opponent: "Jean Silva", result: "V", method: "TKO", event: "Noche UFC : Lopes vs. Silva" },
    { opponent: "Alexander Volkanovski", result: "D", method: "Décision unanime", event: "UFC 314" },
    { opponent: "Brian Ortega", result: "V", method: "Décision unanime", event: "UFC 306" },
  ],
  // Lerone Murphy
  f112: [
    { opponent: "Movsar Evloev", result: "D", method: "Décision majoritaire", event: "UFC Fight Night : Evloev vs. Murphy" },
    { opponent: "Aaron Pico", result: "V", method: "KO", event: "UFC 319" },
    { opponent: "Josh Emmett", result: "V", method: "Décision unanime", event: "UFC on ESPN : Emmett vs. Murphy" },
    { opponent: "Dan Ige", result: "V", method: "Décision unanime", event: "UFC 308" },
    { opponent: "Edson Barboza", result: "V", method: "Décision unanime", event: "UFC Fight Night : Barboza vs. Murphy" },
  ],
  // Aljamain Sterling
  f113: [
    { opponent: "Youssef Zalal", result: "V", method: "Décision unanime", event: "UFC Fight Night : Sterling vs. Zalal" },
    { opponent: "Brian Ortega", result: "V", method: "Décision unanime", event: "UFC Fight Night : Walker vs. Zhang" },
    { opponent: "Movsar Evloev", result: "D", method: "Décision unanime", event: "UFC 310" },
    { opponent: "Calvin Kattar", result: "V", method: "Décision unanime", event: "UFC 300" },
    { opponent: "Sean O'Malley", result: "D", method: "TKO", event: "UFC 292" },
  ],
  // Jean Silva
  f114: [
    { opponent: "José Miguel Delgado", result: "V", method: "Soumission", event: "Noche UFC : Silva vs. Delgado" },
    { opponent: "Arnold Allen", result: "V", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Diego Lopes", result: "D", method: "TKO", event: "Noche UFC : Lopes vs. Silva" },
    { opponent: "Bryce Mitchell", result: "V", method: "Soumission", event: "UFC 314" },
    { opponent: "Melsik Baghdasaryan", result: "V", method: "TKO", event: "UFC Fight Night : Cejudo vs. Song" },
  ],
  // Yair Rodríguez
  f115: [
    { opponent: "Patrício Pitbull", result: "V", method: "Décision unanime", event: "UFC 314" },
    { opponent: "Brian Ortega", result: "D", method: "Soumission", event: "UFC Fight Night : Moreno vs. Royval 2" },
    { opponent: "Alexander Volkanovski", result: "D", method: "TKO", event: "UFC 290" },
    { opponent: "Josh Emmett", result: "V", method: "Soumission", event: "UFC 284" },
    { opponent: "Brian Ortega", result: "V", method: "TKO", event: "UFC on ABC : Ortega vs. Rodríguez" },
  ],
  // Arnold Allen
  f116: [
    { opponent: "Melquizael Costa", result: "V", method: "Décision unanime", event: "UFC Fight Night : Allen vs. Costa" },
    { opponent: "Jean Silva", result: "D", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Giga Chikadze", result: "V", method: "Décision unanime", event: "UFC 304" },
    { opponent: "Movsar Evloev", result: "D", method: "Décision unanime", event: "UFC 297" },
    { opponent: "Max Holloway", result: "D", method: "Décision unanime", event: "UFC on ESPN : Holloway vs. Allen" },
  ],
  // Youssef Zalal
  f117: [
    { opponent: "Aljamain Sterling", result: "D", method: "Décision unanime", event: "UFC Fight Night : Sterling vs. Zalal" },
    { opponent: "Josh Emmett", result: "V", method: "Soumission", event: "UFC 320" },
    { opponent: "Calvin Kattar", result: "V", method: "Décision unanime", event: "UFC Fight Night : Cannonier vs. Rodrigues" },
    { opponent: "Jack Shore", result: "V", method: "Soumission", event: "UFC Fight Night : Moreno vs. Albazi" },
    { opponent: "Jarno Errens", result: "V", method: "Soumission", event: "UFC on ESPN : Tybura vs. Spivac 2" },
  ],
  // Kevin Vallejos
  f118: [
    { opponent: "Josh Emmett", result: "V", method: "TKO", event: "UFC Fight Night : Emmett vs. Vallejos" },
    { opponent: "Giga Chikadze", result: "V", method: "KO", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Danny Silva", result: "V", method: "Décision unanime", event: "UFC on ESPN : Taira vs. Park" },
    { opponent: "Choi Seung-woo", result: "V", method: "TKO", event: "UFC Fight Night : Vettori vs. Dolidze 2" },
    { opponent: "Cam Teague", result: "V", method: "TKO", event: "Dana White's Contender Series 73" },
  ],
  // Aaron Pico
  f119: [
    { opponent: "Losene Keita", result: "V", method: "TKO", event: "UFC 333" },
    { opponent: "Patrício Pitbull", result: "V", method: "Décision unanime", event: "UFC 327" },
    { opponent: "Lerone Murphy", result: "D", method: "KO", event: "UFC 319" },
    { opponent: "Henry Corrales", result: "V", method: "TKO", event: "PFL vs. Bellator" },
    { opponent: "Pedro Carvalho", result: "V", method: "TKO", event: "Bellator 299" },
  ],
  // Steve Garcia
  f120: [
    { opponent: "Diego Lopes", result: "D", method: "KO", event: "UFC Freedom 250" },
    { opponent: "David Onama", result: "V", method: "TKO", event: "UFC Fight Night : Garcia vs. Onama" },
    { opponent: "Calvin Kattar", result: "V", method: "Décision unanime", event: "UFC on ESPN : Lewis vs. Teixeira" },
    { opponent: "Kyle Nelson", result: "V", method: "TKO", event: "UFC Fight Night : Burns vs. Brady" },
    { opponent: "Choi Seung-woo", result: "V", method: "TKO", event: "UFC on ESPN : Lemos vs. Jandiroba" },
  ],
  // Patrício Pitbull
  f121: [
    { opponent: "Dooho Choi", result: "V", method: "TKO", event: "UFC 331" },
    { opponent: "Aaron Pico", result: "D", method: "Décision unanime", event: "UFC 327" },
    { opponent: "Dan Ige", result: "V", method: "Décision unanime", event: "UFC 318" },
    { opponent: "Yair Rodríguez", result: "D", method: "Décision unanime", event: "UFC 314" },
    { opponent: "Jeremy Kennedy", result: "V", method: "TKO", event: "Bellator Champions Series : Belfast" },
  ],
  // David Onama
  f122: [
    { opponent: "Steve Garcia", result: "D", method: "TKO", event: "UFC Fight Night : Garcia vs. Onama" },
    { opponent: "Giga Chikadze", result: "V", method: "Décision unanime", event: "UFC on ESPN : Machado Garry vs. Prates" },
    { opponent: "Roberto Romero", result: "V", method: "Décision unanime", event: "UFC 309" },
    { opponent: "Jonathan Pearce", result: "V", method: "Décision unanime", event: "UFC on ESPN : Nicolau vs. Perez" },
    { opponent: "Gabriel Santos", result: "V", method: "KO", event: "UFC on ABC : Emmett vs. Topuria" },
  ],
  // Pat Sabatini
  f123: [
    { opponent: "William Gomis", result: "V", method: "Décision unanime", event: "UFC 328" },
    { opponent: "Chepe Mariscal", result: "V", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Joanderson Brito", result: "V", method: "Décision unanime", event: "UFC on ESPN : Emmett vs. Murphy" },
    { opponent: "Jonathan Pearce", result: "V", method: "Soumission", event: "UFC Fight Night : Royval vs. Taira" },
    { opponent: "Diego Lopes", result: "D", method: "KO", event: "UFC 295" },
  ],
  // Pavel Andrusca
  f124: [
    { opponent: "Nathaniel Wood", result: "V", method: "Décision unanime", event: "UFC Paris : Hooker vs. Parnasse" },
    { opponent: "Pengchu Gexi", result: "V", method: "KO", event: "UAE Warriors 72" },
    { opponent: "Zhawupasi Daermisi", result: "V", method: "KO", event: "UAE Warriors 65" },
    { opponent: "Thyago Silva Nascimento", result: "V", method: "Soumission", event: "Vendetta Fight Nights 45" },
    { opponent: "Eriquis Camilo Soares", result: "V", method: "TKO", event: "Vendetta Fight Nights 43" },
  ],
  // Joanderson Brito
  f125: [
    { opponent: "Giga Chikadze", result: "V", method: "KO", event: "UFC 331" },
    { opponent: "Jordan Leavitt", result: "V", method: "Soumission", event: "UFC Fight Night : Muhammad vs. Bonfim" },
    { opponent: "Isaac Thomson", result: "V", method: "Décision unanime", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Pat Sabatini", result: "D", method: "Décision unanime", event: "UFC on ESPN : Emmett vs. Murphy" },
    { opponent: "William Gomis", result: "D", method: "Décision partagée", event: "UFC Fight Night : Moicano vs. Saint Denis" },
  ],
  // Jamall Emmers
  f126: [
    { opponent: "Lerryan Douglas", result: "V", method: "TKO", event: "UFC Fight Night : Hernandez vs. Rodrigues" },
    { opponent: "Hyder Amil", result: "V", method: "Décision unanime", event: "UFC Fight Night : Bonfim vs. Brown" },
    { opponent: "Gabriel Miranda", result: "V", method: "TKO", event: "UFC on ESPN : Moreno vs. Erceg" },
    { opponent: "Nate Landwehr", result: "D", method: "KO", event: "UFC on ESPN : Blanchfield vs. Fiorot" },
    { opponent: "Dennis Buzukja", result: "V", method: "TKO", event: "UFC 295" },
  ],
  // Song Yadong
  f127: [
    { opponent: "Umar Nurmagomedov", result: "V", method: "KO", event: "UFC Fight Night : Nurmagomedov vs. Song" },
    { opponent: "Deiveson Figueiredo", result: "V", method: "Soumission", event: "UFC Fight Night : Song vs. Figueiredo" },
    { opponent: "Sean O'Malley", result: "D", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Henry Cejudo", result: "V", method: "Décision technique", event: "UFC Fight Night : Cejudo vs. Song" },
    { opponent: "Petr Yan", result: "D", method: "Décision unanime", event: "UFC 299" },
  ],
  // Umar Nurmagomedov
  f128: [
    { opponent: "Song Yadong", result: "D", method: "KO", event: "UFC Fight Night : Nurmagomedov vs. Song" },
    { opponent: "Deiveson Figueiredo", result: "V", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Mario Bautista", result: "V", method: "Décision unanime", event: "UFC 321" },
    { opponent: "Merab Dvalishvili", result: "D", method: "Décision unanime", event: "UFC 311" },
    { opponent: "Cory Sandhagen", result: "V", method: "Décision unanime", event: "UFC on ABC : Sandhagen vs. Nurmagomedov" },
  ],
  // Mario Bautista
  f129: [
    { opponent: "Cory Sandhagen", result: "V", method: "Décision unanime", event: "UFC 329" },
    { opponent: "Vinicius Oliveira", result: "V", method: "Soumission", event: "UFC Fight Night : Bautista vs. Oliveira" },
    { opponent: "Umar Nurmagomedov", result: "D", method: "Décision unanime", event: "UFC 321" },
    { opponent: "Patchy Mix", result: "V", method: "Décision unanime", event: "UFC 316" },
    { opponent: "José Aldo", result: "V", method: "Décision partagée", event: "UFC 307" },
  ],
  // Cory Sandhagen
  f130: [
    { opponent: "Mario Bautista", result: "D", method: "Décision unanime", event: "UFC 329" },
    { opponent: "Merab Dvalishvili", result: "D", method: "Décision unanime", event: "UFC 320" },
    { opponent: "Deiveson Figueiredo", result: "V", method: "TKO", event: "UFC on ESPN : Sandhagen vs. Figueiredo" },
    { opponent: "Umar Nurmagomedov", result: "D", method: "Décision unanime", event: "UFC on ABC : Sandhagen vs. Nurmagomedov" },
    { opponent: "Rob Font", result: "V", method: "Décision unanime", event: "UFC on ESPN : Sandhagen vs. Font" },
  ],
  // Sean O'Malley
  f131: [
    { opponent: "Aiemann Zahabi", result: "V", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Song Yadong", result: "V", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Merab Dvalishvili", result: "D", method: "Soumission", event: "UFC 316" },
    { opponent: "Merab Dvalishvili", result: "D", method: "Décision unanime", event: "UFC 306" },
    { opponent: "Marlon Vera", result: "V", method: "Décision unanime", event: "UFC 299" },
  ],
  // Aiemann Zahabi
  f132: [
    { opponent: "Sean O'Malley", result: "D", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Marlon Vera", result: "V", method: "Décision partagée", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "José Aldo", result: "V", method: "Décision unanime", event: "UFC 315" },
    { opponent: "Pedro Munhoz", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Albazi" },
    { opponent: "Javid Basharat", result: "V", method: "Décision unanime", event: "UFC Fight Night : Rozenstruik vs. Gaziev" },
  ],
  // David Martínez
  f133: [
    { opponent: "Dan Ige", result: "V", method: "Décision unanime", event: "Noche UFC : Silva vs. Delgado" },
    { opponent: "Marlon Vera", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Kavanagh" },
    { opponent: "Rob Font", result: "V", method: "Décision unanime", event: "Noche UFC : Lopes vs. Silva" },
    { opponent: "Saimon Oliveira", result: "V", method: "TKO", event: "UFC on ESPN : Moreno vs. Erceg" },
    { opponent: "Xavier Franklin", result: "V", method: "Décision unanime", event: "Dana White's Contender Series 74" },
  ],
  // Deiveson Figueiredo
  f134: [
    { opponent: "Payton Talbott", result: "D", method: "TKO", event: "UFC 332" },
    { opponent: "Song Yadong", result: "D", method: "Soumission", event: "UFC Fight Night : Song vs. Figueiredo" },
    { opponent: "Umar Nurmagomedov", result: "D", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Montel Jackson", result: "V", method: "Décision partagée", event: "UFC Fight Night : Oliveira vs. Gamrot" },
    { opponent: "Cory Sandhagen", result: "D", method: "TKO", event: "UFC on ESPN : Sandhagen vs. Figueiredo" },
  ],
  // Marlon Vera
  f135: [
    { opponent: "Charles Jourdain", result: "V", method: "TKO", event: "UFC 331" },
    { opponent: "David Martínez", result: "D", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Kavanagh" },
    { opponent: "Aiemann Zahabi", result: "D", method: "Décision partagée", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "Deiveson Figueiredo", result: "D", method: "Décision unanime", event: "UFC on ABC : Sandhagen vs. Nurmagomedov" },
    { opponent: "Sean O'Malley", result: "D", method: "Décision unanime", event: "UFC 299" },
  ],
  // Payton Talbott
  f136: [
    { opponent: "Deiveson Figueiredo", result: "V", method: "TKO", event: "UFC 332" },
    { opponent: "Henry Cejudo", result: "V", method: "Décision unanime", event: "UFC 323" },
    { opponent: "Felipe Lima", result: "V", method: "Décision unanime", event: "UFC 317" },
    { opponent: "Raoni Barcelos", result: "D", method: "Décision unanime", event: "UFC 311" },
    { opponent: "Yanis Ghemmouri", result: "V", method: "KO", event: "UFC 303" },
  ],
  // Raul Rosas Jr.
  f137: [
    { opponent: "Raoni Barcelos", result: "V", method: "TKO", event: "UFC Fight Night : Rosas Jr. vs. Barcelos" },
    { opponent: "Rob Font", result: "V", method: "Décision unanime", event: "UFC 326" },
    { opponent: "Vince Morales", result: "V", method: "Décision unanime", event: "UFC on ESPN : Moreno vs. Erceg" },
    { opponent: "Aoriqileng", result: "V", method: "Décision unanime", event: "UFC 306" },
    { opponent: "Ricky Turcios", result: "V", method: "Soumission", event: "UFC on ESPN : Cannonier vs. Imavov" },
  ],
  // Raoni Barcelos
  f138: [
    { opponent: "Raul Rosas Jr.", result: "D", method: "TKO", event: "UFC Fight Night : Rosas Jr. vs. Barcelos" },
    { opponent: "Montel Jackson", result: "V", method: "Décision partagée", event: "UFC Fight Night : Sterling vs. Zalal" },
    { opponent: "Ricky Simón", result: "V", method: "Décision unanime", event: "UFC Fight Night : Bonfim vs. Brown" },
    { opponent: "Cody Garbrandt", result: "V", method: "Décision unanime", event: "UFC on ESPN : Usman vs. Buckley" },
    { opponent: "Payton Talbott", result: "V", method: "Décision unanime", event: "UFC 311" },
  ],
  // Farid Basharat
  f139: [
    { opponent: "John Garza", result: "V", method: "Décision unanime", event: "UFC 329" },
    { opponent: "Jean Matsumoto", result: "V", method: "Décision partagée", event: "UFC Fight Night : Bautista vs. Oliveira" },
    { opponent: "Chris Gutiérrez", result: "V", method: "Décision unanime", event: "UFC 320" },
    { opponent: "Victor Hugo", result: "V", method: "Décision unanime", event: "UFC 308" },
    { opponent: "Taylor Lapilus", result: "V", method: "Décision unanime", event: "UFC Fight Night : Ankalaev vs. Walker 2" },
  ],
  // Marcus McGhee
  f140: [
    { opponent: "Anthony Romero", result: "V", method: "TKO", event: "UFC 332" },
    { opponent: "John Yannis", result: "V", method: "Décision unanime", event: "UFC Fight Night : Muhammad vs. Bonfim" },
    { opponent: "Petr Yan", result: "D", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Jonathan Martinez", result: "V", method: "Décision unanime", event: "UFC 309" },
    { opponent: "Gastón Bolaños", result: "V", method: "TKO", event: "UFC Fight Night : Ankalaev vs. Walker 2" },
  ],
  // Montel Jackson
  f141: [
    { opponent: "Ricky Simón", result: "V", method: "KO", event: "UFC Fight Night : Rosas Jr. vs. Barcelos" },
    { opponent: "Raoni Barcelos", result: "D", method: "Décision partagée", event: "UFC Fight Night : Sterling vs. Zalal" },
    { opponent: "Deiveson Figueiredo", result: "D", method: "Décision partagée", event: "UFC Fight Night : Oliveira vs. Gamrot" },
    { opponent: "Daniel Marcos", result: "V", method: "Décision unanime", event: "UFC on ESPN : Sandhagen vs. Figueiredo" },
    { opponent: "Da'Mon Blackshear", result: "V", method: "KO", event: "UFC on ESPN : Namajunas vs. Cortez" },
  ],
  // Bryce Mitchell
  f142: [
    { opponent: "Santiago Luna", result: "V", method: "Soumission", event: "UFC Fight Night : Muhammad vs. Bonfim" },
    { opponent: "Said Nurmagomedov", result: "V", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Jean Silva", result: "D", method: "Soumission", event: "UFC 314" },
    { opponent: "Kron Gracie", result: "V", method: "KO", event: "UFC 310" },
    { opponent: "Josh Emmett", result: "D", method: "KO", event: "UFC 296" },
  ],
  // Manel Kape
  f143: [
    { opponent: "Kyoji Horiguchi", result: "V", method: "TKO", event: "UFC Fight Night : Kape vs. Horiguchi" },
    { opponent: "Brandon Royval", result: "V", method: "KO", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Asu Almabayev", result: "V", method: "TKO", event: "UFC Fight Night : Kape vs. Almabayev" },
    { opponent: "Bruno Silva", result: "V", method: "TKO", event: "UFC on ESPN : Covington vs. Buckley" },
    { opponent: "Muhammad Mokaev", result: "D", method: "Décision unanime", event: "UFC 304" },
  ],
  // Brandon Royval
  f144: [
    { opponent: "Lone'er Kavanagh", result: "V", method: "Soumission", event: "UFC 329" },
    { opponent: "Manel Kape", result: "D", method: "KO", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Joshua Van", result: "D", method: "Décision unanime", event: "UFC 317" },
    { opponent: "Tatsuro Taira", result: "V", method: "Décision partagée", event: "UFC Fight Night : Royval vs. Taira" },
    { opponent: "Brandon Moreno", result: "V", method: "Décision partagée", event: "UFC Fight Night : Moreno vs. Royval 2" },
  ],
  // Tatsuro Taira
  f145: [
    { opponent: "Joshua Van", result: "D", method: "TKO", event: "UFC 328" },
    { opponent: "Brandon Moreno", result: "V", method: "TKO", event: "UFC 323" },
    { opponent: "Park Hyun-sung", result: "V", method: "Soumission", event: "UFC on ESPN : Taira vs. Park" },
    { opponent: "Brandon Royval", result: "D", method: "Décision partagée", event: "UFC Fight Night : Royval vs. Taira" },
    { opponent: "Alex Perez", result: "V", method: "TKO", event: "UFC on ESPN : Perez vs. Taira" },
  ],
  // Kyoji Horiguchi
  f146: [
    { opponent: "Manel Kape", result: "D", method: "TKO", event: "UFC Fight Night : Kape vs. Horiguchi" },
    { opponent: "Amir Albazi", result: "V", method: "Décision unanime", event: "UFC Fight Night : Bautista vs. Oliveira" },
    { opponent: "Tagir Ulanbekov", result: "V", method: "Soumission", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Nkazimulo Zulu", result: "V", method: "Décision unanime", event: "Rizin 49" },
    { opponent: "Sergio Pettis", result: "V", method: "Décision unanime", event: "Rizin 47" },
  ],
  // Lone'er Kavanagh
  f147: [
    { opponent: "Ramazan Temirov", result: "V", method: "TKO", event: "UFC 333" },
    { opponent: "Brandon Royval", result: "D", method: "Soumission", event: "UFC 329" },
    { opponent: "Brandon Moreno", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Kavanagh" },
    { opponent: "Charles Johnson", result: "D", method: "KO", event: "UFC Fight Night : Walker vs. Zhang" },
    { opponent: "Felipe dos Santos", result: "V", method: "Décision unanime", event: "UFC Fight Night : Edwards vs. Brady" },
  ],
  // Asu Almabayev
  f148: [
    { opponent: "Charles Johnson", result: "V", method: "Soumission", event: "UFC Fight Night : Fiziev vs. Torres" },
    { opponent: "Alex Perez", result: "V", method: "Soumission", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Jose Ochoa", result: "V", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Manel Kape", result: "D", method: "TKO", event: "UFC Fight Night : Kape vs. Almabayev" },
    { opponent: "Matheus Nicolau", result: "V", method: "Décision unanime", event: "UFC Fight Night : Hernandez vs. Pereira" },
  ],
  // Brandon Moreno
  f149: [
    { opponent: "Joseph Morales", result: "V", method: "Décision partagée", event: "Noche UFC : Silva vs. Delgado" },
    { opponent: "Lone'er Kavanagh", result: "D", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Kavanagh" },
    { opponent: "Tatsuro Taira", result: "D", method: "TKO", event: "UFC 323" },
    { opponent: "Steve Erceg", result: "V", method: "Décision unanime", event: "UFC on ESPN : Moreno vs. Erceg" },
    { opponent: "Amir Albazi", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Albazi" },
  ],
  // Amir Albazi
  f150: [
    { opponent: "Kyoji Horiguchi", result: "D", method: "Décision unanime", event: "UFC Fight Night : Bautista vs. Oliveira" },
    { opponent: "Brandon Moreno", result: "D", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Albazi" },
    { opponent: "Kai Kara-France", result: "V", method: "Décision partagée", event: "UFC on ESPN : Kara-France vs. Albazi" },
    { opponent: "Alessandro Costa", result: "V", method: "KO", event: "UFC Fight Night : Cannonier vs. Strickland" },
    { opponent: "Francisco Figueiredo", result: "V", method: "Soumission", event: "UFC 278" },
  ],
  // Ramazan Temirov
  f151: [
    { opponent: "Lone'er Kavanagh", result: "D", method: "TKO", event: "UFC 333" },
    { opponent: "Steve Erceg", result: "V", method: "KO", event: "UFC Fight Night : Ankalaev vs. Guskov" },
    { opponent: "Charles Johnson", result: "V", method: "Décision unanime", event: "UFC Fight Night : Kape vs. Almabayev" },
    { opponent: "C.J. Vergara", result: "V", method: "TKO", event: "UFC Fight Night : Royval vs. Taira" },
    { opponent: "Takaki Soya", result: "V", method: "KO", event: "Rizin 44" },
  ],
  // Tim Elliott
  f152: [
    { opponent: "Édgar Cháirez", result: "V", method: "Décision unanime", event: "Noche UFC : Silva vs. Delgado" },
    { opponent: "Steve Erceg", result: "D", method: "Décision unanime", event: "UFC Fight Night : Della Maddalena vs. Prates" },
    { opponent: "Kai Asakura", result: "V", method: "Soumission", event: "UFC 319" },
    { opponent: "Sumudaerji", result: "V", method: "Soumission", event: "UFC Fight Night : Song vs. Gutiérrez" },
    { opponent: "Muhammad Mokaev", result: "D", method: "Soumission", event: "UFC 294" },
  ],
  // Steve Erceg
  f153: [
    { opponent: "Ramazan Temirov", result: "D", method: "KO", event: "UFC Fight Night : Ankalaev vs. Guskov" },
    { opponent: "Tim Elliott", result: "V", method: "Décision unanime", event: "UFC Fight Night : Della Maddalena vs. Prates" },
    { opponent: "Ode' Osbourne", result: "V", method: "Décision unanime", event: "UFC on ESPN : Dolidze vs. Hernandez" },
    { opponent: "Brandon Moreno", result: "D", method: "Décision unanime", event: "UFC on ESPN : Moreno vs. Erceg" },
    { opponent: "Kai Kara-France", result: "D", method: "TKO", event: "UFC 305" },
  ],
  // Sumudaerji
  f154: [
    { opponent: "Alex Perez", result: "V", method: "Décision unanime", event: "UFC Fight Night : Nurmagomedov vs. Song" },
    { opponent: "Alex Perez", result: "NC", method: "Sans décision", event: "UFC Fight Night : Song vs. Figueiredo" },
    { opponent: "Jesús Santos Aguilar", result: "V", method: "Décision unanime", event: "UFC 326" },
    { opponent: "Kevin Borjas", result: "V", method: "Décision unanime", event: "UFC Fight Night : Walker vs. Zhang" },
    { opponent: "Mitch Raposo", result: "V", method: "Décision partagée", event: "UFC 314" },
  ],
  // Tagir Ulanbekov
  f155: [
    { opponent: "Kyoji Horiguchi", result: "D", method: "Soumission", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Azat Maksum", result: "V", method: "Décision unanime", event: "UFC on ABC : Hill vs. Rountree Jr." },
    { opponent: "Clayton Carpenter", result: "V", method: "Décision unanime", event: "UFC 311" },
    { opponent: "Cody Durden", result: "V", method: "Soumission", event: "UFC 296" },
    { opponent: "Nate Maness", result: "V", method: "Soumission", event: "UFC Fight Night : Rodriguez vs. Lemos" },
  ],
  // Alex Perez
  f156: [
    { opponent: "Sumudaerji", result: "D", method: "Décision unanime", event: "UFC Fight Night : Nurmagomedov vs. Song" },
    { opponent: "Sumudaerji", result: "NC", method: "Sans décision", event: "UFC Fight Night : Song vs. Figueiredo" },
    { opponent: "Charles Johnson", result: "V", method: "TKO", event: "UFC 324" },
    { opponent: "Asu Almabayev", result: "D", method: "Soumission", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Tatsuro Taira", result: "D", method: "TKO", event: "UFC on ESPN : Perez vs. Taira" },
  ],
  // Mitch Raposo
  f157: [
    { opponent: "Allan Nascimento", result: "V", method: "Décision partagée", event: "UFC Fight Night : Kape vs. Horiguchi" },
    { opponent: "Azat Maksum", result: "V", method: "Décision unanime", event: "UFC 321" },
    { opponent: "Sumudaerji", result: "D", method: "Décision partagée", event: "UFC 314" },
    { opponent: "André Lima", result: "D", method: "Décision partagée", event: "UFC 302" },
    { opponent: "Justin Valentin", result: "V", method: "TKO", event: "Cage Titans 63" },
  ],
  // Imanol Rodriguez
  f158: [
    { opponent: "Alden Coria", result: "V", method: "TKO", event: "UFC 332" },
    { opponent: "Kevin Borjas", result: "V", method: "TKO", event: "UFC Fight Night : Moreno vs. Kavanagh" },
    { opponent: "Roque Conceição", result: "V", method: "KO", event: "Dana White's Contender Series 85" },
    { opponent: "Alberto Trujillo", result: "V", method: "TKO", event: "Fury FC 96" },
    { opponent: "Tyrell Hill", result: "V", method: "TKO", event: "Fury FC 93" },
  ],
  // Rei Tsuruya
  f159: [
    { opponent: "Kevin Borjas", result: "V", method: "Soumission", event: "UFC Fight Night : Nurmagomedov vs. Song" },
    { opponent: "Luis Gurule", result: "V", method: "Soumission", event: "UFC Fight Night : Song vs. Figueiredo" },
    { opponent: "Joshua Van", result: "D", method: "Décision unanime", event: "UFC 313" },
    { opponent: "Carlos Hernandez", result: "V", method: "Décision unanime", event: "UFC 303" },
    { opponent: "Jiniushiyue", result: "V", method: "TKO", event: "UFC Fight Night : Dolidze vs. Imavov" },
  ],
  // Charles Johnson
  f160: [
    { opponent: "Eduardo Henrique", result: "V", method: "Soumission", event: "UFC 330" },
    { opponent: "Asu Almabayev", result: "D", method: "Soumission", event: "UFC Fight Night : Fiziev vs. Torres" },
    { opponent: "Bruno Silva", result: "V", method: "Décision partagée", event: "UFC Fight Night : Emmett vs. Vallejos" },
    { opponent: "Alex Perez", result: "D", method: "TKO", event: "UFC 324" },
    { opponent: "Lone'er Kavanagh", result: "V", method: "KO", event: "UFC Fight Night : Walker vs. Zhang" },
  ],
  // Raquel Pennington
  f161: [
    { opponent: "Julianna Peña", result: "D", method: "Décision partagée", event: "UFC 307" },
    { opponent: "Mayra Bueno Silva", result: "V", method: "Décision unanime", event: "UFC 297" },
    { opponent: "Ketlen Vieira", result: "V", method: "Décision partagée", event: "UFC Fight Night : Strickland vs. Imavov" },
    { opponent: "Aspen Ladd", result: "V", method: "Décision unanime", event: "UFC 273" },
    { opponent: "Macy Chiasson", result: "V", method: "Soumission", event: "UFC Fight Night : Lewis vs. Daukaus" },
  ],
  // Joselyne Edwards
  f162: [
    { opponent: "Norma Dumont", result: "V", method: "Décision unanime", event: "UFC Fight Night : Sterling vs. Zalal" },
    { opponent: "Nora Cornolle", result: "V", method: "Soumission", event: "UFC Fight Night : Strickland vs. Hernandez" },
    { opponent: "Priscila Cachoeira", result: "V", method: "KO", event: "UFC on ESPN : Dolidze vs. Hernandez" },
    { opponent: "Chelsea Chandler", result: "V", method: "TKO", event: "UFC on ESPN : Machado Garry vs. Prates" },
    { opponent: "Tamires Vidal", result: "V", method: "Soumission", event: "UFC Fight Night : Hernandez vs. Pereira" },
  ],
  // Norma Dumont
  f163: [
    { opponent: "Ailín Pérez", result: "D", method: "Décision unanime", event: "UFC Fight Night : Rosas Jr. vs. Barcelos" },
    { opponent: "Joselyne Edwards", result: "D", method: "Décision unanime", event: "UFC Fight Night : Sterling vs. Zalal" },
    { opponent: "Ketlen Vieira", result: "V", method: "Décision partagée", event: "UFC Fight Night : Garcia vs. Onama" },
    { opponent: "Irene Aldana", result: "V", method: "Décision unanime", event: "UFC 306" },
    { opponent: "Germaine de Randamie", result: "V", method: "Décision unanime", event: "UFC Fight Night : Allen vs. Curtis 2" },
  ],
  // Ailín Pérez
  f164: [
    { opponent: "Norma Dumont", result: "V", method: "Décision unanime", event: "UFC Fight Night : Rosas Jr. vs. Barcelos" },
    { opponent: "Macy Chiasson", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Kavanagh" },
    { opponent: "Karol Rosa", result: "V", method: "Décision unanime", event: "UFC 311" },
    { opponent: "Darya Zheleznyakova", result: "V", method: "Soumission", event: "UFC Fight Night : Moicano vs. Saint Denis" },
    { opponent: "Joselyne Edwards", result: "V", method: "Décision unanime", event: "UFC 302" },
  ],
  // Yana Santos
  f165: [
    { opponent: "Macy Chiasson", result: "V", method: "Décision unanime", event: "UFC 320" },
    { opponent: "Miesha Tate", result: "V", method: "Décision unanime", event: "UFC on ESPN : Sandhagen vs. Figueiredo" },
    { opponent: "Chelsea Chandler", result: "V", method: "Décision unanime", event: "UFC on ESPN : Tybura vs. Spivac 2" },
    { opponent: "Karol Rosa", result: "D", method: "Décision partagée", event: "UFC on ESPN : Strickland vs. Magomedov" },
    { opponent: "Holly Holm", result: "D", method: "Décision unanime", event: "UFC on ESPN : Vera vs. Sandhagen" },
  ],
  // Luana Santos
  f166: [
    { opponent: "Karol Rosa", result: "V", method: "Décision unanime", event: "UFC Fight Night : Kape vs. Horiguchi" },
    { opponent: "Melissa Croden", result: "V", method: "Décision unanime", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Tainara Lisboa", result: "V", method: "Soumission", event: "UFC Fight Night : Burns vs. Morales" },
    { opponent: "Casey O'Neill", result: "D", method: "Décision unanime", event: "UFC 305" },
    { opponent: "Mariya Agapova", result: "V", method: "Soumission", event: "UFC on ESPN : Namajunas vs. Cortez" },
  ],
  // Macy Chiasson
  f167: [
    { opponent: "Ailín Pérez", result: "D", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Kavanagh" },
    { opponent: "Yana Santos", result: "D", method: "Décision unanime", event: "UFC 320" },
    { opponent: "Ketlen Vieira", result: "D", method: "Décision unanime", event: "UFC on ESPN : Gamrot vs. Klein" },
    { opponent: "Mayra Bueno Silva", result: "V", method: "TKO", event: "UFC 303" },
    { opponent: "Pannie Kianzad", result: "V", method: "Soumission", event: "UFC Fight Night : Tuivasa vs. Tybura" },
  ],
  // Jacqueline Cavalcanti
  f168: [
    { opponent: "Ketlen Vieira", result: "D", method: "Décision unanime", event: "UFC Fight Night : Allen vs. Costa" },
    { opponent: "Mayra Bueno Silva", result: "V", method: "Décision unanime", event: "UFC Fight Night : Bonfim vs. Brown" },
    { opponent: "Julia Avila", result: "V", method: "Décision unanime", event: "UFC Fight Night : Cannonier vs. Rodrigues" },
    { opponent: "Nora Cornolle", result: "V", method: "Décision partagée", event: "UFC Fight Night : Moicano vs. Saint Denis" },
    { opponent: "Josiane Nunes", result: "V", method: "Décision partagée", event: "UFC on ESPN : Cannonier vs. Borralho" },
  ],
  // Karol Rosa
  f169: [
    { opponent: "Luana Santos", result: "D", method: "Décision unanime", event: "UFC Fight Night : Kape vs. Horiguchi" },
    { opponent: "Nora Cornolle", result: "V", method: "Décision unanime", event: "UFC on ESPN : Taira vs. Park" },
    { opponent: "Ailín Pérez", result: "D", method: "Décision unanime", event: "UFC 311" },
    { opponent: "Pannie Kianzad", result: "V", method: "Décision unanime", event: "UFC on ESPN : Tybura vs. Spivac 2" },
    { opponent: "Irene Aldana", result: "D", method: "Décision unanime", event: "UFC 296" },
  ],
  // Beatriz Mesquita
  f170: [
    { opponent: "Melissa Mullins", result: "V", method: "Soumission", event: "UFC Fight Night : Kape vs. Horiguchi" },
    { opponent: "Montserrat Rendón", result: "V", method: "Soumission", event: "UFC Fight Night : Emmett vs. Vallejos" },
    { opponent: "Irina Alekseeva", result: "V", method: "Soumission", event: "UFC Fight Night : Oliveira vs. Gamrot" },
    { opponent: "Sierra Dinwoodie", result: "V", method: "TKO", event: "LFA 211" },
    { opponent: "Hope Chase", result: "V", method: "Disqualification", event: "LFA 203" },
  ],
  // Michelle Montague
  f171: [
    { opponent: "Mayra Bueno Silva", result: "V", method: "Décision unanime", event: "UFC Fight Night : Sterling vs. Zalal" },
    { opponent: "Luana Carolina", result: "V", method: "Décision unanime", event: "UFC Fight Night : Ulberg vs. Reyes" },
    { opponent: "Marília Morais", result: "V", method: "Soumission", event: "PFL 8 (2024)" },
    { opponent: "Karolina Sobek", result: "V", method: "Soumission", event: "Bellator Champions Series : Dublin" },
    { opponent: "Abigail Montes", result: "V", method: "Soumission", event: "PFL 9 (2023)" },
  ],
  // Nora Cornolle
  f172: [
    { opponent: "Klaudia Syguła", result: "V", method: "Décision unanime", event: "UFC Paris : Hooker vs. Parnasse" },
    { opponent: "Joselyne Edwards", result: "D", method: "Soumission", event: "UFC Fight Night : Strickland vs. Hernandez" },
    { opponent: "Karol Rosa", result: "D", method: "Décision unanime", event: "UFC on ESPN : Taira vs. Park" },
    { opponent: "Hailey Cowan", result: "V", method: "Soumission", event: "UFC 314" },
    { opponent: "Jacqueline Cavalcanti", result: "D", method: "Décision partagée", event: "UFC Fight Night : Moicano vs. Saint Denis" },
  ],
  // Miesha Tate
  f173: [
    { opponent: "Yana Santos", result: "D", method: "Décision unanime", event: "UFC on ESPN : Sandhagen vs. Figueiredo" },
    { opponent: "Julia Avila", result: "V", method: "Soumission", event: "UFC on ESPN : Dariush vs. Tsarukyan" },
    { opponent: "Lauren Murphy", result: "D", method: "Décision unanime", event: "UFC on ABC : Ortega vs. Rodríguez" },
    { opponent: "Ketlen Vieira", result: "D", method: "Décision unanime", event: "UFC Fight Night : Vieira vs. Tate" },
    { opponent: "Marion Reneau", result: "V", method: "TKO", event: "UFC on ESPN : Makhachev vs. Moisés" },
  ],
  // Melissa Croden
  f174: [
    { opponent: "Chelsea Chandler", result: "D", method: "Soumission", event: "UFC Fight Night : Buckley vs. Malott" },
    { opponent: "Darya Zheleznyakova", result: "V", method: "Décision unanime", event: "UFC Fight Night : Burns vs. Malott" },
    { opponent: "Luana Santos", result: "D", method: "Décision unanime", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Tainara Lisboa", result: "V", method: "TKO", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "Ashley Deen", result: "V", method: "TKO", event: "LFA 195" },
  ],
  // Chelsea Chandler
  f175: [
    { opponent: "Melissa Croden", result: "V", method: "Soumission", event: "UFC Fight Night : Buckley vs. Malott" },
    { opponent: "Priscila Cachoeira", result: "V", method: "Soumission", event: "UFC Fight Night : Muhammad vs. Bonfim" },
    { opponent: "Joselyne Edwards", result: "D", method: "TKO", event: "UFC on ESPN : Machado Garry vs. Prates" },
    { opponent: "Yana Santos", result: "D", method: "Décision unanime", event: "UFC on ESPN : Tybura vs. Spivac 2" },
    { opponent: "Josiane Nunes", result: "V", method: "Décision unanime", event: "UFC Fight Night : Tuivasa vs. Tybura" },
  ],
  // Alice Pereira
  f176: [
    { opponent: "Darya Zheleznyakova", result: "V", method: "TKO", event: "UFC Fight Night : Allen vs. Duncan" },
    { opponent: "Hailey Cowan", result: "V", method: "KO", event: "UFC Fight Night : Moicano vs. Duncan" },
    { opponent: "Montserrat Rendón", result: "D", method: "Décision partagée", event: "Noche UFC : Lopes vs. Silva" },
  ],
  // Alexa Grasso
  f177: [
    { opponent: "Manon Fiorot", result: "V", method: "Décision unanime", event: "Noche UFC : Silva vs. Delgado" },
    { opponent: "Maycee Barber", result: "V", method: "KO", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Natália Silva", result: "D", method: "Décision unanime", event: "UFC 315" },
    { opponent: "Valentina Shevchenko", result: "D", method: "Décision unanime", event: "UFC 306" },
    { opponent: "Valentina Shevchenko", result: "N", method: "Match nul partagé", event: "Noche UFC 2023" },
  ],
  // Manon Fiorot
  f178: [
    { opponent: "Alexa Grasso", result: "D", method: "Décision unanime", event: "Noche UFC : Silva vs. Delgado" },
    { opponent: "Jasmine Jasudavicius", result: "V", method: "TKO", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "Valentina Shevchenko", result: "D", method: "Décision unanime", event: "UFC 315" },
    { opponent: "Erin Blanchfield", result: "V", method: "Décision unanime", event: "UFC on ESPN : Blanchfield vs. Fiorot" },
    { opponent: "Rose Namajunas", result: "V", method: "Décision unanime", event: "UFC Fight Night : Gane vs. Spivac" },
  ],
  // Erin Blanchfield
  f179: [
    { opponent: "Jasmine Jasudavicius", result: "D", method: "Décision unanime", event: "UFC Fight Night : Buckley vs. Malott" },
    { opponent: "Tracy Cortez", result: "V", method: "Soumission", event: "UFC 322" },
    { opponent: "Rose Namajunas", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Albazi" },
    { opponent: "Manon Fiorot", result: "D", method: "Décision unanime", event: "UFC on ESPN : Blanchfield vs. Fiorot" },
    { opponent: "Taila Santos", result: "V", method: "Décision unanime", event: "UFC Fight Night : Holloway vs. The Korean Zombie" },
  ],
  // Rose Namajunas
  f180: [
    { opponent: "Natália Silva", result: "D", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Miranda Maverick", result: "V", method: "Décision unanime", event: "UFC on ESPN : Usman vs. Buckley" },
    { opponent: "Erin Blanchfield", result: "D", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Albazi" },
    { opponent: "Tracy Cortez", result: "V", method: "Décision unanime", event: "UFC on ESPN : Namajunas vs. Cortez" },
    { opponent: "Amanda Ribas", result: "V", method: "Décision unanime", event: "UFC on ESPN : Ribas vs. Namajunas" },
  ],
  // Maycee Barber
  f181: [
    { opponent: "Alexa Grasso", result: "D", method: "KO", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Karine Silva", result: "V", method: "Décision unanime", event: "UFC 323" },
    { opponent: "Katlyn Cerminara", result: "V", method: "Décision unanime", event: "UFC 299" },
    { opponent: "Amanda Ribas", result: "V", method: "TKO", event: "UFC on ABC : Emmett vs. Topuria" },
    { opponent: "Andrea Lee", result: "V", method: "Décision partagée", event: "UFC on ESPN : Vera vs. Sandhagen" },
  ],
  // Jasmine Jasudavicius
  f182: [
    { opponent: "Erin Blanchfield", result: "V", method: "Décision unanime", event: "UFC Fight Night : Buckley vs. Malott" },
    { opponent: "Karine Silva", result: "V", method: "Décision unanime", event: "UFC Fight Night : Burns vs. Malott" },
    { opponent: "Manon Fiorot", result: "D", method: "TKO", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "Jéssica Andrade", result: "V", method: "Soumission", event: "UFC 315" },
    { opponent: "Mayra Bueno Silva", result: "V", method: "Décision unanime", event: "UFC Fight Night : Adesanya vs. Imavov" },
  ],
  // Wang Cong
  f183: [
    { opponent: "Natália Silva", result: "D", method: "Décision unanime", event: "UFC 332" },
    { opponent: "Tracy Cortez", result: "V", method: "Décision unanime", event: "UFC 329" },
    { opponent: "Eduarda Moura", result: "V", method: "Décision unanime", event: "UFC Fight Night : Bautista vs. Oliveira" },
    { opponent: "Ariane da Silva", result: "V", method: "Décision unanime", event: "UFC 316" },
    { opponent: "Bruna Brasil", result: "V", method: "Décision unanime", event: "UFC 312" },
  ],
  // Tracy Cortez
  f184: [
    { opponent: "Wang Cong", result: "D", method: "Décision unanime", event: "UFC 329" },
    { opponent: "Erin Blanchfield", result: "D", method: "Soumission", event: "UFC 322" },
    { opponent: "Viviane Araújo", result: "V", method: "Décision unanime", event: "UFC 317" },
    { opponent: "Rose Namajunas", result: "D", method: "Décision unanime", event: "UFC on ESPN : Namajunas vs. Cortez" },
    { opponent: "Jasmine Jasudavicius", result: "V", method: "Décision unanime", event: "Noche UFC 2023" },
  ],
  // Miranda Maverick
  f185: [
    { opponent: "Rose Namajunas", result: "D", method: "Décision unanime", event: "UFC on ESPN : Usman vs. Buckley" },
    { opponent: "Jamey-Lyn Horth", result: "V", method: "Décision unanime", event: "UFC on ESPN : Covington vs. Buckley" },
    { opponent: "Dione Barbosa", result: "V", method: "Décision unanime", event: "UFC on ESPN : Lemos vs. Jandiroba" },
    { opponent: "Andrea Lee", result: "V", method: "Décision unanime", event: "UFC 298" },
    { opponent: "Priscila Cachoeira", result: "V", method: "Soumission", event: "UFC 291" },
  ],
  // Karine Silva
  f186: [
    { opponent: "Jasmine Jasudavicius", result: "D", method: "Décision unanime", event: "UFC Fight Night : Burns vs. Malott" },
    { opponent: "Maycee Barber", result: "D", method: "Décision unanime", event: "UFC 323" },
    { opponent: "Dione Barbosa", result: "V", method: "Décision unanime", event: "UFC 319" },
    { opponent: "Viviane Araújo", result: "D", method: "Décision unanime", event: "UFC 309" },
    { opponent: "Ariane da Silva", result: "V", method: "Décision unanime", event: "UFC on ESPN : Nicolau vs. Perez" },
  ],
  // Casey O'Neill
  f187: [
    { opponent: "Eduarda Moura", result: "V", method: "Soumission", event: "UFC 331" },
    { opponent: "Gabriella Fernandes", result: "V", method: "KO", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Luana Santos", result: "V", method: "Décision unanime", event: "UFC 305" },
    { opponent: "Ariane da Silva", result: "D", method: "Soumission", event: "UFC 296" },
    { opponent: "Jennifer Maia", result: "D", method: "Décision unanime", event: "UFC 286" },
  ],
  // Eduarda Moura
  f188: [
    { opponent: "Casey O'Neill", result: "D", method: "Soumission", event: "UFC 331" },
    { opponent: "Wang Cong", result: "D", method: "Décision unanime", event: "UFC Fight Night : Bautista vs. Oliveira" },
    { opponent: "Lauren Murphy", result: "V", method: "Décision unanime", event: "UFC on ESPN : Lewis vs. Teixeira" },
    { opponent: "Veronica Hardy", result: "V", method: "Décision unanime", event: "UFC 309" },
    { opponent: "Denise Gomes", result: "D", method: "Décision partagée", event: "UFC on ESPN : Cannonier vs. Imavov" },
  ],
  // Gabriella Fernandes
  f189: [
    { opponent: "Casey O'Neill", result: "D", method: "KO", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Julija Stoliarenko", result: "V", method: "Décision unanime", event: "UFC on ESPN : Dolidze vs. Hernandez" },
    { opponent: "Wang Cong", result: "V", method: "Soumission", event: "UFC Fight Night : Yan vs. Figueiredo" },
    { opponent: "Carli Judice", result: "V", method: "Décision partagée", event: "UFC on ESPN : Perez vs. Taira" },
    { opponent: "Tereza Bleda", result: "D", method: "Décision unanime", event: "UFC on ESPN : Vettori vs. Cannonier" },
  ],
  // Regina Tarin
  f190: [
    { opponent: "J.J. Aldrich", result: "V", method: "Décision unanime", event: "Noche UFC : Silva vs. Delgado" },
    { opponent: "Ernesta Kareckaitė", result: "V", method: "Décision unanime", event: "UFC Fight Night : Moreno vs. Kavanagh" },
    { opponent: "Yurivia Jiménez", result: "V", method: "KO", event: "Tough N Xtreme 1125" },
    { opponent: "Kaytlin Neil", result: "V", method: "TKO", event: "Combate Global : Combate Female 2" },
    { opponent: "Luisa Fernanda Cifuentes", result: "V", method: "TKO", event: "Budo Sento Championship 25" },
  ],
  // Carli Judice
  f191: [
    { opponent: "Jeisla Chaves", result: "V", method: "TKO", event: "UFC Fight Night : Hernandez vs. Rodrigues" },
    { opponent: "Juliana Miller", result: "V", method: "Décision unanime", event: "UFC Fight Night : Strickland vs. Hernandez" },
    { opponent: "Nicolle Caliari", result: "V", method: "TKO", event: "UFC 318" },
    { opponent: "Yuneisy Duben", result: "V", method: "TKO", event: "UFC Fight Night : Vettori vs. Dolidze 2" },
    { opponent: "Gabriella Fernandes", result: "D", method: "Décision partagée", event: "UFC on ESPN : Perez vs. Taira" },
  ],
  // Zhang Weili
  f192: [
    { opponent: "Valentina Shevchenko", result: "D", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Tatiana Suarez", result: "V", method: "Décision unanime", event: "UFC 312" },
    { opponent: "Yan Xiaonan", result: "V", method: "Décision unanime", event: "UFC 300" },
    { opponent: "Amanda Lemos", result: "V", method: "Décision unanime", event: "UFC 292" },
    { opponent: "Carla Esparza", result: "V", method: "Soumission", event: "UFC 281" },
  ],
  // Tatiana Suarez
  f193: [
    { opponent: "Loopy Godínez", result: "V", method: "Soumission", event: "UFC 327" },
    { opponent: "Amanda Lemos", result: "V", method: "Décision unanime", event: "Noche UFC : Lopes vs. Silva" },
    { opponent: "Zhang Weili", result: "D", method: "Décision unanime", event: "UFC 312" },
    { opponent: "Jéssica Andrade", result: "V", method: "Soumission", event: "UFC on ESPN : Sandhagen vs. Font" },
    { opponent: "Montana De La Rosa", result: "V", method: "Soumission", event: "UFC Fight Night : Muniz vs. Allen" },
  ],
  // Denise Gomes
  f194: [
    { opponent: "Yan Xiaonan", result: "V", method: "KO", event: "UFC Fight Night : Nurmagomedov vs. Song" },
    { opponent: "Tecia Pennington", result: "V", method: "Décision unanime", event: "UFC Fight Night : Bonfim vs. Brown" },
    { opponent: "Elise Reed", result: "V", method: "TKO", event: "UFC Fight Night : Burns vs. Morales" },
    { opponent: "Karolina Kowalkiewicz", result: "V", method: "Décision unanime", event: "UFC Fight Night : Magny vs. Prates" },
    { opponent: "Eduarda Moura", result: "V", method: "Décision partagée", event: "UFC on ESPN : Cannonier vs. Imavov" },
  ],
  // Gillian Robertson
  f195: [
    { opponent: "Mackenzie Dern", result: "D", method: "Décision unanime", event: "UFC 330" },
    { opponent: "Amanda Lemos", result: "V", method: "Décision unanime", event: "UFC Fight Night : Emmett vs. Vallejos" },
    { opponent: "Marina Rodriguez", result: "V", method: "TKO", event: "UFC on ESPN : Sandhagen vs. Figueiredo" },
    { opponent: "Luana Pinheiro", result: "V", method: "Décision unanime", event: "UFC Fight Night : Magny vs. Prates" },
    { opponent: "Michelle Waterson-Gomez", result: "V", method: "Décision unanime", event: "UFC 303" },
  ],
  // Yan Xiaonan
  f196: [
    { opponent: "Denise Gomes", result: "D", method: "KO", event: "UFC Fight Night : Nurmagomedov vs. Song" },
    { opponent: "Virna Jandiroba", result: "D", method: "Décision unanime", event: "UFC 314" },
    { opponent: "Tabatha Ricci", result: "V", method: "Décision unanime", event: "UFC Fight Night : Yan vs. Figueiredo" },
    { opponent: "Zhang Weili", result: "D", method: "Décision unanime", event: "UFC 300" },
    { opponent: "Jéssica Andrade", result: "V", method: "KO", event: "UFC 288" },
  ],
  // Fatima Kline
  f197: [
    { opponent: "Tabatha Ricci", result: "V", method: "Décision unanime", event: "UFC Fight Night : Du Plessis vs. Usman" },
    { opponent: "Angela Hill", result: "V", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Melissa Martinez", result: "V", method: "TKO", event: "UFC on ESPN : Lewis vs. Teixeira" },
    { opponent: "Viktoriia Dudakova", result: "V", method: "TKO", event: "UFC Fight Night : Dern vs. Ribas 2" },
    { opponent: "Jasmine Jasudavicius", result: "D", method: "Décision unanime", event: "UFC on ESPN : Namajunas vs. Cortez" },
  ],
  // Loopy Godinez
  f198: [
    { opponent: "Ketlen Souza", result: "V", method: "Décision unanime", event: "UFC Fight Night : Allen vs. Duncan" },
    { opponent: "Tatiana Suarez", result: "D", method: "Soumission", event: "UFC 327" },
    { opponent: "Jéssica Andrade", result: "V", method: "Décision unanime", event: "UFC 319" },
    { opponent: "Julia Polastri", result: "V", method: "Décision unanime", event: "UFC on ESPN : Moreno vs. Erceg" },
    { opponent: "Mackenzie Dern", result: "D", method: "Décision unanime", event: "UFC on ABC : Sandhagen vs. Nurmagomedov" },
  ],
  // Alexia Thainara
  f199: [
    { opponent: "Amanda Lemos", result: "V", method: "Décision unanime", event: "UFC Fight Night : Gamrot vs. Salkilld" },
    { opponent: "Bruna Brasil", result: "V", method: "Décision unanime", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Loma Lookboonmee", result: "V", method: "Décision unanime", event: "UFC Fight Night : Ulberg vs. Reyes" },
    { opponent: "Molly McCann", result: "V", method: "Soumission", event: "UFC Fight Night : Edwards vs. Brady" },
    { opponent: "Rose Conceição", result: "V", method: "Décision unanime", event: "Dana White's Contender Series 73" },
  ],
  // Jéssica Andrade
  f200: [
    { opponent: "Loopy Godínez", result: "D", method: "Décision unanime", event: "UFC 319" },
    { opponent: "Jasmine Jasudavicius", result: "D", method: "Soumission", event: "UFC 315" },
    { opponent: "Natália Silva", result: "D", method: "Décision unanime", event: "UFC Fight Night : Burns vs. Brady" },
    { opponent: "Marina Rodriguez", result: "V", method: "Décision partagée", event: "UFC 300" },
    { opponent: "Mackenzie Dern", result: "V", method: "TKO", event: "UFC 295" },
  ],
  // Tabatha Ricci
  f201: [
    { opponent: "Fatima Kline", result: "D", method: "Décision unanime", event: "UFC Fight Night : Du Plessis vs. Usman" },
    { opponent: "Virna Jandiroba", result: "D", method: "Décision unanime", event: "UFC Fight Night : Moicano vs. Duncan" },
    { opponent: "Amanda Ribas", result: "V", method: "TKO", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Yan Xiaonan", result: "D", method: "Décision unanime", event: "UFC Fight Night : Yan vs. Figueiredo" },
    { opponent: "Angela Hill", result: "V", method: "Décision unanime", event: "UFC on ESPN : Cannonier vs. Borralho" },
  ],
  // Amanda Lemos
  f202: [
    { opponent: "Alexia Thainara", result: "D", method: "Décision unanime", event: "UFC Fight Night : Gamrot vs. Salkilld" },
    { opponent: "Gillian Robertson", result: "D", method: "Décision unanime", event: "UFC Fight Night : Emmett vs. Vallejos" },
    { opponent: "Tatiana Suarez", result: "D", method: "Décision unanime", event: "Noche UFC : Lopes vs. Silva" },
    { opponent: "Iasmin Lucindo", result: "V", method: "Décision unanime", event: "UFC 313" },
    { opponent: "Virna Jandiroba", result: "D", method: "Soumission", event: "UFC on ESPN : Lemos vs. Jandiroba" },
  ],
  // Amanda Ribas
  f203: [
    { opponent: "Tabatha Ricci", result: "D", method: "TKO", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Mackenzie Dern", result: "D", method: "Soumission", event: "UFC Fight Night : Dern vs. Ribas 2" },
    { opponent: "Rose Namajunas", result: "D", method: "Décision unanime", event: "UFC on ESPN : Ribas vs. Namajunas" },
    { opponent: "Luana Pinheiro", result: "V", method: "TKO", event: "UFC Fight Night : Allen vs. Craig" },
    { opponent: "Maycee Barber", result: "D", method: "TKO", event: "UFC on ABC : Emmett vs. Topuria" },
  ],
  // Angela Hill
  f204: [
    { opponent: "Xiong Jingnan", result: "V", method: "Décision unanime", event: "UFC Fight Night : Song vs. Figueiredo" },
    { opponent: "Fatima Kline", result: "D", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Iasmin Lucindo", result: "D", method: "Décision unanime", event: "UFC on ESPN : Dolidze vs. Hernandez" },
    { opponent: "Ketlen Souza", result: "V", method: "Décision partagée", event: "UFC Fight Night : Cannonier vs. Rodrigues" },
    { opponent: "Tabatha Ricci", result: "D", method: "Décision unanime", event: "UFC on ESPN : Cannonier vs. Borralho" },
  ],
  // Mizuki Inoue
  f205: [
    { opponent: "Jaqueline Amorim", result: "V", method: "Décision unanime", event: "UFC 321" },
    { opponent: "Hannah Goldy", result: "V", method: "Décision unanime", event: "UFC Fight Night : Fiziev vs. Gamrot" },
    { opponent: "Amanda Lemos", result: "D", method: "Décision unanime", event: "UFC on ESPN : Munhoz vs. Edgar" },
    { opponent: "Wu Yanan", result: "V", method: "Décision partagée", event: "UFC Fight Night : Andrade vs. Zhang" },
    { opponent: "Viviane Pereira", result: "V", method: "Décision unanime", event: "Invicta FC 32" },
  ],
  // Piera Rodriguez
  f206: [
    { opponent: "Sam Hughes", result: "V", method: "Décision unanime", event: "UFC Fight Night : Emmett vs. Vallejos" },
    { opponent: "Ketlen Souza", result: "V", method: "Décision partagée", event: "UFC on ESPN : Taira vs. Park" },
    { opponent: "Josefine Knutsson", result: "V", method: "Décision unanime", event: "UFC on ESPN : Covington vs. Buckley" },
    { opponent: "Ariane Carnelossi", result: "D", method: "Disqualification", event: "UFC Fight Night : Barboza vs. Murphy" },
    { opponent: "Gillian Robertson", result: "D", method: "Soumission", event: "UFC on ESPN : Holloway vs. Allen" },
  ],
  // Talita Alencar
  f207: [
    { opponent: "Julia Polastri", result: "V", method: "Décision unanime", event: "UFC Fight Night : Sterling vs. Zalal" },
    { opponent: "Ariane Carnelossi", result: "V", method: "Soumission", event: "UFC Fight Night : Garcia vs. Onama" },
    { opponent: "Vanessa Demopoulos", result: "V", method: "Décision unanime", event: "UFC on ESPN : Emmett vs. Murphy" },
    { opponent: "Stephanie Luciano", result: "D", method: "Décision unanime", event: "UFC on ESPN : Tybura vs. Spivac 2" },
    { opponent: "Rayanne dos Santos", result: "V", method: "Décision partagée", event: "UFC Fight Night : Song vs. Gutiérrez" },
  ],
};
