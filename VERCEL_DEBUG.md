# Vercel Deployment Problem - Debug Info

## ❌ PROBLEM: OTP Route wird NICHT deployed

### Vercel Build Log zeigt:
```
├ ƒ /api/auth/magic-link          ← ALT (sollte nicht mehr gebraucht werden)
├ ƒ /api/auth/magic-link/logout   ← ALT
├ ƒ /api/auth/otp                 ← FEHLT! ❌❌❌
```

### Sollte sein:
```
├ ƒ /api/auth/otp                 ← NEU (für Code send/verify)
├ ƒ /api/auth/magic-link/logout   ← Behalten (für Logout)
```

---

## 🔍 VERIFIKATION:

### Lokal:
```bash
✅ ls src/app/api/auth/otp/route.ts → Existiert
✅ npm run build → Erfolgreich
✅ git show HEAD:src/app/api/auth/otp/route.ts → Datei ist auf GitHub
```

### Vercel:
```
❌ Build Logs zeigen KEINE /api/auth/otp Route
❌ Wahrscheinlich Build-Fehler oder Route wird nicht erkannt
```

---

## 💡 MÖGLICHE URSACHEN:

### 1. Next.js App Router Convention Problem
**Problem:** Vercel erkennt die Route nicht als API Route

**Mögliche Gründe:**
- Dateiname falsch (sollte `route.ts` sein) ✅ Ist korrekt
- Export falsch (sollte `export async function POST`) ✅ Ist korrekt
- Ordner-Struktur falsch ✅ Ist korrekt: `app/api/auth/otp/route.ts`

### 2. TypeScript Compilation Error auf Vercel
**Problem:** Vercel's TypeScript Compiler wirft Fehler

**Test lokal:**
```bash
npx tsc --noEmit src/app/api/auth/otp/route.ts
```
**Ergebnis:** Zeigt Error mit `@/lib/supabase` Import

**Aber:** `npm run build` funktioniert (Next.js kompiliert anders als tsc)

### 3. Git / GitHub Problem
**Problem:** Datei ist lokal aber nicht auf GitHub
**Status:** ❌ AUSGESCHLOSSEN - git show bestätigt Datei ist da

### 4. Vercel Build Cache
**Problem:** Vercel cached alte Build-Konfiguration
**Status:** Haben wir mit Empty Commit versucht

---

## 🔧 LÖSUNGSVERSUCHE:

### Versuch 1: File neu erstellen mit sauberer Struktur
Einfache, minimale Version ohne komplexe Imports

### Versuch 2: Route umbenennen
Von `/api/auth/otp/route.ts` zu `/api/otp/route.ts`

### Versuch 3: Explicit Runtime Export
```typescript
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
```

---

## 🎯 EMPFEHLUNG FÜR CLAUDE.AI:

**Das Problem ist dass Vercel die OTP Route NICHT erkennt/baut!**

Mögliche Lösungen:
1. Route-Datei neu erstellen mit expliziten Exports
2. Route an anderen Ort verschieben (`/api/otp` statt `/api/auth/otp`)
3. Vercel Support kontaktieren
4. Alternative: OTP direkt in Login/Register Pages (ohne API Route)

**Was würdest du empfehlen?**

