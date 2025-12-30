# 🚀 BEL KI Live Chat Deployment Guide

## Problem: CORS-Fehler

Die HuggingFace Inference API erlaubt keine direkten Browser-Anfragen aus Sicherheitsgründen.

## ✅ Lösung 1: Cloudflare Worker (Empfohlen - Kostenlos)

### Schritt 1: Cloudflare Account erstellen
1. Gehe zu [cloudflare.com](https://cloudflare.com)
2. Erstelle einen kostenlosen Account

### Schritt 2: Worker erstellen
1. Gehe zu **Workers & Pages**
2. Klicke **Create Worker**
3. Kopiere den Code aus `cloudflare-worker.js`
4. Füge ihn in den Worker-Editor ein
5. Klicke **Save and Deploy**

### Schritt 3: Worker-URL erhalten
Du bekommst eine URL wie: `https://bel-ki-proxy.username.workers.dev`

### Schritt 4: URL in Code einfügen
Öffne `assets/js/bel-brain.js` und ändere Zeile 12:
```javascript
const HF_MODEL_URL = "https://bel-ki-proxy.DEIN-USERNAME.workers.dev";
```

✅ **Fertig!** Der Chat funktioniert jetzt!

---

## ✅ Lösung 2: Vercel Serverless Function

### Schritt 1: Vercel Account
1. Gehe zu [vercel.com](https://vercel.com)
2. Verbinde dein GitHub Repository

### Schritt 2: API Route erstellen
Erstelle `api/proxy.js`:
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, inputs, parameters } = req.body;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/beko2210/Bel-KI-v1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs, parameters })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Schritt 3: Deploy
```bash
vercel --prod
```

### Schritt 4: URL verwenden
URL: `https://dein-projekt.vercel.app/api/proxy`

---

## ⚡ Temporäre Testlösung (Nicht für Production!)

Für schnelles Testing kannst du einen **öffentlichen CORS-Proxy** verwenden:

In `assets/js/bel-brain.js`:
```javascript
const CORS_PROXY = "https://corsproxy.io/?";
const HF_MODEL_URL = CORS_PROXY + encodeURIComponent("https://api-inference.huggingface.co/models/beko2210/Bel-KI-v1");
```

⚠️ **Warnung:** Öffentliche Proxies sind:
- Langsam
- Unzuverlässig
- Unsicher (sehen deinen Token)
- Nicht für Production geeignet

---

## 🎯 Empfehlung

**Beste Lösung:** Cloudflare Worker (5 Minuten Setup, kostenlos, schnell, sicher)
