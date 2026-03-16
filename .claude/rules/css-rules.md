---
globs: ["*.css", "styles/**"]
---

# CSS Rules

## Mobile-First Design
- Write base styles for mobile first, then use `min-width` media queries to scale up
- Never use `max-width` media queries as the primary breakpoint strategy
- Test layouts at 375px, 768px, and 1100px minimum

## CSS Custom Properties
- All colors, fonts, spacing, and radii must use custom properties defined in `:root`
- Never hardcode color values, font stacks, or spacing values outside of `:root`
- Custom property names follow the pattern: `--category-name` (e.g. `--color-accent`, `--space-lg`)

## BEM Naming
- Use BEM (Block__Element--Modifier) for component class names
- Block: `.site-nav`, `.track-embed`, `.show-item`
- Element: `.site-nav__logo`, `.show-item__date`
- Modifier: `.btn--primary`, `.nav-links--open`
- Utility classes (single-purpose) are exempt from BEM

## Focus Styles
- Never use `outline: none` without providing a visible replacement
- All interactive elements (links, buttons, inputs) must have a visible `:focus` style
- Use `outline` or `box-shadow` with the accent color for focus indicators
