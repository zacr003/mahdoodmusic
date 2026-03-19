# CSS Design System Audit Report — Canvas Site

**Audit Date:** 2026-03-16
**File reviewed:** styles/main.css

---

## Hardcoded Color Values

### CRITICAL: #2a2a2a used instead of var(--color-border) — 23 instances
`--color-border: #2a2a2a` is defined in `:root` but never used. The hex value is hardcoded throughout.
**Affected lines:** 70, 162, 375, 423, 469, 484, 497, 694, 783, 815, 952, 1029, 1076, 1136, 1169, 1200, 1241, 1249, 1266, 1297

```css
/* current */
border-bottom: 1px solid #2a2a2a;
/* fix */
border-bottom: 1px solid var(--color-border);
```

### HIGH: #0d0d0d hardcoded for button text — should be var(--color-bg)
**Lines:** 216, 259, 265, 281

### HIGH: #e8b520 hardcoded for button hover — needs new token
**Line 263:** Add `--color-accent-bright: #e8b520` to `:root`, then use `var(--color-accent-bright)`

### HIGH: Gradient colors have no tokens
**Lines 316–317:** `#1f1200` and `#0d0820` hardcoded in hero radial gradients.
Add to `:root`: `--gradient-hero-warm: #1f1200` and `--gradient-hero-cool: #0d0820`

### HIGH: Error color #c0392b has no token — 3 instances
**Lines 645, 650, 671:** Add `--color-error: #c0392b` to `:root`

### LOW: Photo placeholder uses #333 instead of var(--color-border)
**Line 456:** `border: 1px dashed #333` → `border: 1px dashed var(--color-border)`

---

## Responsive Design Issues

### CRITICAL: max-width media queries violate mobile-first rule — 2 instances

**Lines 921–930 (.hero--split):**
```css
/* current — desktop-first, wrong */
@media (max-width: 768px) { .hero--split { flex-direction: column; } }

/* fix — mobile-first */
.hero--split { flex-direction: column; } /* base */
@media (min-width: 769px) { .hero--split { flex-direction: row; } }
```

**Lines 1018–1056 (mobile nav):**
Same pattern — hamburger/nav visibility controlled by max-width. Should be inverted to min-width.

---

## Focus State Issues

### MEDIUM: 9 selectors use :focus instead of :focus-visible

| Line | Selector |
|------|----------|
| 737 | `.post-card__title a:focus` |
| 833 | `.card--link:focus` |
| 880 | `.hero__cta .btn:focus` |
| 990 | `.faq-item__question:focus` |
| 1094 | `.tag-filter__btn:focus` |
| 1127 | `.post-page__back:focus` |
| 1181 | `.post-page__tag:focus` |
| 1279 | `.post-page__content a:focus` |
| 1334 | `.post-nav__prev:focus`, `.post-nav__next:focus` |

Replace all with `:focus-visible` to show focus rings on keyboard navigation only.

---

## Inline Styles in HTML (Design System Violations)

9 inline styles across 3 files should be CSS classes:
- **about.html** lines 44, 70, 95 — margin/padding adjustments
- **music.html** lines 43, 49, 51, 76 — color, max-width, border-radius
- **shows.html** lines 77, 96, 104, 112 — margin, "Completed" badge styling

---

## Recommended New Tokens

```css
:root {
  --color-error: #c0392b;
  --color-accent-bright: #e8b520;
  --gradient-hero-warm: #1f1200;
  --gradient-hero-cool: #0d0820;
}
```

---

## Summary

**11 issues total: 3 critical · 4 high · 3 medium · 1 low**

Biggest win: replace all 23 `#2a2a2a` instances with `var(--color-border)` — single find-and-replace, immediate improvement.
