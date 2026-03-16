# Component Templates — Mahdood Site

Reference patterns for common component types. All use the project's design tokens.

---

## card

A surface container for content like track listings, show items, or gear callouts.

```css
/* ── Card ── */
.card {
  background: var(--color-surface);
  border: 1px solid #2a2a2a;
  border-radius: var(--radius);
  padding: var(--space-lg);
}

.card__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent-muted);
  margin-bottom: var(--space-sm);
}

.card__title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.card__body {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
```

```html
<article class="card">
  <p class="card__label">Featured</p>
  <h2 class="card__title">Track Title</h2>
  <p class="card__body">Description text goes here.</p>
</article>
```

---

## badge

A small inline label for tags, genres, or status indicators.

```css
/* ── Badge ── */
.badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius);
  font-size: 0.75rem;
  font-family: var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--color-accent-muted);
  color: var(--color-bg);
}

.badge--outline {
  background: transparent;
  border: 1px solid var(--color-accent-muted);
  color: var(--color-accent-muted);
}
```

```html
<span class="badge">Hip-Hop</span>
<span class="badge badge--outline">Live Set</span>
```

---

## stat

A number + label pair for metrics like show count, years active, etc.

```css
/* ── Stat ── */
.stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.stat__number {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--color-accent);
  line-height: 1;
}

.stat__label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}
```

```html
<div class="stat">
  <span class="stat__number">12+</span>
  <span class="stat__label">Years Performing</span>
</div>
```

---

## divider

A styled horizontal rule for separating sections.

```css
/* ── Divider ── */
.divider {
  border: none;
  border-top: 1px solid #2a2a2a;
  margin: var(--space-xl) 0;
}

.divider--accent {
  border-top-color: var(--color-accent-muted);
}
```

```html
<hr class="divider" />
<hr class="divider divider--accent" />
```

---

## cta-block

A full-width call-to-action section with heading and button.

```css
/* ── CTA Block ── */
.cta-block {
  text-align: center;
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--radius);
}

.cta-block__heading {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.cta-block__sub {
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}
```

```html
<section class="cta-block">
  <h2 class="cta-block__heading">Ready to Book?</h2>
  <p class="cta-block__sub">Available for live sets, events, and private shows.</p>
  <a href="contact.html" class="btn btn-primary">Get in Touch</a>
</section>
```

---

## Notes

- Always append new component CSS to the bottom of `styles/main.css`
- Group related properties together within each rule
- Mobile-first: base styles apply at all sizes, use `@media (min-width: 768px)` to enhance
- Never add a component without the `/* ── Component Name ── */` section header
