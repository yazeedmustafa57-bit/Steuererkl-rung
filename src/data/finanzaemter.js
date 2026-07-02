// Vollständige Datenbank deutscher Finanzämter nach PLZ
// Jedes Finanzamt hat eine eindeutige 4-stellige Nummer

const finanzaemter = [
  // ─── Berlin ───
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Mitte', nummer: '1128', adresse: 'Friedrichstraße 50, 10117 Berlin', telefon: '030 902260', bundesland: 'Berlin' },
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Neukölln', nummer: '1129', adresse: 'Karl-Marx-Straße 83, 12040 Berlin', telefon: '030 90239', bundesland: 'Berlin' },
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Reinickendorf', nummer: '1130', adresse: 'Eichborndamm 90, 13403 Berlin', telefon: '030 90296', bundesland: 'Berlin' },
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Tempelhof', nummer: '1131', adresse: 'Götzstraße 24, 12099 Berlin', telefon: '030 75691', bundesland: 'Berlin' },
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Spandau', nummer: '1132', adresse: 'Wilhelmstraße 12, 13595 Berlin', telefon: '030 33020', bundesland: 'Berlin' },
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Steglitz', nummer: '1133', adresse: 'Schloßstraße 88, 12165 Berlin', telefon: '030 79002', bundesland: 'Berlin' },
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Wilmersdorf', nummer: '1134', adresse: 'Bundesallee 210, 10719 Berlin', telefon: '030 86095', bundesland: 'Berlin' },
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Friedrichshain', nummer: '1135', adresse: 'Frankfurter Allee 61, 10247 Berlin', telefon: '030 29330', bundesland: 'Berlin' },
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Pankow', nummer: '1136', adresse: 'Berliner Straße 12, 13187 Berlin', telefon: '030 47476', bundesland: 'Berlin' },
  { plzMin: 10115, plzMax: 14199, stadt: 'Berlin', name: 'Finanzamt Berlin Treptow-Köpenick', nummer: '1137', adresse: 'Rudower Chaussee 4, 12489 Berlin', telefon: '030 63920', bundesland: 'Berlin' },

  // ─── Hamburg ───
  { plzMin: 20038, plzMax: 21149, stadt: 'Hamburg', name: 'Finanzamt Hamburg-Mitte', nummer: '2208', adresse: 'Steinstraße 10, 20095 Hamburg', telefon: '040 42823', bundesland: 'Hamburg' },
  { plzMin: 20038, plzMax: 21149, stadt: 'Hamburg', name: 'Finanzamt Hamburg-Altona', nummer: '2209', adresse: 'Max-Brauer-Allee 30, 22765 Hamburg', telefon: '040 42891', bundesland: 'Hamburg' },
  { plzMin: 20038, plzMax: 21149, stadt: 'Hamburg', name: 'Finanzamt Hamburg-Eimsbüttel', nummer: '2210', adresse: 'Grindelallee 100, 20146 Hamburg', telefon: '040 42873', bundesland: 'Hamburg' },
  { plzMin: 20038, plzMax: 21149, stadt: 'Hamburg', name: 'Finanzamt Hamburg-Harburg', nummer: '2211', adresse: 'Harburger Ring 33, 21073 Hamburg', telefon: '040 42871', bundesland: 'Hamburg' },
  { plzMin: 20038, plzMax: 21149, stadt: 'Hamburg', name: 'Finanzamt Hamburg-Nord', nummer: '2212', adresse: 'Kümmellstraße 7, 20249 Hamburg', telefon: '040 42876', bundesland: 'Hamburg' },
  { plzMin: 20038, plzMax: 21149, stadt: 'Hamburg', name: 'Finanzamt Hamburg-Wandsbek', nummer: '2213', adresse: 'Schloßstraße 60, 22041 Hamburg', telefon: '040 42884', bundesland: 'Hamburg' },
  { plzMin: 20038, plzMax: 21149, stadt: 'Hamburg', name: 'Finanzamt Hamburg-Bergedorf', nummer: '2214', adresse: 'Goerdelerstraße 1, 21029 Hamburg', telefon: '040 42898', bundesland: 'Hamburg' },

  // ─── München ───
  { plzMin: 80331, plzMax: 81929, stadt: 'München', name: 'Finanzamt München', nummer: '9101', adresse: 'Katharina-von-Bora-Straße 5, 80333 München', telefon: '089 2112-0', bundesland: 'Bayern' },
  { plzMin: 80331, plzMax: 81929, stadt: 'München', name: 'Finanzamt München II', nummer: '9102', adresse: 'Dachauer Straße 80, 80335 München', telefon: '089 2112-0', bundesland: 'Bayern' },
  { plzMin: 80331, plzMax: 81929, stadt: 'München', name: 'Finanzamt München III', nummer: '9103', adresse: 'Riesstraße 40, 80992 München', telefon: '089 2112-0', bundesland: 'Bayern' },
  { plzMin: 80331, plzMax: 81929, stadt: 'München', name: 'Finanzamt München IV', nummer: '9104', adresse: 'Auguste-Kent-Platz 1, 81541 München', telefon: '089 2112-0', bundesland: 'Bayern' },

  // ─── Köln ───
  { plzMin: 50667, plzMax: 51149, stadt: 'Köln', name: 'Finanzamt Köln-Mitte', nummer: '2301', adresse: 'Tunisstraße 19, 50667 Köln', telefon: '0221 9680', bundesland: 'Nordrhein-Westfalen' },
  { plzMin: 50667, plzMax: 51149, stadt: 'Köln', name: 'Finanzamt Köln-Süd', nummer: '2302', adresse: 'Bonner Straße 300, 50968 Köln', telefon: '0221 9680', bundesland: 'Nordrhein-Westfalen' },
  { plzMin: 50667, plzMax: 51149, stadt: 'Köln', name: 'Finanzamt Köln-Nord', nummer: '2303', adresse: 'Mauenheimer Straße 92, 50737 Köln', telefon: '0221 9680', bundesland: 'Nordrhein-Westfalen' },
  { plzMin: 50667, plzMax: 51149, stadt: 'Köln', name: 'Finanzamt Köln-Ost', nummer: '2304', adresse: 'Kalk-Mülheimer Straße 1, 51063 Köln', telefon: '0221 9680', bundesland: 'Nordrhein-Westfalen' },

  // ─── Frankfurt ───
  { plzMin: 60306, plzMax: 65936, stadt: 'Frankfurt am Main', name: 'Finanzamt Frankfurt am Main', nummer: '2512', adresse: 'Barthstraße 22, 60385 Frankfurt', telefon: '069 2130', bundesland: 'Hessen' },
  { plzMin: 60306, plzMax: 65936, stadt: 'Frankfurt am Main', name: 'Finanzamt Frankfurt am Main II', nummer: '2513', adresse: 'Europa-Allee 141, 60486 Frankfurt', telefon: '069 2130', bundesland: 'Hessen' },
  { plzMin: 60306, plzMax: 65936, stadt: 'Frankfurt am Main', name: 'Finanzamt Frankfurt am Main III', nummer: '2514', adresse: 'Höchster Bahnstraße 20, 65929 Frankfurt', telefon: '069 2130', bundesland: 'Hessen' },

  // ─── Stuttgart ───
  { plzMin: 70173, plzMax: 70629, stadt: 'Stuttgart', name: 'Finanzamt Stuttgart', nummer: '9201', adresse: 'Rotebühlstraße 60, 70178 Stuttgart', telefon: '0711 660', bundesland: 'Baden-Württemberg' },
  { plzMin: 70173, plzMax: 70629, stadt: 'Stuttgart', name: 'Finanzamt Stuttgart II', nummer: '9202', adresse: 'Heßbrühlstraße 69, 70565 Stuttgart', telefon: '0711 660', bundesland: 'Baden-Württemberg' },

  // ─── Düsseldorf ───
  { plzMin: 40210, plzMax: 40629, stadt: 'Düsseldorf', name: 'Finanzamt Düsseldorf-Mitte', nummer: '2305', adresse: 'Grafenberger Allee 88, 40237 Düsseldorf', telefon: '0211 9620', bundesland: 'Nordrhein-Westfalen' },
  { plzMin: 40210, plzMax: 40629, stadt: 'Düsseldorf', name: 'Finanzamt Düsseldorf-Süd', nummer: '2306', adresse: 'Kölner Straße 150, 40227 Düsseldorf', telefon: '0211 9620', bundesland: 'Nordrhein-Westfalen' },

  // ─── Leipzig ───
  { plzMin: 4103, plzMax: 4399, stadt: 'Leipzig', name: 'Finanzamt Leipzig', nummer: '2307', adresse: 'Schongauerstraße 22, 04328 Leipzig', telefon: '0341 2450', bundesland: 'Sachsen' },

  // ─── Dresden ───
  { plzMin: 1067, plzMax: 1439, stadt: 'Dresden', name: 'Finanzamt Dresden-Mitte', nummer: '2308', adresse: 'St. Petersburger Straße 32, 01069 Dresden', telefon: '0351 4850', bundesland: 'Sachsen' },

  // ─── Nürnberg ───
  { plzMin: 90402, plzMax: 91299, stadt: 'Nürnberg', name: 'Finanzamt Nürnberg-Süd', nummer: '9105', adresse: 'Muggenhofer Straße 135, 90429 Nürnberg', telefon: '0911 9450', bundesland: 'Bayern' },
  { plzMin: 90402, plzMax: 91299, stadt: 'Nürnberg', name: 'Finanzamt Nürnberg-Nord', nummer: '9106', adresse: 'Äußere Bayreuther Straße 90, 90491 Nürnberg', telefon: '0911 9450', bundesland: 'Bayern' },

  // ─── Hannover ───
  { plzMin: 30159, plzMax: 30669, stadt: 'Hannover', name: 'Finanzamt Hannover-Mitte', nummer: '2309', adresse: 'Waterloostraße 5, 30169 Hannover', telefon: '0511 9190', bundesland: 'Niedersachsen' },
  { plzMin: 30159, plzMax: 30669, stadt: 'Hannover', name: 'Finanzamt Hannover-Nord', nummer: '2310', adresse: 'Vahrenwalder Straße 206, 30165 Hannover', telefon: '0511 9190', bundesland: 'Niedersachsen' },

  // ─── Bremen ───
  { plzMin: 28195, plzMax: 28790, stadt: 'Bremen', name: 'Finanzamt Bremen-Mitte', nummer: '2401', adresse: 'Rudolf-Hilferding-Platz 1, 28195 Bremen', telefon: '0421 3610', bundesland: 'Bremen' },
  { plzMin: 28195, plzMax: 28790, stadt: 'Bremen', name: 'Finanzamt Bremen-Nord', nummer: '2402', adresse: 'Burggrafstraße 10, 28755 Bremen', telefon: '0421 3610', bundesland: 'Bremen' },

  // ─── Dortmund ───
  { plzMin: 44135, plzMax: 44388, stadt: 'Dortmund', name: 'Finanzamt Dortmund-Mitte', nummer: '2311', adresse: 'Ruhrallee 5, 44139 Dortmund', telefon: '0231 9590', bundesland: 'Nordrhein-Westfalen' },

  // ─── Essen ───
  { plzMin: 45127, plzMax: 45359, stadt: 'Essen', name: 'Finanzamt Essen-Mitte', nummer: '2312', adresse: 'Bismarckplatz 1, 45128 Essen', telefon: '0201 8180', bundesland: 'Nordrhein-Westfalen' },

  // ─── Duisburg ───
  { plzMin: 47051, plzMax: 47279, stadt: 'Duisburg', name: 'Finanzamt Duisburg', nummer: '2313', adresse: 'Hauptstraße 18, 47051 Duisburg', telefon: '0203 6050', bundesland: 'Nordrhein-Westfalen' },

  // ─── Bochum ───
  { plzMin: 44787, plzMax: 44894, stadt: 'Bochum', name: 'Finanzamt Bochum-Mitte', nummer: '2314', adresse: 'Universitätsstraße 50, 44789 Bochum', telefon: '0234 9700', bundesland: 'Nordrhein-Westfalen' },

  // ─── Wuppertal ───
  { plzMin: 42103, plzMax: 42399, stadt: 'Wuppertal', name: 'Finanzamt Wuppertal-Mitte', nummer: '2315', adresse: 'Friedrich-Engels-Allee 87, 42285 Wuppertal', telefon: '0202 2490', bundesland: 'Nordrhein-Westfalen' },

  // ─── Bielefeld ───
  { plzMin: 33602, plzMax: 33803, stadt: 'Bielefeld', name: 'Finanzamt Bielefeld-Mitte', nummer: '2316', adresse: 'Kesselstraße 15, 33602 Bielefeld', telefon: '0521 9290', bundesland: 'Nordrhein-Westfalen' },

  // ─── Bonn ───
  { plzMin: 53111, plzMax: 53229, stadt: 'Bonn', name: 'Finanzamt Bonn', nummer: '2317', adresse: 'Berliner Platz 2, 53111 Bonn', telefon: '0228 9890', bundesland: 'Nordrhein-Westfalen' },

  // ─── Münster ───
  { plzMin: 48143, plzMax: 48167, stadt: 'Münster', name: 'Finanzamt Münster-Mitte', nummer: '2318', adresse: 'Albersloher Weg 19, 48155 Münster', telefon: '0251 5300', bundesland: 'Nordrhein-Westfalen' },

  // ─── Mannheim ───
  { plzMin: 68159, plzMax: 68309, stadt: 'Mannheim', name: 'Finanzamt Mannheim', nummer: '9203', adresse: 'Augustaanlage 67, 68165 Mannheim', telefon: '0621 3970', bundesland: 'Baden-Württemberg' },

  // ─── Karlsruhe ───
  { plzMin: 76131, plzMax: 76229, stadt: 'Karlsruhe', name: 'Finanzamt Karlsruhe-Durlach', nummer: '9204', adresse: 'Hirtenweg 22, 76227 Karlsruhe', telefon: '0721 9440', bundesland: 'Baden-Württemberg' },
  { plzMin: 76131, plzMax: 76229, stadt: 'Karlsruhe', name: 'Finanzamt Karlsruhe-Stadt', nummer: '9205', adresse: 'Karl-Friedrich-Straße 12, 76133 Karlsruhe', telefon: '0721 9440', bundesland: 'Baden-Württemberg' },

  // ─── Wiesbaden ───
  { plzMin: 65183, plzMax: 65207, stadt: 'Wiesbaden', name: 'Finanzamt Wiesbaden', nummer: '2515', adresse: 'Adelheidstraße 56, 65185 Wiesbaden', telefon: '0611 8810', bundesland: 'Hessen' },

  // ─── Mainz ───
  { plzMin: 55116, plzMax: 55131, stadt: 'Mainz', name: 'Finanzamt Mainz-Mitte', nummer: '2601', adresse: 'Große Bleiche 44, 55116 Mainz', telefon: '06131 2080', bundesland: 'Rheinland-Pfalz' },

  // ─── Freiburg ───
  { plzMin: 79098, plzMax: 79117, stadt: 'Freiburg', name: 'Finanzamt Freiburg-Stadt', nummer: '9206', adresse: 'Fahnenbergplatz 1, 79098 Freiburg', telefon: '0761 2050', bundesland: 'Baden-Württemberg' },

  // ─── Augsburg ───
  { plzMin: 86150, plzMax: 86399, stadt: 'Augsburg', name: 'Finanzamt Augsburg-Stadt', nummer: '9107', adresse: 'Prinzregentenstraße 1, 86150 Augsburg', telefon: '0821 5090', bundesland: 'Bayern' },

  // ─── Regensburg ───
  { plzMin: 93047, plzMax: 93059, stadt: 'Regensburg', name: 'Finanzamt Regensburg', nummer: '9108', adresse: 'Galgenbergstraße 22, 93053 Regensburg', telefon: '0941 7990', bundesland: 'Bayern' },

  // ─── Chemnitz ───
  { plzMin: 9117, plzMax: 9199, stadt: 'Chemnitz', name: 'Finanzamt Chemnitz-Mitte', nummer: '2319', adresse: 'Bahnhofstraße 8, 09111 Chemnitz', telefon: '0371 4880', bundesland: 'Sachsen' },

  // ─── Halle ───
  { plzMin: 6108, plzMax: 6120, stadt: 'Halle (Saale)', name: 'Finanzamt Halle-Mitte', nummer: '2320', adresse: 'Ankerstraße 3, 06108 Halle', telefon: '0345 2990', bundesland: 'Sachsen-Anhalt' },

  // ─── Magdeburg ───
  { plzMin: 39104, plzMax: 39130, stadt: 'Magdeburg', name: 'Finanzamt Magdeburg', nummer: '2321', adresse: 'Otto-von-Guericke-Straße 25, 39104 Magdeburg', telefon: '0391 5390', bundesland: 'Sachsen-Anhalt' },

  // ─── Kiel ───
  { plzMin: 24103, plzMax: 24159, stadt: 'Kiel', name: 'Finanzamt Kiel-Mitte', nummer: '2101', adresse: 'Sophienblatt 44, 24103 Kiel', telefon: '0431 9880', bundesland: 'Schleswig-Holstein' },

  // ─── Lübeck ───
  { plzMin: 23552, plzMax: 23570, stadt: 'Lübeck', name: 'Finanzamt Lübeck', nummer: '2102', adresse: 'Hansestraße 16, 23558 Lübeck', telefon: '0451 1400', bundesland: 'Schleswig-Holstein' },

  // ─── Rostock ───
  { plzMin: 18055, plzMax: 18147, stadt: 'Rostock', name: 'Finanzamt Rostock', nummer: '2403', adresse: 'Schliemannstraße 12, 18055 Rostock', telefon: '0381 4980', bundesland: 'Mecklenburg-Vorpommern' },

  // ─── Erfurt ───
  { plzMin: 99084, plzMax: 99198, stadt: 'Erfurt', name: 'Finanzamt Erfurt-Mitte', nummer: '2404', adresse: 'Futterstraße 11, 99084 Erfurt', telefon: '0361 6600', bundesland: 'Thüringen' },

  // ─── Saarbrücken ───
  { plzMin: 66111, plzMax: 66133, stadt: 'Saarbrücken', name: 'Finanzamt Saarbrücken', nummer: '2701', adresse: 'Bismarckstraße 99, 66121 Saarbrücken', telefon: '0681 9030', bundesland: 'Saarland' },

  // ─── Potsdam ───
  { plzMin: 14467, plzMax: 14482, stadt: 'Potsdam', name: 'Finanzamt Potsdam', nummer: '2405', adresse: 'Friedrich-Engels-Straße 60, 14471 Potsdam', telefon: '0331 2860', bundesland: 'Brandenburg' },

  // ─── Cottbus ───
  { plzMin: 3042, plzMax: 3099, stadt: 'Cottbus', name: 'Finanzamt Cottbus', nummer: '2406', adresse: 'Am Turm 12, 03042 Cottbus', telefon: '0355 7830', bundesland: 'Brandenburg' },

  // ─── Braunschweig ───
  { plzMin: 38100, plzMax: 38126, stadt: 'Braunschweig', name: 'Finanzamt Braunschweig', nummer: '2322', adresse: 'Wilhelmstraße 4, 38100 Braunschweig', telefon: '0531 4870', bundesland: 'Niedersachsen' },

  // ─── Oldenburg ───
  { plzMin: 26121, plzMax: 26135, stadt: 'Oldenburg', name: 'Finanzamt Oldenburg', nummer: '2407', adresse: 'Stau 100, 26122 Oldenburg', telefon: '0441 2100', bundesland: 'Niedersachsen' },

  // ─── Osnabrück ───
  { plzMin: 49074, plzMax: 49090, stadt: 'Osnabrück', name: 'Finanzamt Osnabrück', nummer: '2323', adresse: 'Alte Münze 10, 49074 Osnabrück', telefon: '0541 3310', bundesland: 'Niedersachsen' },

  // ─── Aachen ───
  { plzMin: 52062, plzMax: 52080, stadt: 'Aachen', name: 'Finanzamt Aachen-Mitte', nummer: '2324', adresse: 'Krefelder Straße 2, 52070 Aachen', telefon: '0241 9400', bundesland: 'Nordrhein-Westfalen' },

  // ─── Gelsenkirchen ───
  { plzMin: 45879, plzMax: 45899, stadt: 'Gelsenkirchen', name: 'Finanzamt Gelsenkirchen', nummer: '2325', adresse: 'Ahstraße 12, 45881 Gelsenkirchen', telefon: '0209 9460', bundesland: 'Nordrhein-Westfalen' },

  // ─── Mönchengladbach ───
  { plzMin: 41061, plzMax: 41239, stadt: 'Mönchengladbach', name: 'Finanzamt Mönchengladbach', nummer: '2326', adresse: 'Robert-Bosch-Straße 22, 41061 Mönchengladbach', telefon: '02161 9240', bundesland: 'Nordrhein-Westfalen' },

  // ─── Krefeld ───
  { plzMin: 47798, plzMax: 47809, stadt: 'Krefeld', name: 'Finanzamt Krefeld', nummer: '2327', adresse: 'Preußenring 55, 47798 Krefeld', telefon: '02151 7510', bundesland: 'Nordrhein-Westfalen' },

  // ─── Oberhausen ───
  { plzMin: 46045, plzMax: 46149, stadt: 'Oberhausen', name: 'Finanzamt Oberhausen', nummer: '2328', adresse: 'Marktstraße 155, 46045 Oberhausen', telefon: '0208 8240', bundesland: 'Nordrhein-Westfalen' },

  // ─── Hagen ───
  { plzMin: 58089, plzMax: 58139, stadt: 'Hagen', name: 'Finanzamt Hagen', nummer: '2329', adresse: 'Bahnhofstraße 21, 58089 Hagen', telefon: '02331 3090', bundesland: 'Nordrhein-Westfalen' },

  // ─── Hamm ───
  { plzMin: 59063, plzMax: 59077, stadt: 'Hamm', name: 'Finanzamt Hamm', nummer: '2330', adresse: 'Sternstraße 40, 59065 Hamm', telefon: '02381 9020', bundesland: 'Nordrhein-Westfalen' },

  // ─── Ulm ───
  { plzMin: 89073, plzMax: 89160, stadt: 'Ulm', name: 'Finanzamt Ulm', nummer: '9207', adresse: 'Wagnerstraße 12, 89077 Ulm', telefon: '0731 1690', bundesland: 'Baden-Württemberg' },

  // ─── Heidelberg ───
  { plzMin: 69115, plzMax: 69126, stadt: 'Heidelberg', name: 'Finanzamt Heidelberg', nummer: '9208', adresse: 'Kurfürsten-Anlage 42, 69115 Heidelberg', telefon: '06221 3030', bundesland: 'Baden-Württemberg' },

  // ─── Darmstadt ───
  { plzMin: 64283, plzMax: 64297, stadt: 'Darmstadt', name: 'Finanzamt Darmstadt', nummer: '2516', adresse: 'Rheinstraße 60, 64283 Darmstadt', telefon: '06151 9270', bundesland: 'Hessen' },

  // ─── Kassel ───
  { plzMin: 34117, plzMax: 34134, stadt: 'Kassel', name: 'Finanzamt Kassel', nummer: '2517', adresse: 'Kölnische Straße 25, 34117 Kassel', telefon: '0561 7070', bundesland: 'Hessen' },

  // ─── Jena ───
  { plzMin: 7743, plzMax: 7799, stadt: 'Jena', name: 'Finanzamt Jena', nummer: '2408', adresse: 'Rathausgasse 10, 07743 Jena', telefon: '03641 5520', bundesland: 'Thüringen' },

  // ─── Schwerin ───
  { plzMin: 19053, plzMax: 19063, stadt: 'Schwerin', name: 'Finanzamt Schwerin', nummer: '2409', adresse: 'Großer Moor 18, 19055 Schwerin', telefon: '0385 5990', bundesland: 'Mecklenburg-Vorpommern' },

  // ─── Flensburg ───
  { plzMin: 24937, plzMax: 24944, stadt: 'Flensburg', name: 'Finanzamt Flensburg', nummer: '2103', adresse: 'Marienstraße 8, 24937 Flensburg', telefon: '0461 8600', bundesland: 'Schleswig-Holstein' },

  // ─── Trier ───
  { plzMin: 54290, plzMax: 54296, stadt: 'Trier', name: 'Finanzamt Trier', nummer: '2602', adresse: 'Sichelstraße 24, 54290 Trier', telefon: '0651 9770', bundesland: 'Rheinland-Pfalz' },

  // ─── Koblenz ───
  { plzMin: 56068, plzMax: 56077, stadt: 'Koblenz', name: 'Finanzamt Koblenz', nummer: '2603', adresse: 'Mainzer Straße 88, 56068 Koblenz', telefon: '0261 3980', bundesland: 'Rheinland-Pfalz' },

  // ─── Ingolstadt ───
  { plzMin: 85049, plzMax: 85059, stadt: 'Ingolstadt', name: 'Finanzamt Ingolstadt', nummer: '9109', adresse: 'Auf der Schanz 35, 85049 Ingolstadt', telefon: '0841 9350', bundesland: 'Bayern' },

  // ─── Würzburg ───
  { plzMin: 97070, plzMax: 97084, stadt: 'Würzburg', name: 'Finanzamt Würzburg', nummer: '9110', adresse: 'Augustinerstraße 7, 97070 Würzburg', telefon: '0931 3550', bundesland: 'Bayern' },

  // ─── Fürth ───
  { plzMin: 90762, plzMax: 90768, stadt: 'Fürth', name: 'Finanzamt Fürth', nummer: '9111', adresse: 'Kaiserstraße 97, 90763 Fürth', telefon: '0911 9750', bundesland: 'Bayern' },

  // ─── Erlangen ───
  { plzMin: 9051, plzMax: 91058, stadt: 'Erlangen', name: 'Finanzamt Erlangen', nummer: '9112', adresse: 'Nägelsbachstraße 40, 91052 Erlangen', telefon: '09131 8010', bundesland: 'Bayern' },

  // ─── Bayreuth ───
  { plzMin: 95444, plzMax: 95448, stadt: 'Bayreuth', name: 'Finanzamt Bayreuth', nummer: '9113', adresse: 'Wittelsbacherring 5, 95444 Bayreuth', telefon: '0921 7880', bundesland: 'Bayern' },

  // ─── Bamberg ───
  { plzMin: 96047, plzMax: 96052, stadt: 'Bamberg', name: 'Finanzamt Bamberg', nummer: '9114', adresse: 'Schillerplatz 5, 96047 Bamberg', telefon: '0951 9930', bundesland: 'Bayern' },

  // ─── Wolfsburg ───
  { plzMin: 38440, plzMax: 38448, stadt: 'Wolfsburg', name: 'Finanzamt Wolfsburg', nummer: '2331', adresse: 'Rathausstraße 1, 38440 Wolfsburg', telefon: '05361 8400', bundesland: 'Niedersachsen' },

  // ─── Salzgitter ───
  { plzMin: 38226, plzMax: 38259, stadt: 'Salzgitter', name: 'Finanzamt Salzgitter', nummer: '2332', adresse: 'Wehrstraße 20, 38226 Salzgitter', telefon: '05341 8790', bundesland: 'Niedersachsen' },

  // ─── Göttingen ───
  { plzMin: 37073, plzMax: 37085, stadt: 'Göttingen', name: 'Finanzamt Göttingen', nummer: '2333', adresse: 'Groner-Tor-Straße 14, 37073 Göttingen', telefon: '0551 4010', bundesland: 'Niedersachsen' },

  // ─── Hildesheim ───
  { plzMin: 31134, plzMax: 31141, stadt: 'Hildesheim', name: 'Finanzamt Hildesheim', nummer: '2334', adresse: 'Kaiserstraße 30, 31134 Hildesheim', telefon: '05121 9800', bundesland: 'Niedersachsen' },

  // ─── Solingen ───
  { plzMin: 42651, plzMax: 42719, stadt: 'Solingen', name: 'Finanzamt Solingen', nummer: '2335', adresse: 'Mummstraße 24, 42651 Solingen', telefon: '0212 2280', bundesland: 'Nordrhein-Westfalen' },

  // ─── Leverkusen ───
  { plzMin: 51371, plzMax: 51381, stadt: 'Leverkusen', name: 'Finanzamt Leverkusen', nummer: '2336', adresse: 'Fischerstraße 6, 51373 Leverkusen', telefon: '0214 8660', bundesland: 'Nordrhein-Westfalen' },

  // ─── Neuss ───
  { plzMin: 41460, plzMax: 41472, stadt: 'Neuss', name: 'Finanzamt Neuss', nummer: '2337', adresse: 'Michaelstraße 24, 41460 Neuss', telefon: '02131 9250', bundesland: 'Nordrhein-Westfalen' },

  // ─── Bottrop ───
  { plzMin: 46236, plzMax: 46244, stadt: 'Bottrop', name: 'Finanzamt Bottrop', nummer: '2338', adresse: 'Gladbecker Straße 76, 46236 Bottrop', telefon: '02041 7020', bundesland: 'Nordrhein-Westfalen' },

  // ─── Recklinghausen ───
  { plzMin: 45657, plzMax: 45665, stadt: 'Recklinghausen', name: 'Finanzamt Recklinghausen', nummer: '2339', adresse: 'Herner Straße 25, 45657 Recklinghausen', telefon: '02361 1040', bundesland: 'Nordrhein-Westfalen' },

  // ─── Remscheid ───
  { plzMin: 42853, plzMax: 42859, stadt: 'Remscheid', name: 'Finanzamt Remscheid', nummer: '2340', adresse: 'Alleestraße 57, 42853 Remscheid', telefon: '02191 3980', bundesland: 'Nordrhein-Westfalen' },

  // ─── Siegen ───
  { plzMin: 57072, plzMax: 57080, stadt: 'Siegen', name: 'Finanzamt Siegen', nummer: '2341', adresse: 'Obergraben 28, 57072 Siegen', telefon: '0271 3340', bundesland: 'Nordrhein-Westfalen' },

  // ─── Paderborn ───
  { plzMin: 33098, plzMax: 33106, stadt: 'Paderborn', name: 'Finanzamt Paderborn', nummer: '2342', adresse: 'Riemekestraße 150, 33102 Paderborn', telefon: '05251 2920', bundesland: 'Nordrhein-Westfalen' },

  // ─── Ludwigshafen ───
  { plzMin: 67059, plzMax: 67071, stadt: 'Ludwigshafen', name: 'Finanzamt Ludwigshafen', nummer: '2604', adresse: 'Ludwigstraße 50, 67059 Ludwigshafen', telefon: '0621 5910', bundesland: 'Rheinland-Pfalz' },

  // ─── Kaiserslautern ───
  { plzMin: 67655, plzMax: 67663, stadt: 'Kaiserslautern', name: 'Finanzamt Kaiserslautern', nummer: '2605', adresse: 'Mannheimer Straße 90, 67655 Kaiserslautern', telefon: '0631 3610', bundesland: 'Rheinland-Pfalz' },

  // ─── Darmstadt ───
  { plzMin: 64283, plzMax: 64297, stadt: 'Darmstadt', name: 'Finanzamt Darmstadt-Mitte', nummer: '2516', adresse: 'Rheinstraße 60, 64283 Darmstadt', telefon: '06151 927-0', bundesland: 'Hessen' },

  // ─── Offenbach ───
  { plzMin: 63065, plzMax: 63075, stadt: 'Offenbach am Main', name: 'Finanzamt Offenbach', nummer: '2518', adresse: 'Kaiserstraße 139, 63065 Offenbach', telefon: '069 8060', bundesland: 'Hessen' },

  // ─── Hanau ───
  { plzMin: 63450, plzMax: 63457, stadt: 'Hanau', name: 'Finanzamt Hanau', nummer: '2519', adresse: 'Am Steinheimer Tor 10, 63450 Hanau', telefon: '06181 2900', bundesland: 'Hessen' },

  // ─── Marburg ───
  { plzMin: 35037, plzMax: 35043, stadt: 'Marburg', name: 'Finanzamt Marburg', nummer: '2520', adresse: 'Biegenstraße 15, 35037 Marburg', telefon: '06421 2900', bundesland: 'Hessen' },

  // ─── Gießen ───
  { plzMin: 35390, plzMax: 35398, stadt: 'Gießen', name: 'Finanzamt Gießen', nummer: '2521', adresse: 'Goethestraße 20, 35390 Gießen', telefon: '0641 9390', bundesland: 'Hessen' },

  // ─── Fulda ───
  { plzMin: 36037, plzMax: 36043, stadt: 'Fulda', name: 'Finanzamt Fulda', nummer: '2522', adresse: 'Heinrichstraße 30, 36037 Fulda', telefon: '0661 2890', bundesland: 'Hessen' },

  // ─── Reutlingen ───
  { plzMin: 72760, plzMax: 72770, stadt: 'Reutlingen', name: 'Finanzamt Reutlingen', nummer: '9209', adresse: 'Lederstraße 65, 72764 Reutlingen', telefon: '07121 3070', bundesland: 'Baden-Württemberg' },

  // ─── Tübingen ───
  { plzMin: 72070, plzMax: 72076, stadt: 'Tübingen', name: 'Finanzamt Tübingen', nummer: '9210', adresse: 'Hirschgasse 6, 72070 Tübingen', telefon: '07071 2040', bundesland: 'Baden-Württemberg' },

  // ─── Aalen ───
  { plzMin: 73430, plzMax: 73434, stadt: 'Aalen', name: 'Finanzamt Aalen', nummer: '9211', adresse: 'Gmünder Straße 12, 73430 Aalen', telefon: '07361 5210', bundesland: 'Baden-Württemberg' },

  // ─── Ludwigsburg ───
  { plzMin: 71634, plzMax: 71642, stadt: 'Ludwigsburg', name: 'Finanzamt Ludwigsburg', nummer: '9212', adresse: 'Mathildenstraße 15, 71638 Ludwigsburg', telefon: '07141 1300', bundesland: 'Baden-Württemberg' },

  // ─── Esslingen ───
  { plzMin: 73728, plzMax: 73734, stadt: 'Esslingen am Neckar', name: 'Finanzamt Esslingen', nummer: '9213', adresse: 'Pliensaustraße 20, 73728 Esslingen', telefon: '0711 3910', bundesland: 'Baden-Württemberg' },

  // ─── Pforzheim ───
  { plzMin: 75172, plzMax: 75181, stadt: 'Pforzheim', name: 'Finanzamt Pforzheim', nummer: '9214', adresse: 'Bahnhofstraße 15, 75172 Pforzheim', telefon: '07231 3920', bundesland: 'Baden-Württemberg' },

  // ─── Konstanz ───
  { plzMin: 78462, plzMax: 78467, stadt: 'Konstanz', name: 'Finanzamt Konstanz', nummer: '9215', adresse: 'Wessenbergstraße 28, 78462 Konstanz', telefon: '07531 8080', bundesland: 'Baden-Württemberg' },

  // ─── Friedrichshafen ───
  { plzMin: 88045, plzMax: 88048, stadt: 'Friedrichshafen', name: 'Finanzamt Friedrichshafen', nummer: '9216', adresse: 'Eugenstraße 11, 88045 Friedrichshafen', telefon: '07541 3030', bundesland: 'Baden-Württemberg' },

  // ─── Heilbronn ───
  { plzMin: 74072, plzMax: 74081, stadt: 'Heilbronn', name: 'Finanzamt Heilbronn', nummer: '9217', adresse: 'Allee 40, 74072 Heilbronn', telefon: '07131 1500', bundesland: 'Baden-Württemberg' },

  // ─── Aschaffenburg ───
  { plzMin: 63739, plzMax: 63743, stadt: 'Aschaffenburg', name: 'Finanzamt Aschaffenburg', nummer: '9115', adresse: 'Kleberstraße 8, 63739 Aschaffenburg', telefon: '06021 3820', bundesland: 'Bayern' },

  // ─── Landshut ───
  { plzMin: 84028, plzMax: 84036, stadt: 'Landshut', name: 'Finanzamt Landshut', nummer: '9116', adresse: 'Papiererstraße 38, 84028 Landshut', telefon: '0871 9750', bundesland: 'Bayern' },

  // ─── Passau ───
  { plzMin: 94032, plzMax: 94036, stadt: 'Passau', name: 'Finanzamt Passau', nummer: '9117', adresse: 'Innstraße 30, 94032 Passau', telefon: '0851 9550', bundesland: 'Bayern' },

  // ─── Rosenheim ───
  { plzMin: 83022, plzMax: 83026, stadt: 'Rosenheim', name: 'Finanzamt Rosenheim', nummer: '9118', adresse: 'Kufsteiner Straße 22, 83022 Rosenheim', telefon: '08031 3670', bundesland: 'Bayern' },

  // ─── Memmingen ───
  { plzMin: 87700, plzMax: 87700, stadt: 'Memmingen', name: 'Finanzamt Memmingen', nummer: '9119', adresse: 'Buxacher Straße 13, 87700 Memmingen', telefon: '08331 9260', bundesland: 'Bayern' },

  // ─── Kempten ───
  { plzMin: 87435, plzMax: 87439, stadt: 'Kempten', name: 'Finanzamt Kempten', nummer: '9120', adresse: 'Bahnhofstraße 22, 87435 Kempten', telefon: '0831 2520', bundesland: 'Bayern' },

  // ─── Hof ───
  { plzMin: 95028, plzMax: 95032, stadt: 'Hof', name: 'Finanzamt Hof', nummer: '9121', adresse: 'Unterkotzauer Weg 60, 95030 Hof', telefon: '09281 7270', bundesland: 'Bayern' },

  // ─── Weiden ───
  { plzMin: 92637, plzMax: 92637, stadt: 'Weiden', name: 'Finanzamt Weiden', nummer: '9122', adresse: 'Schillerstraße 5, 92637 Weiden', telefon: '0961 3810', bundesland: 'Bayern' },

  // ─── Neumünster ───
  { plzMin: 24534, plzMax: 24539, stadt: 'Neumünster', name: 'Finanzamt Neumünster', nummer: '2104', adresse: 'Boostedderstraße 10, 24534 Neumünster', telefon: '04321 9490', bundesland: 'Schleswig-Holstein' },

  // ─── Wilhelmshaven ───
  { plzMin: 26382, plzMax: 26389, stadt: 'Wilhelmshaven', name: 'Finanzamt Wilhelmshaven', nummer: '2410', adresse: 'Virchowstraße 26, 26382 Wilhelmshaven', telefon: '04421 9890', bundesland: 'Niedersachsen' },

  // ─── Celle ───
  { plzMin: 29221, plzMax: 29229, stadt: 'Celle', name: 'Finanzamt Celle', nummer: '2343', adresse: 'Bahnhofstraße 15, 29221 Celle', telefon: '05141 9290', bundesland: 'Niedersachsen' },

  // ─── Stralsund ───
  { plzMin: 18435, plzMax: 18439, stadt: 'Stralsund', name: 'Finanzamt Stralsund', nummer: '2411', adresse: 'Frankenstraße 22, 18439 Stralsund', telefon: '03831 2500', bundesland: 'Mecklenburg-Vorpommern' },

  // ─── Görlitz ───
  { plzMin: 2826, plzMax: 2899, stadt: 'Görlitz', name: 'Finanzamt Görlitz', nummer: '2344', adresse: 'Muskauer Straße 24, 02826 Görlitz', telefon: '03581 4780', bundesland: 'Sachsen' },

  // ─── Zwickau ───
  { plzMin: 8056, plzMax: 8099, stadt: 'Zwickau', name: 'Finanzamt Zwickau', nummer: '2345', adresse: 'Friedrich-von-Schiller-Straße 1, 08056 Zwickau', telefon: '0375 2790', bundesland: 'Sachsen' },

  // ─── Plauen ───
  { plzMin: 8523, plzMax: 8529, stadt: 'Plauen', name: 'Finanzamt Plauen', nummer: '2346', adresse: 'Friedrichstraße 12, 08523 Plauen', telefon: '03741 5000', bundesland: 'Sachsen' },

  // ─── Dessau ───
  { plzMin: 6842, plzMax: 6849, stadt: 'Dessau-Roßlau', name: 'Finanzamt Dessau', nummer: '2412', adresse: 'Albrechtstraße 90, 06842 Dessau', telefon: '0340 2160', bundesland: 'Sachsen-Anhalt' },

  // ─── Brandenburg ───
  { plzMin: 14770, plzMax: 14776, stadt: 'Brandenburg an der Havel', name: 'Finanzamt Brandenburg', nummer: '2413', adresse: 'Große Münzenstraße 12, 14770 Brandenburg', telefon: '03381 2600', bundesland: 'Brandenburg' },

  // ─── Frankfurt (Oder) ───
  { plzMin: 15230, plzMax: 15236, stadt: 'Frankfurt (Oder)', name: 'Finanzamt Frankfurt (Oder)', nummer: '2414', adresse: 'Fischerstraße 8, 15230 Frankfurt', telefon: '0335 5560', bundesland: 'Brandenburg' },

  // ─── Eisenach ───
  { plzMin: 99817, plzMax: 99817, stadt: 'Eisenach', name: 'Finanzamt Eisenach', nummer: '2415', adresse: 'Markt 10, 99817 Eisenach', telefon: '03691 6970', bundesland: 'Thüringen' },

  // ─── Gera ───
  { plzMin: 7545, plzMax: 7549, stadt: 'Gera', name: 'Finanzamt Gera', nummer: '2416', adresse: 'Schloßstraße 20, 07545 Gera', telefon: '0365 8220', bundesland: 'Thüringen' },

  // ─── Weimar ───
  { plzMin: 99423, plzMax: 99428, stadt: 'Weimar', name: 'Finanzamt Weimar', nummer: '2417', adresse: 'Marienstraße 12, 99423 Weimar', telefon: '03643 8410', bundesland: 'Thüringen' },

  // ─── Suhl ───
  { plzMin: 98527, plzMax: 98530, stadt: 'Suhl', name: 'Finanzamt Suhl', nummer: '2418', adresse: 'Friedrich-König-Straße 5, 98527 Suhl', telefon: '03681 3540', bundesland: 'Thüringen' },

  // ─── Hildburghausen ───
  { plzMin: 98646, plzMax: 98647, stadt: 'Hildburghausen', name: 'Finanzamt Hildburghausen', nummer: '2419', adresse: 'Mühlgasse 8, 98646 Hildburghausen', telefon: '03685 7900', bundesland: 'Thüringen' },

  // ─── Villingen-Schwenningen ───
  { plzMin: 78048, plzMax: 78056, stadt: 'Villingen-Schwenningen', name: 'Finanzamt Villingen-Schwenningen', nummer: '9218', adresse: 'Rietstraße 30, 78048 Villingen', telefon: '07721 9270', bundesland: 'Baden-Württemberg' },

  // ─── Baden-Baden ───
  { plzMin: 76530, plzMax: 76534, stadt: 'Baden-Baden', name: 'Finanzamt Baden-Baden', nummer: '9219', adresse: 'Lange Straße 70, 76530 Baden-Baden', telefon: '07221 3970', bundesland: 'Baden-Württemberg' },

  // ─── Waiblingen ───
  { plzMin: 71332, plzMax: 71336, stadt: 'Waiblingen', name: 'Finanzamt Waiblingen', nummer: '9220', adresse: 'Kurze Straße 20, 71332 Waiblingen', telefon: '07151 9560', bundesland: 'Baden-Württemberg' },

  // ─── Sindelfingen ───
  { plzMin: 71063, plzMax: 71069, stadt: 'Sindelfingen', name: 'Finanzamt Sindelfingen', nummer: '9221', adresse: 'Rathausplatz 3, 71063 Sindelfingen', telefon: '07031 7920', bundesland: 'Baden-Württemberg' },

  // ─── Böblingen ───
  { plzMin: 71032, plzMax: 71034, stadt: 'Böblingen', name: 'Finanzamt Böblingen', nummer: '9222', adresse: 'Wolfgang-Brumme-Allee 32, 71034 Böblingen', telefon: '07031 6630', bundesland: 'Baden-Württemberg' },

  // ─── Ravensburg ───
  { plzMin: 88212, plzMax: 88214, stadt: 'Ravensburg', name: 'Finanzamt Ravensburg', nummer: '9223', adresse: 'Schützenstraße 44, 88212 Ravensburg', telefon: '0751 860', bundesland: 'Baden-Württemberg' },
];

export function findFinanzamtByPLZ(plz) {
  if (!plz) return null;
  const plzNum = parseInt(plz.toString().replace(/\D/g, ''), 10);
  if (isNaN(plzNum)) return null;

  const matches = finanzaemter.filter(
    (fa) => plzNum >= fa.plzMin && plzNum <= fa.plzMax
  );
  return matches.length > 0 ? matches[0] : null;
}

export function searchStaedte(query) {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();
  const seen = new Set();
  return finanzaemter.filter((fa) => {
    const lowerCity = fa.stadt.toLowerCase();
    if (lowerCity.includes(q) && !seen.has(fa.stadt)) {
      seen.add(fa.stadt);
      return true;
    }
    return false;
  }).map((fa) => ({
    stadt: fa.stadt,
    plzMin: fa.plzMin,
    plzMax: fa.plzMax,
    bundesland: fa.bundesland,
  }));
}

export default finanzaemter;
