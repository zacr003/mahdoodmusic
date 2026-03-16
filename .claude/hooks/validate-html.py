#!/usr/bin/env python3
"""PostToolUse hook: validates HTML files after Write or Edit tool calls."""

import json
import sys
import re


def validate_html(filepath, content):
    issues = []

    # Check for DOCTYPE
    if not re.search(r'<!DOCTYPE\s+html', content, re.IGNORECASE):
        issues.append("Missing <!DOCTYPE html>")

    # Check for lang attribute on <html>
    if not re.search(r'<html[^>]+lang=', content, re.IGNORECASE):
        issues.append("Missing lang attribute on <html>")

    # Check for <title> element
    if not re.search(r'<title[^>]*>.+</title>', content, re.IGNORECASE):
        issues.append("Missing or empty <title> element")

    # Basic tag matching: count opening vs closing tags for common block elements
    for tag in ["head", "body", "main", "nav", "footer", "header"]:
        opens = len(re.findall(rf'<{tag}[\s>]', content, re.IGNORECASE))
        closes = len(re.findall(rf'</{tag}>', content, re.IGNORECASE))
        if opens != closes:
            issues.append(f"Mismatched <{tag}> tags ({opens} open, {closes} close)")

    return issues


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    tool_input = data.get("tool_input", {})

    # Only care about HTML files
    filepath = tool_input.get("file_path", tool_input.get("path", ""))
    if not filepath.endswith(".html"):
        sys.exit(0)

    # Get the file content from the tool input
    content = tool_input.get("content", "")
    if not content:
        sys.exit(0)

    issues = validate_html(filepath, content)

    if issues:
        print(f"HTML validation issues in {filepath}:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print(f"HTML validation passed: {filepath}")

    # PostToolUse hooks are feedback only — always exit 0
    sys.exit(0)


if __name__ == "__main__":
    main()
