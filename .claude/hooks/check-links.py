#!/usr/bin/env python3
"""Stop hook: checks all internal links across HTML files and blocks if any are broken."""

import json
import os
import re
import sys

PROJECT_DIR = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())


def find_html_files():
    html_files = []
    for fname in os.listdir(PROJECT_DIR):
        if fname.endswith(".html") and not fname.startswith("eval-"):
            html_files.append(fname)
    return html_files


def extract_internal_links(filepath):
    """Return all href values that look like local file links."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    links = re.findall(r'href=["\']([^"\'#?]+)["\']', content)
    internal = []
    for link in links:
        # Skip external URLs, mailto, tel
        if link.startswith(("http://", "https://", "mailto:", "tel:", "//")):
            continue
        # Skip anchors-only
        if not link:
            continue
        internal.append(link)
    return internal


def main():
    # Consume stdin (required for hooks even if unused)
    try:
        json.load(sys.stdin)
    except Exception:
        pass

    html_files = find_html_files()
    broken = []

    for fname in html_files:
        filepath = os.path.join(PROJECT_DIR, fname)
        links = extract_internal_links(filepath)
        for link in links:
            target = os.path.join(PROJECT_DIR, link)
            if not os.path.exists(target):
                broken.append((fname, link))

    if broken:
        for source, target in broken:
            print(f"  {source} → {target} (missing)", file=sys.stderr)
        sys.exit(2)  # Block — forces Claude to address before finishing

    print(json.dumps({"continue": True}))
    sys.exit(0)


if __name__ == "__main__":
    main()
