const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const srcDir = path.join(repoRoot, 'src');
const outDir = path.join(repoRoot, 'out');

function collectSourceTests(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceTests(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

const sourceTests = collectSourceTests(srcDir);
const testFiles = sourceTests.map(sourceFile => {
  const relativePath = path.relative(srcDir, sourceFile);
  return path.join(outDir, relativePath).replace(/\.ts$/, '.js');
});

if (testFiles.length === 0) {
  console.error('No source test files were found in src/.');
  process.exit(1);
}

execFileSync(process.execPath, ['--test', '--test-concurrency=1', ...testFiles], {
  cwd: repoRoot,
  stdio: 'inherit'
});
