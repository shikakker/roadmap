import redis, { databaseName } from 'lib/redis'

async function listFeatures(req, res) {
  try {
    const data = await redis.zrange(databaseName, 0, -1, { withScores: true })

    const result = []
    for (let i = 0; i < data.length - 1; i += 2) {
      const item = data[i]
      item['score'] = data[i + 1]
      result.push(item)
    }

    res.json(result)
  } catch (error) {
    res.status(400).json({ error })
  }
}

export default listFeatures
