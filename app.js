// Konfigurace cesty k datům
const DATA_URL = 'profile.json';

// --- HLAVNÍ FUNKCE PRO NAČTENÍ DAT ---
document.addEventListener('DOMContentLoaded', () => {
    fetch(DATA_URL)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            // 1. Vykreslení základních údajů
            renderProfile(data);
            
            // 2. Vykreslení sekcí
            renderSkills(data.skills);
            renderProjects(data.projects);
            renderContact(data.contact);

            // 3. Inicializace ikon (Lucide)
            // Musíme zavolat až po vygenerování HTML
            lucide.createIcons();

            // 4. Inicializace interaktivních efektů
            // Musíme zavolat až když existují elementy v DOM
            initVisualEffects();
        })
        .catch(error => {
            console.error('Chyba při načítání dat:', error);
            document.getElementById('name').textContent = "Chyba načítání";
        });
});

// --- POMOCNÉ FUNKCE PRO VYKRESLOVÁNÍ (RENDERING) ---

function renderProfile(data) {
    document.getElementById('name').textContent = data.name;
    document.getElementById('role').textContent = data.role;
    
    // Volitelné: Text o mně
    if(data.about && document.getElementById('about-text')) {
        document.getElementById('about-text').textContent = data.about.description;
    }
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    container.innerHTML = ''; // Vyčištění pro jistotu

    skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        
        card.innerHTML = `
            <i data-lucide="${skill.icon}"></i>
            <h3>${skill.title}</h3>
            <p>${skill.desc}</p>
        `;
        container.appendChild(card);
    });
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // Generování tagů
        const tagsHtml = project.tags.map(tag => `<span>${tag}</span>`).join('');

        card.innerHTML = `
            <div class="project-img">
                <div class="project-overlay">
                    <a href="#" class="btn-icon"><i data-lucide="external-link"></i></a>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.desc}</p>
                <div class="tags">${tagsHtml}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderContact(contact) {
    const container = document.getElementById('contact-container');
    if(!container) return;

    container.innerHTML = `
        <a href="mailto:${contact.email}" class="contact-item">
            <i data-lucide="mail"></i>
            <span>${contact.email}</span>
        </a>
        <div class="contact-item">
            <i data-lucide="map-pin"></i>
            <span>${contact.location}</span>
        </div>
    `;
}

// --- VIZUÁLNÍ EFEKTY (přeneseno z původního script.js) ---

function initVisualEffects() {
    // 1. Cursor Glow Effect
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Reveal Animations on Scroll
    const sections = document.querySelectorAll('.section');
    
    // Přidání CSS pro reveal dynamicky
    const style = document.createElement('style');
    style.textContent = `
        .section.revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.append(style);

    const revealSection = (entries, observer) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease-out';
        sectionObserver.observe(section);
    });

    // 4. Magnetic Card Effect (aplikováno na nově vytvořené karty)
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = -(x - centerX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
}
