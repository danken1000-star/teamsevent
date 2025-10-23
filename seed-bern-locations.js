/**
 * AUFGABE: Datenbank-Seeding mit 100 Bern Locations
 * 
 * Erstelle ein Seeding-Script das 100 Locations in Bern
 * in die Supabase Datenbank importiert.
 * 
 * WICHTIG: Nutze die bestehende Locations-Tabelle Struktur!
 */

// ==========================================
// 1. LOCATION DATA
// ==========================================

const BERN_LOCATIONS = [
  // BATCH 1: Locations 1-30 (Bereits vorhanden aus vorherigem Import)
  
  // BATCH 2: Locations 31-50
  {
    name: "Restaurant Bärenhöfli",
    description: "Traditionelles Berner Restaurant, bekannt für legendäre Öpfuchüechli. Zentral in der Altstadt gelegen mit Seminartätigkeit.",
    category: "restaurant",
    city: "Bern",
    address: "Zeughausgasse 41, 3011 Bern",
    phone: "+41 31 329 95 00",
    website: "https://baerenhoefli.ch",
    price_per_person: 45,
    capacity_min: 10,
    capacity_max: 160,
    amenities: ["indoor", "swiss_cuisine", "groups", "central_location"],
    tags: ["swiss", "traditional", "groups"]
  },
  {
    name: "Restaurant Rosengarten",
    description: "Restaurant mit spektakulärer Aussicht auf die Berner Altstadt und Alpen. Schweizer und mediterrane Küche für Gruppen bis 20 Personen.",
    category: "restaurant",
    cuisine_type: "swiss_mediterranean",
    address: "Alter Aargauerstalden 31B, 3006 Bern",
    phone: "+41 31 331 32 06",
    website: "https://www.rosengarten.be",
    price_range: "$$$",
    capacity_min: 8,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["terrace", "view", "fondue", "groups"]
  },
  {
    name: "Restaurant Della Casa",
    description: "Traditionsreiches Restaurant seit über 120 Jahren. Treffpunkt für Politik, Kunst und Kultur in urtümlichem Ambiente.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "Schauplatzgasse 16, 3011 Bern",
    phone: "031 311 21 42",
    website: "https://www.della-casa.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["historic", "central_location", "traditional"]
  },
  {
    name: "Rooftop Brasserie & Bar Globus",
    description: "Moderne Brasserie mit Dachterrasse über den Dächern Berns. Ganzjährig geöffnet mit Rundumsicht.",
    category: "restaurant",
    cuisine_type: "brasserie",
    address: "Spitalgasse 17-21, 3011 Bern",
    phone: "+41 31 511 64 37",
    website: "https://www.globus.ch/restaurants/bern",
    price_range: "$$$",
    capacity_min: 15,
    capacity_max: 100,
    suitable_for_teams: true,
    features: ["rooftop", "view", "modern", "year_round"]
  },
  {
    name: "Restaurant Harmonie",
    description: "Schweizer Spezialitäten wie Fondue und Chäshörnli in gemütlicher Atmosphäre. Täglich wechselnde Harmonie-Woche Gerichte.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "Hotelgasse 3, 3011 Bern",
    phone: "+41 31 313 11 41",
    website: "https://www.harmoniebern.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["swiss_specialties", "fondue", "central"]
  },
  {
    name: "Brasserie Ratskeller",
    description: "Brasserie-Ambiente im Herzen der Altstadt. Businesslunch Trente/Trente und tägliche Abend-Specials.",
    category: "restaurant",
    cuisine_type: "brasserie",
    address: "Gerechtigkeitsgasse 81, 3011 Bern",
    phone: "031 311 17 71",
    website: "https://brasserie-ratskeller.ch",
    price_range: "$$",
    capacity_min: 8,
    capacity_max: 30,
    suitable_for_teams: true,
    features: ["vault_cellar", "business_lunch", "central"]
  },
  {
    name: "Restaurant Kirchenfeld",
    description: "Gehobene Schweizer Küche im Kirchenfeld-Quartier mit Fokus auf regionale Produkte.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "Thunstrasse 5, 3005 Bern",
    phone: "+41 31 351 02 78",
    website: "https://www.kirchenfeld.ch",
    price_range: "$$$",
    capacity_min: 10,
    capacity_max: 40,
    suitable_for_teams: true,
    features: ["upscale", "regional", "quiet"]
  },
  {
    name: "Restaurant Zunft zu Webern",
    description: "Bodenständige Schweizer Küche mit Fondue und Raclette. Ganzjährig verfügbar in der Altstadt.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "Gerechtigkeitsgasse 68, 3011 Bern",
    phone: "+41 31 311 42 58",
    website: "https://www.restwebern.ch",
    price_range: "$$",
    capacity_min: 12,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["fondue", "raclette", "traditional", "year_round"]
  },
  {
    name: "Brasserie Obstberg",
    description: "Verstecktes Bijou mit Garten unter alten Kastanienbäumen. 13 Gault Millau Punkte.",
    category: "restaurant",
    cuisine_type: "brasserie",
    address: "Schänzlihalde 7, 3013 Bern",
    phone: "+41 31 352 04 40",
    website: "https://brasserie-obstberg.ch",
    price_range: "$$$",
    capacity_min: 15,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["garden", "gault_millau", "french_style"]
  },
  {
    name: "Ristorante Da Vinci",
    description: "Italienische Küche gegenüber dem Bundespalast. Pizza aus dem Holzofen und mediterrane Speisen.",
    category: "restaurant",
    cuisine_type: "italian",
    address: "Bundesplatz, 3011 Bern",
    phone: "Siehe Website",
    website: "https://www.ristorantedavinci.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 70,
    suitable_for_teams: true,
    features: ["pizza", "terrace", "central_location", "wood_oven"]
  },
  {
    name: "La Carbonara",
    description: "Familiengeführtes italienisches Restaurant in der Lorraine. Seit über 25 Jahren mit Holzbackofen.",
    category: "restaurant",
    cuisine_type: "italian",
    address: "Quartiergasse 3, 3013 Bern",
    phone: "Siehe Website",
    website: "https://www.lacarbonara.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["pizza", "pasta", "family_run", "terrace"]
  },
  {
    name: "Ristorante Da Carlo",
    description: "Authentische italienische Küche mit Live-Musik seit 1973. Familiäre Atmosphäre.",
    category: "restaurant",
    cuisine_type: "italian",
    address: "Effingerstrasse 14, 3011 Bern",
    phone: "Siehe Website",
    website: "https://da-carlo-bern.ch",
    price_range: "$$",
    capacity_min: 12,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["live_music", "traditional", "authentic"]
  },
  {
    name: "Santa Lucia Bern",
    description: "Knusprige Pizza aus dem Holzofen, Pasta und italienische Weine am Bärenplatz.",
    category: "restaurant",
    cuisine_type: "italian",
    address: "Bärenplatz 2, 3011 Bern",
    phone: "Via Bindella",
    website: "https://www.bindella.ch/gastronomie/santa-lucia-bern",
    price_range: "$$",
    capacity_min: 15,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["pizza", "central", "wood_oven", "family"]
  },
  {
    name: "Restaurant National La Favorita",
    description: "Italienische Spezialitäten in Ostermundigen. Frische Pizza und Pasta täglich zubereitet.",
    category: "restaurant",
    cuisine_type: "italian",
    address: "Ostermundigen bei Bern",
    phone: "Siehe Website",
    website: "https://www.restaurant-favorita.ch",
    price_range: "$$",
    capacity_min: 20,
    capacity_max: 135,
    suitable_for_teams: true,
    features: ["large_groups", "terrace", "seasonal"]
  },
  {
    name: "Ristorante Tre Fratelli",
    description: "Stilvolles italienisches Restaurant mit eleganter Atmosphäre und traditioneller Küche.",
    category: "restaurant",
    cuisine_type: "italian",
    address: "Bern",
    phone: "031 / Siehe Website",
    website: "https://www.tre-fratelli-bern.ch",
    price_range: "$$$",
    capacity_min: 15,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["elegant", "traditional", "upscale"]
  },
  {
    name: "Rubigen Center",
    description: "Grösstes Bowlingcenter im Kanton Bern mit 20 Bahnen plus Escape Rooms und Virtual Reality.",
    category: "activity",
    activity_type: "bowling_entertainment",
    address: "Altes Riedgässli 28, 3076 Rubigen",
    phone: "Siehe Website",
    website: "https://www.rubigencenter.ch",
    price_range: "$$",
    capacity_min: 4,
    capacity_max: 140,
    suitable_for_teams: true,
    features: ["bowling", "escape_rooms", "vr", "restaurant"]
  },
  {
    name: "Bowling Marzili",
    description: "Gemütliches Bowlingcenter mit 10 Bahnen, Billard und Tischfussball in zentraler Lage.",
    category: "activity",
    activity_type: "bowling",
    address: "Sandrainstrasse 12, 3007 Bern",
    phone: "Siehe Website",
    website: "Via Bern Welcome",
    price_range: "$$",
    capacity_min: 4,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["bowling", "billard", "bar", "central"]
  },
  {
    name: "The Escape Bern",
    description: "Escape Rooms direkt beim Bahnhof. Fantasy und Abenteuer-Themen für Teambuilding.",
    category: "activity",
    activity_type: "escape_room",
    address: "Beim Bahnhof Bern",
    phone: "bern@theescape.ch",
    website: "https://bern.theescape.ch",
    price_range: "$$",
    capacity_min: 2,
    capacity_max: 6,
    suitable_for_teams: true,
    features: ["escape_room", "teambuilding", "central"]
  },
  {
    name: "AdventureRooms Bern",
    description: "Pionier der Escape Room Spiele in der Schweiz seit 2012. Mehrere Themen-Räume.",
    category: "activity",
    activity_type: "escape_room",
    address: "Bern",
    phone: "hallo@adventurerooms.ch",
    website: "https://www.bern.adventurerooms.ch",
    price_range: "$$",
    capacity_min: 2,
    capacity_max: 6,
    suitable_for_teams: true,
    features: ["escape_room", "duell_option", "teambuilding"]
  },
  {
    name: "Mastermind Escape Room",
    description: "Premium Escape Rooms mit Hollywood-Kulissen und modernster Technologie am Bahnhof.",
    category: "activity",
    activity_type: "escape_room",
    address: "Laupenstrasse 20, 3008 Bern",
    phone: "Siehe Website",
    website: "https://bern.mastermind.ch",
    price_range: "$$$",
    capacity_min: 2,
    capacity_max: 6,
    suitable_for_teams: true,
    features: ["premium", "technology", "central"]
  },

  // BATCH 3: Locations 51-70
  {
    name: "ChäsChäuer Chäsbueb",
    description: "Käse-Spezialitäten pur, Fondue und Raclette am Tisch. Regelmässige Events wie Samstigbrunch.",
    category: "restaurant",
    cuisine_type: "cheese_specialty",
    address: "Bern Zentrum",
    phone: "Siehe Website",
    website: "https://www.chaesbueb.ch/che/de/chaes-chaeuer",
    price_range: "$$",
    capacity_min: 8,
    capacity_max: 40,
    suitable_for_teams: true,
    features: ["cheese", "fondue", "raclette", "events"]
  },
  {
    name: "Restaurant Lötschberg",
    description: "Fondue ganzjährig. Über 200 Schweizer Weine. AOP-Raclette aus Bagnes. Label Fait Maison.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "Bern",
    phone: "Siehe Website",
    website: "https://loetschbergbern.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 70,
    suitable_for_teams: true,
    features: ["fondue", "year_round", "wine_selection", "groups"]
  },
  {
    name: "Restaurant Röschtigraben",
    description: "Direkt am Bärenplatz. Schweizer Spezialitäten mit Raclette & Fondue, nahe Bundeshaus.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "Bärenplatz, 3011 Bern",
    phone: "Siehe Website",
    website: "https://www.roeschtigrabe.ch",
    price_range: "$$",
    capacity_min: 15,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["central", "fondue", "raclette", "groups"]
  },
  {
    name: "The BEEF Steakhouse & Bar",
    description: "Premium Steakhouse mit Swiss Black Angus. Sportsbar mit Live-Übertragungen SC Bern.",
    category: "restaurant",
    cuisine_type: "steakhouse",
    address: "Kramgasse 74, 3011 Bern",
    phone: "Siehe Website",
    website: "https://www.beef-steakhouse.ch",
    price_range: "$$$",
    capacity_min: 12,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["steakhouse", "sportsbar", "dry_aged", "live_sports"]
  },
  {
    name: "Nooch Asian Kitchen Aarbergergasse",
    description: "Asiatische Fusionsküche. Moderne Asian Kitchen mit Thai-Gerichten und Sushi.",
    category: "restaurant",
    cuisine_type: "asian",
    address: "Aarbergergasse 52, 3011 Bern",
    phone: "031 311 94 94",
    website: "https://www.nooch.ch/de/bern-aarbergergasse",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["asian", "modern", "central"]
  },
  {
    name: "Nooch Asian Kitchen Viktoriaplatz",
    description: "Zweite Nooch Location in der Lorraine mit gleichem asiatischen Konzept.",
    category: "restaurant",
    cuisine_type: "asian",
    address: "Viktoriaplatz 1, 3013 Bern",
    phone: "031 331 53 00",
    website: "https://www.nooch.ch/de/bern-viktoriaplatz",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["asian", "modern", "lorraine"]
  },
  {
    name: "Restaurant Soriya",
    description: "Authentische thailändische Küche. Vier Geschmacksrichtungen: süss, sauer, salzig, scharf.",
    category: "restaurant",
    cuisine_type: "thai",
    address: "Bern",
    phone: "Siehe Website",
    website: "https://soriya.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["thai", "authentic", "takeaway"]
  },
  {
    name: "Asia HuaKy",
    description: "Chinesisches Restaurant mit fairem Preis-Leistungs-Verhältnis. Grosse Portionen.",
    category: "restaurant",
    cuisine_type: "chinese",
    address: "Egelgasse 65, 3006 Bern",
    phone: "+41 31 971 40 21",
    website: "Via Online-Portale",
    price_range: "$",
    capacity_min: 8,
    capacity_max: 40,
    suitable_for_teams: true,
    features: ["chinese", "affordable", "large_portions"]
  },
  {
    name: "Atarashii Sushi Restaurant",
    description: "Frisches Sushi und asiatische Köstlichkeiten im LOEB Lebensmittel. Streetfood-Feeling.",
    category: "restaurant",
    cuisine_type: "japanese",
    address: "Schauplatzgasse 39, LOEB, 3011 Bern",
    phone: "+41 31 311 10 76",
    website: "https://loeb.ch/genuss/bars-restaurants/atarshii",
    price_range: "$$",
    capacity_min: 6,
    capacity_max: 25,
    suitable_for_teams: true,
    features: ["sushi", "fresh", "central", "takeaway"]
  },
  {
    name: "Restaurant Yù Kursaal",
    description: "Asiatisches Buffet à discrétion. Über 30 Spezialitäten, Sushi, Dim Sum, Pekingente.",
    category: "restaurant",
    cuisine_type: "asian_buffet",
    address: "Kursaal Bern",
    phone: "Siehe Kursaal Website",
    website: "https://kursaal-bern.ch/erleben/gastronomie/restaurant-yu",
    price_range: "$$$",
    capacity_min: 15,
    capacity_max: 100,
    suitable_for_teams: true,
    features: ["buffet", "all_you_can_eat", "variety"]
  },
  {
    name: "The BEEF Burger",
    description: "Burger Take-Away mit mehreren Standorten in Bern. Qualitäts-Burger.",
    category: "restaurant",
    cuisine_type: "burger",
    address: "Mehrere Standorte in Bern",
    phone: "+41 31 332 56 44",
    website: "https://www.beef-burger.ch",
    price_range: "$",
    capacity_min: 4,
    capacity_max: 30,
    suitable_for_teams: true,
    features: ["burger", "takeaway", "multiple_locations"]
  },
  {
    name: "Hans im Glück Bahnhof",
    description: "Burgergrill direkt am Bahnhof. Vegetarisch, vegan und mit Fleisch. Cocktails.",
    category: "restaurant",
    cuisine_type: "burger",
    address: "Bern Bahnhof",
    phone: "Siehe Website",
    website: "https://hansimglueck-burgergrill.ch/burger-restaurant/bern-bahnhof",
    price_range: "$$",
    capacity_min: 8,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["burger", "vegetarian", "vegan", "cocktails"]
  },
  {
    name: "Hans im Glück Gümligen",
    description: "Burgergrill beim Cinedome Muri. Perfekt kombinierbar mit Kino/Bowling.",
    category: "restaurant",
    cuisine_type: "burger",
    address: "Muri bei Bern, Cinedome",
    phone: "Siehe Website",
    website: "https://hansimglueck-burgergrill.de/burger-restaurant/bern-guemligen",
    price_range: "$$",
    capacity_min: 8,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["burger", "cinema_nearby", "bowling_nearby"]
  },
  {
    name: "El Mexicano",
    description: "Mexikanisches Restaurant mit exklusivem Ambiente. Live-Musik Donnerstag-Samstag.",
    category: "restaurant",
    cuisine_type: "mexican",
    address: "Spitalgasse 26, 3011 Bern",
    phone: "+41 31 311 32 20",
    website: "https://bern.elmexicano.ch",
    price_range: "$$",
    capacity_min: 12,
    capacity_max: 150,
    suitable_for_teams: true,
    features: ["mexican", "live_music", "terrace", "groups"]
  },
  {
    name: "Papa Burrito Kornhausplatz",
    description: "Mexikanisches Fast Food. Burritos, Tacos, Bowls. Frisch vor deinen Augen zubereitet.",
    category: "restaurant",
    cuisine_type: "mexican",
    address: "Kornhausplatz 14, 3011 Bern",
    phone: "031 311 98 92",
    website: "https://papaburrito.ch",
    price_range: "$",
    capacity_min: 6,
    capacity_max: 40,
    suitable_for_teams: true,
    features: ["mexican", "fast_food", "fresh", "multiple_locations"]
  },
  {
    name: "Barbière Brauerei",
    description: "Hausbrauerei mit Restaurant am Breitenrainplatz. Craft Beer und täglich Mittagsmenüs.",
    category: "restaurant_bar",
    cuisine_type: "brewery",
    address: "Breitenrainplatz 40, 3014 Bern",
    phone: "031 536 70 77",
    website: "https://www.barbiere-bern.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["brewery", "craft_beer", "restaurant"]
  },
  {
    name: "Brauerei Schuum",
    description: "Handgemachtes Berner Craft Bier. Taproom mit BBQ-Events und Bier-Tastings.",
    category: "bar_brewery",
    activity_type: "brewery",
    address: "Bern",
    phone: "Siehe Website",
    website: "https://www.schuum.ch",
    price_range: "$$",
    capacity_min: 8,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["craft_beer", "taproom", "bbq", "events"]
  },
  {
    name: "Altes Tramdepot",
    description: "Brauerei-Restaurant mit Aussicht auf die Altstadt. Eigene Biere und Eiswerkstatt.",
    category: "restaurant_brewery",
    cuisine_type: "brewery",
    address: "Grosser Muristalden 6, 3006 Bern",
    phone: "Siehe Website",
    website: "https://altestramdepot.ch",
    price_range: "$$",
    capacity_min: 15,
    capacity_max: 100,
    suitable_for_teams: true,
    features: ["brewery", "view", "terrace", "groups"]
  },
  {
    name: "Papa Joe's Bern",
    description: "American Restaurant & Caribbean Bar. Mexikanisch-inspirierter Innenhof mit Brunnen.",
    category: "restaurant_bar",
    cuisine_type: "american_caribbean",
    address: "Berner Altstadt",
    phone: "Siehe Website",
    website: "https://www.papajoes.ch/standorte/bern",
    price_range: "$$",
    capacity_min: 15,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["special_atmosphere", "courtyard", "cocktails"]
  },
  {
    name: "Tres Amigos",
    description: "Mexikanisches Restaurant. Margaritas, Fajitas, Enchiladas in entspanntem Ambiente.",
    category: "restaurant",
    cuisine_type: "mexican",
    address: "Bern",
    phone: "Siehe Website",
    website: "https://www.tresamigos.ch/de/p/standorte/bern-1106.html",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["mexican", "colorful", "groups"]
  },

  // BATCH 4: Locations 71-100
  {
    name: "UNIK Playground",
    description: "Trendsporthalle 2'500m². Trampolin, Ninja Warrior, Skatepark, Rutschbahnschanzen.",
    category: "activity",
    activity_type: "sports_hall",
    address: "Beim Bahnhof Bümpliz Süd, Bern",
    phone: "Siehe Website",
    website: "https://unik-playground.ch",
    price_range: "$$",
    capacity_min: 5,
    capacity_max: 100,
    suitable_for_teams: true,
    features: ["trampoline", "ninja_warrior", "skate", "modern"]
  },
  {
    name: "BEO-Funpark",
    description: "Indoor 2700m² + Outdoor 1500m². Trampoline, Minigolf, Kletterburg, Restaurant.",
    category: "activity",
    activity_type: "funpark",
    address: "Nähe Laupen, 20 Min von Bern",
    phone: "Siehe Website",
    website: "https://beo-funpark.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 200,
    suitable_for_teams: true,
    features: ["indoor_outdoor", "minigolf", "restaurant", "birthday"]
  },
  {
    name: "BounceLap Belp",
    description: "Trampolinhalle 2000m² mit 38 Trampolins. Freerunning, Basketball, Slacklines.",
    category: "activity",
    activity_type: "trampoline",
    address: "Flugplatzstrasse 2, 3123 Belp",
    phone: "Siehe Website",
    website: "Via Freizeit.ch",
    price_range: "$$",
    capacity_min: 5,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["trampoline", "basketball", "freerunning"]
  },
  {
    name: "Kartbahn Lyss",
    description: "Kartbahn nähe Bern. 750m Outdoor-Strecke. Restaurant vor Ort. Firmenevents möglich.",
    category: "activity",
    activity_type: "karting",
    address: "Lyssstrasse 31, 3273 Kappelen",
    phone: "032 392 22 33",
    website: "https://kartbahnlyss.ch",
    price_range: "$$",
    capacity_min: 6,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["karting", "outdoor", "restaurant", "events"]
  },
  {
    name: "Race-Inn Roggwil",
    description: "Längste Indoor-Kartbahn der Schweiz (640m). Elektro & Benziner. Restaurant.",
    category: "activity",
    activity_type: "karting",
    address: "Roggwil bei Bern",
    phone: "Siehe Website",
    website: "https://www.race-inn.ch",
    price_range: "$$",
    capacity_min: 8,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["indoor", "longest_track", "restaurant"]
  },
  {
    name: "Blue Cinema Cinedome",
    description: "12 Bowlingbahnen + Lasertag. Sports Bar. Kombination mit Kino möglich.",
    category: "activity",
    activity_type: "bowling_lasertag",
    address: "Muri bei Bern",
    phone: "Via Blue Cinema",
    website: "https://www.bluecinema.ch",
    price_range: "$$",
    capacity_min: 6,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["bowling", "lasertag", "cinema", "sportsbar"]
  },
  {
    name: "Gurten Berner Hausberg",
    description: "Aussichtsberg mit Restaurant, Spielplatz. Teamevents: Grillieren, Sternbeobachtung.",
    category: "activity",
    activity_type: "mountain_experience",
    address: "Gurten, 3084 Wabern",
    phone: "Siehe Website",
    website: "Via Bern Welcome",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 150,
    suitable_for_teams: true,
    features: ["mountain", "view", "bbq", "events"]
  },
  {
    name: "Stadtführungen Bern",
    description: "Stadtführungen, Schokoladen-Touren, Schnitzeljagden für Teams durch Bern.",
    category: "activity",
    activity_type: "city_tour",
    address: "Bern Tourismus",
    phone: "Via Bern Welcome",
    website: "https://bern.com",
    price_range: "$$",
    capacity_min: 8,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["city_tour", "chocolate", "team_building"]
  },
  {
    name: "URBANescape Bern",
    description: "Outdoor Stadterlebnis. Agentenspiel mit Missionen durch die Stadt Bern.",
    category: "activity",
    activity_type: "outdoor_game",
    address: "Stadt Bern, Outdoor",
    phone: "Siehe Website",
    website: "Via Eventbutler",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 100,
    suitable_for_teams: true,
    features: ["outdoor", "agent_game", "team_building"]
  },
  {
    name: "Aare Booten/Schwimmen",
    description: "Aare-Booten und Schwimmen. Beliebte Sommeraktivität in Bern. Verschiedene Einstiegspunkte.",
    category: "activity",
    activity_type: "water_activity",
    address: "Diverse Einstiegspunkte in Bern",
    phone: "-",
    website: "Via Swiss Activities",
    price_range: "$",
    capacity_min: 5,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["summer", "water", "outdoor", "free"]
  },
  {
    name: "Voyage Culinaire Bern",
    description: "Kulinarischer Stadtrundgang. Besuch von 3 Restaurants/Bars mit Verkostungen.",
    category: "activity",
    activity_type: "food_tour",
    address: "Verschiedene Locations in Bern",
    phone: "Via Anbieter",
    website: "Via Mein-Ausflug.ch",
    price_range: "$$$",
    capacity_min: 8,
    capacity_max: 30,
    suitable_for_teams: true,
    features: ["food_tour", "city_tour", "tastings"]
  },
  {
    name: "Lama & Alpaka Trekking",
    description: "Lama/Alpaka Wanderungen in der Region Bern. Entspannte Naturerlebnisse.",
    category: "activity",
    activity_type: "animal_trekking",
    address: "Nähe Bern",
    phone: "Via Swiss Activities",
    website: "https://www.swissactivities.com",
    price_range: "$$",
    capacity_min: 4,
    capacity_max: 20,
    suitable_for_teams: true,
    features: ["nature", "animals", "relaxing"]
  },
  {
    name: "Schaukäserei Emmental",
    description: "Käserei-Besichtigung mit Fondue-Event. Teambuilding im Emmental.",
    category: "activity",
    activity_type: "cheese_experience",
    address: "Emmental/Sense Region",
    phone: "Via Veranstalter",
    website: "Via Swiss Activities",
    price_range: "$$",
    capacity_min: 12,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["cheese", "fondue", "tradition", "group"]
  },
  {
    name: "Eisschnitzen Workshop",
    description: "Kreatives Eisschnitzen als Teamevent. Ganzjährig möglich in Bern Region.",
    category: "activity",
    activity_type: "creative_workshop",
    address: "Bern Region",
    phone: "Via Eventbutler",
    website: "https://www.eventbutler.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 30,
    suitable_for_teams: true,
    features: ["creative", "ice", "team_building"]
  },
  {
    name: "Cocktail Mix Workshop",
    description: "Barkeeper-Workshop. Cocktails mixen lernen im Team. Verschiedene Locations.",
    category: "activity",
    activity_type: "workshop",
    address: "Verschiedene Locations Bern",
    phone: "Via Eventbutler",
    website: "https://www.eventbutler.ch",
    price_range: "$$",
    capacity_min: 8,
    capacity_max: 25,
    suitable_for_teams: true,
    features: ["cocktails", "workshop", "fun"]
  },
  {
    name: "Restaurant Stadtgarten",
    description: "Restaurant mit Garten an der Aare. Perfekt für Firmenevents und Sommerfeste.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "Bern",
    phone: "Siehe Website",
    website: "Via Eventlokale.ch",
    price_range: "$$",
    capacity_min: 35,
    capacity_max: 90,
    suitable_for_teams: true,
    features: ["garden", "aare", "summer", "events"]
  },
  {
    name: "Restaurant Schwellenmätteli",
    description: "Bekanntes Restaurant direkt an der Aare. Terrasse mit Blick aufs Wasser.",
    category: "restaurant",
    cuisine_type: "modern_swiss",
    address: "Direkt an der Aare, Bern",
    phone: "Siehe Website",
    website: "Via Bern Welcome",
    price_range: "$$$",
    capacity_min: 20,
    capacity_max: 100,
    suitable_for_teams: true,
    features: ["aare", "terrace", "view", "upscale"]
  },
  {
    name: "Restaurant Grosse Schanze",
    description: "Restaurant mit Aussicht auf die Berner Alpen. Zentral gelegen am Schanzenhof.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "Bern",
    phone: "Siehe Website",
    website: "Via Eventlokale.ch",
    price_range: "$$",
    capacity_min: 15,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["view", "alps", "central", "terrace"]
  },
  {
    name: "Grottino an der Aare",
    description: "Gemütliche Pergola. Fondue/Raclette-Menüs November-Februar mit Getränken inkl.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "An der Aare, Bern",
    phone: "Siehe Website",
    website: "Via Bärner Meitschi",
    price_range: "$$",
    capacity_min: 15,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["aare", "fondue", "seasonal", "package"]
  },
  {
    name: "Restaurant Marzilibrücke",
    description: "Restaurant beim Marzili-Bad. Pizza und Schweizer Küche mit Aare-Blick.",
    category: "restaurant",
    cuisine_type: "swiss_italian",
    address: "Marzili, Bern",
    phone: "Siehe Website",
    website: "Via Bärner Meitschi",
    price_range: "$$",
    capacity_min: 15,
    capacity_max: 70,
    suitable_for_teams: true,
    features: ["marzili", "aare", "pizza", "summer"]
  },
  {
    name: "Kramer Restaurant",
    description: "Traditionelles Restaurant mit Fondue-Spezialitäten und Schweizer Klassikern.",
    category: "restaurant",
    cuisine_type: "swiss",
    address: "Bern",
    phone: "Siehe Website",
    website: "Via Bärner Meitschi",
    price_range: "$$",
    capacity_min: 12,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["fondue", "traditional", "swiss"]
  },
  {
    name: "Restaurant Beaulieu",
    description: "Teil der Dallmaier Gruppe. Businesslunch und gehobenes Abendessen.",
    category: "restaurant",
    cuisine_type: "modern_swiss",
    address: "Bern",
    phone: "Via Harmonie Bern",
    website: "Via Harmonie Bern",
    price_range: "$$",
    capacity_min: 12,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["business", "modern", "group"]
  },
  {
    name: "Restaurant Oliv",
    description: "Mediterrane Küche. Teil der renommierten Dallmaier Restaurant-Gruppe in Bern.",
    category: "restaurant",
    cuisine_type: "mediterranean",
    address: "Bern",
    phone: "Via Harmonie Bern",
    website: "Via Harmonie Bern",
    price_range: "$$",
    capacity_min: 12,
    capacity_max: 60,
    suitable_for_teams: true,
    features: ["mediterranean", "modern", "group"]
  },
  {
    name: "Provisorium46",
    description: "Fondue-Location mit besonderem Ambiente. Modern interpretierte Schweizer Küche.",
    category: "restaurant",
    cuisine_type: "swiss_modern",
    address: "Bern",
    phone: "Siehe Website",
    website: "Via Bärner Meitschi",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 40,
    suitable_for_teams: true,
    features: ["fondue", "modern", "special_atmosphere"]
  },
  {
    name: "Gourmanderie Moléson",
    description: "Schweizer Spezialitäten mit Käse-Fokus. Raclette und Fondue in gemütlicher Atmosphäre.",
    category: "restaurant",
    cuisine_type: "cheese_specialty",
    address: "Bern",
    phone: "Siehe Website",
    website: "Via Bärner Meitschi",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["cheese", "raclette", "fondue", "cozy"]
  },
  {
    name: "Can Grillhaus",
    description: "Türkisches Grillhaus. Grillspezialitäten, Meze (Vorspeisen), Live-Musik.",
    category: "restaurant",
    cuisine_type: "turkish",
    address: "Bern",
    phone: "Siehe Website",
    website: "https://www.cangrillhaus.ch",
    price_range: "$$",
    capacity_min: 15,
    capacity_max: 80,
    suitable_for_teams: true,
    features: ["grill", "live_music", "meze", "groups"]
  },
  {
    name: "Restaurant NOA",
    description: "Modernes Restaurant mit Black Angus Burger. Rooftop-Atmosphäre und innovative Küche.",
    category: "restaurant",
    cuisine_type: "modern_grill",
    address: "Murtenstrasse 143A, 3008 Bern",
    phone: "Siehe Website",
    website: "https://noa-restaurant.ch",
    price_range: "$$",
    capacity_min: 12,
    capacity_max: 70,
    suitable_for_teams: true,
    features: ["burger", "modern", "rooftop_feel"]
  },
  {
    name: "Burrito Bandito",
    description: "Mexikanische Küche. Burritos, Tacos, Burger. Reservation empfohlen, sehr beliebt.",
    category: "restaurant",
    cuisine_type: "mexican",
    address: "Münstergasse 60, 3011 Bern",
    phone: "Siehe Website",
    website: "https://burritobandito.ch",
    price_range: "$$",
    capacity_min: 10,
    capacity_max: 50,
    suitable_for_teams: true,
    features: ["mexican", "tacos", "cocktails", "popular"]
  },
  {
    name: "Williams ButchersTable",
    description: "Metzgerei und Restaurant in einem. Premium Fleisch im LOEB Warenhaus.",
    category: "restaurant",
    cuisine_type: "butcher_restaurant",
    address: "LOEB Warenhaus, Bern",
    phone: "Via LOEB",
    website: "https://loeb.ch",
    price_range: "$$$",
    capacity_min: 8,
    capacity_max: 40,
    suitable_for_teams: true,
    features: ["butcher", "premium", "unique_concept"]
  },
  {
    name: "Märitbeizli Münsterplatz",
    description: "Fondue-Beizli auf dem Münsterplatz. Saisonal November-Dezember geöffnet.",
    category: "restaurant",
    cuisine_type: "swiss_seasonal",
    address: "Münsterplatz, 3011 Bern",
    phone: "Siehe Website",
    website: "https://drei-er-lei.ch/maeritbeizli",
    price_range: "$$",
    capacity_min: 8,
    capacity_max: 30,
    suitable_for_teams: true,
    features: ["fondue", "seasonal", "central", "special"]
  }
];

// ==========================================
// 2. SEEDING FUNCTION
// ==========================================

async function seedBernLocations() {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const { createClient } = require('@supabase/supabase-js');
  
  console.log('Environment check:');
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing');
  console.log('ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Missing environment variables. Check your .env.local file.');
    process.exit(1);
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('🚀 Starting to seed 100 Bern locations...');

  let successCount = 0;
  let errorCount = 0;

  for (const location of BERN_LOCATIONS) {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert([location])
        .select();

      if (error) throw error;
      
      successCount++;
      console.log(`✅ ${successCount}/${BERN_LOCATIONS.length}: ${location.name} added`);
      
    } catch (error) {
      errorCount++;
      console.error(`❌ Error adding ${location.name}:`, error.message);
    }
  }

  console.log('\n📊 SEEDING COMPLETE:');
  console.log(`✅ Successfully added: ${successCount} locations`);
  console.log(`❌ Errors: ${errorCount}`);
}

// ==========================================
// 3. EXECUTE
// ==========================================

seedBernLocations()
  .then(() => {
    console.log('\n✨ All done! Check your Supabase dashboard.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
