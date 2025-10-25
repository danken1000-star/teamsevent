# ⚠️  ALLE USER-DATEN LÖSCHEN

## WICHTIG: Diese Operation kann NICHT rückgängig gemacht werden!

Diese SQL-Datei löscht **ALLE** User-generierten Daten aus der Datenbank:

### Was wird gelöscht:
- ✅ Alle **Events**
- ✅ Alle **Team-Mitglieder** (Namen, E-Mails, Ernährungspräferenzen)
- ✅ Alle **Votes** (Abstimmungen mit Namen und E-Mails)
- ✅ Alle **Feedback**
- ✅ Alle **Event-Locations** (Zuordnungen)

### Was bleibt:
- ✅ **Locations** Tabelle (die vordefinierten Locations)
- ✅ **Datenbank-Struktur** (alle Tabellen bleiben erhalten)
- ✅ **Auth Users** (falls vorhanden)

## So führen Sie das SQL aus:

1. Gehe zu deiner **Supabase-Konsole** (supabase.com)
2. Öffne dein Projekt (teamsevent)
3. Klicke auf **"SQL Editor"** im linken Menü
4. Kopiere den **kompletten Inhalt** von `CLEAR_ALL_DATA.sql`
5. Füge ihn in den SQL Editor ein
6. Klicke auf **"Run"** oder drücke `Ctrl+Enter`

## Nach der Ausführung:

Am Ende des SQL-Scripts sehen Sie:
- Eine Übersicht aller Tabellen mit verbleibenden Einträgen (sollten alle `0` sein)
- Eine Bestätigungsnachricht "✅ All user data has been deleted!"

## Vorsicht:
⚠️  Diese Operation ist **permanent** und **nicht rückgängig machbar**!
⚠️  Erstellen Sie ggf. vorher ein Backup in Supabase!

