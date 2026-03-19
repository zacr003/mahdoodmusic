---
name: publish
description: Validate, minify, and package the site into dist/ for deployment
allowed-tools: Read, Write, Bash, Glob, Grep, mcp__canvas-fs__read_file, mcp__canvas-fs__write_file, mcp__canvas-fs__create_directory, mcp__canvas-fs__list_directory, mcp__canvas-fs__directory_tree
disable-model-invocation: true
---

Package the Mahdood site for deployment. Run each step in order and stop if validation fails.

## Steps

### 1. Validate

Run the site validator before doing anything else:

```
node test-site.js
```

If the validator exits with errors, print them and STOP. Do not build a broken site.

### 2. Create dist/

Use Bash to wipe and recreate the dist/ directory:

```
rm -rf dist && mkdir dist && mkdir dist/styles && mkdir dist/scripts
```

### 3. Copy HTML files

Use Glob to find all `*.html` files in the project root. Skip the following — they are not deployable site pages:
- Files starting with `eval-` (test fixtures)
- `test.html` (dev/validation page)

Use mcp__canvas-fs__read_file to read each remaining file and mcp__canvas-fs__write_file to write it to `dist/<filename>`. Do not recurse into subdirectories.

### 4. Copy scripts/

Read `scripts/main.js` and write it to `dist/scripts/main.js` unchanged.

### 5. Minify CSS

Read `styles/main.css`. Produce a minified version by:
- Removing all comment blocks (`/* ... */`)
- Collapsing runs of whitespace (spaces, tabs, newlines) inside rule blocks to a single space
- Removing whitespace around `:`, `;`, `{`, `}`
- Removing trailing semicolons before `}`

Write the result to `dist/styles/main.css`.

### 6. Generate sitemap.xml

Build a `sitemap.xml` from the HTML files copied in step 3. Use this format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mahdood.com/index.html</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- one <url> block per HTML file -->
</urlset>
```

Set `priority` to `1.0` for `index.html`, `0.8` for all others. Write to `dist/sitemap.xml`.

### 7. Deployment summary

Print a summary in this format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PUBLISH COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  HTML files:   7
  CSS (minified): 17.2kb → 11.4kb (saved X%)
  JS files:     1
  sitemap.xml:  7 URLs

  Output:       dist/
  Ready to deploy to: Netlify / Cloudflare Pages / GitHub Pages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Show actual file sizes — use Bash `wc -c` to measure `styles/main.css` vs `dist/styles/main.css`.
