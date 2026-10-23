#!/usr/bin/env node
// Fails if any installed Expo module has an android.publication block without
// "version". Such modules come from a newer Expo SDK and break Gradle's
// settings evaluation on SDK 54 ("Field 'version' is required ... Publication").
// Prints GitHub annotations when run in Actions; writes offenders to bad-modules.txt.

const fs = require('fs');
const path = require('path');

const found = [];
const badNames = new Set();
const mods = [];

function walk(dir, depth) {
  if (depth > 4) return;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const p = path.join(dir, e.name);
    if (e.name.startsWith('@')) {
      walk(p, depth);
      continue;
    }
    const cfg = path.join(p, 'expo-module.config.json');
    if (fs.existsSync(cfg)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(p, 'package.json'), 'utf8'));
        const c = JSON.parse(fs.readFileSync(cfg, 'utf8'));
        const id = `${pkg.name}@${pkg.version} (${path.relative(process.cwd(), p)})`;
        mods.push(id);
        const pub = c.android && c.android.publication;
        if (pub && !pub.version) {
          found.push(id);
          badNames.add(pkg.name);
        }
      } catch {
        // Unreadable config: ignore, Gradle will report it if it matters.
      }
    }
    const nested = path.join(p, 'node_modules');
    if (fs.existsSync(nested)) walk(nested, depth + 1);
  }
}

walk('node_modules', 0);
console.log(`Expo modules (${mods.length}):\n${mods.join('\n')}`);
fs.writeFileSync('bad-modules.txt', [...badNames].join('\n'));

if (found.length) {
  console.log(`::error title=Expo module from a newer SDK::${found.join(' | ')} — pin it to the SDK 54 version in package.json`);
  process.exit(1);
}
console.log('::notice title=Expo modules OK::No versionless android.publication found');
