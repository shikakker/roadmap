import { FEATURE_TYPE } from 'lib/const'
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

  const feature = { title, createdAt, user, status }
  const featureMember = JSON.stringify(feature)

  try {
    const score = await redis.zscore(databaseName, featureMember)
    if (score === null) {
      return res.status(404).json({ error: 'FEATURE_NOT_FOUND' })
    }

    const removed = await redis.zrem(databaseName, featureMember)
    if (!removed) {
      return res.status(409).json({ error: 'FEATURE_CHANGED' })
    }

    try {
      const added = await redis.zadd(
        databaseName,
        { nx: true },
        {
          score,
          member: JSON.stringify({
            ...feature,
            status: FEATURE_TYPE.RELEASE
          })
        }
      )

      if (!added) {
        await redis.zadd(
          databaseName,
          { nx: true },
          { score, member: featureMember }
        ).catch(() => undefined)
        return res.status(409).json({ error: 'FEATURE_CONFLICT' })
      }
    } catch {
      await redis.zadd(
        databaseName,
        { nx: true },
        { score, member: featureMember }
      ).catch(() => undefined)
      return res.status(500).json({ error: 'PUBLISH_FAILED' })
    }

    return res.json({ body: 'success' })
  } catch {
    return res.status(500).json({ error: 'PUBLISH_FAILED' })
  }
})
