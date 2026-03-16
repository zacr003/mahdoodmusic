# Mahdood — Visual Design System

## Color Palette
All colors are defined as CSS custom properties in `styles/main.css` under `:root`.

| Token                  | Value     | Usage                              |
|------------------------|-----------|------------------------------------|
| `--color-bg`           | `#0d0d0d` | Page background                    |
| `--color-surface`      | `#1a1a1a` | Cards, nav, footer                 |
| `--color-text`         | `#f0f0f0` | Primary body text                  |
| `--color-text-muted`   | `#999999` | Secondary text, labels, captions   |
| `--color-accent`       | `#d4a017` | CTAs, active nav, headings, links  |
| `--color-accent-muted` | `#8b6914` | Borders, subdued accent use        |

**Palette character:** Dark background with warm gold accent — piano/jazz feel with a modern electronic edge. Never use cold blues or grays as accents.

## Typography
| Token             | Value                              | Usage                        |
|-------------------|------------------------------------|------------------------------|
| `--font-display`  | `Georgia, 'Times New Roman', serif`| Hero name, section titles    |
| `--font-sans`     | `system-ui, -apple-system, sans-serif` | Body text, nav, labels   |

- Display font gives "MAHDOOD" weight and character
- Body font stays system-native for readability and zero load cost
- Use `clamp()` for responsive font sizes on headings

## Spacing
| Token        | Value    | Usage                        |
|--------------|----------|------------------------------|
| `--space-xs` | `0.25rem`| Tight gaps (label to input)  |
| `--space-sm` | `0.5rem` | Small internal padding       |
| `--space-md` | `1rem`   | Standard padding/gap         |
| `--space-lg` | `2rem`   | Section padding, nav gaps    |
| `--space-xl` | `4rem`   | Hero padding, major sections |

## Component Patterns

### Buttons
Two variants — always use CSS classes, never inline styles.
- `.btn.btn-primary` — gold fill, dark text. Use for primary CTAs ("Book a Show")
- `.btn.btn-outline` — transparent with gold border. Use for secondary actions

### Navigation
- Sticky top bar, `--nav-height: 64px`
- Logo left (display font, accent color), links right (uppercase, muted → accent on hover/active)
- Mobile: hamburger toggle, links stack vertically in a dropdown
- Active state set via JS (`active` class) matching current page filename

### Cards / Surface Elements
- Background: `--color-surface`
- Border: `1px solid #2a2a2a`
- Border radius: `--radius` (`4px`)
- Use for: track embeds, show items, gear callout, contact form

### Section Labels
- `.section-label` — tiny uppercase, `--color-accent-muted`, wide letter-spacing
- Always appears above the main heading of a section

## Responsive Breakpoints
- Mobile base: styles written mobile-first
- Tablet+: `min-width: 768px`
- Desktop: `min-width: 1100px` (max content width via `.container`)
