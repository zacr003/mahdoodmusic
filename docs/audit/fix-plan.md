# Unified Fix Plan — Canvas Site
**Generated:** 2026-03-16
**Sources:** accessibility.md · css.md · content.md

---

## Cross-Team Findings
*Issues flagged by 2 or more agents — highest priority by definition.*

### 1. Footer social links — `href="#"` on all 8 pages
- **Accessibility:** Keyboard users tab to these and go nowhere (moderate issue)
- **Content:** Single most pervasive unfinished item on the site; affects every page

**Fix:** Replace all footer `href="#"` placeholders with real URLs for SoundCloud, Spotify, Instagram, and Bandcamp. If real URLs are not yet available, remove the links entirely rather than leaving dead ends.

---

### 2. Focus state implementation — `:focus` vs `:focus-visible`
- **CSS:** 9 selectors use `:focus` when they should use `:focus-visible` (lines 737, 833, 880, 990, 1094, 1127, 1181, 1279, 1334)
- **Accessibility:** All interactive elements must have visible focus styles

**Fix:** Replace all 9 `:focus` selectors with `:focus-visible` in `styles/main.css`. This preserves keyboard navigation rings while suppressing them for mouse users — satisfying both agents' concerns.

---

### 3. Heading hierarchy on about.html
- **Accessibility:** `<h3>` ("Gear & Tools") orphaned inside `<h1>` → `<h2>` → `<h3>` → `<h2>` sequence (serious issue, lines 35/44/72/86)
- **Content:** Bio and gear sections are noted as structurally distinct — the heading mismatch undermines that

**Fix:** Change `<h3>` on Gear section to `<h2>` in `about.html`. Adjust any associated CSS size overrides if needed.

---

## P1 — Blocks Real Visitors (Fix Now)

### P1-A: YouTube embed broken on music.html
- **Agent:** Content
- **Detail:** Line 86 uses `PLplaceholder` as the embed src — renders as a broken/empty player immediately visible to visitors.
- **Fix:** Replace `PLplaceholder` with a real YouTube playlist or video ID, or remove the embed temporarily.

### P1-B: Photo placeholder text visible on about.html
- **Agent:** Content
- **Detail:** Line 63: `<div class="photo-placeholder">[ Photo — add image here ]</div>` — raw dev instruction text visible to every visitor.
- **Fix:** Replace with an actual photo, or style as a blank visual placeholder with no text content. Do not leave the literal string visible.

### P1-C: Shows RSVP links dead-end (`href="#"`)
- **Agent:** Content
- **Detail:** All 3 RSVP/Tickets buttons use `href="#"`. A visitor ready to attend a show hits a dead end — highest conversion impact of any unresolved link.
- **Fix:** Add real ticket/RSVP URLs. If unavailable, swap buttons for a "DM for tickets" contact link rather than a no-op.

### P1-D: post.html loads as "Loading…" before JS runs
- **Agent:** Content
- **Detail:** Static `<h1>` text is "Loading…", `<title>` is generic, meta description is generic, `<time datetime="">` is empty.
- **SEO risk:** Search engines may index "Loading…" as the page title for every blog post.
- **Fix:** Either pre-populate the template with a meaningful static fallback, or switch to server-side/build-time rendering for post metadata.

### P1-E: max-width media queries violate mobile-first rule
- **Agent:** CSS
- **Detail:** Two instances use `max-width` (lines 921–930 and 1018–1056) — desktop-first breakpoints that break the mobile-first contract in `css-rules.md`.
- **Fix:**
  - `.hero--split`: Remove `@media (max-width: 768px)` block; set `flex-direction: column` as base style; add `@media (min-width: 769px) { flex-direction: row; }`.
  - Mobile nav: Invert hamburger/nav visibility to use `min-width: 769px`.

---

## P2 — Quality Issues (Fix Before Launch)

### P2-A: `#2a2a2a` hardcoded instead of `var(--color-border)` — 23 instances
- **Agent:** CSS
- **Detail:** `--color-border` is defined in `:root` but never used. The hex value is scattered across 23 lines in `styles/main.css`.
- **Fix:** Global find-and-replace `#2a2a2a` → `var(--color-border)`. Single operation, immediate design-system compliance.

### P2-B: Missing CSS tokens — 4 hardcoded values need `:root` entries
- **Agent:** CSS
- **Detail:** Four values used in CSS have no token:
  - `#0d0d0d` for button text (lines 216, 259, 265, 281) → should be `var(--color-bg)`
  - `#e8b520` for button hover (line 263) → add `--color-accent-bright: #e8b520`
  - `#1f1200` and `#0d0820` in hero gradients (lines 316–317) → add `--gradient-hero-warm` and `--gradient-hero-cool`
  - `#c0392b` for error state (lines 645, 650, 671) → add `--color-error: #c0392b`
- **Fix:** Add the four new tokens to `:root`, then replace each hardcoded value with its variable.

### P2-C: 9 inline styles in HTML should be CSS classes
- **Agent:** CSS
- **Detail:** `about.html` (lines 44, 70, 95), `music.html` (lines 43, 49, 51, 76), `shows.html` (lines 77, 96, 104, 112) all use inline `style=""` attributes — violates the design system rule requiring CSS classes.
- **Fix:** Move each inline style to a named class in `styles/main.css`.

### P2-D: `autocomplete` attributes missing on contact form
- **Agent:** Accessibility
- **Detail:** `<input type="text" id="name">` (line 72) and `<input type="email" id="email">` (line 77) are missing `autocomplete="name"` and `autocomplete="email"` respectively.
- **Fix:** Add the two `autocomplete` attributes.

### P2-E: blog.html has no `<noscript>` fallback
- **Agent:** Content
- **Detail:** The blog grid and tag filter are entirely JS-populated. Search engines and no-JS users see a nearly empty page.
- **Fix:** Add a `<noscript>` block with a static list of post titles and links, or a brief message directing users to enable JavaScript.

### P2-F: Blog not in nav
- **Agent:** Content
- **Detail:** Blog is reachable only by direct URL — no nav entry on any page.
- **Fix:** Add a "Blog" link to the shared nav in all 8 HTML files and update `scripts/main.js` active-state logic accordingly.

### P2-G: faq.html section label case inconsistency
- **Agent:** Content
- **Detail:** Section label reads "HELP" in all-caps; every other page uses sentence-case labels (e.g., "About", "Music").
- **Fix:** Change the label to "Help" (sentence case) to match the sitewide pattern.

### P2-H: Missing CTAs on music.html, blog.html, faq.html
- **Agent:** Content
- **Detail:** Three pages have no outbound conversion path:
  - `music.html` — no link to shows or booking after listening
  - `blog.html` — no CTA after reading posts
  - `faq.html` — no "Ready to book?" CTA at bottom despite being a natural conversion point
- **Fix:** Add a minimal CTA block (one sentence + button linking to `contact.html`) at the bottom of each page.

---

## P3 — Nice to Have

### P3-A: `faq.html` `<h1>` missing `.page-title` class
- **Agent:** Accessibility
- **Detail:** Line 37: `<h1>FAQ</h1>` — every other page uses `<h1 class="page-title">`. Visual inconsistency only; no functional impact.
- **Fix:** Add `class="page-title"` to the element.

### P3-B: Contact social links in body copy use `href="#"`
- **Agent:** Content
- **Detail:** "Find me online" links in `contact.html` body copy use `href="#"` with visible handle names — more noticeable than footer links since handles are shown inline.
- **Fix:** Same resolution as the footer links — add real URLs or remove.

### P3-C: Nav/sitemap documentation gap
- **Agent:** Content
- **Detail:** FAQ is in the nav but not in `docs/sitemap.md`. No user-facing impact; purely a docs maintenance issue.
- **Fix:** Add FAQ entry to `docs/sitemap.md`.

### P3-D: `#333` photo placeholder border should use token
- **Agent:** CSS
- **Detail:** Line 456: `border: 1px dashed #333` → `border: 1px dashed var(--color-border)`. Minor — will also be resolved if the about.html photo placeholder is replaced (P1-B).
- **Fix:** Replace `#333` with `var(--color-border)` in CSS, regardless of whether the placeholder itself is replaced.

---

## Conflicts and Contradictions Between Agents

**No direct contradictions found.** The three agents audited different dimensions (structure, style, content) with minimal overlap in their recommendations.

One area to watch: **P1-B (photo placeholder) and P3-D (placeholder border token)** are related. If the photo placeholder `<div>` is replaced with a real image (P1-B), the CSS rule at line 456 becomes dead code — fix P1-B first, then decide whether to keep or remove the CSS rule rather than refactoring it in isolation.

A second coordination note: **P2-F (add Blog to nav)** requires editing all 8 HTML files. If any other fix also touches all 8 files (e.g., footer social link URLs from P1 / Cross-Team Finding 1), batch those changes in the same pass to minimize repetitive edits.
