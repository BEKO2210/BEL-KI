// BEL KI - Terminal Simulation
// Typewriter effect for training logs

class TerminalSimulator {
  constructor(terminalId, logs) {
    this.terminal = document.getElementById(terminalId);
    if (!this.terminal) return;

    this.logs = logs;
    this.currentLine = 0;
    this.currentChar = 0;
    this.speed = 30; // milliseconds per character
    this.lineDelay = 500; // delay between lines

    this.init();
  }

  init() {
    this.terminal.innerHTML = '';
    this.typeLine();
  }

  typeLine() {
    if (this.currentLine >= this.logs.length) {
      this.addCursor();
      return;
    }

    const currentLog = this.logs[this.currentLine];

    if (this.currentChar < currentLog.length) {
      const lineElement = this.getOrCreateLine();
      lineElement.textContent += currentLog[this.currentChar];
      this.currentChar++;

      // Auto-scroll
      this.terminal.scrollTop = this.terminal.scrollHeight;

      setTimeout(() => this.typeLine(), this.speed);
    } else {
      // Line complete, move to next
      this.currentLine++;
      this.currentChar = 0;

      setTimeout(() => this.typeLine(), this.lineDelay);
    }
  }

  getOrCreateLine() {
    let line = this.terminal.querySelector(`[data-line="${this.currentLine}"]`);
    if (!line) {
      line = document.createElement('div');
      line.className = 'terminal-line';
      line.setAttribute('data-line', this.currentLine);
      this.terminal.appendChild(line);
    }
    return line;
  }

  addCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    this.terminal.appendChild(cursor);
  }
}

// Training logs data
const trainingLogs = [
  '>>> Initialisiere Training...',
  '>>> Modell: Llama-3.1-8B',
  '>>> Datensatz: GermanQuAD (1420 Samples)',
  '>>> Hardware: NVIDIA RTX 3070 (8GB VRAM)',
  '>>> Optimizer: AdamW | LR: 2e-4',
  '',
  '[Step 100/1440] Loss: 1.702 | LR: 2.00e-04',
  '[Step 200/1440] Loss: 1.456 | LR: 1.95e-04',
  '[Step 300/1440] Loss: 1.289 | LR: 1.90e-04',
  '[Step 400/1440] Loss: 1.134 | LR: 1.85e-04',
  '[Step 500/1440] Loss: 0.987 | LR: 1.80e-04',
  '[Step 600/1440] Loss: 0.876 | LR: 1.75e-04',
  '[Step 700/1440] Loss: 0.789 | LR: 1.70e-04',
  '[Step 800/1440] Loss: 0.721 | LR: 1.65e-04',
  '[Step 900/1440] Loss: 0.668 | LR: 1.60e-04',
  '[Step 1000/1440] Loss: 0.624 | LR: 1.55e-04',
  '[Step 1100/1440] Loss: 0.589 | LR: 1.50e-04',
  '[Step 1200/1440] Loss: 0.561 | LR: 1.45e-04',
  '[Step 1300/1440] Loss: 0.542 | LR: 1.40e-04',
  '[Step 1400/1440] Loss: 0.534 | LR: 1.35e-04',
  '[Step 1440/1440] Loss: 0.530 | LR: 1.30e-04',
  '',
  '✓ Training abgeschlossen!',
  '✓ Finale Loss: 0.530',
  '✓ Quantisierung zu Q4_K_M GGUF...',
  '✓ Modell gespeichert: bel-ki-v1.0.gguf',
  '',
  '>>> Training erfolgreich. Bereit für Deployment.'
];

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const terminalContent = document.getElementById('terminalContent');
  if (terminalContent) {
    new TerminalSimulator('terminalContent', trainingLogs);
  }
});
