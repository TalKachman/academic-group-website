# Academic Group Website

Personal academic website for Tal Kachman - Assistant Professor at Radboud University & Visiting Assistant Professor at Yale School of Management.

## Features

- **Single-page design** with smooth navigation
- **Responsive layout** that works on all devices
- **Multi-content support**: images, videos, markdown, and code
- **Data-driven publications** and projects from JSON files
- **Markdown rendering** for blog posts and notes
- **Syntax highlighting** for code examples

## Structure

```
/
├── index.html              # Main website (current minimalist design)
├── late-timer.html        # Grad student lateness tracker
├── css/                   # Stylesheets
│   ├── main.css          # Main styles (for multi-page variant)
│   └── syntax.css        # Code syntax highlighting
├── js/                    # JavaScript files
│   ├── main.js           # General utilities
│   └── markdown.js       # Markdown rendering
├── assets/                # Media files
│   ├── images/           # Images and photos
│   │   ├── profile/      # Profile photos
│   │   ├── research/     # Research project images
│   │   └── group/        # Group photos
│   ├── videos/           # Video files
│   └── pdfs/             # PDF documents
│       ├── papers/       # Research papers
│       └── cv.pdf        # Curriculum Vitae
├── content/               # Content files
│   ├── markdown/         # Markdown files for blog/notes
│   └── code/             # Code examples
└── data/                  # Data files
    ├── publications.json  # Publications metadata
    └── projects.json      # Research projects metadata
```

## Local Development

Start a local server:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server -p 8000
```

Then open: `http://localhost:8000`

## Adding Content

### Adding Publications

Edit `data/publications.json`:

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

### Adding Images

Place images in appropriate subdirectories:
- Profile photos: `assets/images/profile/`
- Research images: `assets/images/research/`
- Group photos: `assets/images/group/`

### Adding Videos

For local videos, place in `assets/videos/`
For embedded videos (YouTube, Vimeo), use iframe embed codes

### Adding Markdown Content

Create `.md` files in `content/markdown/` with frontmatter:

```markdown
---
title: Post Title
date: 2025-01-15
tags: tag1, tag2
---

Your content here...
```

### Adding Code Examples

Place code files in `content/code/` and reference them in your pages with syntax highlighting.

## Technologies

- **HTML5/CSS3** - Modern web standards
- **Vanilla JavaScript** - No framework dependencies
- **marked.js** - Markdown parsing (optional, load from CDN)
- **Prism.js** - Syntax highlighting (optional, load from CDN)

## Customization

The current `index.html` uses a minimal single-page design. To use the multi-page variant:

1. The CSS in `css/main.css` provides styles for multi-page layouts
2. The JavaScript utilities in `js/` handle dynamic content loading
3. Reference these in your HTML pages

## Contact

Prof Tal Kachman
Radboud University & Yale School of Management

## License

© 2025 Tal Kachman. All rights reserved.
