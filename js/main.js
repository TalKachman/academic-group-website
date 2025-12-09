// Mobile hamburger menu toggle
function toggleMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('header nav ul');
    const body = document.body;

    if (menuToggle && navMenu) {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
}

// Close menu when clicking on overlay
document.addEventListener('click', function(e) {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('header nav ul');
    const body = document.body;

    if (body.classList.contains('menu-open') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

// Close menu when clicking on a navigation link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('header nav ul a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const navMenu = document.querySelector('header nav ul');
            const body = document.body;

            if (menuToggle && navMenu) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    });
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Initialize syntax highlighting if Prism is loaded
if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
}

// Load publications from JSON
async function loadPublications() {
    try {
        const response = await fetch('data/publications.json');
        const data = await response.json();
        return data.publications;
    } catch (error) {
        console.error('Error loading publications:', error);
        return [];
    }
}

// Load projects from JSON
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

// Render publications list
function renderPublications(publications, containerId = 'publications-list', limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pubs = limit ? publications.slice(0, limit) : publications;

    container.innerHTML = pubs.map(pub => `
        <div class="publication">
            <div class="publication-title">${pub.title}</div>
            <div class="publication-authors">${pub.authors}</div>
            <div class="publication-venue">${pub.venue}, ${pub.year}</div>
            ${pub.abstract ? `<p style="margin-top: 0.5rem; font-size: 0.9rem;">${pub.abstract}</p>` : ''}
            <div class="publication-links">
                ${pub.pdf ? `<a href="${pub.pdf}" target="_blank">PDF</a>` : ''}
                ${pub.code ? `<a href="${pub.code}" target="_blank">Code</a>` : ''}
                ${pub.project ? `<a href="${pub.project}" target="_blank">Project Page</a>` : ''}
                ${pub.bibtex ? `<a href="#" onclick="showBibtex('${pub.id}'); return false;">BibTeX</a>` : ''}
            </div>
        </div>
    `).join('');
}

// Show BibTeX modal (simple alert for now)
function showBibtex(pubId) {
    // You can implement a modal here
    alert('BibTeX for ' + pubId);
}

// Auto-load publications and projects on specific pages
if (document.getElementById('publications-list')) {
    loadPublications().then(pubs => {
        renderPublications(pubs, 'publications-list');
    });
}

if (document.getElementById('recent-publications')) {
    loadPublications().then(pubs => {
        renderPublications(pubs, 'recent-publications', 3);
    });
}
