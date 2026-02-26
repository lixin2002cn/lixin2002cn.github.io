// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Set current year and date
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('last-updated').textContent = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Load data
    loadProfile();
    loadEducation();
    loadExperience();
    loadPublications();
    loadProjects();
    loadAwards();
    loadSkills();

    // Initialize scroll animations
    setTimeout(initScrollAnimations, 300);

    // Nav scroll transition: transparent on hero → glass after scroll
    const nav = document.getElementById('main-nav');
    const handleScroll = () => {
        if (window.scrollY > 80) {
            nav.classList.remove('nav-transparent');
            nav.classList.add('nav-glass');
        } else {
            nav.classList.remove('nav-glass');
            nav.classList.add('nav-transparent');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
});

// Scroll-based fade-in animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Helper function to fetch JSON
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        return null;
    }
}

// Load Profile → Hero + About + Footer
async function loadProfile() {
    const data = await fetchJSON('data/profile.json');
    if (!data) return;

    document.title = `${data.name} - Homepage`;
    document.getElementById('nav-name').textContent = data.name;

    const hero = document.getElementById('hero-container');
    hero.innerHTML = `
        <img src="${data.image}" alt="${data.name}" class="hero-avatar">
        <div class="flex-1 text-white">
            <h1 class="text-4xl md:text-5xl font-serif font-bold mb-2">${data.name}</h1>
            <p class="text-xl text-blue-200 font-light mb-4">${data.title}</p>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-blue-100 text-sm mb-6">
                <span><i class="fas fa-envelope mr-2"></i><a href="mailto:${data.email}" class="hover:text-white transition-colors">${data.email}</a></span>
                <span><i class="fas fa-phone mr-2"></i>${data.phone}</span>
                <span><i class="fas fa-map-marker-alt mr-2"></i>${data.location}</span>
            </div>
            <div class="flex flex-wrap gap-3">
                <a href="${data.github}" target="_blank" class="hero-btn"><i class="fab fa-github"></i> GitHub</a>
                <a href="${data.google_scholar}" target="_blank" class="hero-btn"><i class="fas fa-graduation-cap"></i> Google Scholar</a>
                <a href="${data.linkedin}" target="_blank" class="hero-btn"><i class="fab fa-linkedin"></i> LinkedIn</a>
                <a href="mailto:${data.email}" class="hero-btn"><i class="fas fa-envelope"></i> Contact</a>
            </div>
        </div>
    `;

    const aboutHtml = `
        <div class="fade-in">
            <p class="mb-4">${data.about}</p>
            <p class="mb-4">Currently, I am working as a <strong>Technology Partner</strong> at <a href="http://www.yagotec.com/" target="_blank" class="text-accent hover:underline">YAGOTec</a>, where I am responsible for the company's strategic planning and transformation, focusing on recommendation algorithms, app feature planning, and AIGC (Artificial Intelligence Generated Content).</p>
            <p>I am also a <strong>Co-founder in Technology</strong> at <a href="http://luminapath.ai/" target="_blank" class="text-accent hover:underline">LuminaPath.ai</a>, leading the technical team to develop the company's MVP. Our team was recognized as a 2026 President's Innovation Challenge Semi Finalist at Harvard Innovation Labs.</p>
        </div>
    `;
    document.getElementById('about-container').innerHTML = aboutHtml;

    // Footer social
    document.getElementById('footer-social').innerHTML = `
        <a href="${data.github}" target="_blank" class="footer-icon" title="GitHub"><i class="fab fa-github"></i></a>
        <a href="${data.google_scholar}" target="_blank" class="footer-icon" title="Google Scholar"><i class="fas fa-graduation-cap"></i></a>
        <a href="${data.linkedin}" target="_blank" class="footer-icon" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
        <a href="mailto:${data.email}" class="footer-icon" title="Email"><i class="fas fa-envelope"></i></a>
    `;
}

// Load Education
async function loadEducation() {
    const data = await fetchJSON('data/education.json');
    if (!data) return;

    const container = document.getElementById('education-container');
    let html = '';

    data.forEach((item, i) => {
        const detailsHtml = item.details ? `<ul class="details-list text-gray-600 text-sm mt-3">${item.details.map(d => `<li>${d}</li>`).join('')}</ul>` : '';
        
        html += `
            <div class="timeline-card fade-in" style="transition-delay: ${i * 100}ms">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h3 class="text-lg font-bold text-gray-900">${item.institution}</h3>
                    <span class="date-badge">${item.date}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mb-1">
                    <span class="font-medium italic text-secondary">${item.degree}</span>
                    <span><i class="fas fa-map-marker-alt mr-1 text-gray-400"></i>${item.location}</span>
                </div>
                ${detailsHtml}
            </div>
        `;
    });

    container.innerHTML = html;
}

// Load Experience
async function loadExperience() {
    const data = await fetchJSON('data/experience.json');
    if (!data) return;

    const container = document.getElementById('experience-container');
    let html = '';

    data.forEach((item, i) => {
        const companyHtml = item.link ? `<a href="${item.link}" target="_blank" class="text-gray-900 hover:text-accent hover:underline">${item.company}</a>` : item.company;
        const detailsHtml = item.details ? `<ul class="details-list text-gray-600 text-sm mt-3">${item.details.map(d => `<li>${d}</li>`).join('')}</ul>` : '';
        
        html += `
            <div class="timeline-card fade-in" style="transition-delay: ${i * 100}ms">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h3 class="text-lg font-bold">${companyHtml}</h3>
                    <span class="date-badge">${item.date}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mb-1">
                    <span class="font-medium italic text-secondary">${item.role}</span>
                    <span><i class="fas fa-map-marker-alt mr-1 text-gray-400"></i>${item.location}</span>
                </div>
                ${detailsHtml}
            </div>
        `;
    });

    container.innerHTML = html;
}

// Load Publications
async function loadPublications() {
    const data = await fetchJSON('data/publications.json');
    if (!data) return;

    const container = document.getElementById('publications-container');
    let html = '';

    data.forEach((section, i) => {
        const itemsHtml = section.items.map(item => `<li>${item}</li>`).join('');
        html += `
            <div class="fade-in" style="transition-delay: ${i * 100}ms">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-accent inline-block"></span>
                    ${section.type}
                </h3>
                <ol class="pub-list text-gray-600 text-sm">
                    ${itemsHtml}
                </ol>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Load Projects
async function loadProjects() {
    const data = await fetchJSON('data/projects.json');
    if (!data) return;

    const container = document.getElementById('projects-container');
    let html = '';

    data.forEach((item, i) => {
        const titleHtml = item.link ? `<a href="${item.link}" target="_blank" class="text-gray-900 hover:text-accent transition-colors">${item.title}</a>` : item.title;
        const detailsHtml = item.details ? `<ul class="details-list text-gray-600 text-sm mt-3">${item.details.map(d => `<li>${d}</li>`).join('')}</ul>` : '';
        
        html += `
            <div class="project-card fade-in" style="transition-delay: ${i * 80}ms">
                <div class="flex justify-between items-start gap-2 mb-1">
                    <h3 class="text-base font-bold text-gray-900">${titleHtml}</h3>
                </div>
                <p class="text-xs text-gray-400 italic mb-1">${item.subtitle}</p>
                <span class="date-badge text-xs mb-3 inline-block">${item.date}</span>
                ${detailsHtml}
            </div>
        `;
    });

    container.innerHTML = html;
}

// Load Awards
async function loadAwards() {
    const data = await fetchJSON('data/awards.json');
    if (!data) return;

    const container = document.getElementById('awards-container');
    let html = '';

    const iconMap = {
        'Scholarships': 'fa-medal',
        'Achievements': 'fa-award',
        'Social Engagements': 'fa-hands-helping'
    };

    data.forEach((section, i) => {
        const icon = iconMap[section.category] || 'fa-star';
        const itemsHtml = section.items.map(item => `
            <div class="award-row">
                <span class="text-gray-600 text-sm flex-1 pr-4">${item.title}</span>
                <span class="text-sm text-gray-400 whitespace-nowrap font-medium">${item.date}</span>
            </div>
        `).join('');
        
        html += `
            <div class="fade-in" style="transition-delay: ${i * 100}ms">
                <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i class="fas ${icon} text-accent"></i>
                    ${section.category}
                </h3>
                <div class="bg-gray-50 rounded-xl border border-gray-100 p-5">
                    ${itemsHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Load Skills
async function loadSkills() {
    const data = await fetchJSON('data/skills.json');
    if (!data) return;

    const iconMap = {
        'Language': 'fa-language',
        'Software': 'fa-code',
        'Official tools': 'fa-tools',
        'Operation System': 'fa-desktop',
        'Others': 'fa-puzzle-piece'
    };

    const container = document.getElementById('skills-container');
    let html = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">';

    data.forEach((item, i) => {
        const icon = iconMap[item.category] || 'fa-check';
        html += `
            <div class="skill-card fade-in" style="transition-delay: ${i * 80}ms">
                <div class="flex items-center gap-2 mb-2">
                    <i class="fas ${icon} text-blue-300"></i>
                    <h4 class="font-bold text-white">${item.category}</h4>
                </div>
                <p class="text-sm text-blue-100/80">${item.details}</p>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}
