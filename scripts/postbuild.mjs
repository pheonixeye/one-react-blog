import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

const outDir = new URL('../out', import.meta.url).pathname;
const src = join(outDir, '_next', 'static');
const dest = join(outDir, 'static');

if (existsSync(src) && !existsSync(dest)) {
  mkdirSync(join(outDir, '_next'), { recursive: true });
  renameSync(src, dest);
  rmSync(join(outDir, '_next'), { recursive: true, force: true });
}

const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) { walk(full); continue; }
    const ext = full.split('.').pop();
    if (!['html', 'xml', 'txt'].includes(ext)) continue;
    const c = readFileSync(full, 'utf-8');
    const u = c.replace(/\/_next\/static\//g, '/static/');
    if (u !== c) writeFileSync(full, u);
  }
};
walk(outDir);

// Fix /_next/ references in JS bundles (webpack publicPath)
const jsWalk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) { jsWalk(full); continue; }
    if (!full.endsWith('.js') && !full.endsWith('.mjs')) continue;
    const c = readFileSync(full, 'utf-8');
    const u = c.replace(/\/_next\/static\//g, '/static/').replace(/\br\.p\s*=\s*["']\/_next\/["']/g, 'r.p="/"');
    if (u !== c) writeFileSync(full, u);
  }
};
jsWalk(join(outDir, 'static'));
