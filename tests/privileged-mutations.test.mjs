import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

for (const path of ['pages/api/create.tsx', 'pages/api/remove.ts', 'pages/api/publish.ts']) {
  test(`${path} is POST-only and returns a controlled method error`, () => {
    const source = read(path)
    assert.match(source, /req\.method\s*!==\s*['"]POST['"]/)
    assert.match(source, /setHeader\(['"]Allow['"],\s*['"]POST['"]\)/)
    assert.match(source, /METHOD_NOT_ALLOWED/)
  })

  test(`${path} does not leak raw exception messages`, () => {
    const source = read(path)
    assert.doesNotMatch(source, /error\.message/)
    assert.doesNotMatch(source, /json\(\{\s*error\s*\}\)/)
  })
}

test('create returns bounded validation and storage errors', () => {
  const source = read('pages/api/create.tsx')
  assert.match(source, /INVALID_TITLE/)
  assert.match(source, /CREATE_FAILED/)
})

for (const path of ['pages/api/remove.ts', 'pages/api/publish.ts']) {
  test(`${path} validates admin configuration and authorization explicitly`, () => {
    const source = read(path)
    assert.match(source, /AUTH0_ADMIN_ID/)
    assert.match(source, /ADMIN_NOT_CONFIGURED/)
    assert.match(source, /FORBIDDEN/)
  })

  test(`${path} validates the feature payload before Redis mutation`, () => {
    const source = read(path)
    assert.match(source, /INVALID_FEATURE/)
    assert.match(source, /typeof title/)
    assert.match(source, /typeof createdAt/)
    assert.match(source, /typeof status/)
  })
}

test('publish checks existence before replacing a feature and reports provider failure generically', () => {
  const source = read('pages/api/publish.ts')
  assert.match(source, /FEATURE_NOT_FOUND/)
  assert.match(source, /PUBLISH_FAILED/)
  assert.doesNotMatch(source, /console\.log/)
})

test('remove reports not-found separately from provider failure', () => {
  const source = read('pages/api/remove.ts')
  assert.match(source, /FEATURE_NOT_FOUND/)
  assert.match(source, /REMOVE_FAILED/)
  assert.doesNotMatch(source, /console\.log/)
})

test('public list endpoint is GET-only and never leaks raw Redis errors', () => {
  const source = read('pages/api/list.ts')
  assert.match(source, /req\.method\s*!==\s*['"]GET['"]/)
  assert.match(source, /setHeader\(['"]Allow['"],\s*['"]GET['"]\)/)
  assert.match(source, /METHOD_NOT_ALLOWED/)
  assert.match(source, /LIST_FAILED/)
  assert.doesNotMatch(source, /json\(\{\s*error\s*\}\)/)
})


test('publish moves source to release atomically inside one Redis script', () => {
  const source = read('pages/api/publish.ts')
  assert.match(source, /PUBLISH_FEATURE_SCRIPT/)
  assert.match(source, /redis\.call\('ZSCORE', KEYS\[1\], ARGV\[1\]\)/)
  assert.match(source, /redis\.call\('ZSCORE', KEYS\[1\], ARGV\[2\]\)/)
  assert.match(source, /redis\.call\('ZREM', KEYS\[1\], ARGV\[1\]\)/)
  assert.match(source, /redis\.call\('ZADD', KEYS\[1\], score, ARGV\[2\]\)/)
  assert.match(source, /await redis\.eval\(/)
  assert.match(source, /FEATURE_NOT_FOUND/)
  assert.match(source, /FEATURE_CONFLICT/)
  assert.doesNotMatch(source, /await redis\.zscore\(databaseName, featureMember\)/)
})
