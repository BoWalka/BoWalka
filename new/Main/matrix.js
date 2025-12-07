const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const emojis = ['😂', '👌', 'YEET', '🤣', '👌', '😂', 'YEET', '👌'];
const fontSize = 20;
const columns = canvas.width / fontSize;

const drops = Array(Math.floor(columns)).fill(1);

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f0';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = emojis[Math.floor(Math.random() * emojis.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Optimize performance with requestAnimationFrame
let lastTime = 0;
const fps = 30;
const frameInterval = 1000 / fps;

function animate(currentTime) {
  if (currentTime - lastTime >= frameInterval) {
    draw();
    lastTime = currentTime;
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Recalculate columns on resize
  const newColumns = canvas.width / fontSize;
  drops.length = Math.floor(newColumns);
  for (let i = 0; i < drops.length; i++) {
    if (!drops[i]) drops[i] = 1;
  }
});
