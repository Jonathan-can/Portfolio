// Elements
class NavigationElement {
    constructor() {
        this.navLinks = document.querySelectorAll('[data-nav]');
        this.activeClass = 'active';
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-nav');
                this.setActiveLink(targetPage);
            });
        });
    }

    setActiveLink(page) {
        this.navLinks.forEach(link => {
            link.classList.remove(this.activeClass);
            if (link.getAttribute('data-nav') === page) {
                link.classList.add(this.activeClass);
            }
        });
    }

    getActivePage() {
        const activeLink = document.querySelector(`.nav-links a.${this.activeClass}`);
        return activeLink ? activeLink.getAttribute('data-nav') : 'accueil';
    }
}

class PageElement {
    constructor() {
        this.pages = document.querySelectorAll('.page-section');
        this.activeClass = 'active';
    }

    init() {
        // Initialiser l'observation d'intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.showPage(entry.target.getAttribute('data-page'));
                }
            });
        }, { threshold: 0.3 });

        this.pages.forEach(page => observer.observe(page));
    }

    showPage(pageName) {
        this.pages.forEach(page => {
            if (page.getAttribute('data-page') === pageName) {
                page.classList.add(this.activeClass);
            } else {
                page.classList.remove(this.activeClass);
            }
        });
    }

    scrollToPage(pageName) {
        const targetPage = document.querySelector(`[data-page="${pageName}"]`);
        if (targetPage) {
            targetPage.scrollIntoView({ behavior: 'smooth' });
        }
    }

    getCurrentPage() {
        const activePage = document.querySelector(`.page-section.${this.activeClass}`);
        return activePage ? activePage.getAttribute('data-page') : 'accueil';
    }
}

// Services
class NavigationService {
    constructor(navigationElement, pageElement) {
        this.navElement = navigationElement;
        this.pageElement = pageElement;
    }

    init() {
        this.navElement.init();
        this.pageElement.init();
        
        // Synchroniser la navigation avec le défilement
        this.setupNavigation();
        this.setupSmoothScrolling();
    }

    setupNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-nav]') || e.target.closest('[data-nav]')) {
                e.preventDefault();
                const link = e.target.matches('[data-nav]') ? e.target : e.target.closest('[data-nav]');
                const targetPage = link.getAttribute('data-nav');
                
                this.navigateTo(targetPage);
            }
        });
    }

    setupSmoothScrolling() {
        // Gérer les ancres dans l'URL
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && this.isValidPage(hash)) {
                this.navigateTo(hash);
            }
        });

        // Gérer l'URL initiale
        if (window.location.hash) {
            const initialPage = window.location.hash.substring(1);
            if (this.isValidPage(initialPage)) {
                setTimeout(() => this.navigateTo(initialPage), 100);
            }
        }
    }

    navigateTo(pageName) {
        if (!this.isValidPage(pageName)) return;

        this.navElement.setActiveLink(pageName);
        this.pageElement.scrollToPage(pageName);
        
        // Mettre à jour l'URL
        window.history.pushState(null, '', `#${pageName}`);
    }

    isValidPage(pageName) {
        const validPages = ['accueil', 'apropos', 'projets', 'contact'];
        return validPages.includes(pageName);
    }

    getCurrentPage() {
        return this.pageElement.getCurrentPage();
    }
}

class ProjectService {
    constructor() {
        this.projects = [
            {
                id: 1,
                title: "E-commerce Écologique",
                description: "Plateforme e-commerce spécialisée dans les produits écologiques avec système de paiement sécurisé et gestion d'inventaire.",
                technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                icon: "fas fa-shopping-cart",
                demoUrl: "#",
                codeUrl: "#"
            },
            {
                id: 2,
                title: "Application de Gestion de Tâches",
                description: "Application web de gestion de tâches avec fonctionnalités de collaboration en équipe et calendrier intégré.",
                technologies: ["Vue.js", "Firebase", "CSS3"],
                icon: "fas fa-tasks",
                demoUrl: "#",
                codeUrl: "#"
            },
            {
                id: 3,
                title: "Chatbot Éducatif",
                description: "Chatbot utilisant l'IA pour aider les étudiants en programmation avec des explications et des exemples de code.",
                technologies: ["Python", "TensorFlow", "Flask", "NLP"],
                icon: "fas fa-robot",
                demoUrl: "#",
                codeUrl: "#"
            }
        ];
    }

    getProjects() {
        return this.projects;
    }

    renderProjects(container) {
        const projectsGrid = container || document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = this.projects.map(project => `
            <div class="project-card">
                <div class="project-img">
                    <i class="${project.icon}"></i>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.demoUrl}"><i class="fas fa-external-link-alt"></i> Voir le projet</a>
                        <a href="${project.codeUrl}"><i class="fab fa-github"></i> Code source</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Application principale
class PortfolioApp {
    constructor() {
        this.navigationElement = new NavigationElement();
        this.pageElement = new PageElement();
        this.navigationService = new NavigationService(this.navigationElement, this.pageElement);
        this.projectService = new ProjectService();
    }

    init() {
        // Initialiser les services
        this.navigationService.init();
        this.projectService.renderProjects();

        // Initialiser le formulaire de contact
        this.initContactForm();

        // Animation au défilement pour les sections
        this.initScrollAnimations();

        console.log('Portfolio app initialisé avec la méthode POSE');
    }

    initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }
    }

    handleContactForm() {
        // Simulation d'envoi de formulaire
        const formData = new FormData(document.getElementById('contact-form'));
        const data = Object.fromEntries(formData);
        
        console.log('Données du formulaire:', data);
        alert('Message envoyé avec succès! (simulation)');
        document.getElementById('contact-form').reset();
    }

    initScrollAnimations() {
        // Animation pour les compétences
        const skills = document.querySelectorAll('.skill');
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        skills.forEach(skill => {
            skill.style.opacity = '0';
            skill.style.transform = 'translateY(20px)';
            skill.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            skillsObserver.observe(skill);
        });

        // Animation pour les cartes de projets
        const projectCards = document.querySelectorAll('.project-card');
        const projectsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.1 });

        projectCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            projectsObserver.observe(card);
        });
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();
});

// Gérer le rechargement de la page avec hash
window.addEventListener('load', () => {
    if (window.location.hash) {
        const page = window.location.hash.substring(1);
        const validPages = ['accueil', 'apropos', 'projets', 'contact'];
        if (validPages.includes(page)) {
            setTimeout(() => {
                const targetSection = document.getElementById(page);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }
});