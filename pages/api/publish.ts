import { FEATURE_TYPE } from 'lib/const'
import redis, { databaseName } from 'lib/redis'
import authenticate from 'lib/authenticate'

const PUBLISH_FEATURE_SCRIPT = `
local score = redis.call('ZSCORE', KEYS[1], ARGV[1])
if not score then
  return 'NOT_FOUND'
end

if redis.call('ZSCORE', KEYS[1], ARGV[2]) then
  return 'CONFLICT'
end

redis.call('ZREM', KEYS[1], ARGV[1])
redis.call('ZADD', KEYS[1], score, ARGV[2])
return 'OK'
`

export default authenticate(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  const adminId = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID
  if (!adminId) {
    return res.status(503).json({ error: 'ADMIN_NOT_CONFIGURED' })
  }

  if (req.user.sub !== adminId) {
    return res.status(403).json({ error: 'FORBIDDEN' })
  }

  const { title, createdAt, user, status } = req.body ?? {}
  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof createdAt !== 'number' ||
    !Number.isFinite(createdAt) ||
    !user ||
    typeof user !== 'object' ||
    typeof status !== 'string' ||
    !status.trim()
  ) {
    return res.status(400).json({ error: 'INVALID_FEATURE' })
  }

  const feature = { title, createdAt, user, status }
  const featureMember = JSON.stringify(feature)
  const releaseMember = JSON.stringify({
    ...feature,
    status: FEATURE_TYPE.RELEASE
  })

  try {
    const publishResult = String(
      await redis.eval(
        PUBLISH_FEATURE_SCRIPT,
        [databaseName],
        [featureMember, releaseMember]
      )
    )

    if (publishResult === 'NOT_FOUND') {
      return res.status(404).json({ error: 'FEATURE_NOT_FOUND' })
    }

    if (publishResult === 'CONFLICT') {
      return res.status(409).json({ error: 'FEATURE_CONFLICT' })
    }

    if (publishResult !== 'OK') {
      return res.status(500).json({ error: 'PUBLISH_FAILED' })
    }

    await redis.del('s:' + featureMember).catch(() => undefined)
    return res.json({ body: 'success' })
  } catch {
    return res.status(500).json({ error: 'PUBLISH_FAILED' })
  }
})
