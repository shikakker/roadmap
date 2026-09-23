import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const auth = fs.readFileSync('lib/authenticate.ts', 'utf8')

const compact = auth.replace(/\s+/g, ' ')

test('Auth0 userinfo must fail closed on non-success responses', () => {
  assert.match(compact, /if \(!response\.ok\)/)
})

test('authenticated identity must include a non-empty subject', () => {
  assert.match(compact, /typeof user\?\.sub !== ['"]string['"]/)
  assert.match(compact, /user\.sub\.trim\(\)/)
})

test('missing Auth0 server configuration returns a controlled service error', () => {
  assert.match(compact, /AUTH_NOT_CONFIGURED/)
  assert.match(compact, /status\(503\)/)
})
