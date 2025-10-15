# TeamEvent.ch - Tag 15 Starter Prompt für Claude.ai

## 🎯 HEUTE FOKUS: Auth-System Entscheidung treffen

**Status nach Tag 14:** MVP ~98% fertig, aber **kritisches Auth-Problem** mit Gmail/Outlook

---

## ✅ WAS FUNKTIONIERT PERFEKT:

- ✅ Activity-based Event Creation (30 Activities im Katalog)
- ✅ Event Detail zeigt Activities mit Budget Overview
- ✅ Magic Link Login/Registration mit **temp-mail.org** Adressen
- ✅ Session bleibt bestehen (Cookies funktionieren)
- ✅ Kompletter Event Flow (Create → Invite → Vote → Finalize)
- ✅ Logout fix (Cookie-Deletion implementiert)

---

## 🔴 KRITISCHES PROBLEM: Gmail/Outlook Magic Links

### Problem:
- **Mit temp-mail.org:** ✅ Funktioniert perfekt
- **Mit Gmail/Outlook:** ❌ "Link expired" nach 1-2 Minuten

### Root Cause:
Gmail/Outlook haben **Email Security Scanner** die:
1. Magic Link automatisch beim Scannen anklicken
2. Token als "verwendet" markieren
3. User klickt später → Token ist abgelaufen

### Warum haben wir Magic Link gewählt?
- **Vorherige Probleme mit Passwort-Auth:**
  - Session-Management war komplex
  - Password Reset Flow fehlerhaft
  - Cookie-Probleme mit Middleware
  - User vergessen Passwörter

**Magic Link schien einfacher:**
- Kein Passwort nötig
- Supabase managed Session automatisch
- User-freundlicher

---

## 💡 LÖSUNGSOPTIONEN (zu evaluieren):

### Option 1: Magic Link beibehalten + Workarounds
**Vorteile:**
- Code bleibt wie er ist
- User-freundlich (kein Passwort)

**Nachteile:**
- Gmail/Outlook User müssen Link innerhalb 5 Min klicken
- Bekanntes Supabase-Limitation
- Support-Aufwand

**Workarounds:**
- Token-Gültigkeit auf 24h erhöhen (Supabase Settings)
- User informieren: "Klicken Sie den Link sofort"
- Fallback: "Link abgelaufen? Neuen Link anfordern"

---

### Option 2: OTP Code (6-stelliger Code)
**Vorteile:**
- ✅ Kein Link = kein Scanner-Problem
- ✅ Funktioniert mit allen Email-Providern
- ✅ User gibt Code manuell ein
- ✅ Supabase unterstützt OTP nativ

**Nachteile:**
- Code-Input-Feld nötig (UX etwas komplexer)
- User muss Email + Code eingeben (2 Schritte)

**Implementierung:**
```typescript
// 1. OTP senden
await supabase.auth.signInWithOtp({ email })

// 2. User gibt Code ein
await supabase.auth.verifyOtp({ 
  email, 
  token: userEnteredCode 
})
```

**UX Flow:**
1. User gibt Email ein → "Code gesendet"
2. Code-Input-Feld erscheint (6 Ziffern)
3. User gibt Code ein → Login

---

### Option 3: Hybrid: Magic Link + OTP Fallback
**Vorgehen:**
- Magic Link als Standard (temp-mail funktioniert)
- Wenn Link abgelaufen → "Code anfordern" Button
- OTP als Fallback

**Vorteile:**
- Best of both worlds
- User hat Wahl

**Nachteile:**
- Komplexerer Code
- 2 Auth-Flows zu maintainen

---

## 🔍 TECHNISCHE DETAILS:

### Aktueller Magic Link Flow:
```
1. User gibt Email ein
2. POST /api/auth/magic-link
3. Supabase sendet Email mit Link
4. User klickt Link
5. Callback Route: /auth/callback?token=pkce_...
6. Session wird gesetzt
7. Redirect zu /dashboard
```

### Aktueller Code (funktioniert mit temp-mail):
- `src/app/api/auth/magic-link/route.ts` - Sendet Magic Link
- `src/app/auth/callback/route.ts` - Verarbeitet PKCE Token
- `src/app/auth/login/page.tsx` - UI
- `src/app/auth/register/page.tsx` - UI

### Was funktioniert:
- ✅ PKCE Flow mit temp-mail
- ✅ Session bleibt bestehen
- ✅ Logout (nach heutigem Fix)
- ✅ Registration erstellt User automatisch

---

## 🎯 ENTSCHEIDUNG FÜR MORGEN:

**Claude.ai soll evaluieren:**

1. **Option A:** Magic Link beibehalten + Workarounds
   - Ist der Support-Aufwand akzeptabel?
   - Können wir User gut informieren?

2. **Option B:** Zu OTP Code wechseln
   - Wie komplex ist die Implementierung?
   - Wie ist die UX im Vergleich?

3. **Option C:** Hybrid-Lösung
   - Lohnt sich der zusätzliche Code?

**WICHTIG:** Magic Link war bewusste Entscheidung wegen vorheriger Probleme mit Passwort-Auth!

---

## 📊 MVP STATUS: ~98%

**Offen:**
- Auth-System finalisieren
- Mobile Testing
- Gmail/Outlook Problem lösen

**Fertig:**
- Event Creation mit Activities
- Team Invitation & Voting
- Event Finalization
- Dashboard & Stats
- Responsive Design

---

## 🔗 LINKS:

- Live: https://www.teamsevent.ch
- GitHub: https://github.com/danken1000-star/teamsevent
- Test-Account (temp-mail): oves763@fanlvr.com

---

## 💬 AN CLAUDE.AI:

**Bitte evaluiere die 3 Optionen und empfehle die beste Lösung für unser MVP.**

**Kriterien:**
- User Experience
- Implementierungsaufwand
- Wartbarkeit
- Support-Aufwand

**Kontext:** Magic Link war bewusste Entscheidung wegen vorheriger Probleme mit Passwort-Auth. Jetzt haben wir Scanner-Problem mit Gmail/Outlook, aber temp-mail funktioniert perfekt.

**Frage:** Sollen wir zu OTP wechseln oder Magic Link mit Workarounds behalten?

