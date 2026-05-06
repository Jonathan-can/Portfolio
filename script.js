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
            <div class="tl to">&nbsp;&nbsp;<span class="tk">about</span>      · Qui suis-je ?</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">parcours</span>   · Mon parcours scolaire</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">skills</span>     · Mes compétences techniques</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">projects</span>   · Mes projets scolaires</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">stages</span>     · Mes stages en entreprise</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">contact</span>    · Me contacter</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">judo</span>       · Ma passion pour le judo</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">veille</span>     · Ma veille technologique</div>
            <div class="tl to">&nbsp;&nbsp;<span class="tk">clear</span>      · Effacer le terminal</div>`,

        about: () => `
            <div class="tl"><span class="tk">nom       </span> <span class="tv">Jonathan CANEVET</span></div>
            <div class="tl"><span class="tk">formation </span> <span class="tv">BTS SIO SLAM · ESUPEC, Cholet</span></div>
            <div class="tl"><span class="tk">ville     </span> <span class="tv">Cholet (49)</span></div>
            <div class="tl"><span class="tk">dispo     </span> <span class="tv">Alternance dès Septembre 2026</span></div>
            <div class="tl"><span class="tk">email     </span> <span class="tv">jocanevet49@gmail.com</span></div>`,

        parcours: () => `
            <div class="tl to">&#8594; <span class="tk">2022–2024</span>&nbsp;&nbsp;Baccalauréat Général · Spé Maths &amp; NSI</div>
            <div class="tl to">&#8594; <span class="tk">2024–2026</span>&nbsp;&nbsp;BTS SIO option SLAM · ESUPEC, Cholet</div>
            <div class="tl to">&#8594; <span class="tk">Sept.2026</span>&nbsp;&nbsp;<span class="tv">Recherche alternance développeur web/logiciel</span></div>`,

        skills: () => `
            <div class="tl to">&#8594; <span class="tk">Langages  </span>: <span class="tv">Java · PHP · JavaScript · C++ · Python · HTML · CSS · SQL</span></div>
            <div class="tl to">&#8594; <span class="tk">Frameworks</span>: <span class="tv">Symfony · Android Studio · Power Apps · Bootstrap · REST API</span></div>
            <div class="tl to">&#8594; <span class="tk">BDD       </span>: <span class="tv">MySQL · SQL Server · NoSQL · Doctrine · SQLite</span></div>
            <div class="tl to">&#8594; <span class="tk">Versioning</span>: <span class="tv">Git · GitHub</span></div>
            <div class="tl to">&#8594; <span class="tk">IA        </span>: <span class="tv">Maîtrise pratique · GitHub Copilot · Claude</span></div>`,

        projects: () => `
            <div class="tl to">01 · <span class="tv">Amap'market</span>         : PHP · HTML · CSS · JS · MySQL · Bootstrap</div>
            <div class="tl to">02 · <span class="tv">Escales La Rochelle</span> : PHP · Symfony · Doctrine · MySQL · Android · REST API</div>
            <div class="tl to">03 · <span class="tv">Tournois de judo</span>    : PHP · Symfony · Doctrine · MySQL · Android · REST API</div>`,

        stages: () => `
            <div class="tl to">S1 · <span class="tv">Batistyl</span> : Application Power Apps de A à Z en autonomie</div>
            <div class="tl to">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tk">Stack</span>: Power Apps · Power Automate · Dataverse · SharePoint</div>
            <div class="tl to">S2 · <span class="tv">Sogal</span>    : Graphiques qualité + refonte de site web</div>
            <div class="tl to">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tk">Stack</span>: PHP · Symfony · Doctrine · MySQL · Chart.js · SCSS · Twig · Swiper.js</div>`,

        contact: () => `
            <div class="tl to">email    : <span class="tv">jocanevet49@gmail.com</span></div>
            <div class="tl to">github   : <span class="tv">github.com/Jonathan-can</span></div>
            <div class="tl to">linkedin : <span class="tv">linkedin.com/in/jonathan-canevet-a6398a3a8</span></div>`,

        judo: () => `
            <div class="tl"><span class="tk">discipline </span> <span class="tv">Judo</span></div>
            <div class="tl"><span class="tk">grade      </span> <span class="tv">🥋 Ceinture Noire · 1er Dan</span></div>
            <div class="tl"><span class="tk">expérience </span> <span class="tv">16 ans de pratique</span></div>
            <div class="tl"><span class="tk">club       </span> <span class="tv">Energie Judo · May-sur-Evre</span></div>`,

        veille: () => `
            <div class="tl to">── Veille technologique ─────────────</div>
            <div class="tl to">&#8594; <span class="tk">Symfony</span>  : "Symfony framework" · "Symfony release" · "Symfony security"</div>
            <div class="tl to">&#8594; <span class="tk">PHP</span>      : "PHP 8" · "PHP news" · "PHP best practices"</div>
            <div class="tl to">&#8594; <span class="tk">Sécurité</span> : "web security PHP" · "PHP vulnerability"</div>
            <div class="tl to">Outil : <span class="tv">Google Alerts</span> · notifications quotidiennes</div>
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
            err.innerHTML = `<span class="terr">commande introuvable: ${val}</span>, tape <span class="tk">help</span>`;
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
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'border-color .2s ease, box-shadow .2s ease';
        });
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - .5) * 2;
            const y = ((e.clientY - r.top)  / r.height - .5) * 2;
            card.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform .25s ease, border-color .2s ease, box-shadow .2s ease';
            card.style.transform = '';
        });
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

/* NAV · SECTION ACTIVE AU SCROLL */
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
   NAVBAR · ANIMATIONS IMPRESSIONNANTES
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


/* ═══════════════════════════════════════════
   PROJECT MODALS
═══════════════════════════════════════════ */

const projectData = {
    proj1: {
        idx: 'Projet 01',
        isStage: false,
        title: "Amap'market",
        desc: `Application web complète de gestion d'une AMAP (Association pour le Maintien d'une Agriculture Paysanne), réalisée en équipe dans le cadre du BTS SIO.

Les adhérents peuvent consulter le catalogue de produits locaux, composer et gérer leurs paniers de commande, et suivre leurs livraisons. Les producteurs disposent d'un espace d'administration pour gérer leur catalogue, les stocks et planifier les distributions.`,
        features: [
            "Authentification séparée adhérents / producteurs",
            "Catalogue produits avec gestion des stocks",
            "Panier de commande et historique des achats",
            "Interface d'administration producteur",
            "Design responsive Bootstrap"
        ],
        stack: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL', 'Bootstrap'],
        img: 'img/amapmarket.png',
        imgIcon: '🛒',
        links: [{ label: 'GitHub', url: 'https://github.com/Ewen-Evin/AMAPMarket' }]
    },
    proj2: {
        idx: 'Projet 02',
        isStage: false,
        title: 'Gestion des escales · La Rochelle',
        desc: `Système de gestion des escales du port de La Rochelle, développé en binôme dans le cadre du BTS SIO. L'application permet le suivi en temps réel des navires, la planification des quais, la gestion des équipages et l'édition de rapports.

Le projet inclut une API REST consommée par une application Android développée en parallèle, permettant aux agents portuaires d'accéder aux informations depuis leur terminal mobile.`,
        features: [
            "Suivi des navires et affectation des quais",
            "Gestion des équipages et documents de bord",
            "API REST exposée pour l'application Android",
            "Application Android native (Android Studio)",
            "Génération et édition de rapports d'escale"
        ],
        stack: ['PHP', 'MySQL', 'Android Studio', 'Bootstrap', 'REST API'],
        img: 'img/escales.png',
        imgIcon: '⚓',
        links: [{ label: 'GitHub', url: 'https://github.com/azevan230/PPE3' }]
    },
    proj3: {
        idx: 'Projet 03',
        isStage: false,
        title: 'Gestion de tournois de judo',
        desc: `Application complète de gestion de tournois de judo, combinant un back-end Symfony et une application Android. Ce projet m'a permis d'allier ma passion pour le judo au développement logiciel.

L'application gère l'inscription des participants, génère automatiquement les poules par catégorie de poids, saisit les résultats en temps réel et calcule le classement final. L'app Android consomme l'API REST du back-end.`,
        features: [
            "Inscription et gestion des participants par catégorie",
            "Tirage automatique des poules",
            "Saisie des résultats en temps réel",
            "Classement final automatique",
            "Application Android connectée via REST API"
        ],
        stack: ['PHP', 'Symfony', 'Doctrine', 'MySQL', 'Android Studio', 'Bootstrap', 'REST API'],
        img: 'img/tournoi.png',
        imgIcon: '🥋',
        links: [{ label: 'GitHub', url: 'https://github.com/dootod/tournois-app-web' }]
    },
    stage1: {
        idx: 'Stage 01 · Batistyl',
        isStage: true,
        title: 'Application Power Apps · Batistyl',
        desc: `Premier stage en entreprise chez Batistyl, fabricant de menuiseries. J'ai développé en totale autonomie une application métier complète sur Microsoft Power Apps, de la phase de recueil des besoins jusqu'au déploiement en production.

L'application automatise un processus métier clé de l'entreprise avec des workflows Power Automate et des données stockées dans Dataverse / SharePoint. Une expérience complète du cycle de vie d'un projet applicatif.`,
        features: [
            "Recueil et analyse des besoins métier",
            "Conception de l'architecture applicative",
            "Développement de l'interface Power Apps",
            "Automatisation des flux avec Power Automate",
            "Déploiement et formation des utilisateurs"
        ],
        stack: ['Power Apps', 'Power Automate', 'Dataverse', 'SharePoint'],
        img: 'img/batistyl.png',
        imgIcon: '📱',
        links: []
    },
    stage2: {
        idx: 'Stage 02 · Sogal',
        isStage: true,
        title: 'Intégration web & refonte · Sogal',
        desc: `Deuxième stage chez Sogal, spécialiste de l'aménagement intérieur. J'ai travaillé sur deux projets : l'intégration de graphiques de suivi qualité sur un site Symfony existant, et la participation à la refonte complète d'un site web.

Pour les graphiques, j'ai intégré Chart.js dans une application Symfony existante. Pour la refonte, j'ai participé au maquettage et au développement front-end avec SCSS, Twig et Swiper.js.`,
        features: [
            "Développement de graphiques qualité avec Chart.js",
            "Intégration dans une application Symfony existante",
            "Participation à la refonte front-end d'un site",
            "Intégration des maquettes avec SCSS et Twig",
            "Mise en place d'un carrousel Swiper.js"
        ],
        stack: ['PHP', 'Symfony', 'Doctrine', 'MySQL', 'Bootstrap', 'Chart.js', 'SCSS', 'Twig', 'Swiper.js'],
        img: 'img/sogal.png',
        imgIcon: '🌐',
        links: []
    }
};

(() => {
    const overlay = document.getElementById('proj-modal');
    const box     = overlay.querySelector('.modal-box');
    const closeBtn = document.getElementById('modal-close-btn');

    function openModal(id) {
        const d = projectData[id];
        if (!d) return;

        document.getElementById('modal-idx-el').textContent = d.idx;
        document.getElementById('modal-idx-el').className = 'modal-idx' + (d.isStage ? ' is-stage' : '');
        document.getElementById('modal-title-el').textContent = d.title;
        document.getElementById('modal-desc-el').textContent = d.desc;

        const featWrap = document.getElementById('modal-feat-wrap');
        const featEl   = document.getElementById('modal-features');
        if (d.features && d.features.length) {
            featEl.innerHTML = '<ul>' + d.features.map(f => `<li>${f}</li>`).join('') + '</ul>';
            featWrap.style.display = 'block';
        } else {
            featWrap.style.display = 'none';
        }

        document.getElementById('modal-stack').innerHTML =
            d.stack.map(t => `<span class="proj-tag">${t}</span>`).join('');

        document.getElementById('modal-links').innerHTML =
            d.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" class="p-link">${l.label} ↗</a>`).join('');

        const imgEl = document.getElementById('modal-img');
        const phEl  = document.getElementById('modal-img-ph');
        document.getElementById('modal-img-ph-icon').textContent = d.imgIcon || '🖼️';
        imgEl.style.display = 'none';
        phEl.style.display  = 'flex';

        if (d.img) {
            imgEl.onload  = () => { imgEl.style.display = 'block'; phEl.style.display = 'none'; };
            imgEl.onerror = () => { imgEl.style.display = 'none';  phEl.style.display = 'flex'; };
            imgEl.src = d.img;
        }

        overlay.classList.add('open');
        document.body.classList.add('modal-open');
        box.scrollTop = 0;
    }

    function closeModal() {
        overlay.classList.remove('open');
        document.body.classList.remove('modal-open');
    }

    document.querySelectorAll('.proj-card[data-project]').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('a')) return;
            openModal(card.dataset.project);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });
})();
