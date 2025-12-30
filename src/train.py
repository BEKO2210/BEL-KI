import builtins
import psutil
builtins.psutil = psutil
from unsloth import FastLanguageModel
import torch
from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments
from unsloth import is_bfloat16_supported

max_seq_length = 2048 
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/llama-3.1-8b-bnb-4bit",
    max_seq_length = max_seq_length,
    load_in_4bit = True,
)

model = FastLanguageModel.get_peft_model(
    model, r = 16, target_modules = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha = 16, lora_dropout = 0, bias = "none", use_gradient_checkpointing = "unsloth",
)

prompt_style = """Beantworte die folgende Frage basierend auf dem gegebenen Kontext so präzise wie möglich auf Deutsch.\n\n### Kontext:\n{}\n\n### Frage:\n{}\n\n### Antwort:\n{}"""

def formatting_prompts_func(examples):
    contexts = examples["context"]
    questions = examples["question"]
    answers = examples["answer"]
    texts = []
    for context, question, answer in zip(contexts, questions, answers):
        text = prompt_style.format(context, question, answer) + tokenizer.eos_token
        texts.append(text)
    return { "text" : texts, }

dataset = load_dataset("json", data_files={"train": "dataset.jsonl"}, split="train")
dataset = dataset.map(formatting_prompts_func, batched = True)

trainer = SFTTrainer(
    model = model, tokenizer = tokenizer, train_dataset = dataset, dataset_text_field = "text", max_seq_length = max_seq_length, dataset_num_proc = 1,
    args = TrainingArguments(per_device_train_batch_size = 2, gradient_accumulation_steps = 4, warmup_steps = 50, num_train_epochs = 1, learning_rate = 2e-4, fp16 = not is_bfloat16_supported(), bf16 = is_bfloat16_supported(), logging_steps = 10, optim = "adamw_8bit", weight_decay = 0.01, lr_scheduler_type = "linear", seed = 3407, output_dir = "outputs"),
)
trainer.train()
model.save_pretrained("german_model_lora_final")
tokenizer.save_pretrained("german_model_lora_final")
