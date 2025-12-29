// BEL KI - Neural Core Canvas Engine
// High-performance particle simulation representing neural networks

class NeuralCore {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.connections = [];
    this.mouse = { x: 0, y: 0 };
    this.isActive = true;

    // Performance settings
    this.isMobile = window.innerWidth < 768;
    this.particleCount = this.isMobile ? 30 : 80;
    this.maxDistance = this.isMobile ? 100 : 150;

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Pause animation when tab is inactive
    document.addEventListener('visibilitychange', () => {
      this.isActive = !document.hidden;
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }

      // Mouse interaction (parallax effect)
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.x -= (dx / distance) * force * 2;
        particle.y -= (dy / distance) * force * 2;
      }
    });
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 243, 255, ${particle.opacity})`;
      this.ctx.fill();

      // Glow effect
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(0, 243, 255, 0.8)';
    });
    this.ctx.shadowBlur = 0;
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.maxDistance) {
          const opacity = (1 - distance / this.maxDistance) * 0.3;

          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(0, 243, 255, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();

          // Data pulse effect (occasional bright pulses)
          if (Math.random() > 0.98) {
            this.drawPulse(this.particles[i], this.particles[j]);
          }
        }
      }
    }
  }

  drawPulse(p1, p2) {
    const progress = Math.random();
    const x = p1.x + (p2.x - p1.x) * progress;
    const y = p1.y + (p2.y - p1.y) * progress;

    this.ctx.beginPath();
    this.ctx.arc(x, y, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(188, 19, 254, 0.8)';
    this.ctx.fill();
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = 'rgba(188, 19, 254, 1)';
    this.ctx.shadowBlur = 0;
  }

  animate() {
    if (!this.isActive) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    // Clear canvas
    this.ctx.fillStyle = 'rgba(3, 3, 3, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateParticles();
    this.drawConnections();
    this.drawParticles();

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    new NeuralCore('heroCanvas');
  }
});
