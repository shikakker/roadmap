import redis, { databaseName } from 'lib/redis'

async function listFeatures(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  try {
    const data = await redis.zrange(databaseName, 0, -1, { withScores: true })

    const result = []
    for (let i = 0; i < data.length - 1; i += 2) {
      const item = data[i]
      item['score'] = data[i + 1]
      result.push(item)
    }

    return res.status(200).json(result)
  } catch {
    return res.status(500).json({ error: 'LIST_FAILED' })
  }
}

export default listFeatures
