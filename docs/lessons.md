# Lessons — Mahdood Site

Rules and patterns learned over the course of building this site.
Updated by /sync at the end of each session.

## CSS
- All colors, spacing, fonts must use custom properties from `:root` — never hardcode values
- Mobile styles use `max-width: 768px` (existing pattern — don't refactor to min-width without asking)
- Section padding: use `var(--space-xl)` on desktop, override to `var(--space-lg)` at mobile breakpoint
- Footer social links need `flex-wrap: wrap` + `justify-content: center` or they overflow on narrow screens
- Shorts/video grids need `margin: auto` when collapsing to single column on mobile
- Container horizontal padding drops from `var(--space-lg)` → `var(--space-md)` on mobile

## HTML
- One `<h1>` per page — never skip heading levels
- Every `<img>` needs an `alt` attribute — the enforce-alt.py hook will block the write if missing
- Use semantic elements (`<section>`, `<article>`, `<nav>`) — never `<div>` when a semantic element fits
- `post.html` is a blog post template, not a nav page — don't add it to the nav

## JavaScript
- Vanilla JS only — no frameworks, no libraries
- Use `const` by default, `let` only when reassignment needed, never `var`
- Always check DOM elements exist before operating on them

## Git
- Conventional commits: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`
- Subject line under 72 characters
- Body explains "why", not "what"
- Never auto-commit without asking first

## Images
- Store all site images in `images/` at the project root
- Use `object-fit: cover` + `object-position: center top` for portrait photos — keeps the face in frame
- To center a max-width constrained block inside a flex column, add `margin: 0 auto` to the element
- Use `max-height: 100%` on images inside flex containers to prevent them from overflowing
- Scope page-specific layouts with a body class (e.g. `.page-home`) — avoids leaking layout rules to other pages

## Workflow
- Never delete files without asking
- Always explain what you're about to do before doing it
- When something breaks, explain why before fixing it
