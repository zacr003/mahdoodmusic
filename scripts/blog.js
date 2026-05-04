// blog.js — markdown-powered blog engine

// ── Utilities ──────────────────────────────────────────────────────────────

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Frontmatter parser ─────────────────────────────────────────────────────

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]+?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    }
    meta[key] = val;
  });

  return { meta, body: match[2] };
}

// ── Markdown parser ────────────────────────────────────────────────────────

function inlineMarkdown(text) {
  text = escHtml(text);
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return text;
}

function parseMarkdown(md) {
  // Extract fenced code blocks before any other processing
  const codeBlocks = [];
  md = md.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = escHtml(code.replace(/\n$/, ''));
    const langAttr = lang ? ` class="language-${escHtml(lang)}"` : '';
    codeBlocks.push(`<pre><code${langAttr}>${escaped}</code></pre>`);
    return `\x00CODE${codeBlocks.length - 1}\x00`;
  });

  const lines = md.split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;
  let inBlockquote = false;
  const para = [];

  function flushPara() {
    if (para.length) {
      html += `<p>${inlineMarkdown(para.join(' '))}</p>\n`;
      para.length = 0;
    }
  }
  function closeUl() { if (inUl)  { html += '</ul>\n';         inUl = false; } }
  function closeOl() { if (inOl)  { html += '</ol>\n';         inOl = false; } }
  function closeBq() { if (inBlockquote) { html += '</blockquote>\n'; inBlockquote = false; } }

  for (const line of lines) {
    // Heading
    const hMatch = line.match(/^(#{1,6}) (.+)/);
    if (hMatch) {
      flushPara(); closeUl(); closeOl(); closeBq();
      const level = hMatch[1].length;
      html += `<h${level}>${inlineMarkdown(hMatch[2])}</h${level}>\n`;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushPara(); closeUl(); closeOl(); closeBq();
      html += '<hr>\n';
      continue;
    }

    // Blockquote
    const bqMatch = line.match(/^> ?(.*)/);
    if (bqMatch) {
      flushPara(); closeUl(); closeOl();
      if (!inBlockquote) { html += '<blockquote>\n'; inBlockquote = true; }
      html += `<p>${inlineMarkdown(bqMatch[1])}</p>\n`;
      continue;
    } else {
      closeBq();
    }

    // Unordered list
    const ulMatch = line.match(/^[-*] (.*)/);
    if (ulMatch) {
      flushPara(); closeOl();
      if (!inUl) { html += '<ul>\n'; inUl = true; }
      html += `<li>${inlineMarkdown(ulMatch[1])}</li>\n`;
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\. (.*)/);
    if (olMatch) {
      flushPara(); closeUl();
      if (!inOl) { html += '<ol>\n'; inOl = true; }
      html += `<li>${inlineMarkdown(olMatch[1])}</li>\n`;
      continue;
    }

    // Code block placeholder
    if (line.includes('\x00CODE')) {
      flushPara(); closeUl(); closeOl(); closeBq();
      html += line + '\n';
      continue;
    }

    // Empty line — flush accumulated paragraph
    if (line.trim() === '') {
      flushPara(); closeUl(); closeOl(); closeBq();
      continue;
    }

    // Paragraph text
    closeUl(); closeOl(); closeBq();
    para.push(line);
  }

  flushPara(); closeUl(); closeOl(); closeBq();

  // Restore code blocks
  html = html.replace(/\x00CODE(\d+)\x00/g, (_, i) => codeBlocks[parseInt(i, 10)]);

  return html;
}

// ── Data fetching ──────────────────────────────────────────────────────────

async function fetchManifest() {
  const res = await fetch('posts/manifest.json');
  if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`);
  const posts = await res.json();
  // Always newest-first
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function fetchPost(slug) {
  const res = await fetch(`posts/${escHtml(slug)}.md`);
  if (!res.ok) throw new Error(`Post not found: ${slug}`);
  return res.text();
}

// ── Blog index page ────────────────────────────────────────────────────────

function getAllTags(posts) {
  const set = new Set();
  posts.forEach(p => (p.tags || []).forEach(t => set.add(t)));
  return [...set].sort();
}

function renderTagFilter(tags, activeTag, container, onSelect) {
  const allBtn = document.createElement('button');
  allBtn.className = 'tag-filter__btn' + (activeTag === '' ? ' tag-filter__btn--active' : '');
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => onSelect(''));
  container.appendChild(allBtn);

  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-filter__btn' + (tag === activeTag ? ' tag-filter__btn--active' : '');
    btn.textContent = tag;
    btn.addEventListener('click', () => onSelect(tag));
    container.appendChild(btn);
  });
}

function renderPostCards(posts, activeTag, container) {
  const filtered = activeTag
    ? posts.filter(p => (p.tags || []).includes(activeTag))
    : posts;

  container.innerHTML = '';

  if (!filtered.length) {
    container.innerHTML = `<li class="blog-empty"><p>No posts tagged "${escHtml(activeTag)}".</p></li>`;
    return;
  }

  filtered.forEach(post => {
    const li = document.createElement('li');
    li.innerHTML = `
      <article class="post-card">
        <header class="post-card__header">
          <time class="post-card__date" datetime="${escHtml(post.date)}">${formatDate(post.date)}</time>
          <h2 class="post-card__title">
            <a href="post.html?slug=${encodeURIComponent(post.slug)}">${escHtml(post.title)}</a>
          </h2>
        </header>
        <p class="post-card__excerpt">${escHtml(post.excerpt)}</p>
        <ul class="post-card__tags" aria-label="Tags">
          ${(post.tags || []).map(t => `<li><span class="post-card__tag">${escHtml(t)}</span></li>`).join('')}
        </ul>
      </article>`;
    container.appendChild(li);
  });
}

async function initBlogIndex() {
  const grid = document.querySelector('.blog-grid');
  const filterContainer = document.querySelector('.tag-filter');
  if (!grid) return;

  try {
    const posts = await fetchManifest();
    const tags = getAllTags(posts);
    const params = new URLSearchParams(window.location.search);
    let activeTag = params.get('tag') || '';

    if (filterContainer && tags.length) {
      renderTagFilter(tags, activeTag, filterContainer, tag => {
        activeTag = tag;

        // Update active button states
        filterContainer.querySelectorAll('.tag-filter__btn').forEach(btn => {
          btn.classList.toggle('tag-filter__btn--active',
            (tag === '' && btn.textContent === 'All') || btn.textContent === tag);
        });

        renderPostCards(posts, activeTag, grid);

        const url = new URL(window.location.href);
        if (tag) url.searchParams.set('tag', tag);
        else url.searchParams.delete('tag');
        history.pushState({}, '', url);
      });
    }

    renderPostCards(posts, activeTag, grid);
  } catch (err) {
    console.error('Blog index error:', err);
    grid.innerHTML = '<li><p class="blog-error">Could not load posts.</p></li>';
  }
}

// ── Single post page ───────────────────────────────────────────────────────

async function initPostPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const titleEl    = document.querySelector('.post-page__title');
  const dateEl     = document.querySelector('.post-page__date');
  const tagsEl     = document.querySelector('.post-page__tags');
  const contentEl  = document.querySelector('.post-page__content');
  const prevEl     = document.querySelector('.post-nav__prev');
  const nextEl     = document.querySelector('.post-nav__next');

  if (!slug || !contentEl) return;

  try {
    const [posts, raw] = await Promise.all([fetchManifest(), fetchPost(slug)]);
    const { body } = parseFrontmatter(raw);

    const idx  = posts.findIndex(p => p.slug === slug);
    const post = posts[idx];

    if (!post) throw new Error(`Slug not found in manifest: ${slug}`);

    // Page title
    document.title = `${post.title} — Mahdood`;

    if (titleEl)  titleEl.textContent  = post.title;
    if (dateEl) {
      dateEl.textContent  = formatDate(post.date);
      dateEl.setAttribute('datetime', post.date);
    }
    if (tagsEl && post.tags) {
      tagsEl.innerHTML = post.tags
        .map(t => `<li><a class="post-page__tag" href="blog.html?tag=${encodeURIComponent(t)}">${escHtml(t)}</a></li>`)
        .join('');
    }

    contentEl.innerHTML = parseMarkdown(body);

    // Prev / Next (manifest is newest-first, so prev = higher index, next = lower index)
    const newer = posts[idx - 1]; // published after current
    const older = posts[idx + 1]; // published before current

    if (nextEl && newer) {
      nextEl.href = `post.html?slug=${encodeURIComponent(newer.slug)}`;
      nextEl.querySelector('.post-nav__label').textContent = newer.title;
      nextEl.hidden = false;
    }
    if (prevEl && older) {
      prevEl.href = `post.html?slug=${encodeURIComponent(older.slug)}`;
      prevEl.querySelector('.post-nav__label').textContent = older.title;
      prevEl.hidden = false;
    }

  } catch (err) {
    console.error('Post page error:', err);
    if (contentEl) contentEl.innerHTML = '<p class="blog-error">Could not load this post.</p>';
  }
}

// ── Router ─────────────────────────────────────────────────────────────────

(function init() {
  if (document.querySelector('.blog-grid')) {
    initBlogIndex();
  } else if (document.querySelector('.post-page__content')) {
    initPostPage();
  }
})();
