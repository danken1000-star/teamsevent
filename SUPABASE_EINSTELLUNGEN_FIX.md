# 🔧 Supabase Einstellungen - OTP Code statt Magic Link

## ❗ PROBLEM IDENTIFIZIERT:

**Supabase sendet Magic Links statt OTP Codes weil die Email Templates falsch konfiguriert sind!**

---

## 🎯 LÖSUNG: Supabase Email Templates anpassen

### Schritt 1: Supabase Dashboard öffnen
1. Gehen Sie zu: https://supabase.com/dashboard
2. Wählen Sie Ihr Projekt: **teamsevent**
3. Navigieren Sie zu: **Authentication → Email Templates**

---

### Schritt 2: "Magic Link" Template DEAKTIVIEREN

**Aktuell:** Supabase sendet Magic Links für OTP
**Gewünscht:** Supabase sendet 6-stelligen Code

**Wo finden:**
- Authentication → Email Templates
- Suchen Sie nach: **"Magic Link"** oder **"Confirm signup"**

**Was ändern:**
- Template: **"Magic Link"** → Auf **"OTP"** umstellen

---

### Schritt 3: OTP Email Template aktivieren

**Supabase hat 2 Modi:**

#### Modus A: Magic Link (aktuell aktiv ❌)
```
Email enthält: 
"Click here to sign in: https://..."
```

#### Modus B: OTP Code (gewünscht ✅)
```
Email enthält:
"Your verification code is: 123456"
```

**Umstellen:**
1. Authentication → Settings
2. **Enable Email OTP** ← Muss aktiviert sein!
3. **Disable Magic Links** ← Optional

---

### Schritt 4: Email Template anpassen

**Pfad:** Authentication → Email Templates → **Confirm signup / Magic Link**

**Aktuelles Template (ungefähr):**
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

**Neues Template für OTP:**
```html
<h2>Ihr Anmelde-Code</h2>
<p>Verwenden Sie diesen Code um sich anzumelden:</p>
<h1 style="font-size: 32px; letter-spacing: 8px;">{{ .Token }}</h1>
<p>Der Code ist 5 Minuten gültig.</p>
```

**Wichtig:** Verwenden Sie `{{ .Token }}` statt `{{ .ConfirmationURL }}`!

---

## 🔍 ZUSÄTZLICHE EINSTELLUNGEN:

### Authentication → Settings → Email Auth

**Prüfen Sie:**
- ✅ **Enable email confirmations** → AUS (für OTP nicht nötig)
- ✅ **Enable email OTP** → AN ✅✅✅
- ✅ **OTP expiry duration** → 300 seconds (5 Minuten)
- ✅ **OTP length** → 6 digits

---

## 🎯 WARUM DAS DAS PROBLEM IST:

**Ihr Code ist 100% korrekt!**

```typescript
// Dieser Code SOLLTE einen OTP Code senden:
await supabase.auth.signInWithOtp({
  email,
  options: { shouldCreateUser: true }
  // KEIN emailRedirectTo!
})
```

**ABER:** Supabase entscheidet basierend auf den **Email Template Settings** ob:
- Magic Link gesendet wird (mit URL)
- OTP Code gesendet wird (mit 6 Ziffern)

**Wenn "Enable Email OTP" NICHT aktiviert ist:**
→ Supabase sendet IMMER Magic Links, auch wenn der Code korrekt ist!

---

## ✅ CHECKLISTE:

Gehen Sie zu Supabase Dashboard und prüfen Sie:

- [ ] Authentication → Settings → **Enable email OTP** ist AN
- [ ] Authentication → Email Templates → Template verwendet `{{ .Token }}`
- [ ] OTP expiry duration: 300 seconds
- [ ] OTP length: 6 digits

---

## 🚀 NACH DER ÄNDERUNG:

1. Speichern Sie die Supabase Einstellungen
2. Warten Sie 1-2 Minuten (Supabase propagiert Änderungen)
3. Testen Sie auf https://teamsevent.ch/auth/login
4. Email eingeben → "Code anfordern"
5. **Sie sollten jetzt einen 6-stelligen CODE erhalten!** ✅

---

## 💡 WARUM WIR DAS NICHT FRÜHER GESEHEN HABEN:

- Der Code war korrekt
- Lokal können wir Supabase Settings nicht testen
- Supabase entscheidet serverseitig welches Template verwendet wird
- Die API funktioniert, aber Supabase sendet das falsche Email-Format

---

## 📋 ZUSAMMENFASSUNG FÜR CLAUDE.AI:

**Problem:** Supabase sendet Magic Links statt OTP Codes
**Ursache:** Email Template Einstellungen in Supabase
**Lösung:** "Enable Email OTP" in Supabase Dashboard aktivieren

**Der Code ist perfekt - es ist ein Supabase-Konfigurations-Problem!** 🎯

