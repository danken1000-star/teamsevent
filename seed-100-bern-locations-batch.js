/**
 * BATCH SEEDING SCRIPT FÜR 100 BERN LOCATIONS
 * Fügt Locations in 5 Batches à 20 Locations hinzu
 */

// ==========================================
// 1. LOCATION DATA (100 LOCATIONS IN 5 BATCHES)
// ==========================================

const BATCH_1 = [
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
    city: "Bern",
    address: "Alter Aargauerstalden 31B, 3006 Bern",
    phone: "+41 31 331 32 06",
    website: "https://www.rosengarten.be",
    price_per_person: 65,
    capacity_min: 8,
    capacity_max: 60,
    amenities: ["terrace", "view", "fondue", "groups"],
    tags: ["swiss", "view", "upscale"]
  },
  {
    name: "Restaurant Della Casa",
    description: "Traditionsreiches Restaurant seit über 120 Jahren. Treffpunkt für Politik, Kunst und Kultur in urtümlichem Ambiente.",
    category: "restaurant",
    city: "Bern",
    address: "Schauplatzgasse 16, 3011 Bern",
    phone: "031 311 21 42",
    website: "https://www.della-casa.ch",
    price_per_person: 55,
    capacity_min: 10,
    capacity_max: 80,
    amenities: ["historic", "central_location", "traditional"],
    tags: ["swiss", "historic", "traditional"]
  },
  {
    name: "Rooftop Brasserie & Bar Globus",
    description: "Moderne Brasserie mit Dachterrasse über den Dächern Berns. Ganzjährig geöffnet mit Rundumsicht.",
    category: "restaurant",
    city: "Bern",
    address: "Spitalgasse 17-21, 3011 Bern",
    phone: "+41 31 511 64 37",
    website: "https://www.globus.ch/restaurants/bern",
    price_per_person: 75,
    capacity_min: 15,
    capacity_max: 100,
    amenities: ["rooftop", "view", "modern", "year_round"],
    tags: ["modern", "rooftop", "view"]
  },
  {
    name: "Restaurant Harmonie",
    description: "Schweizer Spezialitäten wie Fondue und Chäshörnli in gemütlicher Atmosphäre. Täglich wechselnde Harmonie-Woche Gerichte.",
    category: "restaurant",
    city: "Bern",
    address: "Hotelgasse 3, 3011 Bern",
    phone: "+41 31 313 11 41",
    website: "https://www.harmoniebern.ch",
    price_per_person: 50,
    capacity_min: 10,
    capacity_max: 60,
    amenities: ["swiss_specialties", "fondue", "central"],
    tags: ["swiss", "fondue", "traditional"]
  },
  {
    name: "Brasserie Ratskeller",
    description: "Brasserie-Ambiente im Herzen der Altstadt. Businesslunch Trente/Trente und tägliche Abend-Specials.",
    category: "restaurant",
    city: "Bern",
    address: "Gerechtigkeitsgasse 81, 3011 Bern",
    phone: "031 311 17 71",
    website: "https://brasserie-ratskeller.ch",
    price_per_person: 40,
    capacity_min: 8,
    capacity_max: 30,
    amenities: ["vault_cellar", "business_lunch", "central"],
    tags: ["brasserie", "business", "central"]
  },
  {
    name: "Restaurant Kirchenfeld",
    description: "Gehobene Schweizer Küche im Kirchenfeld-Quartier mit Fokus auf regionale Produkte.",
    category: "restaurant",
    city: "Bern",
    address: "Thunstrasse 5, 3005 Bern",
    phone: "+41 31 351 02 78",
    website: "https://www.kirchenfeld.ch",
    price_per_person: 70,
    capacity_min: 10,
    capacity_max: 40,
    amenities: ["upscale", "regional", "quiet"],
    tags: ["swiss", "upscale", "regional"]
  },
  {
    name: "Restaurant Zunft zu Webern",
    description: "Bodenständige Schweizer Küche mit Fondue und Raclette. Ganzjährig verfügbar in der Altstadt.",
    category: "restaurant",
    city: "Bern",
    address: "Gerechtigkeitsgasse 68, 3011 Bern",
    phone: "+41 31 311 42 58",
    website: "https://www.restwebern.ch",
    price_per_person: 50,
    capacity_min: 12,
    capacity_max: 50,
    amenities: ["fondue", "raclette", "traditional", "year_round"],
    tags: ["swiss", "fondue", "raclette"]
  },
  {
    name: "Brasserie Obstberg",
    description: "Verstecktes Bijou mit Garten unter alten Kastanienbäumen. 13 Gault Millau Punkte.",
    category: "restaurant",
    city: "Bern",
    address: "Schänzlihalde 7, 3013 Bern",
    phone: "+41 31 352 04 40",
    website: "https://brasserie-obstberg.ch",
    price_per_person: 80,
    capacity_min: 15,
    capacity_max: 80,
    amenities: ["garden", "gault_millau", "french_style"],
    tags: ["french", "garden", "upscale"]
  },
  {
    name: "Ristorante Da Vinci",
    description: "Italienische Küche gegenüber dem Bundespalast. Pizza aus dem Holzofen und mediterrane Speisen.",
    category: "restaurant",
    city: "Bern",
    address: "Bundesplatz, 3011 Bern",
    phone: "Siehe Website",
    website: "https://www.ristorantedavinci.ch",
    price_per_person: 45,
    capacity_min: 10,
    capacity_max: 70,
    amenities: ["pizza", "terrace", "central_location", "wood_oven"],
    tags: ["italian", "pizza", "central"]
  },
  {
    name: "La Carbonara",
    description: "Familiengeführtes italienisches Restaurant in der Lorraine. Seit über 25 Jahren mit Holzbackofen.",
    category: "restaurant",
    city: "Bern",
    address: "Quartiergasse 3, 3013 Bern",
    phone: "Siehe Website",
    website: "https://www.lacarbonara.ch",
    price_per_person: 40,
    capacity_min: 10,
    capacity_max: 50,
    amenities: ["pizza", "pasta", "family_run", "terrace"],
    tags: ["italian", "pizza", "family"]
  },
  {
    name: "Ristorante Da Carlo",
    description: "Authentische italienische Küche mit Live-Musik seit 1973. Familiäre Atmosphäre.",
    category: "restaurant",
    city: "Bern",
    address: "Effingerstrasse 14, 3011 Bern",
    phone: "Siehe Website",
    website: "https://da-carlo-bern.ch",
    price_per_person: 45,
    capacity_min: 12,
    capacity_max: 60,
    amenities: ["live_music", "traditional", "authentic"],
    tags: ["italian", "live_music", "traditional"]
  },
  {
    name: "Santa Lucia Bern",
    description: "Knusprige Pizza aus dem Holzofen, Pasta und italienische Weine am Bärenplatz.",
    category: "restaurant",
    city: "Bern",
    address: "Bärenplatz 2, 3011 Bern",
    phone: "Via Bindella",
    website: "https://www.bindella.ch/gastronomie/santa-lucia-bern",
    price_per_person: 40,
    capacity_min: 15,
    capacity_max: 80,
    amenities: ["pizza", "central", "wood_oven", "family"],
    tags: ["italian", "pizza", "central"]
  },
  {
    name: "Restaurant National La Favorita",
    description: "Italienische Spezialitäten in Ostermundigen. Frische Pizza und Pasta täglich zubereitet.",
    category: "restaurant",
    city: "Bern",
    address: "Ostermundigen bei Bern",
    phone: "Siehe Website",
    website: "https://www.restaurant-favorita.ch",
    price_per_person: 35,
    capacity_min: 20,
    capacity_max: 135,
    amenities: ["large_groups", "terrace", "seasonal"],
    tags: ["italian", "large_groups", "terrace"]
  },
  {
    name: "Ristorante Tre Fratelli",
    description: "Stilvolles italienisches Restaurant mit eleganter Atmosphäre und traditioneller Küche.",
    category: "restaurant",
    city: "Bern",
    address: "Bern",
    phone: "031 / Siehe Website",
    website: "https://www.tre-fratelli-bern.ch",
    price_per_person: 60,
    capacity_min: 15,
    capacity_max: 60,
    amenities: ["elegant", "traditional", "upscale"],
    tags: ["italian", "elegant", "upscale"]
  },
  {
    name: "Rubigen Center",
    description: "Grösstes Bowlingcenter im Kanton Bern mit 20 Bahnen plus Escape Rooms und Virtual Reality.",
    category: "activity",
    city: "Bern",
    address: "Altes Riedgässli 28, 3076 Rubigen",
    phone: "Siehe Website",
    website: "https://www.rubigencenter.ch",
    price_per_person: 25,
    capacity_min: 4,
    capacity_max: 140,
    amenities: ["bowling", "escape_rooms", "vr", "restaurant"],
    tags: ["bowling", "entertainment", "groups"]
  },
  {
    name: "Bowling Marzili",
    description: "Gemütliches Bowlingcenter mit 10 Bahnen, Billard und Tischfussball in zentraler Lage.",
    category: "activity",
    city: "Bern",
    address: "Sandrainstrasse 12, 3007 Bern",
    phone: "Siehe Website",
    website: "Via Bern Welcome",
    price_per_person: 20,
    capacity_min: 4,
    capacity_max: 60,
    amenities: ["bowling", "billard", "bar", "central"],
    tags: ["bowling", "billard", "central"]
  },
  {
    name: "The Escape Bern",
    description: "Escape Rooms direkt beim Bahnhof. Fantasy und Abenteuer-Themen für Teambuilding.",
    category: "activity",
    city: "Bern",
    address: "Beim Bahnhof Bern",
    phone: "bern@theescape.ch",
    website: "https://bern.theescape.ch",
    price_per_person: 30,
    capacity_min: 2,
    capacity_max: 6,
    amenities: ["escape_room", "teambuilding", "central"],
    tags: ["escape_room", "teambuilding", "central"]
  },
  {
    name: "AdventureRooms Bern",
    description: "Pionier der Escape Room Spiele in der Schweiz seit 2012. Mehrere Themen-Räume.",
    category: "activity",
    city: "Bern",
    address: "Bern",
    phone: "hallo@adventurerooms.ch",
    website: "https://www.bern.adventurerooms.ch",
    price_per_person: 35,
    capacity_min: 2,
    capacity_max: 6,
    amenities: ["escape_room", "duell_option", "teambuilding"],
    tags: ["escape_room", "teambuilding", "pioneer"]
  },
  {
    name: "Mastermind Escape Room",
    description: "Premium Escape Rooms mit Hollywood-Kulissen und modernster Technologie am Bahnhof.",
    category: "activity",
    city: "Bern",
    address: "Laupenstrasse 20, 3008 Bern",
    phone: "Siehe Website",
    website: "https://bern.mastermind.ch",
    price_per_person: 40,
    capacity_min: 2,
    capacity_max: 6,
    amenities: ["premium", "technology", "central"],
    tags: ["escape_room", "premium", "technology"]
  }
];

// Weitere Batches würden hier folgen...
// BATCH_2, BATCH_3, BATCH_4, BATCH_5

// ==========================================
// 2. BATCH SEEDING FUNCTION
// ==========================================

async function seedBatch(batch, batchNumber) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log(`🚀 Starting Batch ${batchNumber} (${batch.length} locations)...`);

  let successCount = 0;
  let errorCount = 0;

  for (const location of batch) {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert([location])
        .select();

      if (error) throw error;
      
      successCount++;
      console.log(`✅ ${successCount}/${batch.length}: ${location.name} added`);
      
    } catch (error) {
      errorCount++;
      console.error(`❌ Error adding ${location.name}:`, error.message);
    }
  }

  console.log(`\n📊 BATCH ${batchNumber} COMPLETE:`);
  console.log(`✅ Successfully added: ${successCount} locations`);
  console.log(`❌ Errors: ${errorCount}`);
  
  return { successCount, errorCount };
}

// ==========================================
// 3. EXECUTE ALL BATCHES
// ==========================================

async function seedAllBatches() {
  console.log('🎯 Starting 100 Bern Locations Seeding in Batches...\n');
  
  const batches = [BATCH_1]; // Hier würden alle 5 Batches stehen
  let totalSuccess = 0;
  let totalErrors = 0;
  
  for (let i = 0; i < batches.length; i++) {
    const result = await seedBatch(batches[i], i + 1);
    totalSuccess += result.successCount;
    totalErrors += result.errorCount;
    
    // Pause zwischen Batches
    if (i < batches.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next batch...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎉 ALL BATCHES COMPLETE:');
  console.log(`✅ Total Successfully added: ${totalSuccess} locations`);
  console.log(`❌ Total Errors: ${totalErrors}`);
}

// ==========================================
// 4. EXECUTE
// ==========================================

seedAllBatches()
  .then(() => {
    console.log('\n✨ All done! Check your Supabase dashboard.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
