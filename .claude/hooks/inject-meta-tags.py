#!/usr/bin/env python3
"""
PreToolUse hook: Silently inject missing charset/viewport meta tags into HTML files
before they are written. Uses updatedInput to modify the content transparently.
"""

import json
import re
import sys


CHARSET_TAG = '<meta charset="UTF-8" />'
VIEWPORT_TAG = '<meta name="viewport" content="width=device-width, initial-scale=1.0" />'


def main():
    try:
        hook_input = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_name = hook_input.get("tool_name", "")
    tool_input = hook_input.get("tool_input", {})

    if tool_name != "Write":
        sys.exit(0)

    file_path = tool_input.get("file_path", "")
    content = tool_input.get("content", "")

    if not file_path.endswith(".html"):
        sys.exit(0)

    tags_to_inject = []

    if not re.search(r'<meta\s+charset', content, re.IGNORECASE):
        tags_to_inject.append(CHARSET_TAG)

    if not re.search(r'<meta\s+name=["\']viewport["\']', content, re.IGNORECASE):
        tags_to_inject.append(VIEWPORT_TAG)

    if not tags_to_inject:
        sys.exit(0)

    injection = "\n    ".join(tags_to_inject)

    # Inject after <head> tag, or before </head> if <head> open tag not found cleanly
    if re.search(r'<head>', content, re.IGNORECASE):
        updated_content = re.sub(
            r'(<head>)',
            r'\1\n    ' + injection,
            content,
            count=1,
            flags=re.IGNORECASE
        )
    elif re.search(r'</head>', content, re.IGNORECASE):
        updated_content = re.sub(
            r'(</head>)',
            '    ' + injection + r'\n\1',
            content,
            count=1,
            flags=re.IGNORECASE
        )
    else:
        # No <head> at all — can't safely inject, let it through unchanged
        sys.exit(0)

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow",
            "updatedInput": {
                "file_path": file_path,
                "content": updated_content
            }
        }
    }))
    sys.exit(0)


if __name__ == "__main__":
    main()
