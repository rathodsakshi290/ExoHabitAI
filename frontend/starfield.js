const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
let shootingStars = [];

const STAR_COUNT = 220;
const SHOOTING_STAR_CHANCE = 0.003; // lower = rarer (cinematic)

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ===== NORMAL STARS ===== */

class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 1.3 + 0.2;
    this.alpha = Math.random();
    this.alphaChange = Math.random() * 0.015 + 0.003;
    this.speedY = Math.random() * 0.15 + 0.02;
  }

  update() {
    this.y -= this.speedY;

    this.alpha += this.alphaChange;
    if (this.alpha <= 0 || this.alpha >= 1) {
      this.alphaChange *= -1;
    }

    if (this.y < 0) {
      this.y = canvas.height;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 230, 255, ${this.alpha})`;
    ctx.fill();
  }
}

/* ===== SHOOTING STARS ===== */

class ShootingStar {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height * 0.5;
    this.length = Math.random() * 250 + 150;
    this.speed = Math.random() * 14 + 10;
    this.angle = Math.PI / 4; // diagonal
    this.opacity = 1;
    this.fade = 0.015;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.opacity -= this.fade;
  }

  draw() {
    const endX = this.x - Math.cos(this.angle) * this.length;
    const endY = this.y - Math.sin(this.angle) * this.length;

    const gradient = ctx.createLinearGradient(
      this.x, this.y, endX, endY
    );

    gradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

/* ===== INIT ===== */

function initStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }
}

/* ===== ANIMATION LOOP ===== */

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Normal stars
  for (let star of stars) {
    star.update();
    star.draw();
  }

  // Random shooting star spawn
  if (Math.random() < SHOOTING_STAR_CHANCE) {
    shootingStars.push(new ShootingStar());
  }

  // Shooting stars update
  shootingStars = shootingStars.filter(star => star.opacity > 0);
  for (let s of shootingStars) {
    s.update();
    s.draw();
  }

  requestAnimationFrame(animate);
}

initStars();
animate();
