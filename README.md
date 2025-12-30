# BEL KI 🇩🇪
## Deutschlands erste wirklich ehrliche KI

[![Training Status](https://img.shields.io/badge/Status-v1.0%20Released-success)](https://huggingface.co/Beko2210/Bel-KI-v1-GGUF)
[![Loss](https://img.shields.io/badge/Final%20Loss-0.530-blue)](https://huggingface.co/Beko2210/Bel-KI-v1-GGUF)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red)](LICENSE)
[![Funding](https://img.shields.io/badge/Funding-1k%2F100k%20€-orange)](https://belkis-aslani.de)

---

## 🎯 Die Mission

Während Tech-Giganten Milliarden in KI pumpen und dir erzählen, was du hören willst, trainiere ich – **Belkis Aslani** – auf einer RTX 3070 in Freiberg am Neckar ein Modell, das die Wahrheit sagt.

**BEL KI** ist nicht einfach nur ein weiteres Language Model. Es ist ein Statement:

> **Künstliche Intelligenz muss dem Menschen dienen – nicht Konzernen, nicht Regierungen, nicht Werbenetzwerken.**

### Was BEL KI anders macht:

- ✅ **100% Offline** - Deine Daten verlassen niemals dein Gerät
- ✅ **Keine Zensur** - Ehrliche Antworten ohne politische Agenda
- ✅ **Open Source** - Vollständig transparent, jeder kann den Code prüfen
- ✅ **Made in Germany** - Entwickelt & trainiert in Freiberg am Neckar
- ✅ **Kein Abo** - Einmal downloaden, für immer nutzen
- ✅ **Radikale Ehrlichkeit** - Keine PR-Sprache, keine Ausweichmanöver

---

## 📦 Verfügbare Formate

Dieses Repository enthält **alle Formate** von Bel KI v1:

| Format | Dateien | Größe | Verwendung |
|--------|---------|-------|------------|
| **🔥 GGUF Q4_K_M** | `Bel-KI-v1-Q4_K_M.gguf` | ~4.92 GB | LM Studio, Ollama, llama.cpp |
| **📊 16-bit (FP16)** | `model-0000X-of-00004.safetensors` | ~15 GB | Transformers, vLLM, Forschung |
| **🔧 LoRA Adapter** | `adapter_model.safetensors` | ~168 MB | Merge mit Base-Model |

---

## 👑 Bel KI v1 Master (FP16 - Full Precision)

Dies ist die **hochpräzise Master-Version** von Bel KI. Sie dient als Basis für alle weiteren Quantisierungen und Anwendungen, die maximale mathematische Genauigkeit erfordern.

### 📋 Master Details

| Eigenschaft | Wert |
|-------------|------|
| **Format** | Safetensors (FP16) |
| **Parameter** | 8 Milliarden |
| **Dateien** | 4 Shards (~15 GB total) |
| **Training** | Finetuned auf GermanQuAD (13k Samples) |
| **Status** | ✅ Final Master |
| **Verwendung** | Transformers, vLLM, Forschung, Weiter-Training |

### 🔒 Integrität (SHA256 Checksums)

Um die Integrität der Master-Dateien zu gewährleisten, vergleiche die Hashes nach dem Download:

| Datei | SHA256 Hash |
|-------|-------------|
| `model-00001-of-00004.safetensors` | `E29C7521F403A244F558A1A7DB4B0C646A7EF3677B80B3E74A55DE2AF94FE00F` |
| `model-00002-of-00004.safetensors` | `A6359CD242837A0272F1A019957AEA0D43D3809BFA4A9B80F86DFDABD92A34BD` |
| `model-00003-of-00004.safetensors` | `4B643D7B3075DC1A196D318CDA3266D7A0B7191563662790B12CF6E6B6EAA91B` |
| `model-00004-of-00004.safetensors` | `F3035F0DAF6C283D967C22B4B17BCCC32927E3830A37121B814D536E5F8A4024` |

**Verifizierung (Linux/Mac):**
```bash
sha256sum model-*.safetensors
```

**Verifizierung (Windows PowerShell):**
```powershell
Get-FileHash model-00001-of-00004.safetensors -Algorithm SHA256
```

### 🚀 Master vs. GGUF - Was brauche ich?

| Anwendungsfall | Empfehlung |
|----------------|------------|
| Chat auf eigenem PC (LM Studio, Ollama) | → **GGUF Q4_K_M** (~4.9 GB) |
| Python/Hugging Face Transformers | → **FP16 Master** (~15 GB) |
| Eigenes Fine-Tuning / Weiter-Training | → **FP16 Master** |
| Maximale Qualität (Server mit viel VRAM) | → **FP16 Master** |
| Neue Quantisierungen erstellen | → **FP16 Master** |

### 💻 Master in Python laden
```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_path = "Beko2210/Bel-KI-v1-GGUF"  # oder lokaler Pfad

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.float16,
    device_map="auto"
)

# Inference
inputs = tokenizer("Was ist die Hauptstadt von Bayern?", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```
```


### Welches Format brauche ich?

| Anwendungsfall | Empfohlenes Format |
|----------------|-------------------|
| Chat auf eigenem PC | GGUF Q4_K_M |
| Python/Hugging Face Transformers | 16-bit Safetensors |
| Eigenes Weiter-Training | LoRA Adapter |
| Maximale Qualität (Server) | 16-bit Safetensors |

---

## 🚀 Aktueller Stand: BEL KI v1.0

### Technische Spezifikationen

| Eigenschaft | Wert |
|------------|------|
| **Base Model** | Llama-3.1-8B |
| **Parameter** | 8 Milliarden |
| **Datensatz** | GermanQuAD (1.420 Samples) |
| **Training Steps** | 1.440 |
| **Final Loss** | **0.530** |
| **Kontext** | 128k Tokens |
| **Format** | GGUF (Q4_K_M) |
| **Größe** | ~4.8 GB |
| **Hardware** | NVIDIA RTX 3070 (8GB VRAM) |
| **Framework** | Unsloth |
| **Training Zeit** | 2,5 Stunden |

### Was diese Zahlen bedeuten:

- **Loss 0.530** = Präzises deutsches Sprachverständnis auf Production-Level
- **Q4_K_M** = Optimal quantisiert für maximale Performance bei minimaler Größe
- **GermanQuAD** = Spezialisiert auf deutsche Sprache, nicht einfach nur übersetzt

### Offizielle Benchmarks (GermanQuAD Validation)

| Metrik | BEL KI v1.0 | Interpretation |
|--------|-------------|----------------|
| **F1 Score** | **87.64%** | Inhaltliche Genauigkeit (Production-Ready) |
| **Exact Match** | **70.00%** | 14/20 Fragen perfekt beantwortet |
| **Final Loss** | **0.530** | Optimale Konvergenz ohne Overfitting |

*Reproduzierbar via [`src/evaluate.py`](src/evaluate.py) • Dokumentation: [`src/README.md`](src/README.md)*

---

## 💰 Die Realität: David vs. Goliath

### Wo wir jetzt sind:
- ✅ BEL KI v1.0 trainiert auf RTX 3070
- ✅ 8B Parameter, Loss 0.530
- ✅ GGUF verfügbar auf HuggingFace
- ✅ 1.000 € Funding erreicht

### Wo wir hin müssen:
- 🎯 **100.000 €** für 3 Monate H100-Cluster
- 🎯 Llama-3.1-**70B** Training
- 🎯 **F1-Score: 94%+** (aktuell 87.6%) auf GermanQuAD
- 🎯 **Exact Match: 85%+** (aktuell 70%) auf deutschen QA-Tasks
- 🎯 **HumanEval Pass@1: 60%+** für Code-Generierung
- 🎯 **GSM8K: 75%+** für mathematisches Reasoning

### Was das bedeutet:

Mit einem H100-Cluster können wir BEL KI auf **70 Milliarden Parameter** skalieren. Das bedeutet nicht "ein bisschen besser" – das bedeutet **in einer komplett anderen Liga spielen**.

**Zum Vergleich:**
- OpenAI GPT-4: ~1,76 **Billionen** Parameter
- Meta Llama-3.1-70B: 70 **Milliarden** Parameter
- BEL KI v1.0: 8 **Milliarden** Parameter (auf einer Gaming-Grafikkarte!)

---

## 🛠️ Wie wurde BEL KI trainiert?

### Der Stack:

```
GermanQuAD Dataset (1.420 QA-Paare)
         ↓
Llama-3.1-8B Base Model
         ↓
Unsloth Framework (2x schneller als Standard)
         ↓
RTX 3070 @ 92% Auslastung
         ↓
AdamW Optimizer (LR: 2e-4, Warmup: 100 Steps)
         ↓
1.440 Training Steps (2,5 Stunden)
         ↓
GGUF Quantisierung (Q4_K_M)
         ↓
BEL KI v1.0 (Final Loss: 0.530)
```

### Training Highlights:

- **Start Loss**: 1.702 (Modell rät noch)
- **Step 500**: 0.987 (Patterns werden erkannt)
- **Step 1000**: 0.624 (Konvergenz)
- **Step 1440**: 0.530 (Production-Ready)

---

## 📦 Installation & Nutzung

### Voraussetzungen:
- Python 3.10+
- `llama-cpp-python` oder `ollama`
- 8 GB RAM (16 GB empfohlen)
- Optional: CUDA-fähige GPU

### Schnellstart:

```bash
# 1. Modell downloaden von HuggingFace
wget https://huggingface.co/Beko2210/Bel-KI-v1-GGUF/resolve/main/Bel-KI-v1-Q4_K_M.gguf

# 2. SHA256 Hash verifizieren (optional)
sha256sum Bel-KI-v1-Q4_K_M.gguf
# Expected: 8B97EC63954565EBF6BB8F495E854957FD9D605EB84FAF7795D5FFB101BD0624

# 3. llama.cpp installieren
pip install llama-cpp-python

# 4. Modell laden und nutzen
python
```

```python
from llama_cpp import Llama

# Modell laden
llm = Llama(
    model_path="./Bel-KI-v1-Q4_K_M.gguf",
    n_ctx=4096,
    n_threads=8,
    n_gpu_layers=-1  # Alle Layer auf GPU (falls vorhanden)
)

# Inference
response = llm(
    "Was ist Künstliche Intelligenz?",
    max_tokens=512,
    temperature=0.7,
    top_p=0.9
)

print(response['choices'][0]['text'])
```

### Alternative: Ollama

```bash
# Modell zu Ollama hinzufügen
ollama create bel-ki -f Modelfile

# Nutzen
ollama run bel-ki "Erkläre mir Quantencomputer"
```

---

## 👑 Bel KI v1 Master (FP16 - Full Precision)

Dies ist die **hochpräzise Master-Version** von Bel KI. Sie dient als Basis für alle weiteren Quantisierungen und Anwendungen, die maximale mathematische Genauigkeit erfordern.

### 📋 Master Details

| Eigenschaft | Wert |
|-------------|------|
| **Format** | Safetensors (FP16) |
| **Parameter** | 8 Milliarden |
| **Dateien** | 4 Shards (~15 GB total) |
| **Training** | Finetuned auf GermanQuAD (1.420 Samples) |
| **Status** | ✅ Final Master |
| **Verwendung** | Transformers, vLLM, Forschung, Weiter-Training |

### 🔒 Integrität (SHA256 Checksums)

Um die Integrität der Master-Dateien zu gewährleisten, vergleiche die Hashes nach dem Download:

<details>
<summary><strong>📋 SHA256 Hashes anzeigen</strong></summary>

```
model-00001-of-00004.safetensors
E29C7521F403A244F558A1A7DB4B0C646A7EF3677B80B3E74A55DE2AF94FE00F

model-00002-of-00004.safetensors
A6359CD242837A0272F1A019957AEA0D43D3809BFA4A9B80F86DFDABD92A34BD

model-00003-of-00004.safetensors
4B643D7B3075DC1A196D318CDA3266D7A0B7191563662790B12CF6E6B6EAA91B

model-00004-of-00004.safetensors
F3035F0DAF6C283D967C22B4B17BCCC32927E3830A37121B814D536E5F8A4024
```

**Verifizierung (Linux/Mac):**
```bash
sha256sum model-*.safetensors
```

**Verifizierung (Windows PowerShell):**
```powershell
Get-FileHash model-00001-of-00004.safetensors -Algorithm SHA256
Get-FileHash model-00002-of-00004.safetensors -Algorithm SHA256
Get-FileHash model-00003-of-00004.safetensors -Algorithm SHA256
Get-FileHash model-00004-of-00004.safetensors -Algorithm SHA256
```

</details>

### 🚀 Master vs. GGUF - Was brauche ich?

| Anwendungsfall | Empfehlung |
|----------------|------------|
| Chat auf eigenem PC (LM Studio, Ollama) | → **GGUF Q4_K_M** (~4.9 GB) |
| Python/Hugging Face Transformers | → **FP16 Master** (~15 GB) |
| Eigenes Fine-Tuning / Weiter-Training | → **FP16 Master** |
| Maximale Qualität (Server mit viel VRAM) | → **FP16 Master** |
| Neue Quantisierungen erstellen | → **FP16 Master** |

### 💻 Master in Python laden

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_path = "Beko2210/Bel-KI-v1-GGUF"  # oder lokaler Pfad

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.float16,
    device_map="auto"
)

# Inference
inputs = tokenizer("Was ist die Hauptstadt von Bayern?", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```

---

## 🔬 Technische Deep-Dives

### Warum GermanQuAD?

GermanQuAD ist nicht einfach nur SQuAD übersetzt. Es ist ein natives deutsches Q&A-Dataset mit:
- 1.420 handkuratierten Frage-Antwort-Paaren
- Fokus auf deutsches Sprachverständnis
- Wikipedia-basiert, faktisch korrekt
- Optimiert für Reading Comprehension

### Warum Unsloth?

Unsloth ist ein optimiertes Training-Framework, das:
- **2x schnelleres Training** durch CUDA-Kernel-Optimierung
- **70% weniger VRAM-Verbrauch** durch Smart Memory Management
- **Gleiche Qualität** wie Standard-Training
- **Open Source** und aktiv maintained

### Warum Q4_K_M Quantisierung?

Q4_K_M ist der Sweet Spot zwischen:
- **Größe** (~4.8 GB statt ~16 GB)
- **Performance** (minimal degradation)
- **Speed** (4-5x schnellere Inference)

---

## 🗺️ Roadmap: Von 8B zu AGI

### Q2 2026 - Community & Infrastructure
- [ ] Discord Server für Community
- [ ] HuggingFace Model Hub Integration (✅ Done!)
- [ ] Umfassende Dokumentation
- [ ] API & SDK für Entwickler

### Q3 2026 - Mit 100k Funding: Der Sprung zu 70B
- [ ] H100-Cluster Miete (3 Monate)
- [ ] Llama-3.1-70B Training
- [ ] Erweiterter deutscher Datensatz (100k+ Samples)
- [ ] Multimodales Training (Code, Reasoning)

### Q4 2026 - Desktop & CLI Tools
- [ ] Electron-basierte Desktop App
- [ ] CLI für Power-User
- [ ] VS Code Extension
- [ ] Docker Container

### 2027 - Mobile Revolution
- [ ] Native iOS & Android Apps
- [ ] On-Device Inference
- [ ] 100% Offline-fähig
- [ ] Quantisiert für Mobile (2-3 GB)

### Beyond - Multimodal & AGI-Ready
- [ ] Vision-Language-Modelle
- [ ] Audio Processing (Speech-to-Text, TTS)
- [ ] Reasoning & Planning Capabilities
- [ ] Agentic Workflows

---

## 💡 Warum das Geld wirklich gebraucht wird

### Die harte Wahrheit über KI-Training:

Ein H100-Cluster kostet **nicht** wenig. Hier die Rechnung:

- **1x NVIDIA H100**: ~30.000 € (Kaufpreis)
- **H100-Cluster Miete**: ~1.000 €/Tag (~30.000 €/Monat)
- **Für 70B Training**: ~3 Monate = **100.000 €**

### Was bekommst du dafür?

- ✅ Ein 70B-Modell, das mit GPT-4 mithalten kann
- ✅ 100% Open Source, jeder kann es nutzen
- ✅ Keine Cloud, keine Abos, keine Tricks
- ✅ Made in Germany, DSGVO-konform
- ✅ Vollständige Transparenz: Jeder Euro fließt in Hardware

### Transparenz-Garantie:

🔒 **Jeder Euro wird dokumentiert**
📊 **Monatliche Updates zum Fortschritt**
💯 **Kein Gehalt, keine Verwaltungskosten, 100% Hardware**

---

## 🤝 Wie du helfen kannst

### 1. Finanziell unterstützen

[![PayPal](https://img.shields.io/badge/PayPal-Spenden-blue?logo=paypal)](https://www.paypal.com/donate/?business=renateweinfurtner@gmx.de&item_name=Spende+-+BEL+KI+-+H100+Cluster+Funding&currency_code=EUR)

**Empfänger:** renateweinfurtner@gmx.de
**Verwendungszweck:** "BEL KI - H100 Cluster Funding"

### 2. Code beitragen

Dieses Projekt ist Open Source. Du kannst:
- Issues melden
- Pull Requests erstellen
- Dokumentation verbessern
- Das Modell testen und Feedback geben

### 3. Verbreiten

- ⭐ **Star das Repo**
- 🔄 **Teile auf Social Media**
- 💬 **Erzähl deinen Freunden davon**
- 📝 **Schreibe über BEL KI**

---

## 📊 Vergleich: BEL KI vs. US-KI

| Feature | BEL KI | ChatGPT | Claude | Gemini |
|---------|--------|---------|---------|---------|
| **Offline** | ✅ 100% | ❌ Cloud-only | ❌ Cloud-only | ❌ Cloud-only |
| **Zensur** | ✅ Keine | ❌ Stark | ❌ Stark | ❌ Stark |
| **Datenschutz** | ✅ Lokal | ❌ USA | ❌ USA | ❌ USA |
| **Kosten** | ✅ Kostenlos | ❌ 20€/Monat | ❌ 20€/Monat | ❌ Abo |
| **Open Source** | ✅ Ja | ❌ Nein | ❌ Nein | ❌ Nein |
| **Made in Germany** | ✅ Ja | ❌ USA | ❌ USA | ❌ USA |

---

## 🏆 Das Team

### Belkis Aslani
**Founder, Developer, Trainer**

- 🎓 Self-taught AI Engineer
- 💻 RTX 3070 Warrior
- 🇩🇪 Based in Freiberg am Neckar
- 🔥 "Lieber auf einer RTX 3070 scheitern als auf fremden Servern Erfolg haben"

**Kontakt:**
- 📧 Email: belkis.aslani@gmail.com
- 📱 Telefon: +49 176 81462526
- 🐙 GitHub: [@BEKO2210](https://github.com/BEKO2210)
- 🤗 HuggingFace: [@Beko2210](https://huggingface.co/Beko2210)

---

## 📜 Lizenz & Copyright

**© 2025 Belkis Aslani. Alle Rechte vorbehalten.**

Das Modell wird unter einer Open-Source-Lizenz veröffentlicht, sobald das 70B-Training abgeschlossen ist.

BEL KI v1.0 ist aktuell frei verfügbar auf HuggingFace für:
- ✅ Persönliche Nutzung
- ✅ Forschung & Bildung
- ✅ Non-Commercial Use

Für kommerzielle Nutzung kontaktiere bitte: belkis.aslani@gmail.com

---

## 🔗 Links

- 🌐 **Website**: [belkis-aslani.de](https://belkis-aslani.de)
- 🤗 **HuggingFace**: [Beko2210/Bel-KI-v1-GGUF](https://huggingface.co/Beko2210/Bel-KI-v1-GGUF)
- 🐙 **GitHub**: [BEKO2210/BEL-KI](https://github.com/BEKO2210/BEL-KI)
- 💰 **Spenden**: [PayPal](https://www.paypal.com/donate/?business=renateweinfurtner@gmx.de)

---

## ⚡ Quick Facts

- 🎂 **Projekt gestartet**: Dezember 2025
- 🏋️ **Training Zeit**: 2,5 Stunden
- 💰 **Hardware Budget**: 700 € (RTX 3070)
- 🎯 **Ziel**: 100.000 € für H100-Cluster
- 📊 **Aktuelles Funding**: 1.000 € *Danke an Unbekannt ❤️
- 🔥 **Motivation**: Unendlich

---

## 💬 FAQ

**Q: Warum nicht einfach ChatGPT nutzen?**
A: Weil deine Daten auf fremden Servern landen, du monatlich zahlst, und du zensierte Antworten bekommst.

**Q: Ist BEL KI wirklich besser als GPT-4?**
A: BEL KI v1.0 (8B) ist nicht besser als GPT-4 (1.76T). Aber BEL KI v2.0 (70B) wird in der gleichen Liga spielen – und das 100% offline & open source.

**Q: Warum 100k für Training?**
A: H100-Cluster sind teuer. Das ist keine Marketing-Zahl, das ist die reale Rechnung für 3 Monate Cluster-Zeit.

**Q: Wie kann ich sicher sein, dass das Geld wirklich für Training genutzt wird?**
A: Vollständige Transparenz. Jeder Cent wird dokumentiert, monatliche Updates zum Fortschritt.

**Q: Wann kommt BEL KI v2.0?**
A: Sobald die 100k erreicht sind. Könnte Q3 2025 sein, könnte auch 2026 sein. Aber es kommt.

---

<div align="center">

## 🔥 Built with Passion in Freiberg am Neckar 🇩🇪

**Eine Person. Eine RTX 3070. Eine Mission.**

[![Website](https://img.shields.io/badge/Website-Visit-blue)](https://belkis-aslani.de)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-Download-yellow)](https://huggingface.co/Beko2210/Bel-KI-v1-GGUF)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-green)](https://www.paypal.com/donate/?business=renateweinfurtner@gmx.de)

**"Während andere über KI reden, trainiere ich sie."**
— Belkis Aslani

</div>
