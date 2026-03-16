---
globs: ["*.js", "scripts/**"]
---

# JavaScript Rules

## Vanilla JS Only
- No frameworks, no libraries, no build tools
- No jQuery, React, Vue, Alpine, or any external dependency
- If something feels complex without a library, find the native DOM API equivalent

## Event Handling
- Always use `addEventListener` — never inline handlers (`onclick=`, `onsubmit=`, etc.)
- Remove event listeners when they are no longer needed to avoid memory leaks
- Use event delegation for dynamically added elements

## Variable Declarations
- Use `const` by default
- Use `let` only when the variable must be reassigned
- Never use `var`

## Error Handling
- Wrap any operation that can fail in a try/catch
- Never silently swallow errors — at minimum log them to the console
- Check that DOM elements exist before operating on them:
  ```js
  const el = document.querySelector('.thing');
  if (!el) return;
  ```
