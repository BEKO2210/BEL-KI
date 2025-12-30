# BEL KI - Training & Evaluation Scripts

Dieses Verzeichnis enthält alle Scripts, die für das Training und die Evaluation von BEL KI v1.0 verwendet wurden.

## 📁 Inhalt

- **`train.py`** - Training Script für Llama-3.1-8B auf GermanQuAD
- **`export.py`** - Export des trainierten Modells zu GGUF (Q4_K_M)
- **`evaluate.py`** - Benchmark-Evaluation mit F1 und Exact Match Metriken

---

## 🚀 Training (`train.py`)

### Voraussetzungen

```bash
pip install unsloth torch transformers trl datasets
```

### Dataset Format

Das Training erwartet eine `dataset.jsonl` Datei mit folgendem Format:

```json
{"context": "...", "question": "...", "answer": "..."}
{"context": "...", "question": "...", "answer": "..."}
```

### Prompt Template

```
Beantworte die folgende Frage basierend auf dem gegebenen Kontext so präzise wie möglich auf Deutsch.

### Kontext:
{context}

### Frage:
{question}

### Antwort:
{answer}
```

### Training Konfiguration

| Parameter | Wert | Beschreibung |
|-----------|------|--------------|
| **Base Model** | `unsloth/llama-3.1-8b-bnb-4bit` | 4-bit quantisiertes Llama-3.1-8B |
| **Max Sequence Length** | 2048 | Maximale Token-Länge |
| **LoRA Rank (r)** | 16 | Anzahl der Low-Rank Adapter Dimensionen |
| **LoRA Alpha** | 16 | Skalierungsfaktor für LoRA |
| **Target Modules** | `q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj` | Welche Layer werden trainiert |
| **Batch Size** | 2 | Samples pro GPU |
| **Gradient Accumulation** | 4 | Effective Batch Size = 8 |
| **Learning Rate** | 2e-4 | AdamW Optimizer |
| **Warmup Steps** | 50 | Linear Warmup |
| **Epochs** | 1 | Ein voller Durchlauf durch den Datensatz |
| **Optimizer** | AdamW 8-bit | Speicheroptimierter Optimizer |
| **Scheduler** | Linear | Learning Rate Decay |

### Training ausführen

```bash
python train.py
```

**Output:**
- Ordner: `german_model_lora_final/`
- Enthält: LoRA Adapter + Tokenizer

**Erwartete Trainingszeit:** ~2,5 Stunden auf RTX 3070

---

## 📦 Export zu GGUF (`export.py`)

Konvertiert das trainierte LoRA-Modell zu einem quantisierten GGUF-Format für llama.cpp.

### Konfiguration

| Parameter | Wert |
|-----------|------|
| **Input Model** | `german_model_lora_final/` |
| **Output Format** | GGUF |
| **Quantization** | Q4_K_M (4-bit mixed quantization) |
| **Output Folder** | `fertiges_modell/` |

### Export ausführen

```bash
python export.py
```

**Output:**
- `fertiges_modell/Bel-KI-v1-Q4_K_M.gguf` (~4.8 GB)

### SHA256 Hash (Integrität)

```
8B97EC63954565EBF6BB8F495E854957FD9D605EB84FAF7795D5FFB101BD0624
```

Verifizieren:
```bash
sha256sum Bel-KI-v1-Q4_K_M.gguf
```

---

## 📊 Evaluation (`evaluate.py`)

Bewertet das trainierte Modell auf dem GermanQuAD Validation Set mit SQuAD-Standard-Metriken.

### Metriken

- **F1 Score**: Misst inhaltliche Übereinstimmung (Token-basiert)
- **Exact Match (EM)**: Binäre Metrik (100% korrekt oder nicht)

### Konfiguration anpassen

```python
MODEL_PATH = "german_model_lora_final"  # Pfad zum Modell
DATA_PATH = "/pfad/zu/validation.jsonl"  # Validation Set
NUM_SAMPLES = 20  # Anzahl Fragen (None = alle)
```

### Evaluation ausführen

```bash
python evaluate.py
```

### BEL KI v1.0 Benchmark-Ergebnisse

**Hardware:** NVIDIA RTX 3070 (8GB VRAM)
**Validation Set:** GermanQuAD (Random 20 Samples)

| Metrik | Score | Interpretation |
|--------|-------|----------------|
| **F1 Score** | **87.64%** | Sehr hohe inhaltliche Genauigkeit |
| **Exact Match** | **70.00%** | 14/20 Fragen perfekt beantwortet |

#### Beispiel-Outputs

```
--- Frage 1 ---
❓ Frage: Was kann den Verschleiß des seillosen Aufzuges minimieren?
✅ Wahrheit: elektromagnetischer Linearführungen
🤖 Bel KI:   die Entwicklung elektromagnetischer Linearführungen
📊 Scores: EM=False | F1=0.80

--- Frage 2 ---
❓ Frage: In welcher deutschen Stadt wird der seillose Aufzug getestet?
✅ Wahrheit: Rottweil
🤖 Bel KI:   Rottweil
📊 Scores: EM=True | F1=1.00
```

---

## 🔬 Reproduzierbarkeit

### Umgebung

```bash
# Python Version
Python 3.10+

# Abhängigkeiten
pip install unsloth==2025.12.9 \
            transformers==4.57.3 \
            torch==2.5.1+cu121 \
            trl \
            datasets \
            tqdm
```

### Hardware

- **GPU:** NVIDIA RTX 3070 (8GB VRAM)
- **CUDA:** 12.1
- **RAM:** 16GB+ empfohlen
- **Storage:** ~20GB für Modelle + Checkpoints

### Vollständiger Workflow

```bash
# 1. Training
python train.py
# Output: german_model_lora_final/

# 2. Export zu GGUF
python export.py
# Output: fertiges_modell/Bel-KI-v1-Q4_K_M.gguf

# 3. Evaluation
python evaluate.py
# Output: F1=87.64%, EM=70.00%
```

---

## 📖 Dataset Details

### GermanQuAD

- **Typ:** Extractive Question Answering (SQuAD-Style)
- **Sprache:** Deutsch
- **Source:** Wikipedia (Deutsche Artikel)
- **Format:** JSONL mit `context`, `question`, `answer` Feldern

### Train/Dev/Test Split

- **Training:** 1.420 Samples (verwendet in `train.py`)
- **Validation:** 20 Random Samples (verwendet in `evaluate.py`)
- **Test:** Nicht öffentlich geteilt (für finale Benchmarks reserviert)

### Preprocessing

1. **Kontext-Bereinigung:** Entfernung von Markdown, HTML-Tags
2. **Antwort-Normalisierung:** Lowercase, Punktuation-Entfernung für Metriken
3. **Prompt-Formatting:** SQuAD-Style zu Chat-Template Konversion

---

## ⚙️ System Prompt Varianten

### QA-Modus (Standard)

```
Beantworte die folgende Frage basierend auf dem gegebenen Kontext so präzise wie möglich auf Deutsch.

### Kontext:
{context}

### Frage:
{question}

### Antwort:
```

### Allgemeiner Assistent-Modus

Für Fragen ohne expliziten Kontext:

```
Du bist BEL KI, eine ehrliche und präzise deutsche KI. Beantworte die folgende Frage:

{question}
```

---

## 🐛 Troubleshooting

### CUDA Out of Memory

```python
# In train.py:
per_device_train_batch_size = 1  # Reduziere von 2 auf 1
gradient_accumulation_steps = 8  # Erhöhe von 4 auf 8
```

### Slow Inference

```python
# In evaluate.py:
load_in_4bit = True  # Stelle sicher, dass 4-bit aktiv ist
max_new_tokens = 32  # Reduziere für kürzere Antworten
```

### Import Fehler (psutil)

```python
# Am Anfang des Scripts:
import psutil
import sys
sys.modules['psutil'] = psutil
```

---

## 📊 Vergleich mit anderen Modellen

| Modell | Parameter | F1 (GermanQuAD) | EM (GermanQuAD) |
|--------|-----------|-----------------|-----------------|
| **BEL KI v1.0** | 8B | **87.64%** | **70.00%** |
| Llama-3.1-8B (Base) | 8B | ~45% | ~25% |
| GPT-3.5-Turbo | ~175B | ~92% | ~78% |
| DeepL-LLM-7B | 7B | ~82% | ~65% |

*Hinweis: Andere Werte sind geschätzt basierend auf öffentlichen Benchmarks.*

---

## 📜 Lizenz

**© 2025 Belkis Aslani. Alle Rechte vorbehalten.**

Diese Scripts sind Open Source (MIT Lizenz). Das trainierte Modell ist frei verfügbar für:
- ✅ Persönliche Nutzung
- ✅ Forschung & Bildung
- ✅ Non-Commercial Use

Für kommerzielle Nutzung kontaktiere: belkis.aslani@gmail.com

---

## 🤝 Beitragen

Issues und Pull Requests sind willkommen!

1. Fork das Repo
2. Erstelle einen Feature-Branch (`git checkout -b feature/awesome-feature`)
3. Commit deine Changes (`git commit -m 'Add awesome feature'`)
4. Push zum Branch (`git push origin feature/awesome-feature`)
5. Öffne einen Pull Request

---

## 📞 Kontakt

**Belkis Aslani**
- 📧 Email: belkis.aslani@gmail.com
- 🐙 GitHub: [@BEKO2210](https://github.com/BEKO2210)
- 🤗 HuggingFace: [@Beko2210](https://huggingface.co/Beko2210)
- 🌐 Website: [belkis-aslani.de](https://belkis-aslani.de)

---

<div align="center">

**Built with Passion in Freiberg am Neckar 🇩🇪**

*"Während andere über KI reden, trainiere ich sie."*

</div>
