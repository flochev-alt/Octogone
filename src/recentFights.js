// 5 derniers combats vérifiés (du plus récent au plus ancien), par id de combattant.
// Sources croisées : ufc.com (fiche athlète) + Wikipédia (tableau "Mixed martial arts record").
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
  // Rizvan Kuniev
  f043: [
    { opponent: "Alexander Volkov", result: "D", method: "Décision unanime", event: "UFC 333" },
    { opponent: "Tyrell Fortune", result: "V", method: "TKO", event: "UFC Fight Night : Ankalaev vs. Guskov" },
    { opponent: "Jailton Almeida", result: "V", method: "Décision unanime", event: "UFC Fight Night : Bautista vs. Oliveira" },
    { opponent: "Curtis Blaydes", result: "D", method: "Décision partagée", event: "UFC on ABC : Hill vs. Rountree Jr." },
    { opponent: "Hugo Cunha", result: "V", method: "TKO", event: "Dana White's Contender Series 68" },
  ],
  // Alexander Volkov
  f048: [
    { opponent: "Rizvan Kuniev", result: "V", method: "Décision unanime", event: "UFC 333" },
    { opponent: "Waldo Cortes-Acosta", result: "V", method: "Décision unanime", event: "UFC 328" },
    { opponent: "Jailton Almeida", result: "V", method: "Décision partagée", event: "UFC 321" },
    { opponent: "Ciryl Gane", result: "D", method: "Décision partagée", event: "UFC 310" },
    { opponent: "Sergei Pavlovich", result: "V", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. Aliskerov" },
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
  // Joe Pyfer
  f077: [
    { opponent: "Israel Adesanya", result: "V", method: "TKO", event: "UFC Fight Night : Adesanya vs. Pyfer" },
    { opponent: "Abusupiyan Magomedov", result: "V", method: "Soumission", event: "UFC 320" },
    { opponent: "Kelvin Gastelum", result: "V", method: "Décision unanime", event: "UFC 316" },
    { opponent: "Marc-André Barriault", result: "V", method: "KO", event: "UFC 303" },
    { opponent: "Jack Hermansson", result: "D", method: "Décision unanime", event: "UFC Fight Night : Hermansson vs. Pyfer" },
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
  // Sean Brady
  f093: [
    { opponent: "Joaquin Buckley", result: "V", method: "Décision unanime", event: "UFC 328" },
    { opponent: "Michael Morales", result: "D", method: "TKO", event: "UFC 322" },
    { opponent: "Leon Edwards", result: "V", method: "Soumission", event: "UFC Fight Night : Edwards vs. Brady" },
    { opponent: "Gilbert Burns", result: "V", method: "Décision unanime", event: "UFC Fight Night : Burns vs. Brady" },
    { opponent: "Kelvin Gastelum", result: "V", method: "Soumission", event: "UFC on ESPN : Dariush vs. Tsarukyan" },
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
  // Sean O'Malley
  f131: [
    { opponent: "Aiemann Zahabi", result: "V", method: "TKO", event: "UFC Freedom 250" },
    { opponent: "Song Yadong", result: "V", method: "Décision unanime", event: "UFC 324" },
    { opponent: "Merab Dvalishvili", result: "D", method: "Soumission", event: "UFC 316" },
    { opponent: "Merab Dvalishvili", result: "D", method: "Décision unanime", event: "UFC 306" },
    { opponent: "Marlon Vera", result: "V", method: "Décision unanime", event: "UFC 299" },
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
  // Asu Almabayev
  f148: [
    { opponent: "Charles Johnson", result: "V", method: "Soumission", event: "UFC Fight Night : Fiziev vs. Torres" },
    { opponent: "Alex Perez", result: "V", method: "Soumission", event: "UFC Fight Night : Tsarukyan vs. Hooker" },
    { opponent: "Jose Ochoa", result: "V", method: "Décision unanime", event: "UFC on ABC : Whittaker vs. de Ridder" },
    { opponent: "Manel Kape", result: "D", method: "TKO", event: "UFC Fight Night : Kape vs. Almabayev" },
    { opponent: "Matheus Nicolau", result: "V", method: "Décision unanime", event: "UFC Fight Night : Hernandez vs. Pereira" },
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
  // Luana Santos
  f166: [
    { opponent: "Karol Rosa", result: "V", method: "Décision unanime", event: "UFC Fight Night : Kape vs. Horiguchi" },
    { opponent: "Melissa Croden", result: "V", method: "Décision unanime", event: "UFC on ESPN : Royval vs. Kape" },
    { opponent: "Tainara Lisboa", result: "V", method: "Soumission", event: "UFC Fight Night : Burns vs. Morales" },
    { opponent: "Casey O'Neill", result: "D", method: "Décision unanime", event: "UFC 305" },
    { opponent: "Mariya Agapova", result: "V", method: "Soumission", event: "UFC on ESPN : Namajunas vs. Cortez" },
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
  // Jasmine Jasudavicius
  f182: [
    { opponent: "Erin Blanchfield", result: "V", method: "Décision unanime", event: "UFC Fight Night : Buckley vs. Malott" },
    { opponent: "Karine Silva", result: "V", method: "Décision unanime", event: "UFC Fight Night : Burns vs. Malott" },
    { opponent: "Manon Fiorot", result: "D", method: "TKO", event: "UFC Fight Night : de Ridder vs. Allen" },
    { opponent: "Jéssica Andrade", result: "V", method: "Soumission", event: "UFC 315" },
    { opponent: "Mayra Bueno Silva", result: "V", method: "Décision unanime", event: "UFC Fight Night : Adesanya vs. Imavov" },
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
};
