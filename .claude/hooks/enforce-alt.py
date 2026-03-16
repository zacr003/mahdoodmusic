#!/usr/bin/env python3
"""
PreToolUse hook: Block Write to HTML files if any <img> tags are missing alt attributes.
Outputs permissionDecision 'deny' with a clear reason.
"""

import json
import re
import sys

def main():
    try:
        hook_input = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_name = hook_input.get("tool_name", "")
    tool_input = hook_input.get("tool_input", {})

    # Only check Write tool calls
    if tool_name != "Write":
        sys.exit(0)

    file_path = tool_input.get("file_path", "")
    content = tool_input.get("content", "")

    # Only check HTML files
    if not file_path.endswith(".html"):
        sys.exit(0)

    # Find all <img> tags
    img_tags = re.findall(r'<img\b[^>]*>', content, re.IGNORECASE)

    # Check each for a missing or empty alt attribute
    missing_alt = []
    for tag in img_tags:
        has_alt = re.search(r'\balt\s*=\s*["\'][^"\']*["\']', tag, re.IGNORECASE)
        if not has_alt:
            missing_alt.append(tag)

    if missing_alt:
        examples = "\n".join(f"  {t}" for t in missing_alt[:3])
        reason = (
            f"Accessibility violation: {len(missing_alt)} <img> tag(s) in "
            f"{file_path} are missing alt attributes.\n\n"
            f"Offending tag(s):\n{examples}\n\n"
            "Fix: add a descriptive alt attribute to each image "
            '(or alt="" for purely decorative images).'
        )
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": reason
            }
        }))
        sys.exit(0)

    sys.exit(0)

if __name__ == "__main__":
    main()
