# Registry — Mahdood Site

A map of all pages, components, scripts, hooks, and external connections.
Updated by /sync when new things are added.

## Pages
| File | Nav Label | Purpose |
|---|---|---|
| `index.html` | Home | Hero, tagline, Book a Show CTA |
| `music.html` | Music | SoundCloud embeds, YouTube Shorts, platform links |
| `about.html` | About | Bio, gear card, live show section |
| `shows.html` | Shows | Upcoming shows list, booking CTA, past performances |
| `contact.html` | Contact | Booking form, social links |
| `faq.html` | FAQ | Accordion FAQ sections |
| `blog.html` | Blog | Blog listing with tag filter |
| `post.html` | — | Blog post template (not a nav page) |

## CSS Components (`styles/main.css`)
| Class | Type | Purpose |
|---|---|---|
| `.site-nav` | Block | Sticky top navigation bar |
| `.nav-inner` | Element | Max-width container inside nav |
| `.nav-logo` | Element | Logo/brand link |
| `.nav-links` | Element | Horizontal link list (collapses on mobile) |
| `.nav-toggle` | Element | Hamburger button (mobile only) |
| `.site-footer` | Block | Footer with social links and book CTA |
| `.hero` | Block | Full-viewport hero (index.html) |
| `.page-hero` | Block | Compact hero for inner pages |
| `.btn` | Block | Base button styles |
| `.btn-primary` | Modifier | Gold fill button |
| `.btn-outline` | Modifier | Transparent gold border button |
| `.card` | Block | Surface card with border |
| `.section-label` | Utility | Small uppercase label above headings |
| `.section-title` | Utility | Display font section heading |
| `.track-grid` | Block | Grid for SoundCloud embeds |
| `.track-embed` | Block | Single SoundCloud embed wrapper |
| `.shorts-grid` | Block | 3-column YouTube Shorts grid |
| `.short-embed` | Block | 9:16 aspect ratio Shorts wrapper |
| `.about-grid` | Block | 2-column bio/photo layout |
| `.gear-card` | Block | Gear callout card |
| `.show-item` | Block | Single show row (date, details, CTA) |
| `.shows-cta` | Block | Booking callout block |
| `.contact-grid` | Block | 2-column contact layout |
| `.contact-form` | Block | Booking form |
| `.faq-item` | Block | `<details>` accordion item |
| `.post-card` | Block | Blog listing card |
| `.tag-filter` | Block | Tag filter button bar |
| `.post-page` | Block | Single post page layout |
| `.page-home` | Modifier (body) | Locks home page to 100vh flex column — no scroll |
| `.hero--split` | Modifier | Two-column hero: text left, photo right |
| `.hero__content` | Element | Left column of split hero |
| `.hero__media` | Element | Right column of split hero |
| `.hero__photo` | Element | Photo inside hero__media |
| `.about-photo` | Block | Full-width photo on about page bio grid |

## Images (`images/`)
| File | Used On | Description |
|---|---|---|
| `mahdood-hero.jpg` | index.html | Hero split layout — right column |
| `mahdood-photo.jpg` | about.html | Bio section — right column |

## Scripts
| File | Purpose |
|---|---|
| `scripts/main.js` | Nav active state, mobile menu toggle |
| `scripts/blog.js` | Blog engine — renders posts/ markdown into post.html |

## Hooks (`.claude/hooks/`)
| Event | File | Behavior |
|---|---|---|
| SessionStart | `site-summary.py` | Prints page/CSS/image count |
| PreToolUse (Read *.html) | `inject-html-context.py` | Adds accessibility reminders |
| PreToolUse (Write *.html) | `enforce-alt.py` | **Blocks** writes missing alt attributes |
| PreToolUse (Write *.html) | `inject-meta-tags.py` | Auto-injects missing charset/viewport |
| PostToolUse (Write/Edit *.html) | `validate-html.py` | Reports structure issues (non-blocking) |
| Stop | `check-links.py` | **Blocks** if internal links are broken |
| Stop | `check-accessibility.py` | **Blocks** if img/input accessibility issues found |

## Posts (`posts/`)
| File | Title |
|---|---|
| `manifest.json` | Post index (read by blog.js) |

## External Connections
| Service | Used On | Purpose |
|---|---|---|
| SoundCloud | music.html | Track embeds + profile link |
| YouTube | music.html | Shorts grid + live band embed |
| Spotify | music.html, footer | Platform link |
| Bandcamp | music.html, footer | Platform link |
| Instagram | footer, contact.html | Social link |
| Facebook | footer | Social link |
