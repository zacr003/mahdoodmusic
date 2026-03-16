---
name: component
description: Generate a BEM-style CSS component matching the Mahdood design system
allowed-tools: Read, Write, Edit
---

You are creating a new CSS component for the Mahdood portfolio site. The component type is: $0

## Steps

1. Read `styles/main.css` to understand the existing design tokens (`:root` custom properties), naming conventions, and any existing components.

2. Read `${CLAUDE_SKILL_DIR}/component-templates.md` for example HTML and CSS patterns for common component types.

3. Read `.claude/rules/css-rules.md` for the CSS conventions this project follows.

4. Generate CSS for a new `.$0` component block following these requirements:
   - Use BEM naming: `.block`, `.block__element`, `.block--modifier`
   - Use only CSS custom properties from `:root` — no hardcoded colors, fonts, or spacing values
   - Write mobile-first: base styles for mobile, then `min-width` media queries for tablet (768px) and desktop (1100px) if needed
   - Include hover and focus states for any interactive elements (links, buttons)
   - Focus styles must use `outline` or `box-shadow` with `--color-accent` — never `outline: none` without a replacement
   - Add a comment block above the component: `/* ── [Component Name] ── */`

5. Append the new component CSS to `styles/main.css` at the end of the file, after all existing rules.

6. Output the companion HTML snippet showing how to use the component — print it as a code block in your response (do not write it to any file).

7. Report: which component was created, what BEM classes it introduces, and the HTML usage example.
