const GITHUB_USER = 'Housni0';
const API = `https://api.github.com/users/${GITHUB_USER}`;

// ── Lang colors ──────────────────────────────────────────────
const LANG_COLORS = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219', C: '#555555',
  'C++': '#f34b7d', 'C#': '#178600', PHP: '#4F5D95', Rust: '#dea584',
  Go: '#00ADD8', Swift: '#F05138', Kotlin: '#A97BFF', Shell: '#89e051',
};

function langColor(lang) {
  return LANG_COLORS[lang] || '#7c6af7';
}

// ── Load GitHub user ─────────────────────────────────────────
async function loadUser() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error();
    const user = await res.json();

    document.getElementById('stat-repos').textContent = user.public_repos ?? '—';
    document.getElementById('stat-followers').textContent = user.followers ?? '—';

    setAvatar(user.avatar_url);
  } catch {
    console.warn('GitHub user API unavailable');
  }
}

function setAvatar(githubUrl) {
  const avatar = document.getElementById('avatar');
  if (avatar.src && !avatar.src.endsWith('/') && avatar.naturalWidth > 0) return;
  avatar.src = githubUrl;
}

function loadGithubAvatar() {}

// ── Descriptions personnalisées pour les repos GitHub ────────
const REPO_DESCRIPTIONS = {
  SystemeRendezVous: 'Application de gestion de rendez-vous en C# : interface desktop WPF et API backend .NET. Architecture en deux couches avec gestion complète des rendez-vous.',
  AppliFacturation: 'Application console C# de gestion de factures : création de clients, ajout de lignes par catégorie (Informatique, Téléphonie…), calcul HT/TVA/TTC, remises et persistance des données par sérialisation JSON.',
  ReservationSalle: 'Application console C# de réservation de salles : 3 types de salles (réunion, formation, auditorium), gestion des créneaux horaires et affichage du planning journalier. Conception orientée objet avec héritage.',
};

// ── Screenshots par repo (chemin relatif depuis index.html) ──
const REPO_SCREENSHOTS = {
  AppliFacturation: 'screenshots/facturation.png',
  ReservationSalle: 'screenshots/reservation.png',
  SystemeRendezVous: 'screenshots/rendezvous.png',
};

// ── Tous les projets (toujours affichés, API enrichit si dispo) ──
const ALL_PROJECTS = [
  {
    name: 'SystemeRendezVous',
    description: 'Application de gestion de rendez-vous en C# : interface desktop WPF et API backend .NET. Architecture en deux couches avec gestion complète des rendez-vous.',
    language: 'C#',
    screenshot: 'screenshots/rendezvous.png',
    link: 'https://github.com/Housni0/SystemeRendezVous',
  },
  {
    name: 'AppliFacturation',
    description: 'Application console C# de gestion de factures : création de clients, ajout de lignes par catégorie, calcul HT/TVA/TTC, remises et persistance des données par sérialisation JSON.',
    language: 'C#',
    screenshot: 'screenshots/facturation.png',
    link: 'https://github.com/Housni0/AppliFacturation',
  },
  {
    name: 'ReservationSalle',
    description: 'Application console C# de réservation de salles : 3 types de salles (réunion, formation, auditorium), gestion des créneaux horaires et affichage du planning journalier.',
    language: 'C#',
    screenshot: 'screenshots/reservation.png',
    link: 'https://github.com/Housni0/ReservationSalle',
  },
  {
    name: 'Boutique Montres Luxe',
    description: 'Site e-commerce de montres de luxe en HTML/CSS : catalogue produits, panier, espace personnel, personnalisations et journal. Design élégant avec une charte graphique dorée.',
    language: 'HTML/CSS',
    screenshot: 'screenshots/boutique.png',
    link: null,
  },
];

// ── Render projects ───────────────────────────────────────────
function renderProjects(starsMap = {}) {
  return ALL_PROJECTS.map(p => {
    const stars = starsMap[p.name];
    const badge = stars !== undefined
      ? `<span class="project-stars">★ ${stars}</span>`
      : `<span class="project-stars" style="color:var(--accent2);font-size:0.75rem">${p.link ? 'GitHub' : 'Projet perso'}</span>`;
    return `
    <div class="project-card" ${p.screenshot ? `onclick="openScreenshot('${p.screenshot}')"` : ''} style="cursor:${p.screenshot ? 'pointer' : 'default'}">
      ${p.screenshot ? `<div class="project-screenshot"><img src="${p.screenshot}" alt="Aperçu ${escHtml(p.name)}" loading="lazy" /></div>` : ''}
      <div class="project-header">
        <span class="project-name">${escHtml(p.name)}</span>
        ${badge}
      </div>
      <p class="project-desc">${escHtml(p.description)}</p>
      <span class="project-lang" style="color:${langColor(p.language)}">● ${escHtml(p.language)}</span>
      ${p.link ? `<a href="${p.link}" target="_blank" class="project-link" onclick="event.stopPropagation()">Voir sur GitHub →</a>` : ''}
    </div>`;
  }).join('');
}

// ── Load repos ───────────────────────────────────────────────
async function loadRepos() {
  const grid = document.getElementById('projects-grid');

  // Afficher immédiatement tous les projets
  grid.innerHTML = renderProjects();

  // Enrichir avec les étoiles GitHub si l'API répond
  try {
    const res = await fetch(`${API}/repos?per_page=100`);
    if (!res.ok) return;
    const repos = await res.json();
    const starsMap = {};
    repos.forEach(r => { starsMap[r.name] = r.stargazers_count; });
    grid.innerHTML = renderProjects(starsMap);
  } catch {
    // API indisponible, les projets sont déjà affichés
  }
}

// ── Contact form ─────────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const status = document.getElementById('form-status');
  const btn = this.querySelector('button[type="submit"]');
  const name = document.getElementById('f-name').value.trim();

  btn.disabled = true;
  status.textContent = 'Envoi en cours…';

  try {
    const res = await fetch('https://formspree.io/f/mvkpgbkp', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(this),
    });
    if (res.ok) {
      status.textContent = `Merci ${name} ! Je vous répondrai dès que possible.`;
      this.reset();
    } else {
      status.textContent = 'Erreur lors de l\'envoi. Réessayez ou contactez-moi par email.';
    }
  } catch {
    status.textContent = 'Erreur réseau. Vérifiez votre connexion et réessayez.';
  } finally {
    btn.disabled = false;
    setTimeout(() => { status.textContent = ''; }, 6000);
  }
});

// ── Utility ──────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Lightbox ─────────────────────────────────────────────────
function openScreenshot(src) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  lb.classList.add('active');
}

document.addEventListener('click', e => {
  if (e.target.id === 'lightbox' || e.target.id === 'lightbox-close') {
    document.getElementById('lightbox').classList.remove('active');
  }
});

// ── Scroll reveal ─────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Nav active on scroll ──────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`nav a[href="#${sec.id}"]`);
    if (!link) return;
    const active = y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle('nav-active', active);
  });
}, { passive: true });

// ── Init ─────────────────────────────────────────────────────

// Charger la photo locale immédiatement, sans attendre l'API
const avatarEl = document.getElementById('avatar');
avatarEl.src = 'photo.jpg';

loadUser();
loadRepos();
