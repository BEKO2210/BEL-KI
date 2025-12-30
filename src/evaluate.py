import json
import torch
import re
import string
import collections
from unsloth import FastLanguageModel
from tqdm import tqdm  # Fortschrittsbalken

# --- KONFIGURATION ---
# Pfad zu deinem trainierten Modell (Ordner)
MODEL_PATH = "german_model_lora_final"

# Pfad zu deinen Testdaten (Windows-Pfad automatisch für WSL angepasst)
DATA_PATH = "/mnt/c/Users/belki/Desktop/Dev/germanquad/processed/validation.jsonl"

# Wie viele Fragen sollen getestet werden? (Setze auf None für ALLE, aber das dauert!)
NUM_SAMPLES = 20

# --- METRIK FUNKTIONEN (SQuAD Standard) ---
def normalize_answer(s):
    """Bereinigt Text für fairen Vergleich (Lowercase, keine Punktuation/Artikel)."""
    def remove_articles(text):
        regex = r'\b(der|die|das|ein|eine|einen|dem|den|des)\b'
        return re.sub(regex, ' ', text)

    def white_space_fix(text):
        return ' '.join(text.split())

    def remove_punc(text):
        exclude = set(string.punctuation)
        return ''.join(ch for ch in text if ch not in exclude)

    def lower(text):
        return text.lower()

    return white_space_fix(remove_articles(remove_punc(lower(s))))

def f1_score(prediction, ground_truth):
    pred_tokens = normalize_answer(prediction).split()
    truth_tokens = normalize_answer(ground_truth).split()

    common = collections.Counter(pred_tokens) & collections.Counter(truth_tokens)
    num_same = sum(common.values())

    if num_same == 0: return 0

    precision = 1.0 * num_same / len(pred_tokens)
    recall = 1.0 * num_same / len(truth_tokens)
    return (2 * precision * recall) / (precision + recall)

def exact_match_score(prediction, ground_truth):
    return (normalize_answer(prediction) == normalize_answer(ground_truth))

# --- HAUPTPROGRAMM ---
def main():
    print(f"🔄 Lade Modell aus: {MODEL_PATH}...")

    # 1. Modell laden
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = MODEL_PATH,
        max_seq_length = 2048,
        dtype = None,
        load_in_4bit = True,
    )
    FastLanguageModel.for_inference(model)

    # 2. Daten laden
    print(f"📂 Lade Testdaten von: {DATA_PATH}")
    data = []
    try:
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            for line in f:
                data.append(json.loads(line))
    except FileNotFoundError:
        print("❌ Fehler: Datei nicht gefunden! Prüfe den Pfad.")
        return

    # Limitieren für Schnelltest
    eval_data = data[:NUM_SAMPLES] if NUM_SAMPLES else data
    print(f"🚀 Starte Benchmark mit {len(eval_data)} Fragen...\n")

    # Prompt Template (Muss exakt wie im Training sein!)
    prompt_style = """Beantworte die folgende Frage basierend auf dem gegebenen Kontext so präzise wie möglich auf Deutsch.

### Kontext:
{}

### Frage:
{}

### Antwort:
"""

    total_f1 = 0
    total_em = 0

    # Loop durch die Fragen
    for i, entry in enumerate(tqdm(eval_data)):
        context = entry['context']
        question = entry['question']
        # GermanQuAD hat manchmal mehrere valide Antworten, wir nehmen die erste oder das Feld 'answer'
        # Passe das Feld hier an, je nachdem wie dein JSONL aussieht ('answer' oder 'answers')
        ground_truth = entry.get('answer', entry.get('answers', [''])[0])

        # Sicherstellen, dass ground_truth ein String ist
        if isinstance(ground_truth, list): ground_truth = ground_truth[0]

        # Inferenz
        inputs = tokenizer(
            [prompt_style.format(context, question, "")],
            return_tensors = "pt"
        ).to("cuda")

        outputs = model.generate(
            **inputs,
            max_new_tokens = 64,  # Kurze Antworten reichen oft für Fakten
            use_cache = True,
            pad_token_id = tokenizer.eos_token_id
        )

        # Antwort extrahieren
        decoded = tokenizer.batch_decode(outputs)[0]
        prediction = decoded.split("### Antwort:\n")[-1].replace("<|end_of_text|>", "").strip()

        # Scores berechnen
        em = exact_match_score(prediction, ground_truth)
        f1 = f1_score(prediction, ground_truth)

        total_em += em
        total_f1 += f1

        # Optional: Zeige Details für die ersten 5 Fragen
        if i < 3:
            print(f"\n--- Frage {i+1} ---")
            print(f"❓ Frage: {question}")
            print(f"✅ Wahrheit: {ground_truth}")
            print(f"🤖 Bel KI:   {prediction}")
            print(f"📊 Scores: EM={em} | F1={f1:.2f}")

    # Endergebnis
    avg_em = 100.0 * total_em / len(eval_data)
    avg_f1 = 100.0 * total_f1 / len(eval_data)

    print("\n" + "="*40)
    print("🏆 FINAL BENCHMARK RESULT (Bel KI v1)")
    print("="*40)
    print(f"Getestete Fragen: {len(eval_data)}")
    print(f"Exact Match (EM): {avg_em:.2f}%")
    print(f"F1 Score:         {avg_f1:.2f}%")
    print("="*40)

if __name__ == "__main__":
    main()
