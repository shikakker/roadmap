import redis, { databaseName } from 'lib/redis'
import authenticate from 'lib/authenticate'

export default authenticate(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  try {
    const { title, createdAt, user, status } = req.body ?? {}

    if (typeof title !== 'string' || !title.trim() || !createdAt || typeof status !== 'string') {
      return res.status(400).json({ error: 'INVALID_FEATURE' })
    }

    const FEATURE = JSON.stringify({ title, createdAt, user, status })
    const score = await redis.zscore(databaseName, FEATURE)

    if (score === null) {
      return res.status(404).json({ error: 'FEATURE_NOT_FOUND' })
    }

    const hasUser = await redis.sadd('s:' + FEATURE, req.user.sub)

    if (!hasUser) {
      return res.status(409).json({ error: 'ALREADY_VOTED' })
    }

    try {
      const data = await redis.zincrby(databaseName, 1, FEATURE)
      return res.json(data)
    } catch {
      await redis.srem('s:' + FEATURE, req.user.sub).catch(() => undefined)
      return res.status(500).json({ error: 'VOTE_FAILED' })
    }
  } catch {
    return res.status(500).json({ error: 'VOTE_FAILED' })
  }
})
