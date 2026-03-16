---
globs: ["*.html"]
---

# HTML Rules

## Semantic Elements
- Use semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- Never use `<div>` or `<span>` when a semantic element fits
- Use `<button>` for interactive controls, `<a>` only for navigation

## Accessibility
- Every `<img>` must have an `alt` attribute — descriptive for meaningful images, empty (`alt=""`) for decorative ones
- All form inputs must have an associated `<label>`
- Interactive elements must be keyboard-reachable
- Use `aria-label` or `aria-labelledby` when visible text labels are not present

## Heading Hierarchy
- One `<h1>` per page — the page's primary title
- Do not skip heading levels (no jumping from `<h1>` to `<h3>`)
- Headings communicate document structure, not visual size — use CSS for size

## Meta Tags
- Every page must have `<meta charset="UTF-8">`
- Every page must have `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Every page must have a `<meta name="description">` with meaningful content
- `<title>` must be unique per page and descriptive
