export default function authenticate(next) {
  return async (req, res) => {
    const authorization = req.headers.authorization
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN

    if (!domain) {
      return res.status(503).json({ error: 'AUTH_NOT_CONFIGURED' })
    }

    if (typeof authorization !== 'string' || !authorization.trim()) {
      return res.status(401).json({ error: 'UNAUTHORIZED' })
    }

    try {
      const response = await fetch(`https://${domain}/userinfo`, {
        headers: {
          Authorization: `Bearer ${authorization.trim()}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        return res.status(401).json({ error: 'UNAUTHORIZED' })
      }

      const user = await response.json()
      if (typeof user?.sub !== 'string' || !user.sub.trim()) {
        return res.status(401).json({ error: 'UNAUTHORIZED' })
      }

      req.user = user
      return next(req, res)
    } catch {
      return res.status(502).json({ error: 'AUTH_PROVIDER_UNAVAILABLE' })
    }
  }
}
