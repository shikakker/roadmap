import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))

test('roadmap uses patched Next and React runtime versions', () => {
  assert.equal(pkg.dependencies.next, '15.5.24')
  assert.equal(pkg.dependencies.react, '18.2.0')
  assert.equal(pkg.dependencies['react-dom'], '18.2.0')
})
