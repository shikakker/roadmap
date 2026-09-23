import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('deployment pins supported Node and pnpm instead of inheriting platform defaults', () => {
  assert.match(pkg.engines?.node || '', /^24\./);
  assert.equal(pkg.packageManager, 'pnpm@9.15.9');
});
