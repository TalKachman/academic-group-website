// News page functionality
let allNews = [];
let filteredNews = [];

// Load and display news
async function loadNewsPage() {
    try {
        const response = await fetch('data/news.json');
        const data = await response.json();
        allNews = data.news.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
        filteredNews = [...allNews];

        renderNews();
        setupNewsEventListeners();
    } catch (error) {
        console.error('Error loading news:', error);
        document.getElementById('news-container').innerHTML =
            '<p class="error-message">Failed to load news. Please try again later.</p>';
    }
}

// Render news items
function renderNews() {
    const container = document.getElementById('news-container');
    const noNews = document.getElementById('no-news');

    if (filteredNews.length === 0) {
        container.style.display = 'none';
        noNews.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    noNews.style.display = 'none';

    container.innerHTML = filteredNews.map(item => `
        <div class="news-card">
            <div class="news-header">
                <span class="news-date">${formatDate(item.date)}</span>
                <span class="news-category category-${item.category}">${formatCategory(item.category)}</span>
            </div>
            <h3 class="news-title">${item.title}</h3>
            <p class="news-description">${item.description}</p>
            ${item.link ? `
                <a href="${item.link}" class="news-link" ${item.link.startsWith('http') ? 'target="_blank"' : ''}>
                    Read more →
                </a>
            ` : ''}
        </div>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format category for display
function formatCategory(category) {
    const categoryNames = {
        'publication': 'Publication',
        'award': 'Award',
        'talk': 'Talk',
        'event': 'Event',
        'hiring': 'Hiring'
    };
    return categoryNames[category] || category;
}

// Apply filters
function applyNewsFilters() {
    const categoryFilter = document.getElementById('category-filter').value;

    filteredNews = allNews.filter(item => {
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesCategory;
    });

    renderNews();
}

// Setup event listeners
function setupNewsEventListeners() {
    document.getElementById('category-filter').addEventListener('change', applyNewsFilters);
}

// Initialize when DOM is loaded
if (document.getElementById('news-container')) {
    document.addEventListener('DOMContentLoaded', loadNewsPage);
}

// Export for use in main.js (for landing page news)
async function loadRecentNews(limit = 3) {
    try {
        const response = await fetch('data/news.json');
        const data = await response.json();
        const recentNews = data.news
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
        return recentNews;
    } catch (error) {
        console.error('Error loading recent news:', error);
        return [];
    }
}
