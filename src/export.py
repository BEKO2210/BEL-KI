import psutil
import sys
import torch
sys.modules['psutil'] = psutil
from unsloth import FastLanguageModel

model_path = "german_model_lora_final"
model, tokenizer = FastLanguageModel.from_pretrained(model_name = model_path, max_seq_length = 2048, load_in_4bit = True)
model.save_pretrained_gguf("fertiges_modell", tokenizer, quantization_method = "q4_k_m")
