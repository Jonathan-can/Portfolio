/* CANVAS BACKGROUND */

(() => {
    const c = document.getElementById('bg-canvas');
    const ctx = c.getContext('2d');
    let W, H, pts = [];
    const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < 50; i++) pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2,
        r: Math.random() * 1.5 + .5
    });
    (function loop() {
        ctx.clearRect(0, 0, W, H);
        const dark = document.documentElement.dataset.theme !== 'light';
        const rgb = dark ? '79,158,255' : '0,100,200';
        pts.forEach(p => {
            p.x = (p.x + p.vx + W) % W;
            p.y = (p.y + p.vy + H) % H;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},.5)`;
            ctx.fill();
        });
        pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 120) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(${rgb},${.13 * (1 - d / 120)})`;
                ctx.lineWidth = .5;
                ctx.stroke();
            }
        }));
        requestAnimationFrame(loop);
    })();
})();

/* THEME */

document.getElementById('theme-btn').addEventListener('click', () => {
    const h = document.documentElement;
    const light = h.dataset.theme === 'light';
    h.dataset.theme = light ? 'dark' : 'light';
    document.getElementById('theme-btn').textContent = light ? '🌙' : '☀️';
});

/* TYPEWRITER */

(() => {
    const el = document.getElementById('typewriter');
    const phrases = ['Développeur Web Full-Stack', 'Étudiant BTS SIO', 'Ceinture Noire de Judo', "En recherche d'alternance"];
    let p = 0, c = 0, d = false;
    const t = () => {
        const ph = phrases[p];
        if (!d) {
            el.textContent = ph.slice(0, ++c);
            if (c === ph.length) { d = true; setTimeout(t, 1800); return; }
        } else {
            el.textContent = ph.slice(0, --c);
            if (c === 0) { d = false; p = (p + 1) % phrases.length; }
        }
        setTimeout(t, d ? 46 : 78);
    };
    t();
})();

/* SCROLL REVEAL */

const ro = new IntersectionObserver(e => {
    e.forEach(x => {
        if (!x.isIntersecting) return;
        x.target.classList.add('visible');
        x.target.querySelectorAll('.tag').forEach((tag, i) => {
            setTimeout(() => tag.classList.add('tag-visible'), 180 + i * 55);
        });
        ro.unobserve(x.target);
    });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* COUNTERS */

const co = new IntersectionObserver(e => {
    if (e[0].isIntersecting) {
        document.querySelectorAll('[data-count]').forEach(el => {
            const t = +el.dataset.count;
            let n = 0;
            const iv = setInterval(() => {
                n = Math.min(n + Math.ceil(t / 34), t);
                el.textContent = n;
                if (n >= t) clearInterval(iv);
            }, 26);
        });
        co.disconnect();
    }
}, { threshold: .3 });
const sg = document.querySelector('.stats-grid');
if (sg) co.observe(sg);

/* TERMINAL */

(() => {
    const out = document.getElementById('term-out');
    const inp = document.getElementById('term-input');
    const body = document.getElementById('term-body');

    const cmds = {
        help: () => `
            <div class="tl to">Commandes disponibles :</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">about</span>      — Qui suis-je ?</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">parcours</span>   — Mon parcours scolaire</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">skills</span>     — Mes compétences techniques</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">projects</span>   — Mes projets scolaires</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">stages</span>     — Mes stages en entreprise</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">contact</span>    — Me contacter</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">judo</span>       — Ma passion pour le judo</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">veille</span>     — Ma veille technologique</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">clear</span>      — Effacer le terminal</div>`,

        about: () => `
            <div class="tl"><span class="tk">nom       </span> <span class="tv">Jonathan CANEVET</span></div>
            <div class="tl"><span class="tk">formation </span> <span class="tv">BTS SIO SLAM — ESUPEC, Cholet</span></div>
            <div class="tl"><span class="tk">ville     </span> <span class="tv">Cholet (49)</span></div>
            <div class="tl"><span class="tk">dispo     </span> <span class="tv">Alternance dès Septembre 2026</span></div>
            <div class="tl"><span class="tk">email     </span> <span class="tv">jocanevet49@gmail.com</span></div>`,

        parcours: () => `
            <div class="tl to">&#8594; <span class="tk">2022–2024</span>&nbsp;&nbsp;Baccalauréat Général — Spé Maths &amp; NSI</div>
            <div class="tl to">&#8594; <span class="tk">2024–2026</span>&nbsp;&nbsp;BTS SIO option SLAM — ESUPEC, Cholet</div>
            <div class="tl to">&#8594; <span class="tk">Sept.2026</span>&nbsp;&nbsp;<span class="tv">Recherche alternance développeur web/logiciel</span></div>`,

        skills: () => `
            <div class="tl to">&#8594; <span class="tk">Langages  </span>: <span class="tv">Java · PHP · JavaScript · C++ · Python · HTML · CSS · SQL</span></div>
            <div class="tl to">&#8594; <span class="tk">Frameworks</span>: <span class="tv">Symfony · Android Studio · Power Apps · Bootstrap · REST API</span></div>
            <div class="tl to">&#8594; <span class="tk">BDD       </span>: <span class="tv">MySQL · SQL Server · NoSQL · Doctrine · SQLite</span></div>
            <div class="tl to">&#8594; <span class="tk">Versioning</span>: <span class="tv">Git · GitHub</span></div>
            <div class="tl to">&#8594; <span class="tk">IA        </span>: <span class="tv">Maîtrise pratique · GitHub Copilot · Claude</span></div>`,

        projects: () => `
            <div class="tl to">01 · <span class="tv">Amap'market</span>         — PHP · HTML · CSS · JS · MySQL · Bootstrap</div>
            <div class="tl to">02 · <span class="tv">Escales La Rochelle</span> — PHP · Symfony · Doctrine · MySQL · Android · REST API</div>
            <div class="tl to">03 · <span class="tv">Tournois de judo</span>    — PHP · Symfony · Doctrine · MySQL · Android · REST API</div>`,

        stages: () => `
            <div class="tl to">S1 · <span class="tv">Batistyl</span> — Application Power Apps de A à Z en autonomie</div>
            <div class="tl to">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tk">Stack</span>: Power Apps · Power Automate · Dataverse · SharePoint</div>
            <div class="tl to">S2 · <span class="tv">Sogal</span>    — Graphiques qualité + refonte de site web</div>
            <div class="tl to">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tk">Stack</span>: PHP · Symfony · Doctrine · MySQL · Chart.js · SCSS · Twig · Swiper.js</div>`,

        contact: () => `
            <div class="tl to">email    : <span class="tv">jocanevet49@gmail.com</span></div>
            <div class="tl to">github   : <span class="tv">github.com/Jonathan-can</span></div>
            <div class="tl to">linkedin : <span class="tv">linkedin.com/in/jonathan-canevet-a6398a3a8</span></div>`,

        judo: () => `
            <div class="tl"><span class="tk">discipline </span> <span class="tv">Judo</span></div>
            <div class="tl"><span class="tk">grade      </span> <span class="tv">🥋 Ceinture Noire — 1er Dan</span></div>
            <div class="tl"><span class="tk">expérience </span> <span class="tv">16 ans de pratique</span></div>
            <div class="tl"><span class="tk">club       </span> <span class="tv">Energie Judo — May-sur-Evre</span></div>`,

        veille: () => `
            <div class="tl to">── Veille technologique ─────────────</div>
            <div class="tl to">&#8594; <span class="tk">Symfony</span>  : "Symfony framework" · "Symfony release" · "Symfony security"</div>
            <div class="tl to">&#8594; <span class="tk">PHP</span>      : "PHP 8" · "PHP news" · "PHP best practices"</div>
            <div class="tl to">&#8594; <span class="tk">Sécurité</span> : "web security PHP" · "PHP vulnerability"</div>
            <div class="tl to">Outil : <span class="tv">Google Alerts</span> — notifications quotidiennes</div>
            <div class="tl to">────────────────────────────────────</div>`,
    };

    inp.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const val = inp.value.trim().toLowerCase();
        if (!val) return;
        const echo = document.createElement('div');
        echo.className = 'tl';
        echo.innerHTML = `<span class="tp">➜</span> <span class="tc">${val}</span>`;
        out.appendChild(echo);
        if (val === 'clear') {
            out.innerHTML = '';
        } else if (cmds[val]) {
            const res = document.createElement('div');
            res.innerHTML = cmds[val]();
            out.appendChild(res);
        } else {
            const err = document.createElement('div');
            err.innerHTML = `<span class="terr">commande introuvable: ${val}</span> — tape <span class="tk">help</span>`;
            out.appendChild(err);
        }
        inp.value = '';
        body.scrollTop = body.scrollHeight;
    });
})();

/* ═══════════════════════════════════════════
   ANIMATIONS ORIGINALES
═══════════════════════════════════════════ */

/* SCROLL PROGRESS BAR */
const progressEl = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrolled = document.documentElement.scrollTop;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressEl.style.width = (total > 0 ? scrolled / total * 100 : 0) + '%';
}, { passive: true });

/* CUSTOM CURSOR (desktop uniquement) */
if (window.matchMedia('(pointer: fine)').matches) {
    document.body.classList.add('has-custom-cursor');
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    }, { passive: true });
    (function cursorLoop() {
        rx += (mx - rx) * .13;
        ry += (my - ry) * .13;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(cursorLoop);
    })();

    document.querySelectorAll('a, button, .proj-card, .skill-card, .c-card, input, .value-card, .piano-item, .stat-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
}

/* EFFET 3D TILT SUR LES CARTES (desktop uniquement) */
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.proj-card, .skill-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  - .5) * 2;
            const y = ((e.clientY - r.top)  / r.height - .5) * 2;
            card.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}

/* BOUTONS MAGNÉTIQUES */
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn, .c-card').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width  / 2) * .28;
            const y = (e.clientY - r.top  - r.height / 2) * .28;
            el.style.transform = `translate(${x}px,${y}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
}

/* NAV — SECTION ACTIVE AU SCROLL */
(() => {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !links.length) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => l.classList.toggle('nav-active', l.getAttribute('href') === '#' + e.target.id));
            }
        });
    }, { rootMargin: '-38% 0px -57% 0px' });
    sections.forEach(s => obs.observe(s));
})();

/* ORBES AMBIANTS */
[
    { sel: '#hero',    left: '4%',  top: '12%', w: '380px', c: 'rgba(79,158,255,.055)', d: '0s' },
    { sel: '#hero',    left: '72%', top: '52%', w: '300px', c: 'rgba(232,184,75,.042)', d: '3.5s' },
    { sel: '#contact', left: '58%', top: '15%', w: '320px', c: 'rgba(79,158,255,.06)',  d: '1s' },
    { sel: '#about',   left: '82%', top: '35%', w: '240px', c: 'rgba(79,158,255,.04)',  d: '2s' },
].forEach(({ sel, left, top, w, c, d }) => {
    const s = document.querySelector(sel);
    if (!s) return;
    const o = document.createElement('div');
    o.className = 'orb';
    o.style.cssText = `left:${left};top:${top};width:${w};height:${w};background:${c};animation-delay:${d}`;
    s.style.position = s.style.position || 'relative';
    s.appendChild(o);
});

/* ═══════════════════════════════════════════
   NAVBAR — ANIMATIONS IMPRESSIONNANTES
═══════════════════════════════════════════ */
(() => {
    const nav = document.querySelector('nav');

    /* 1. Glassmorphism renforcé au scroll */
    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 30);
    }, { passive: true });

    /* 3. Magic pill (desktop uniquement) */
    if (!window.matchMedia('(min-width: 992px)').matches) return;
    const wrap = document.querySelector('.nav-links');
    if (!wrap) return;
    wrap.style.position = 'relative';

    const pill = document.createElement('div');
    pill.className = 'nav-pill';
    wrap.insertBefore(pill, wrap.firstChild); /* Inséré en premier → peint sous les liens */

    wrap.querySelectorAll('a').forEach(a => {
        a.addEventListener('mouseenter', () => {
            const ar = a.getBoundingClientRect();
            const wr = wrap.getBoundingClientRect();
            pill.style.left    = (ar.left - wr.left - 9)  + 'px';
            pill.style.top     = (ar.top  - wr.top  - 6)  + 'px';
            pill.style.width   = (ar.width  + 18)         + 'px';
            pill.style.height  = (ar.height + 12)         + 'px';
            pill.style.opacity = '1';
        });
    });
    wrap.addEventListener('mouseleave', () => { pill.style.opacity = '0'; });
})();
