---
name: new-page
description: Scaffold a new HTML page with the shared nav and footer from index.html
allowed-tools: Read, Write, Edit, Bash
---

You are scaffolding a new page for the Mahdood portfolio site. The page name is: $0

## Steps

1. Read `index.html` to extract the exact nav and footer HTML (do not paraphrase — copy the markup verbatim).

2. Read `${CLAUDE_SKILL_DIR}/page-template.md` to understand the expected page structure.

3. Read `docs/style-guide.md` for design tokens and component patterns to use.

3.5. Check whether `$0.html` already exists in the project root. If it does, STOP and tell the user — do not overwrite it. Ask them to confirm they want to replace it or choose a different name.

4. Create a new file called `$0.html` in the root directory with:
   - The complete HTML boilerplate (doctype, lang, charset, viewport, description, title, stylesheet link)
   - The exact nav markup copied from index.html
   - A `<main>` section with a page hero (section label + h1 matching the page name)
   - A placeholder `<section class="$0-content">` with a brief comment describing what goes here
   - The exact footer markup copied from index.html
   - The script tag for `scripts/main.js`

5. The `<title>` should follow this pattern: `[Page Title] — Mahdood`
   The `<meta name="description">` should be a sensible placeholder for a $0 page.

6. After creating the file, add a link to `$0.html` in the nav of every existing HTML page that is missing it. Read each page, check if the link exists, and add it if not.

7. Report what was created and which nav files were updated.

Follow all rules in `.claude/rules/html-rules.md` when writing the markup.
