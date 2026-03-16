# Page Template — Mahdood Site

Use this as the reference structure when scaffolding a new page.

## Full Page Structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>[Page Title] — Mahdood</title>
    <meta name="description" content="[Meaningful description for this page]" />
    <link rel="stylesheet" href="styles/main.css" />
  </head>
  <body>

    <!-- Navigation — copied verbatim from index.html -->
    <nav class="site-nav">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">MAHDOOD</a>
        <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="music.html">Music</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="shows.html">Shows</a></li>
          <li><a href="contact.html">Contact</a></li>
          <!-- Add new page links here when they exist -->
        </ul>
      </div>
    </nav>

    <!-- Page Content -->
    <main>

      <!-- Page Hero -->
      <section class="page-hero">
        <p class="section-label">[SECTION LABEL — e.g. "DISCOVER" or "EXPLORE"]</p>
        <h1>[Page Title]</h1>
      </section>

      <!-- Primary Content -->
      <section class="[page-name]-content">
        <!-- Main content for this page goes here -->
        <!-- Use cards (.card), sections with .container, etc. -->
        <!-- Reference docs/style-guide.md for available component patterns -->
      </section>

    </main>

    <!-- Footer — copied verbatim from index.html -->
    <footer class="site-footer">
      <div class="footer-inner">
        <ul class="footer-social">
          <li><a href="#">SoundCloud</a></li>
          <li><a href="#">Spotify</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">Bandcamp</a></li>
        </ul>
        <a href="contact.html" class="footer-book">Book Mahdood</a>
        <p class="footer-copy">&copy; 2026 Mahdood. All rights reserved.</p>
      </div>
    </footer>

    <script src="scripts/main.js"></script>
  </body>
</html>
```

## Rules to Follow

- One `<h1>` per page — the page title in the hero section
- Do not skip heading levels (h1 → h2 → h3, no gaps)
- All images need `alt` attributes
- Use CSS custom properties from the design system — no hardcoded colors or font stacks
- The `.section-label` pattern: small uppercase text above the h1, using `--color-accent-muted`
- Active nav state is set automatically by `scripts/main.js` — no need to add active classes manually
- New pages live in the root directory alongside `index.html`
