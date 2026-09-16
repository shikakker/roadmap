import { string } from 'yup'
import { FEATURE_TYPE } from 'lib/const'
import redis, { databaseName } from 'lib/redis'
import authenticate from 'lib/authenticate'

const excludedUserFields = new Set(['nickname', 'email', 'updated_at'])

export default authenticate(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  try {
    const { title } = req.body ?? {}
    const schema = string().required().trim().min(10).max(70)
    const isValid = await schema.isValid(title)

    if (!isValid) {
      return res.status(400).json({ error: 'INVALID_TITLE' })
    }

    const user = Object.fromEntries(
      Object.entries(req.user).filter(([key]) => !excludedUserFields.has(key))
    )
    const feature = {
      title: title.trim(),
      createdAt: Date.now(),
      user,
      status: FEATURE_TYPE.NEW
    }

    await redis.zadd(
      databaseName,
      { nx: true },
      { score: 0, member: JSON.stringify(feature) }
    )

    return res.status(201).json({ body: 'success' })
  } catch {
    return res.status(500).json({ error: 'CREATE_FAILED' })
  }
})
