#!/usr/bin/env node
/**
 * build-neural-demo.cjs
 * ─────────────────────────────────────────────────────────────
 * Rebuilds the Neural SPA and copies its dist/ into the
 * portfolio's public/demos/neural/ so the demo iframe works.
 *
 * Usage:  node scripts/build-neural-demo.cjs
 *
 * Requires: Node 18+, npm. Neural source must already exist at
 *           ../projects-raw/neural-ai-ui/neural-ai-ui
 */
import { existsSync } from 'node:fs';
import { cp, rm, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const portfolioRoot = path.resolve(__dirname, '..');
const neuralRoot = path.resolve(portfolioRoot, '..', 'projects-raw', 'neural-ai-ui', 'neural-ai-ui');
const distSrc = path.join(neuralRoot, 'dist');
const distDst = path.join(portfolioRoot, 'public', 'demos', 'neural');

function log(msg) {
  console.log(`\x1b[36m[build-neural]\x1b[0m ${msg}`);
}
function ok(msg) {
  console.log(`\x1b[32m[build-neural]\x1b[0m ${msg}`);
}
function fail(msg) {
  console.error(`\x1b[31m[build-neural]\x1b[0m ${msg}`);
  process.exit(1);
}

if (!existsSync(neuralRoot)) {
  fail(`Neural source not found at ${neuralRoot}`);
}

log(`Building Neural at ${neuralRoot} ...`);
const build = spawnSync('npm', ['run', 'build'], {
  cwd: neuralRoot,
  stdio: 'inherit',
  shell: true,
});
if (build.status !== 0) {
  fail('Neural build failed.');
}

if (!existsSync(distSrc)) {
  fail(`Neural dist not found at ${distSrc} after build.`);
}

log(`Copying dist -> ${distDst} ...`);
await rm(distDst, { recursive: true, force: true });
await mkdir(distDst, { recursive: true });
await cp(distSrc, distDst, { recursive: true });

ok(`Neural demo embedded at /demos/neural/`);
ok(`Run \`npm run dev\` and visit /demos/neural/ to verify.`);