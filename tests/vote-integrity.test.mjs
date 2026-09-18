import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const source = fs.readFileSync('pages/api/vote.ts', 'utf8')
const compact = source.replace(/\s+/g, ' ')

test('vote endpoint only accepts POST mutations', () => {
  assert.match(compact, /req\.method !== ['"]POST['"]/)
  assert.match(compact, /status\(405\)/)
})

test('vote endpoint verifies the feature already exists before recording a voter', () => {
  const existenceCheck = source.indexOf('redis.zscore(databaseName, FEATURE)')
  const recordVoter = source.indexOf("redis.sadd('s:' + FEATURE")

  assert.ok(existenceCheck >= 0, 'missing sorted-set membership check')
  assert.ok(recordVoter > existenceCheck, 'voter must not be recorded before feature existence is verified')
  assert.match(compact, /FEATURE_NOT_FOUND/)
})

test('duplicate votes return a conflict instead of a generic bad request', () => {
  assert.match(compact, /ALREADY_VOTED/)
  assert.match(compact, /status\(409\)/)
})

test('failed score increments release the voter marker so a legitimate retry is possible', () => {
  const incrementVote = source.indexOf('redis.zincrby(databaseName, 1, FEATURE)')
  const rollbackVoter = source.indexOf("redis.srem('s:' + FEATURE, req.user.sub)")

  assert.ok(incrementVote >= 0, 'missing score increment')
  assert.ok(rollbackVoter > incrementVote, 'failed score increment must compensate the voter marker')
  assert.match(compact, /catch\s*\{[^}]*redis\.srem/s)
})
