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

// Inspirational Message Algo: Neutral, bias-free gen
// Algo: Name[0] → theme (action/growth/reflect); Age bucket → intensity (spark/drive/wisdom); Color → tone (energy/calm/balance).
// Templates: 9 combos (3x3) w/ placeholders; procedural insert for personal/agnostic vibe.
// Sources: Neutral inspo patterns (e.g., growth mindset, no creed/demog refs).

const form = document.getElementById('inputForm');
const thumbsContainer = document.getElementById('thumbsContainer'); // Repurpose as msg display
const canvas = document.getElementById('portraitCanvas'); // Hide/unuse
const downloadLink = document.getElementById('downloadLink'); // Repurpose as "Copy/Share"
canvas.classList.add('hidden'); // Perma-hide

// Maps: Expandable, neutral
const nameThemes = { // First letter buckets (A=0, etc.)
  'a': 'action', 'b': 'action', 'c': 'action', 'd': 'action',
  'e': 'growth', 'f': 'growth', 'g': 'growth', 'h': 'growth',
  'i': 'reflect', 'j': 'reflect', 'k': 'reflect', 'l': 'reflect',
  // ... z: cycle or default 'action'
};
const ageBuckets = age => age < 25 ? 'spark' : age <= 50 ? 'drive' : 'wisdom'; // Intensity levels
const colorTones = {
  'red': 'energy', 'orange': 'energy', 'yellow': 'energy',
  'green': 'balance', 'blue': 'calm', 'purple': 'calm',
  // Defaults: 'balance'
};

// Templates: 3 themes x 3 intensities x 3 tones = 27; sample 9 here, rand select
const templates = {
  action: {
    spark: { energy: 'Ignite your {name} fire: Take one bold step today—momentum builds worlds.',
             balance: 'Balance your {name} path: A single choice shifts the horizon.',
             calm: 'With calm {name} focus, act now—the ripple starts here.' },
    drive: { energy: 'Fuel your {name} drive: Push boundaries; every effort echoes forward.',
             balance: 'Steady {name} drive: Align steps with purpose, watch clarity emerge.',
             calm: 'In quiet drive, {name} thrives: One measured move unlocks tomorrow.' },
    wisdom: { energy: 'Channel {name} wisdom into action: Legacy sparks from today\'s spark.',
              balance: 'Wise {name} action: Harmonize experience with intent for lasting flow.',
              calm: 'Serene {name} action: Let insight guide—peaceful steps shape eternity.' }
  },
  growth: {
    spark: { energy: 'Bloom as {name}: Nurture your spark—growth awaits the curious mind.',
             balance: 'Gentle {name} growth: Root in balance, reach for untapped potential.',
             calm: 'In {name} calm, grow: Whispers of progress fill the patient soul.' },
    drive: { energy: 'Fuel your {name} growth: Push boundaries; every effort echoes forward.',
             balance: 'Steady {name} growth: Align steps with purpose, watch clarity emerge.',
             calm: 'In quiet growth, {name} thrives: One measured move unlocks tomorrow.' },
    wisdom: { energy: 'Channel {name} wisdom into growth: Legacy sparks from today\'s spark.',
              balance: 'Wise {name} growth: Harmonize experience with intent for lasting flow.',
              calm: 'Serene {name} growth: Let insight guide—peaceful steps shape eternity.' }
  },
  reflect: {
    spark: { energy: 'Reflect with {name} spark: Insights ignite paths unseen.',
             balance: 'Balanced {name} reflection: Clarity blooms in mindful pause.',
             calm: 'Calm {name} reflection: Still waters reveal the deepest truths.' },
    drive: { energy: 'Fuel your {name} reflection: Push boundaries; every effort echoes forward.',
             balance: 'Steady {name} reflection: Align steps with purpose, watch clarity emerge.',
             calm: 'In quiet reflection, {name} thrives: One measured move unlocks tomorrow.' },
    wisdom: { energy: 'Channel {name} wisdom into reflection: Legacy sparks from today\'s spark.',
              balance: 'Wise {name} reflection: Harmonize experience with intent for lasting flow.',
              calm: 'Serene {name} reflection: Let insight guide—peaceful steps shape eternity.' }
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const age = parseInt(document.getElementById('ageInput').value);
  const color = document.getElementById('colorInput').value.trim().toLowerCase();
  
  if (!name || !age || !color) return alert('Fill all fields!');
  
  const themeKey = nameThemes[name[0].toLowerCase()] || 'action'; // Default neutral
  const intensity = ageBuckets(age);
  const tone = colorTones[color] || 'balance';
  
  // Rand select from template group (if multiple per combo)
  const msgObj = templates[themeKey][intensity][tone];
  let message = msgObj; // Single for now
  message = message.replace('{name}', name); // Personalize w/o bias
  
  // Display: Clear, show msg in thumbsContainer
  thumbsContainer.innerHTML = `
    <div class="message-display">
      <h3>Your Message Today</h3>
      <p aria-live="polite">${message}</p>
      <button id="copyBtn">Copy to Share</button>
    </div>
  `;
  thumbsContainer.classList.remove('hidden');
  
  // Copy handler
  document.getElementById('copyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(message).then(() => {
      const btn = document.getElementById('copyBtn');
      btn.textContent = 'Copied! ✨';
      setTimeout(() => btn.textContent = 'Copy to Share', 2000);
    });
  });
  
  // A11y announce
  const announce = document.createElement('div');
  announce.setAttribute('aria-live', 'assertive');
  announce.textContent = `Message generated: ${message}`;
  form.appendChild(announce);
  setTimeout(() => announce.remove(), 10000); // Long read
  
  console.log(`Gen msg: ${themeKey}/${intensity}/${tone} → "${message}"`);
});

// Perf: Preload check (optional PWA stub – expand later)
if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js'); // Uncomment for offline (cache assets)
}

// Sources: Canvas API (MDN Web Docs, public); particles inspired by CSS-Tricks (CC).