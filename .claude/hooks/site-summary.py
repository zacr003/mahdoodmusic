#!/usr/bin/env python3
"""SessionStart hook — prints a one-line site summary to stdout."""

import os
import glob

project_dir = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())

# Count HTML pages
html_files = glob.glob(os.path.join(project_dir, "*.html"))
page_count = len(html_files)

# Total CSS size
css_files = glob.glob(os.path.join(project_dir, "styles", "*.css"))
css_bytes = sum(os.path.getsize(f) for f in css_files)
css_kb = css_bytes / 1024

# Count images
image_extensions = ("*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.webp")
images_dir = os.path.join(project_dir, "images")
image_count = 0
for ext in image_extensions:
    image_count += len(glob.glob(os.path.join(images_dir, ext)))

print(
    f"[canvas-site] {page_count} pages · "
    f"{css_kb:.1f}kb CSS · "
    f"{image_count} image{'s' if image_count != 1 else ''}"
)
