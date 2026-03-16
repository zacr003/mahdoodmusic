#!/usr/bin/env python3
"""InstructionsLoaded hook: prints a timestamp when CLAUDE.md or rules files are loaded."""

import json
import sys
from datetime import datetime

# Consume stdin
try:
    json.load(sys.stdin)
except Exception:
    pass

timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
print(f"Rules loaded at {timestamp}")

sys.exit(0)
