---
name: check-site
description: Validate all HTML pages for common issues and output a pass/fail report
allowed-tools: Read, Bash, Grep, Glob
disable-model-invocation: true
---

Scan all HTML files in the project root and produce a pass/fail quality report.

## Steps

1. Use Glob to find all `*.html` files in the project root directory. Exclude the following from scanning — they are not real site pages:
   - Files whose name starts with `eval-` (intentionally broken test fixtures)
   - `test.html` (internal dev/validation page)
   - Anything inside `dist/` (build output, not source)

2. For each HTML file, check the following and record any failures:

   **Structure**
   - [ ] Starts with `<!DOCTYPE html>`
   - [ ] `<html>` tag has a `lang` attribute
   - [ ] Has a `<title>` element with non-empty content

   **Meta tags**
   - [ ] Has `<meta charset="UTF-8">`
   - [ ] Has `<meta name="viewport" ...>`
   - [ ] Has `<meta name="description" ...>` with non-empty content

   **Heading hierarchy**
   - [ ] Exactly one `<h1>` per page
   - [ ] No skipped heading levels (e.g. h1 → h3 with no h2)

   **Accessibility**
   - [ ] All `<img>` tags have an `alt` attribute (empty is acceptable for decorative images, but the attribute must be present)

   **Internal links**
   - [ ] All `href` values pointing to local `.html` files (not starting with `http`, `#`, or `mailto`) refer to files that actually exist on disk

   **External links**
  - [ ] All <a> tags with external URLs have target="_blank" and rel="noopener"

3. Output a report in this format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SITE CHECK REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

index.html          ✓ PASS
about.html          ✓ PASS
contact.html        ✗ FAIL
  → Missing <meta name="description">
  → <img> on line ~42 missing alt attribute

music.html          ✗ FAIL
  → 2 external links missing rel="noopener"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SUMMARY: 2 passed · 2 failed · 0 skipped
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. After the report, list any actionable fixes grouped by file. Keep it short — one line per issue.

Do not modify any files. This skill is read-only.
