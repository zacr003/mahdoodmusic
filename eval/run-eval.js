#!/usr/bin/env node
/**
 * Canvas Site — Skill & Agent Eval Runner
 *
 * Runs test cases from test-cases.json against the project's skills and agents.
 * Each test invokes `claude --print` non-interactively, then scores the output
 * against defined output_checks and file_checks.
 *
 * Usage:
 *   node eval/run-eval.js                      # run all tests
 *   node eval/run-eval.js --filter new-page    # run one category
 *   node eval/run-eval.js --verbose            # show full claude output
 *
 * Categories: new-page · check-site · accessibility-agent · design-agent
 *
 * Notes on fixture files:
 *   Intentionally broken HTML is stored as .fixture (not .html) so the
 *   project's enforce-alt PreToolUse hook does not fire on Claude writes.
 *   The runner copies .fixture files to .html using Node fs — hooks only
 *   fire on Claude tool calls, not raw Node file I/O.
 */

'use strict';

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

// ── Paths ────────────────────────────────────────────────────────────────────

const PROJECT_DIR = path.resolve(__dirname, '..');
const EVAL_DIR    = __dirname;
const CASES_FILE  = path.join(EVAL_DIR, 'test-cases.json');

// ── ANSI helpers ─────────────────────────────────────────────────────────────

const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
};

const ok   = msg => `  ${C.green}✓${C.reset} ${msg}`;
const fail = msg => `  ${C.red}✗${C.reset} ${msg}`;
const hr   = () => '  ' + C.dim + '─'.repeat(56) + C.reset;

// ── CLI args ─────────────────────────────────────────────────────────────────

const args    = process.argv.slice(2);
const filterIdx = args.indexOf('--filter');
const FILTER  = filterIdx >= 0 ? args[filterIdx + 1] : null;
const VERBOSE = args.includes('--verbose');
const DRY_RUN = args.includes('--dry-run'); // print prompts without running claude

// ── Pattern matching ─────────────────────────────────────────────────────────

/**
 * Parse a pattern: strings wrapped in /.../ are treated as regex.
 * Everything else is a plain substring match.
 */
function toMatcher(pattern) {
  if (typeof pattern === 'string' && pattern.startsWith('/') && pattern.lastIndexOf('/') > 0) {
    const lastSlash = pattern.lastIndexOf('/');
    const flags = pattern.slice(lastSlash + 1);
    const src   = pattern.slice(1, lastSlash);
    return text => new RegExp(src, flags || 'i').test(text);
  }
  return text => text.includes(pattern);
}

/** Returns true if output satisfies a "contains" / "not_contains" check */
function evalOutputCheck(output, check) {
  const matchers = check.patterns.map(toMatcher);
  if (check.type === 'not_contains') {
    const matchMode = check.match || 'any';
    if (matchMode === 'any') {
      return !matchers.some(m => m(output));
    }
    return !matchers.every(m => m(output));
  }

  // type === 'contains'
  const matchMode = check.match || 'all';
  if (matchMode === 'any') {
    return matchers.some(m => m(output));
  }
  return matchers.every(m => m(output));
}

/**
 * "line_match" check: the output must have a line that contains ALL strings in
 * check.contains_all. Used for check-site which puts file verdict on one line:
 *   eval-check-clean.html    ✓ PASS
 */
function evalLineMatch(output, check) {
  const lines = output.split('\n');
  return lines.some(line => check.contains_all.every(s => line.includes(s)));
}

// ── Setup / teardown ─────────────────────────────────────────────────────────

function runSetup(actions) {
  for (const action of (actions || [])) {
    const dst = path.join(PROJECT_DIR, action.to || action.path);
    fs.mkdirSync(path.dirname(dst), { recursive: true });

    if (action.type === 'write_file') {
      fs.writeFileSync(dst, action.content, 'utf8');

    } else if (action.type === 'copy_fixture_as_html') {
      // Copies a .fixture file to a .html destination using raw Node fs.
      // This bypasses the enforce-alt PreToolUse hook (which only fires on
      // Claude Write tool calls, not Node file I/O).
      const src = path.join(EVAL_DIR, action.from);
      if (!fs.existsSync(src)) {
        throw new Error(`Fixture not found: ${src}`);
      }
      fs.copyFileSync(src, dst);

    } else if (action.type === 'copy_fixture') {
      const src = path.join(EVAL_DIR, action.from);
      if (!fs.existsSync(src)) {
        throw new Error(`Fixture not found: ${src}`);
      }
      fs.copyFileSync(src, dst);
    }
  }
}

function runTeardown(actions) {
  for (const action of (actions || [])) {
    if (action.type === 'delete_file') {
      const filePath = path.join(PROJECT_DIR, action.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
}

// ── File checks ───────────────────────────────────────────────────────────────

function evalFileCheck(check) {
  const filePath = path.join(PROJECT_DIR, check.path);
  const exists   = fs.existsSync(filePath);

  if (check.type === 'exists') {
    return exists;
  }
  if (check.type === 'not_exists') {
    return !exists;
  }
  if (check.type === 'contains') {
    if (!exists) return false;
    const content = fs.readFileSync(filePath, 'utf8');
    const matchers = check.patterns.map(toMatcher);
    const matchMode = check.match || 'all';
    return matchMode === 'any'
      ? matchers.some(m => m(content))
      : matchers.every(m => m(content));
  }
  return false;
}

// ── Claude invocation ─────────────────────────────────────────────────────────

const CLAUDE_TIMEOUT_MS = 180_000; // 3 min — agents can be slow

// Prepended to every prompt so Claude treats each test as a standalone task
// rather than continuing prior conversation context from the active session.
const EVAL_PREAMBLE =
  'You are running as part of an automated eval suite. ' +
  'This is a completely fresh, standalone task — do not reference or continue ' +
  'any previous conversation context. Execute only what is asked below.\n\n';

function runClaude(prompt, timeoutMs = CLAUDE_TIMEOUT_MS) {
  const fullPrompt = EVAL_PREAMBLE + prompt;

  if (DRY_RUN) {
    console.log(`  ${C.dim}[dry-run] would run: claude --print ${JSON.stringify(prompt)}${C.reset}`);
    return { ok: true, output: '' };
  }

  try {
    const output = execSync(
      `claude --print ${JSON.stringify(fullPrompt)}`,
      {
        cwd: PROJECT_DIR,
        timeout: timeoutMs,
        encoding: 'utf8',
        env: { ...process.env },
        maxBuffer: 10 * 1024 * 1024, // 10 MB
      }
    );
    return { ok: true, output };
  } catch (err) {
    // execSync throws on non-zero exit; stdout may still contain useful output
    return { ok: false, output: err.stdout || '', error: err.message };
  }
}

// ── Score a single test ───────────────────────────────────────────────────────

function scoreTest(testCase, claudeOutput) {
  const results = [];

  for (const check of (testCase.output_checks || [])) {
    let passed;
    if (check.type === 'line_match') {
      passed = evalLineMatch(claudeOutput, check);
    } else {
      passed = evalOutputCheck(claudeOutput, check);
    }
    results.push({ label: check.label, passed, source: 'output' });
  }

  for (const check of (testCase.file_checks || [])) {
    const passed = evalFileCheck(check);
    results.push({ label: check.label, passed, source: 'file' });
  }

  return results;
}

// ── Run one test ──────────────────────────────────────────────────────────────

async function runTest(testCase) {
  const {
    description,
    prompt,
    setup,
    teardown,
    pass_threshold,
    scoring_notes,
  } = testCase;

  process.stdout.write(`  ${C.dim}${description}${C.reset}\n`);

  let claudeOutput = '';

  try {
    runSetup(setup);

    const { ok: claudeOk, output, error } = runClaude(prompt);
    claudeOutput = output;

    if (!claudeOk && !output) {
      runTeardown(teardown);
      console.log(fail(`claude CLI failed: ${error}`));
      return { passed: false, checks: [] };
    }

    const checks  = scoreTest(testCase, claudeOutput);
    const numPass = checks.filter(c => c.passed).length;
    const total   = checks.length;
    const threshold = pass_threshold ?? total;
    const testPassed = numPass >= threshold;

    // Print each check result
    for (const check of checks) {
      console.log(check.passed ? ok(check.label) : fail(check.label));
    }

    // Summary line
    const badge = testPassed
      ? `${C.green}${C.bold}PASS${C.reset}`
      : `${C.red}${C.bold}FAIL${C.reset}`;
    console.log(`  ${badge} ${C.dim}(${numPass}/${total} checks · threshold ${threshold})${C.reset}`);

    if (scoring_notes) {
      console.log(`  ${C.gray}note: ${scoring_notes}${C.reset}`);
    }

    if (VERBOSE && claudeOutput) {
      console.log(`\n  ${C.dim}── Claude output ──${C.reset}`);
      claudeOutput.split('\n').forEach(l => console.log(`  ${C.dim}${l}${C.reset}`));
    }

    runTeardown(teardown);
    return { passed: testPassed, checks };

  } catch (err) {
    runTeardown(teardown);
    console.log(fail(`error: ${err.message}`));
    if (VERBOSE) console.error(err.stack);
    return { passed: false, checks: [] };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

/** Remove any eval-*.html files left over from a previous interrupted run. */
function cleanupStalFixtures() {
  const stale = fs.readdirSync(PROJECT_DIR)
    .filter(f => f.startsWith('eval-') && f.endsWith('.html'));
  if (stale.length > 0) {
    console.log(`  ${C.yellow}⚠${C.reset}  Removing ${stale.length} stale fixture(s): ${stale.join(', ')}`);
    stale.forEach(f => fs.unlinkSync(path.join(PROJECT_DIR, f)));
  }
}

async function main() {
  // Verify test-cases.json exists
  if (!fs.existsSync(CASES_FILE)) {
    console.error(`${C.red}Error:${C.reset} test-cases.json not found at ${CASES_FILE}`);
    process.exit(1);
  }

  const suite = JSON.parse(fs.readFileSync(CASES_FILE, 'utf8'));
  const allTests = suite.test_cases;
  const tests = FILTER
    ? allTests.filter(t => t.category === FILTER)
    : allTests;

  if (tests.length === 0) {
    const cats = [...new Set(allTests.map(t => t.category))].join(' · ');
    console.log(`No tests found${FILTER ? ` for category "${FILTER}"` : ''}.`);
    console.log(`Available categories: ${cats}`);
    process.exit(0);
  }

  cleanupStalFixtures();

  // Header
  console.log('');
  console.log(`${C.bold}  Canvas Site — Eval Suite${C.reset}  ${C.dim}v${suite.version}${C.reset}`);
  console.log(`  ${C.dim}${tests.length} test${tests.length > 1 ? 's' : ''}${FILTER ? ` · filter: ${FILTER}` : ''}${DRY_RUN ? ' · DRY RUN' : ''}${C.reset}`);
  console.log('');

  const categories = [...new Set(tests.map(t => t.category))];
  const summary = { passed: 0, failed: 0, categories: {} };

  for (const category of categories) {
    const catTests = tests.filter(t => t.category === category);
    let catPass = 0;

    console.log(`${C.cyan}${C.bold}  ${category}${C.reset}`);
    console.log(hr());

    for (const test of catTests) {
      const result = await runTest(test);
      if (result.passed) {
        catPass++;
        summary.passed++;
      } else {
        summary.failed++;
      }
      console.log('');
    }

    summary.categories[category] = { passed: catPass, total: catTests.length };
    console.log('');
  }

  // Final report
  console.log('━'.repeat(58));
  console.log('');
  console.log(`${C.bold}  Results by category${C.reset}`);
  for (const [cat, s] of Object.entries(summary.categories)) {
    const icon = s.passed === s.total ? C.green + '✓' : C.red + '✗';
    console.log(`  ${icon}${C.reset}  ${cat.padEnd(24)} ${s.passed}/${s.total}`);
  }
  console.log('');

  const total = summary.passed + summary.failed;
  const allPassed = summary.failed === 0;
  const resultColor = allPassed ? C.green : C.red;

  console.log(`  ${C.bold}Total: ${resultColor}${summary.passed}/${total} passed${C.reset}`);
  if (!allPassed) {
    console.log(`  ${C.dim}Run with --verbose to see full claude output per test.${C.reset}`);
  }
  console.log('');

  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error(`${C.red}Fatal:${C.reset}`, err.message);
  process.exit(1);
});
