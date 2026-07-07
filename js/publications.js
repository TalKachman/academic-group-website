// Publications page functionality
let allPublications = [];
let filteredPublications = [];

// Load and display publications
async function loadPublicationsPage() {
    try {
        const response = await fetch('data/publications.json');
        const data = await response.json();
        allPublications = data.publications.sort((a, b) => b.year - a.year); // Sort by year descending
        filteredPublications = [...allPublications];

        populateYearFilter();
        renderPublications();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading publications:', error);
        document.getElementById('publications-container').innerHTML =
            '<p class="error-message">Failed to load publications. Please try again later.</p>';
    }
}

// Populate year filter dropdown
function populateYearFilter() {
    const years = [...new Set(allPublications.map(pub => pub.year))].sort((a, b) => b - a);
    const yearFilter = document.getElementById('year-filter');

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// Render publications
function renderPublications() {
    const container = document.getElementById('publications-container');
    const noResults = document.getElementById('no-results');

    if (filteredPublications.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    noResults.style.display = 'none';

    container.innerHTML = filteredPublications.map(pub => `
        <div class="publication-card" data-id="${pub.id}">
            <div class="publication-header">
                <div class="publication-title-section">
                    <h3 class="publication-title">${pub.title}</h3>
                    <div class="publication-meta">
                        <span class="publication-authors">${pub.authors}</span>
                        <span class="publication-venue">${pub.venue}, ${pub.year}</span>
                        <span class="publication-type-badge type-${pub.type}">${pub.type}</span>
                    </div>
                    ${pub.tags && pub.tags.length > 0 ? `
                        <div class="publication-tags">
                            ${pub.tags.map(tag => `<span class="tag tag-${tag}">${formatTag(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>

            ${pub.abstract ? `
                <div class="publication-abstract">
                    <p>${pub.abstract}</p>
                </div>
            ` : ''}

            <div class="publication-links">
                ${pub.pdf ? `<a href="${pub.pdf}" target="_blank" class="pub-link pub-link-pdf">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5.5 11.5A1.5 1.5 0 0 1 4 10h1v1.5zm6.5 0a1.5 1.5 0 0 1-1.5-1.5H9v1.5H7V4h2.5A1.5 1.5 0 0 1 11 5.5v1A1.5 1.5 0 0 1 9.5 8H9v2z"/>
                    </svg>
                    PDF
                </a>` : ''}
                ${pub.code ? `<a href="${pub.code}" target="_blank" class="pub-link pub-link-code">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
                    </svg>
                    Code
                </a>` : ''}
                ${pub.project ? `<a href="${pub.project}" class="pub-link pub-link-project">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                    </svg>
                    Project
                </a>` : ''}
                ${pub.bibtex ? `<button onclick="showBibtexModal('${pub.id}')" class="pub-link pub-link-bibtex">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
                    </svg>
                    BibTeX
                </button>` : ''}
            </div>
        </div>
    `).join('');
}

// Format tag for display
function formatTag(tag) {
    const tagNames = {
        'llm-theory-of-mind': 'LLM & ToM',
        'chemical-ai': 'Chemical AI',
        'game-theory': 'Game Theory',
        'training-dynamics': 'Training Dynamics'
    };
    return tagNames[tag] || tag;
}

// Filter publications
function applyFilters() {
    const searchQuery = document.getElementById('pub-search').value.toLowerCase();
    const yearFilter = document.getElementById('year-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const themeFilter = document.getElementById('theme-filter').value;

    filteredPublications = allPublications.filter(pub => {
        // Search filter
        const matchesSearch = !searchQuery ||
            pub.title.toLowerCase().includes(searchQuery) ||
            pub.authors.toLowerCase().includes(searchQuery) ||
            pub.venue.toLowerCase().includes(searchQuery) ||
            (pub.abstract && pub.abstract.toLowerCase().includes(searchQuery));

        // Year filter
        const matchesYear = yearFilter === 'all' || pub.year.toString() === yearFilter;

        // Type filter
        const matchesType = typeFilter === 'all' || pub.type === typeFilter;

        // Theme filter
        const matchesTheme = themeFilter === 'all' ||
            (pub.tags && pub.tags.includes(themeFilter));

        return matchesSearch && matchesYear && matchesType && matchesTheme;
    });

    renderPublications();
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('pub-search');
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300); // Debounce search
    });

    // Filter dropdowns
    document.getElementById('year-filter').addEventListener('change', applyFilters);
    document.getElementById('type-filter').addEventListener('change', applyFilters);
    document.getElementById('theme-filter').addEventListener('change', applyFilters);

    // Reset filters button
    document.getElementById('reset-filters').addEventListener('click', () => {
        document.getElementById('pub-search').value = '';
        document.getElementById('year-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        document.getElementById('theme-filter').value = 'all';
        applyFilters();
    });

    // Modal close button
    const modal = document.getElementById('bibtex-modal');
    const closeBtn = document.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Copy BibTeX button
    document.getElementById('copy-bibtex').addEventListener('click', copyBibtex);
}

// Show BibTeX modal
function showBibtexModal(pubId) {
    const pub = allPublications.find(p => p.id === pubId);
    if (!pub || !pub.bibtex) return;

    const modal = document.getElementById('bibtex-modal');
    const content = document.getElementById('bibtex-content');

    content.textContent = pub.bibtex;
    modal.style.display = 'block';
}

// Copy BibTeX to clipboard
async function copyBibtex() {
    const bibtexContent = document.getElementById('bibtex-content').textContent;
    const copyBtn = document.getElementById('copy-bibtex');

    try {
        await navigator.clipboard.writeText(bibtexContent);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy BibTeX. Please copy manually.');
    }
}

// Initialize when DOM is loaded
if (document.getElementById('publications-container')) {
    document.addEventListener('DOMContentLoaded', loadPublicationsPage);
}
