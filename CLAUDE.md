# Canvas — Personal Portfolio Site

## Project Description
A personal portfolio site built from scratch using plain HTML, CSS, and JavaScript.
No build tools, no frameworks, no dependencies — just open index.html in a browser.

## Goal
Build a personal portfolio site with 7 navigable pages: home, music, about, shows, contact, FAQ, and blog.
`post.html` is a blog post template (not a nav page) — the blog engine renders individual posts into it dynamically.
The finished site should be clean, minimal, and deployable as static HTML.

## Design
- Dark background, warm gold accent — see full design system in docs/style-guide.md
- Style: minimal, typography-forward, let the music do the talking
- New pages go in the root directory alongside index.html

@docs/style-guide.md
@docs/sitemap.md

## Language and Stack
- HTML5, CSS3, JavaScript (ES6+)
- No build step required
- Browser: system default

## Build and Test Commands
- Open site: `open index.html`
- No compilation or install step needed

## Project Structure
- `index.html` — main entry point
- `styles/main.css` — all styles
- `scripts/main.js` — all JavaScript
- `scripts/blog.js` — blog engine (renders posts/ markdown into post.html)
- `posts/` — markdown blog posts + manifest.json
- `test.html` — internal dev/validation page, not a real site page (no nav/footer needed)
- `eval/` — eval suite for skills and agents (not part of the site)
- `dist/` — build output from /publish skill (gitignored)

## Hook System
These hooks fire automatically — know what they do to avoid surprises:

| Event | Hook | What it does |
|---|---|---|
| SessionStart | site-summary.py | Prints page/CSS/image count |
| PreToolUse (Read *.html) | inject-html-context.py | Adds accessibility reminders to context |
| PreToolUse (Write *.html) | enforce-alt.py | **Blocks** writes missing alt attributes |
| PreToolUse (Write *.html) | inject-meta-tags.py | Auto-injects missing charset/viewport |
| PostToolUse (Write/Edit *.html) | validate-html.py | Reports structure issues (non-blocking) |
| Stop | check-links.py | **Blocks** if internal links are broken |
| Stop | check-accessibility.py | **Blocks** if img/input accessibility issues found |
| SubagentStop | (prompt) | Reviews subagent output for completeness |

**Hooks skip `eval-*` files** — these are intentionally broken test fixtures.

## Agent Team
Three specialist agents + a coordinator for site audits:
1. Run `accessibility-agent`, `design-agent`, `content-agent` (can run in parallel)
2. Each writes a report to `docs/audit/` automatically
3. Then run `coordinator-agent` to get a unified, prioritized fix plan

Invoke all three at once: *"Run the accessibility, design, and content agents in parallel, then run the coordinator."*

## Rules
- Never auto-commit without asking me first.
- Never delete files without asking me first.
- Always explain what you're about to do before doing it.
- Keep CSS organized — group related properties together and add a comment above each section.
- Don't add frameworks or libraries without asking — keep it plain HTML/CSS/JS.
- When something breaks, explain why before fixing it.

## Pointers
See ../../projects/canvas/README.md for the full module guide.
See ../../context/ for detailed Claude Code feature documentation.
