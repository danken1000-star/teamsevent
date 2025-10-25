-- =====================================================
-- ADD NEW LOCATIONS FOR MISSING CATEGORIES
-- =====================================================
-- Datum: 2025-01-23
-- Zweck: Fügt neue Locations für fehlende Kategorien hinzu

-- INDOOR KATEGORIE (🏢 Drinnen stattfindend)
INSERT INTO locations (name, description, address, city, category, price_per_person, capacity_min, capacity_max, phone, website) VALUES
('Adventure Arena Bern', 'Reality Gaming auf über 1000m² mit bis zu 20 Abenteuer-Missionen. Perfekt für Teamevents von 2 bis 100 Personen.', 'Nähe ÖV Bern', 'Bern', 'indoor', 30, 2, 100, NULL, NULL),
('Villa Creativa', 'Indoor Spielplatz und Event-Location mit KAPLA-Workshops. Ideal für Teamevents mit pädagogischem Ansatz.', 'Ostermundigenstraße 69, 3006 Bern', 'Bern', 'indoor', 25, 10, 50, NULL, NULL),
('Windwerk Indoor Skydiving', 'Indoor Skydiving in der einzigen Anlage der Deutschschweiz. Ultimatives Flugerlebnis ohne Flugzeugsprung.', 'Region Bern', 'Bern', 'indoor', 100, 5, 20, NULL, NULL);

-- ENTSPANNT KATEGORIE (😌 Gemütlich & locker)
INSERT INTO locations (name, description, address, city, category, price_per_person, capacity_min, capacity_max, phone, website) VALUES
('Hammam & Spa Oktogon', 'Orientalische Wohlfühloase im Stadtzentrum von Bern. Dampfräume, warmes Entspannungsbad und Wellness über vier Stockwerke.', 'Unterhalb Bundeshausterrasse, Bern', 'Bern', 'entspannt', 75, 2, 30, NULL, NULL),
('Bernaqua Wellness & Spa', 'Wellnessbereich im Westside mit Saunalandschaft, Thai-Massagen und Römisch-Irischem Bad. Entspannung pur.', 'Westside, Bern', 'Bern', 'entspannt', 52, 2, 50, NULL, NULL),
('Schweizerhof Spa', 'Exklusives Hotel-Spa mit Vitality Pool, Sauna, Dampfbad und Kältebecken. Pure Entspannung in historischer Kulisse.', 'Bahnhofplatz, Bern', 'Bern', 'entspannt', 95, 2, 20, NULL, NULL);

-- TEAM KATEGORIE (👥 Team-Building Fokus)
INSERT INTO locations (name, description, address, city, category, price_per_person, capacity_min, capacity_max, phone, website) VALUES
('URBANescape Bern', 'Einzigartiges Outdoor Escape Game durch die Stadt Bern. Spaß, Spannung und Teambuilding kombiniert.', 'Verschiedene Startpunkte in Bern', 'Bern', 'team', 42, 4, 100, NULL, NULL),
('Gurten Park Teamevents', 'Berner Hausberg mit diversen Teamaktivitäten: Grillieren, Outdoor Escape Games, Hufeisenwerfen und mehr.', 'Gurten, Bern', 'Bern', 'team', 60, 10, 100, NULL, NULL);

-- KULTUR KATEGORIE (🎨 Kulturell & Bildung)
INSERT INTO locations (name, description, address, city, category, price_per_person, capacity_min, capacity_max, phone, website) VALUES
('Zentrum Paul Klee', 'Spektakuläre Architektur mit weltweit größter Paul Klee Sammlung. Workshops und Führungen für Gruppen verfügbar.', 'Monument im Fruchtland 3, Bern', 'Bern', 'kultur', 32, 5, 50, NULL, NULL),
('Naturhistorisches Museum Bern', 'Event unter dem Finnwal! Gruppenführungen und Teamevents in atemberaubender Museumskulisse.', 'Bernastrasse 15, Bern', 'Bern', 'kultur', 27, 10, 80, NULL, NULL),
('Museum für Kommunikation', 'Interaktives Teambuilding-Event mit Kommunikator:innen. Exklusiver Museumsbesuch mit Apéro-Option.', 'Helvetiastrasse, Bern', 'Bern', 'kultur', 50, 10, 100, NULL, NULL);

-- GAMES KATEGORIE (🎮 Spiele & Unterhaltung)
INSERT INTO locations (name, description, address, city, category, price_per_person, capacity_min, capacity_max, phone, website) VALUES
('Adventure Arena Bern Games', 'Reality Gaming auf über 1000m² mit bis zu 20 Abenteuer-Missionen. Das perfekte Indoor-Gaming-Erlebnis.', 'Nähe ÖV Bern', 'Bern', 'games', 30, 2, 100, NULL, NULL),
('MysteryRooms Interlaken', 'Escape Rooms für alle Generationen. Rätselspaß in der Nähe von Bern im Berner Oberland.', 'Bernastrasse 33, Interlaken', 'Interlaken', 'games', 37, 2, 6, NULL, NULL);

-- Zeige alle neuen Locations
SELECT 
  name, 
  city, 
  category, 
  price_per_person,
  capacity_min,
  capacity_max
FROM locations 
WHERE category IN ('indoor', 'entspannt', 'team', 'kultur', 'games')
ORDER BY category, name;

-- Zeige Kategorie-Übersicht
SELECT 
  category,
  COUNT(*) as location_count
FROM locations 
GROUP BY category
ORDER BY location_count DESC;
