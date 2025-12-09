# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static academic website for the CATALYST Lab (Complex Agent Theory, Autonomy, Learning dYnamicS & Theory) at Radboud University & Yale School of Management. The site is built with vanilla HTML, CSS, and JavaScript without any build process or framework dependencies.

## Development Commands

### Local Development Server

Start a local server to view the site:

```bash
# Using Python (recommended)
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

### No Build Process

This is a static site with no build, lint, or test commands. All HTML, CSS, and JavaScript files are served directly.

## Architecture

### Site Structure

The site uses two different architectural patterns:

1. **Landing Page** ([index.html](index.html)): Minimalist single-page design with inline CSS, featuring a two-column grid layout (navigation on left, image on right)
2. **Content Pages** (about.html, research.html, group.html, etc.): Multi-page structure using shared CSS ([css/pages.css](css/pages.css)) with a fixed header navigation

### Key Components

**HTML Pages:**
- [index.html](index.html) - Landing page with navigation grid
- [about.html](about.html) - About the lab
- [research.html](research.html) - Research themes and publications
- [group.html](group.html) - Team members showcase
- [information_for_prospective_students.html](information_for_prospective_students.html) - Student recruitment info
- [code.html](code.html) - Code repositories
- [contact.html](contact.html) - Contact information
- [people/tal.html](people/tal.html) - Individual profile page

**JavaScript:**
- [js/main.js](js/main.js) - Core utilities including:
  - Publication/project loading from JSON files
  - Smooth scroll navigation
  - Dynamic content rendering
  - Syntax highlighting initialization (Prism.js)
- [js/markdown.js](js/markdown.js) - Markdown rendering support (marked.js)

**CSS:**
- [css/pages.css](css/pages.css) - Shared styles for multi-page layout (fixed header nav, responsive design)
- [css/main.css](css/main.css) - Legacy styles for multi-page variant
- [css/syntax.css](css/syntax.css) - Code syntax highlighting styles

**Data Files:**
- [data/publications.json](data/publications.json) - Publication metadata (title, authors, venue, year, abstract, links)
- [data/projects.json](data/projects.json) - Research project metadata (title, description, team, funding, status)

### Data-Driven Content

Publications and projects are loaded dynamically from JSON files. The system uses:
- `loadPublications()` and `loadProjects()` functions to fetch JSON data
- `renderPublications()` to display publication lists
- Auto-initialization on page load for elements with IDs `publications-list` or `recent-publications`

### Adding Content

**Publications** - Edit [data/publications.json](data/publications.json):
```json
{
  "id": "unique-id",
  "title": "Paper Title",
  "authors": "Author A, Author B",
  "venue": "Conference/Journal Name",
  "year": 2025,
  "abstract": "Brief abstract...",
  "pdf": "assets/pdfs/papers/paper.pdf",
  "code": "https://github.com/username/repo",
  "bibtex": "@inproceedings{...}"
}
```

**Projects** - Edit [data/projects.json](data/projects.json):
```json
{
  "id": "project-id",
  "title": "Project Title",
  "description": "Description...",
  "image": "assets/images/research/image.jpg",
  "status": "active",
  "funding": "Grant info",
  "team": ["Member 1", "Member 2"],
  "links": {
    "github": "https://github.com/...",
    "paper": "assets/pdfs/..."
  }
}
```

**Images** - Organized in subdirectories:
- `assets/images/profile/` - Profile photos
- `assets/images/research/` - Research project images
- `assets/images/group/` - Group member photos
- `assets/images/landing/` - Landing page assets (small_robot.png, black_board.png)

**Team Members** - Edit [group.html](group.html) directly, using the `.student-card` structure for consistent layout.

**Markdown Content** - Create `.md` files in `content/markdown/` with frontmatter for blog posts or notes.

### Styling Patterns

**Landing Page** ([index.html](index.html)):
- All styles inline in `<style>` tag
- Two-column grid layout using CSS Grid
- Sticky navigation and image sections
- Hover effects on robot icons (`.robot-icon` shows image on hover)
- Responsive breakpoints at 900px, 768px, 640px, and 480px
- Mobile-optimized typography and spacing

**Content Pages**:
- Use [css/pages.css](css/pages.css) for consistent header navigation
- Fixed header with horizontal navigation on desktop
- **Hamburger menu** on mobile (< 768px) with smooth slide-in navigation drawer
- Main content in `.page-content` container
- Research themes use `.research-theme` and `.research-theme-content` classes
- Student cards use `.student-card`, `.student-photo-container`, `.student-details` structure

### Mobile Navigation

All content pages feature a professional hamburger menu on screens smaller than 768px:
- Three-line hamburger button (`.menu-toggle`) that animates to an X when active
- Slide-in navigation drawer from the right side
- Dark overlay backdrop when menu is open
- Auto-closes when clicking a link or the overlay
- Touch-friendly with smooth animations
- Managed by [js/main.js](js/main.js) `toggleMenu()` function

### External Dependencies

The site optionally loads these from CDN (not currently included but supported):
- **marked.js** - Markdown parsing
- **Prism.js** - Syntax highlighting

These are initialized in [js/main.js](js/main.js) if detected.

## Important Notes

- **No Framework**: This is intentionally vanilla JS/HTML/CSS. Do not introduce build tools, frameworks, or transpilation.
- **Static Hosting**: Designed for GitHub Pages or similar static hosting (see CNAME file).
- **Video Files**: Large video files are gitignored. Place in `assets/videos/` locally or use external hosting (YouTube, Vimeo).
- **Profile Page Pattern**: Individual profile pages go in `people/` directory (see [people/tal.html](people/tal.html)).
- **Navigation Consistency**: When adding new pages, update the `<nav>` section in all existing pages to maintain consistent navigation.
