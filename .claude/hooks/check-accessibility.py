#!/usr/bin/env python3
"""
Stop hook: scan all HTML files for accessibility violations.
Blocks if any are found.
"""

import json
import os
import re
import sys

PROJECT_DIR = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())


def check_file(filepath):
    issues = []
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Check for <img> tags missing alt
    for tag in re.findall(r'<img\b[^>]*>', content, re.IGNORECASE):
        if not re.search(r'\balt\s*=', tag, re.IGNORECASE):
            issues.append(f"<img> missing alt attribute")
            break

    # Check for <input> tags without an associated <label>
    inputs = re.findall(r'<input\b[^>]*>', content, re.IGNORECASE)
    for tag in inputs:
        # Skip hidden, submit, button, reset inputs — they don't need labels
        type_match = re.search(r'\btype\s*=\s*["\'](\w+)["\']', tag, re.IGNORECASE)
        input_type = type_match.group(1).lower() if type_match else "text"
        if input_type in ("hidden", "submit", "button", "reset"):
            continue
        input_id = re.search(r'\bid\s*=\s*["\']([^"\']+)["\']', tag, re.IGNORECASE)
        if input_id:
            label_for = re.search(
                rf'<label\b[^>]*\bfor\s*=\s*["\']' + re.escape(input_id.group(1)) + r'["\']',
                content, re.IGNORECASE
            )
            if not label_for:
                issues.append(f"<input id=\"{input_id.group(1)}\"> has no matching <label for>")
        else:
            # No id — check if wrapped in a <label>
            issues.append(f"<input> has no id and may lack an associated <label>")
            break

    return issues


def main():
    try:
        json.load(sys.stdin)
    except Exception:
        pass

    html_files = [f for f in os.listdir(PROJECT_DIR) if f.endswith(".html")]
    all_issues = []

    for fname in html_files:
        filepath = os.path.join(PROJECT_DIR, fname)
        issues = check_file(filepath)
        for issue in issues:
            all_issues.append(f"{fname}: {issue}")

    if all_issues:
        for issue in all_issues:
            print(issue, file=sys.stderr)
        sys.exit(2)

    print(json.dumps({"continue": True}))
    sys.exit(0)


if __name__ == "__main__":
    main()
