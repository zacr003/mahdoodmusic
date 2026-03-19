# Accessibility Audit Report — Canvas Site

**Audit Date:** 2026-03-16
**Pages Scanned:** index.html, about.html, music.html, shows.html, contact.html, blog.html, faq.html, post.html

---

## Critical

None found.

All pages include `lang="en"` on `<html>`. All form inputs have associated labels. All buttons have accessible text or `aria-label`. No images missing alt attributes.

---

## Serious

**about.html** — Heading hierarchy violation
- Lines 35, 44, 72, 86: structure goes `<h1>` → `<h2>` → `<h3>` ("Gear & Tools") → `<h2>`. The `<h3>` is an orphaned level that jumps out of sequence before returning to `<h2>`. Should be restructured so the Gear section uses `<h2>`.

---

## Moderate

**contact.html** — Missing `autocomplete` attributes
- Line 72: `<input type="text" id="name">` — missing `autocomplete="name"`
- Line 77: `<input type="email" id="email">` — missing `autocomplete="email"`

**All pages** — Footer social links use `href="#"`
- SoundCloud, Spotify, Instagram, Bandcamp in footer are all unresolved placeholder hrefs. Keyboard users tab to these links and go nowhere.

**faq.html** — `<h1>` missing `.page-title` class
- Line 37: `<h1>FAQ</h1>` — every other page uses `<h1 class="page-title">`. Visual inconsistency.

---

## Summary

**0 critical · 1 serious · 4 moderate issues across 8 files.**

Strong semantic HTML and ARIA foundation. Main issue is the heading hierarchy violation in about.html and sitewide unresolved social links.
