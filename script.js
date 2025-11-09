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

// Input Form: Handle submit, extract chars, gen 3 attempts
const form = document.getElementById('inputForm');
const thumbsContainer = document.getElementById('thumbsContainer');
const canvas = document.getElementById('portraitCanvas');
const downloadLink = document.getElementById('downloadLink');
const ctx = canvas.getContext('2d');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // No page reload
  const name = document.getElementById('nameInput').value.trim();
  const age = parseInt(document.getElementById('ageInput').value);
  const color = document.getElementById('colorInput').value.trim().toLowerCase();
  
  if (!name || !age || !color) return alert('Fill all fields!'); // Basic validate
  
  // Extract first chars: name letter, age first digit, color letter
  const nameChar = name[0].toLowerCase();
  const ageChar = age.toString()[0]; // First digit as "char"
  const colorChar = color[0];
  const chars = [nameChar, ageChar, colorChar];
  
  // Clear prev thumbs
  thumbsContainer.innerHTML = '';
  thumbsContainer.classList.remove('hidden');
  
  // Gen 3 attempts: Each composites 3 images (one per char)
  for (let attempt = 1; attempt <= 3; attempt++) {
    const attemptSeed = `${name}${age}${color}${attempt}`; // Vary for uniqueness
    const images = await Promise.all(chars.map(async (char, idx) => {
      // Robohash API: Free robot "portrait element" seeded w/ char + cosmic theme
      // I chose: Robots as xAI "elements" – fun, thematic; size scales w/ age
      const size = Math.min(100 + (age * 2), 200); // Age influences scale (1-150 → 102-400px, but cap)
      const query = `${char}cosmic`; // Pick: Cosmic robot for [char] vibe
      const imgUrl = `https://robohash.org/${query}?size=${size}x${size}&set=set2&bgset=bg1`; // Set2: robots; bg1: cosmic-ish
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // For canvas tainting
        img.onload = () => resolve(img);
        img.onerror = () => resolve(createFallback(char, size)); // Fallback if API fail
        img.src = imgUrl;
      });
    }));
    
    // Composite: Layer 3 images on canvas (triad layout, tint w/ color)
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = 300; compositeCanvas.height = 300;
    const compCtx = compositeCanvas.getContext('2d');
    
    // Bg: Cosmic gradient tinted w/ fav color
    const hue = color === 'red' ? 0 : color === 'blue' ? 240 : 120; // Simple hue map; expand as needed
    compCtx.fillStyle = `hsl(${hue}, 50%, 5%)`; // Dark tint
    compCtx.fillRect(0, 0, 300, 300);
    
    // Layer images: Triangle pos, scale down
    images.forEach((img, idx) => {
      const x = 50 + (idx * 100); const y = 50 + (idx * 50); // Staggered
      compCtx.drawImage(img, x, y, 100, 100); // Fixed thumb size
    });
    
    // Add text: Initials overlay
    compCtx.fillStyle = color; // Fav color text
    compCtx.font = 'bold 20px Inter';
    compCtx.fillText(`${nameChar}${ageChar}${colorChar}`, 10, 280);
    
    // Thumb display: Click to select
    const thumb = document.createElement('canvas');
    thumb.width = 100; thumb.height = 100; thumb.className = 'thumb-canvas';
    const thumbCtx = thumb.getContext('2d');
    thumbCtx.drawImage(compositeCanvas, 0, 0, 100, 100);
    
    const label = document.createElement('div');
    label.className = 'thumb-label';
    label.textContent = `Attempt ${attempt}`;
    label.setAttribute('aria-label', `Select attempt ${attempt} portrait`);
    
    const wrapper = document.createElement('div');
    wrapper.append(thumb, label);
    thumbsContainer.appendChild(wrapper);
    
    // Click handler: Set as main, download
    thumb.addEventListener('click', () => {
      canvas.width = 300; canvas.height = 300;
      ctx.drawImage(compositeCanvas, 0, 0);
      canvas.classList.remove('hidden');
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.classList.remove('hidden');
      downloadLink.textContent = `Download Attempt ${attempt}`;
      // A11y announce
      const announce = document.createElement('div');
      announce.setAttribute('aria-live', 'polite');
      announce.textContent = `Selected attempt ${attempt}. Ready to download.`;
      form.appendChild(announce);
      setTimeout(() => announce.remove(), 3000);
    });
  }
  
  console.log('Generated 3 portrait attempts from inputs');
});

// Fallback: Simple canvas draw if API fails
function createFallback(char, size) {
  const img = document.createElement('canvas');
  img.width = img.height = size;
  const fCtx = img.getContext('2d');
  fCtx.fillStyle = '#00D4FF';
  fCtx.beginPath();
  fCtx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
  fCtx.fill();
  fCtx.fillStyle = '#000';
  fCtx.font = `${size/4}px Inter`;
  fCtx.textAlign = 'center';
  fCtx.fillText(char, size/2, size/2 + size/8);
  return img;
}

// Perf: Preload check (optional PWA stub – expand later)
if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js'); // Uncomment for offline (cache assets)
}

// Sources: Canvas API (MDN Web Docs, public); particles inspired by CSS-Tricks (CC).