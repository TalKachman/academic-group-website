// Markdown rendering utilities
// Uses marked.js library (load from CDN in HTML)

async function loadMarkdownFile(path) {
    try {
        const response = await fetch(path);
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('Error loading markdown file:', error);
        return '';
    }
}

async function renderMarkdown(markdownText, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (typeof marked !== 'undefined') {
        container.innerHTML = marked.parse(markdownText);

        // Re-highlight code blocks
        if (typeof Prism !== 'undefined') {
            container.querySelectorAll('pre code').forEach((block) => {
                Prism.highlightElement(block);
            });
        }
    } else {
        // Fallback: just display as pre-formatted text
        container.innerHTML = `<pre>${markdownText}</pre>`;
    }
}

async function loadAndRenderMarkdown(markdownPath, containerId) {
    const markdown = await loadMarkdownFile(markdownPath);
    await renderMarkdown(markdown, containerId);
}

// Parse frontmatter from markdown
function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
        return { frontmatter: {}, content: markdown };
    }

    const frontmatterText = match[1];
    const content = match[2];

    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            frontmatter[key.trim()] = valueParts.join(':').trim();
        }
    });

    return { frontmatter, content };
}

// Example usage for blog-style markdown pages
async function loadBlogPost(path, containerId) {
    const markdown = await loadMarkdownFile(path);
    const { frontmatter, content } = parseFrontmatter(markdown);

    const container = document.getElementById(containerId);
    if (!container) return;

    // Render metadata if present
    let metaHTML = '';
    if (frontmatter.title) {
        metaHTML += `<h1>${frontmatter.title}</h1>`;
    }
    if (frontmatter.date) {
        metaHTML += `<p class="meta">Posted on ${frontmatter.date}</p>`;
    }
    if (frontmatter.tags) {
        metaHTML += `<p class="tags">Tags: ${frontmatter.tags}</p>`;
    }

    container.innerHTML = metaHTML;

    // Render content
    if (typeof marked !== 'undefined') {
        container.innerHTML += marked.parse(content);

        // Re-highlight code blocks
        if (typeof Prism !== 'undefined') {
            container.querySelectorAll('pre code').forEach((block) => {
                Prism.highlightElement(block);
            });
        }
    } else {
        container.innerHTML += `<pre>${content}</pre>`;
    }
}
