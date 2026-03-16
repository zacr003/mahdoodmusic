#!/usr/bin/env python3
"""
PreToolUse hook: Inject accessibility reminders when Claude reads an HTML file.
Does not block anything -- only adds additionalContext.
"""

import json
import sys


def main():
    try:
        hook_input = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_name = hook_input.get("tool_name", "")
    tool_input = hook_input.get("tool_input", {})

    if tool_name != "Read":
        sys.exit(0)

    file_path = tool_input.get("file_path", "")
    if not file_path.endswith(".html"):
        sys.exit(0)

    context = (
        "HTML accessibility reminders for this file:\n"
        "1. Use semantic elements: <header>, <nav>, <main>, <section>, <article>, <aside>, <footer> — never <div> when a semantic element fits.\n"
        "2. Add ARIA roles where semantic elements alone are insufficient (e.g. role=\"banner\", role=\"navigation\", role=\"main\").\n"
        "3. Keep heading hierarchy sequential — one <h1> per page, no skipped levels (h1 → h2 → h3, never h1 → h3).\n"
        "4. Every <img> must have an alt attribute. Descriptive for meaningful images, empty (alt=\"\") for decorative ones.\n"
        "5. All form inputs must have an associated <label>."
    )

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "additionalContext": context
        }
    }))
    sys.exit(0)


if __name__ == "__main__":
    main()
