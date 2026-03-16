# Mahdood — Site Map

## Pages

### `index.html` — Home
- Sticky nav (shared)
- Hero section: artist name, tagline, "Book a Show" CTA
- Short blurb (2-3 sentences about the artist)
- Footer (shared)

### `music.html` — Music
- Sticky nav (shared)
- Page hero: section label + page title
- Solo / Electronic section: 3 embedded tracks (SoundCloud iframes), platform links
- Jamband section: YouTube + SoundCloud embeds, platform links
- Footer (shared)

### `about.html` — About
- Sticky nav (shared)
- Page hero: section label + page title
- Bio + photo grid (2-column): artist bio left, photo placeholder right
- Gear callout card: MPC Live 2, piano, live sampling, no laptop
- Live show section: what to expect, "Book a Solo Show" CTA
- Footer (shared)

### `shows.html` — Shows
- Sticky nav (shared)
- Page hero: section label + page title
- Upcoming shows list (date, venue, city, RSVP/ticket link)
- Booking CTA block
- Past performances list
- Footer (shared)

### `contact.html` — Contact / Book
- Sticky nav (shared)
- Page hero: section label + page title
- Two-column layout: intro + social links left, booking form right
- Form fields: name, email, event type (select), message
- Form action: mailto: (replace with Formspree for live use)
- Footer (shared)

## Shared Components

### Nav (`.site-nav`)
Present on all pages. Logo links to `index.html`. Links: Home, Music, About, Shows, Contact.
Active state set by `scripts/main.js` based on current filename.

### Footer (`.site-footer`)
Present on all pages. Social links (SoundCloud, Spotify, Instagram, Bandcamp), "Book Mahdood" CTA, copyright.

## Supporting Files
- `styles/main.css` — all styles, single file
- `scripts/main.js` — nav active state, mobile menu toggle
- `test-site.js` — site validator (links, titles, meta, nav consistency, alt text)
- `.claude/rules/` — path-scoped coding standards (html, css, js)
- `docs/style-guide.md` — visual design system reference
- `docs/sitemap.md` — this file
