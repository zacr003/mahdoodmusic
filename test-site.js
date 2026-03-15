// test-site.js — static site validator for Mahdood portfolio
// Run with: node test-site.js

const fs = require('fs');
const path = require('path');

const SITE_DIR = __dirname;
const PAGES = ['index.html', 'music.html', 'about.html', 'shows.html', 'contact.html'];

// Expected nav links on every page
const EXPECTED_NAV_LINKS = [
  'index.html',
  'music.html',
  'about.html',
  'shows.html',
  'contact.html',
];

let failures = 0;

function fail(msg) {
  console.error(`  FAIL  ${msg}`);
  failures++;
}

function pass(msg) {
  console.log(`  pass  ${msg}`);
}

function readPage(filename) {
  const filepath = path.join(SITE_DIR, filename);
  if (!fs.existsSync(filepath)) {
    fail(`Page file missing: ${filename}`);
    return null;
  }
  return fs.readFileSync(filepath, 'utf8');
}

// ── 1. Check all pages exist ──────────────────────────────────────────────────
console.log('\n[1] Page files exist');
for (const page of PAGES) {
  const filepath = path.join(SITE_DIR, page);
  if (fs.existsSync(filepath)) {
    pass(page);
  } else {
    fail(`Missing: ${page}`);
  }
}

// ── 2. Title tag ──────────────────────────────────────────────────────────────
console.log('\n[2] Title tags');
for (const page of PAGES) {
  const html = readPage(page);
  if (!html) continue;
  const match = html.match(/<title>(.+?)<\/title>/i);
  if (match && match[1].trim().length > 0) {
    pass(`${page} — "${match[1].trim()}"`);
  } else {
    fail(`${page} — missing or empty <title>`);
  }
}

// ── 3. Meta description ───────────────────────────────────────────────────────
console.log('\n[3] Meta descriptions');
for (const page of PAGES) {
  const html = readPage(page);
  if (!html) continue;
  const match = html.match(/<meta\s+name=["']description["']\s+content=["'](.+?)["']/i)
             || html.match(/<meta\s+content=["'](.+?)["']\s+name=["']description["']/i);
  if (match && match[1].trim().length > 0) {
    pass(`${page} — "${match[1].trim().slice(0, 60)}…"`);
  } else {
    fail(`${page} — missing <meta name="description">`);
  }
}

// ── 4. Internal links resolve ─────────────────────────────────────────────────
console.log('\n[4] Internal links resolve');
const linkPattern = /href=["']([^"'#]+)["']/gi;

for (const page of PAGES) {
  const html = readPage(page);
  if (!html) continue;
  let match;
  while ((match = linkPattern.exec(html)) !== null) {
    const href = match[1];
    // Skip external URLs and mailto
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('//')) continue;
    // Skip empty or anchor-only
    if (!href || href === '#') continue;

    const target = path.join(SITE_DIR, href);
    if (fs.existsSync(target)) {
      pass(`${page} → ${href}`);
    } else {
      fail(`${page} → ${href} (file not found)`);
    }
  }
}

// ── 5. Nav consistency ────────────────────────────────────────────────────────
console.log('\n[5] Navigation consistency');
const navPattern = /<nav[\s\S]*?<\/nav>/i;

for (const page of PAGES) {
  const html = readPage(page);
  if (!html) continue;
  const navMatch = html.match(navPattern);
  if (!navMatch) {
    fail(`${page} — no <nav> found`);
    continue;
  }
  const nav = navMatch[0];
  const missing = EXPECTED_NAV_LINKS.filter(link => !nav.includes(link));
  if (missing.length === 0) {
    pass(`${page} — all nav links present`);
  } else {
    fail(`${page} — nav missing: ${missing.join(', ')}`);
  }
}

// ── 6. Images have alt text ───────────────────────────────────────────────────
console.log('\n[6] Image alt text');
const imgPattern = /<img([^>]+)>/gi;
const altPattern = /alt=["'][^"']*["']/i;

let anyImages = false;
for (const page of PAGES) {
  const html = readPage(page);
  if (!html) continue;
  let match;
  while ((match = imgPattern.exec(html)) !== null) {
    anyImages = true;
    const attrs = match[1];
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    const src = srcMatch ? srcMatch[1] : '(unknown src)';
    if (altPattern.test(attrs)) {
      pass(`${page} — img[src="${src}"] has alt`);
    } else {
      fail(`${page} — img[src="${src}"] missing alt attribute`);
    }
  }
}
if (!anyImages) {
  pass('No <img> tags found — nothing to check');
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));
if (failures === 0) {
  console.log(`All checks passed.\n`);
  process.exit(0);
} else {
  console.log(`${failures} check(s) failed.\n`);
  process.exit(1);
}
