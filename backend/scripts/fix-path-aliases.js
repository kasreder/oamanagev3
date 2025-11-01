const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const ALIAS_PREFIX = '@/';

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.isFile() && fullPath.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

function resolveAlias(modulePath, fromFile) {
  const aliasTarget = modulePath.slice(ALIAS_PREFIX.length);
  const absoluteTarget = path.join(DIST_DIR, aliasTarget);
  let relativePath = path.relative(path.dirname(fromFile), absoluteTarget);
  relativePath = relativePath.split(path.sep).join('/');
  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }
  return relativePath;
}

function rewriteFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  if (!original.includes(ALIAS_PREFIX)) {
    return false;
  }

  let modified = original;
  const importRegex = /(['"])@\/([^'"\n]+)\1/g;
  modified = modified.replace(importRegex, (match, quote, rest) => {
    const modulePath = `${ALIAS_PREFIX}${rest}`;
    const resolvedPath = resolveAlias(modulePath, filePath);
    return `${quote}${resolvedPath}${quote}`;
  });

  if (modified !== original) {
    fs.writeFileSync(filePath, modified, 'utf8');
    return true;
  }

  return false;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.warn(`skip alias fix: dist directory not found at ${DIST_DIR}`);
    return;
  }

  const files = walkDir(DIST_DIR);
  let updatedCount = 0;
  for (const file of files) {
    if (rewriteFile(file)) {
      updatedCount += 1;
    }
  }
  console.log(`Updated ${updatedCount} files to replace '@/' aliases.`);
}

main();
