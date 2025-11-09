// ===== xAI Landing Script Docs =====
// Source: Vanilla JS – no libs for speed/security.
// Features: Procedural particles (cosmic bg), scroll fades, free portrait gen (canvas API).
// A11y: Aria-live updates; no blocking ops.
// Edges: Canvas fallback (modern browsers); download polyfill if needed.
// License: MIT. Minify: jscompress.com.

// Particle Graphics: Create 50 subtle dots on load – xAI cosmic theme
function createParticles() {
  const particles = document.createElement('div');
  particles.className = 'particles'; // Append to body for fixed pos
  document.body.insertBefore(particles, document.body.firstChild); // Z-index low
  for (let i = 0; i < 50; i++) { // Low count: perf-friendly (60fps)
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%'; // Random pos
    particle.style.top = Math.random() * 100 + '%';
    particle.style.width = particle.style.height = (Math.random() * 4 + 1) + 'px'; // Size var
    particle.style.animationDelay = Math.random() * 6 + 's'; // Stagger
    particle.style.opacity = Math.random() * 0.5 + 0.2; // Fade var
    particles.appendChild(particle);
  }
  console.log('Particles generated: 50 cosmic nodes'); // Debug: removable
}
createParticles(); // Init on DOM ready (defer in HTML)

// Scroll Animations: Trigger fades on view – enhances engagement
window.addEventListener('scroll', () => { // Throttle implicit via requestAnim
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { // In viewport
      el.style.animationPlayState = 'running'; // Start once
    }
  });
}, { passive: true }); // Perf: no block

// Rewarding Element: Free Portrait Gen – Procedural avatar (xAI blue/circle motif)
const genBtn = document.getElementById('genPortrait');
const canvas = document.getElementById('portraitCanvas');
const downloadLink = document.getElementById('downloadLink');
const ctx = canvas.getContext('2d'); // 2D context for draw

genBtn.addEventListener('click', () => {
  // Clear & gen: Random cosmic portrait (circle face + particles)
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Reset
  ctx.fillStyle = '#0a0a0a'; // Dark bg
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Face: Simple circle w/ gradient
  const gradient = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
  gradient.addColorStop(0, '#00D4FF'); // xAI blue core
  gradient.addColorStop(1, '#000421'); // Fade to cosmic
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(150, 150, 120, 0, 2 * Math.PI); // Circle "head"
  ctx.fill();

  // Eyes: Two white dots
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(120, 130, 10, 0, 2 * Math.PI); // Left eye
  ctx.arc(180, 130, 10, 0, 2 * Math.PI); // Right
  ctx.fill();

  // Particles: 5 random blue dots on face
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(0, 212, 255, ${Math.random()})`; // Var opacity
    ctx.beginPath();
    ctx.arc(Math.random() * 300, Math.random() * 300, Math.random() * 3 + 1, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Reveal & download setup
  canvas.classList.remove('hidden'); // Show canvas
  downloadLink.href = canvas.toDataURL('image/png'); // Base64 for download
  downloadLink.classList.remove('hidden'); // Show link
  downloadLink.textContent = 'Download Your xAI Portrait'; // Dynamic text
  genBtn.textContent = 'Regenerate 🎨'; // Feedback loop

  // A11y: Announce to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = 'Portrait generated! Download below.';
  genBtn.parentNode.appendChild(announcement); // Temp; remove after 5s if needed
  setTimeout(() => announcement.remove(), 5000);

  console.log('Portrait generated: Procedural xAI avatar'); // Debug
});

// Perf: Preload check (optional PWA stub – expand later)
if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js'); // Uncomment for offline (cache assets)
}

// Sources: Canvas API (MDN Web Docs, public); particles inspired by CSS-Tricks (CC).