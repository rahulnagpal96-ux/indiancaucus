import { isAuthenticated, getCurrentUser } from '../../../lib/auth'
import { listUsers, createUser, deleteUserById, updateUserFields } from '../../../lib/db'

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req, res) {
  if (!await isAuthenticated(req, res)) return res.status(401).json({ error: 'Unauthorized' })

  // Managing who can sign in is an admin-only action.
  const me = await getCurrentUser(req, res)
  if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Admins only' })

  if (req.method === 'GET') {
    try {
      const users = await listUsers()
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ users: users.rows, me: me.email })
    } catch (err) {
      console.error('users GET error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    const { email, name, role } = req.body || {}
    if (!isValidEmail(email)) return res.status(400).json({ error: 'A valid email is required' })
    try {
      const result = await createUser({ email, name, role: role === 'admin' ? 'admin' : 'staff' })
      if (!result.rows[0]) return res.status(409).json({ error: 'That email is already on the list' })
      return res.status(200).json({ user: result.rows[0] })
    } catch (err) {
      console.error('users POST error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'PATCH') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    const { name, role, active } = req.body || {}
    try {
      const result = await updateUserFields(id, {
        name,
        role: role === 'admin' || role === 'staff' ? role : undefined,
        active,
      })
      return res.status(200).json({ user: result.rows[0] })
    } catch (err) {
      console.error('users PATCH error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    try {
      await deleteUserById(id)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('users DELETE error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
