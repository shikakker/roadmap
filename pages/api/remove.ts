import redis, { databaseName } from 'lib/redis'
import authenticate from 'lib/authenticate'

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

  const feature = JSON.stringify({ title, createdAt, user, status })

  try {
    const removed = await redis.zrem(databaseName, feature)

    if (!removed) {
      return res.status(404).json({ error: 'FEATURE_NOT_FOUND' })
    }

    await redis.del('s:' + feature).catch(() => undefined)
    return res.json({ body: 'success' })
  } catch {
    return res.status(500).json({ error: 'REMOVE_FAILED' })
  }
})
