# Locations & Kategorien Prüfung

## SQL Abfrage für Supabase

```sql
-- Alle Kategorien mit Anzahl Locations
SELECT DISTINCT category, COUNT(*) as location_count
FROM locations
GROUP BY category
ORDER BY location_count DESC;
```

## Erwartete Kategorien (von Schritt 1):

1. ⚡ **Aktiv** (activity)
2. 🍔 **Essen** (restaurant)
3. 🏢 **Indoor** (indoor)
4. ⛰️ **Outdoor** (outdoor)
5. 😌 **Entspannt** (wellness)
6. 👥 **Team** (team_building)
7. 🎨 **Kultur** (culture)
8. 🎮 **Games** (entertainment)

## Nächste Schritte:

Wenn Kategorien fehlen:
1. **Ich kann SQL erstellen** um neue Locations hinzuzufügen
2. **Du musst mir die Daten geben** (Name, Stadt, Adresse, Preis, etc.)
3. **Oder ich erstelle SQL-Templates** die du mit Claude.ai befüllen kannst

Ich kann NICHT selbst recherchieren oder neue echte Locations erstellen!
