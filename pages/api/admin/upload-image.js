import { put } from '@vercel/blob'
import { isAuthenticated } from '../../../lib/auth'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const filename = req.query.filename
  if (!filename) return res.status(400).json({ error: 'filename query param required' })

  try {
    const blob = await put(filename, req, {
      access: 'public',
      addRandomSuffix: true,
    })
    return res.status(200).json({ url: blob.url })
  } catch (err) {
    console.error('upload error:', err)
    return res.status(500).json({ error: err.message })
  }
}
