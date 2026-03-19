# Content Audit Report — Canvas Site

**Audit Date:** 2026-03-16
**Pages reviewed:** index.html, about.html, music.html, shows.html, contact.html, blog.html, faq.html, post.html

---

## index.html

**Placeholder content**
- Footer social links (SoundCloud, Spotify, Instagram, Bandcamp) all use `href="#"` — sitewide issue, see below.

**Quality:** Strong. Hero blurb on-voice, CTA links correctly to contact.html. No lorem ipsum.

---

## about.html

**Placeholder content**
- Line 63: `<div class="photo-placeholder">[ Photo — add image here ]</div>` — raw placeholder text visible to every visitor. Most jarring unfinished element on the site.

**Quality:** Bio and gear sections are well-written and specific. "Book a Solo Show" CTA links correctly to contact.html.

---

## music.html

**Placeholder content**
- Line 86: YouTube embed src contains `PLplaceholder` — renders as a broken/empty player.
- SoundCloud and Bandcamp platform buttons: `href="#"` (4 links unresolved).
- Only Spotify has a real URL.

**Quality:** On-voice. No CTA pointing to shows or booking — missed conversion opportunity.

---

## shows.html

**Placeholder content**
- All 3 RSVP/Tickets buttons use `href="#"` — visitor ready to attend a show hits a dead end.

**Quality:** Show dates are future-dated (Apr–May 2026). Venue names are specific Chicago venues — credible. Booking CTA links correctly to contact.html.

---

## contact.html

**Placeholder content**
- Social links in body copy ("Find me online") all use `href="#"` — especially visible here since handle names are shown.
- Form action is `mailto:booking@mahdood.com` with a dev comment to replace with Formspree.

**Quality:** Strong copy. Form fields complete and well-labeled.

---

## blog.html

**Placeholder content**
- Blog grid and tag filter are empty — entirely JavaScript-populated. No `<noscript>` fallback.

**SEO risk:** Search engines crawling without JS see a nearly empty page.

**Quality:** No CTA pointing anywhere after reading posts.

---

## faq.html

**Placeholder content**
- FAQ answer for "Where can I listen to your music?" promises real platform links on music.html — but those links are still `href="#"`. The FAQ is making a promise the music page doesn't keep.

**Quality:** Substantive, on-voice content. Missing a "Ready to book?" CTA at the bottom — natural conversion point given the FAQ audience.

**Style inconsistency:** Section label reads "HELP" in all-caps; every other page uses sentence-case labels.

---

## post.html

**Placeholder content**
- `<h1>` is "Loading…" in static HTML — visible before JS runs.
- `<title>` is generic "Post — Mahdood" — applies to every blog post.
- Meta description is generic "A post from the Mahdood journal." — applies to every blog post.
- `<time datetime="">` — empty datetime attribute.

**SEO risk:** All post-level metadata depends on JavaScript. Search engines may index "Loading…" as the page title.

---

## Sitewide Issues

**Footer social links — all 8 pages**
SoundCloud, Spotify, Instagram, Bandcamp all use `href="#"`. This is the single most pervasive unfinished item. Affects every page.

**Nav drift from sitemap**
FAQ is linked in every nav but not in docs/sitemap.md. Not a broken link — just a documentation gap.

**Blog not in nav**
Blog is reachable only if you know the URL. No nav entry.

---

## Summary

**8 pages · 18 placeholder items · 4 SEO issues · 6 content quality issues**

**Priority fixes:**
1. Resolve sitewide footer `href="#"` social links — affects every page, most visible signal of an unfinished site
2. Fix YouTube `PLplaceholder` embed on music.html — broken embed visible immediately
3. Remove photo placeholder text on about.html — raw `[ Photo — add image here ]` text visible to visitors
