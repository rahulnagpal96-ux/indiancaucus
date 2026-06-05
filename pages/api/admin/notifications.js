import { isAuthenticated, getCurrentUser } from '../../../lib/auth'
import {
  getUserPrefs,
  setUserPref,
  listPushSubscriptionsForUser,
  deletePushSubscriptionById,
} from '../../../lib/db'

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })

  const me = await getCurrentUser(req, res)
  if (!me?.email) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    try {
      const [prefs, devices] = await Promise.all([
        getUserPrefs(me.email),
        listPushSubscriptionsForUser(me.email),
      ])
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ prefs, devices: devices.rows })
    } catch (err) {
      console.error('notifications GET error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'PUT') {
    const { sale, subscriber } = req.body || {}
    try {
      if (typeof sale === 'boolean') await setUserPref(me.email, 'sale', sale)
      if (typeof subscriber === 'boolean') await setUserPref(me.email, 'subscriber', subscriber)
      return res.status(200).json({ ok: true, prefs: await getUserPrefs(me.email) })
    } catch (err) {
      console.error('notifications PUT error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    try {
      await deletePushSubscriptionById(id)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('notifications DELETE error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
