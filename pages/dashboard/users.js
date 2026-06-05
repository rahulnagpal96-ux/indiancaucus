import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

function RoleBadge({ role }) {
  const admin = role === 'admin'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
      {admin ? 'Admin' : 'Staff'}
    </span>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [me, setMe] = useState('')
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('staff')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    try {
      const r = await fetch('/api/admin/users')
      if (r.status === 403) { setForbidden(true); setLoading(false); return }
      const d = await r.json()
      if (!d.error) { setUsers(d.users || []); setMe(d.me || '') }
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function addUser(e) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const r = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role }),
      })
      const d = await r.json()
      if (!r.ok || d.error) throw new Error(d.error || 'Could not add user')
      setEmail(''); setName(''); setRole('staff')
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function changeRole(u, newRole) {
    setUsers((list) => list.map((x) => x.id === u.id ? { ...x, role: newRole } : x))
    await fetch(`/api/admin/users?id=${u.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: newRole }),
    }).catch(() => {})
  }

  async function removeUser(u) {
    setUsers((list) => list.filter((x) => x.id !== u.id))
    await fetch(`/api/admin/users?id=${u.id}`, { method: 'DELETE' }).catch(() => {})
  }

  if (forbidden) {
    return (
      <AdminLayout title="Users">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-gray-900 font-bold mb-1">Admins only</p>
          <p className="text-gray-500 text-sm">Ask an administrator to manage dashboard access.</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Users">
      <div className="max-w-2xl space-y-5">

        {/* Add user */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-gray-900 font-bold text-sm">Grant access</h2>
            <p className="text-gray-400 text-xs mt-0.5">Add the person's Microsoft email. They sign in with their own Microsoft account.</p>
          </div>
          <form onSubmit={addUser} className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
              />
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={role} onChange={(e) => setRole(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit" disabled={saving}
                className="flex-1 text-white text-sm font-bold py-3 rounded-xl shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#1a2744,#243660)' }}
              >
                {saving ? 'Adding…' : 'Add user'}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </form>
        </div>

        {/* User list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-gray-900 font-bold text-sm">People with access</h2>
            <p className="text-gray-400 text-xs mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''}</p>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm text-center py-10">Loading…</p>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No users yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-900 text-sm font-semibold truncate">
                      {u.name || u.email}{u.email === me && <span className="text-gray-400 font-normal"> (you)</span>}
                    </p>
                    {u.name && <p className="text-gray-400 text-xs truncate">{u.email}</p>}
                    <p className="text-gray-300 text-xs mt-0.5">
                      {u.last_login_at ? `Last in ${new Date(u.last_login_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Never signed in'}
                    </p>
                  </div>
                  <select
                    value={u.role || 'staff'}
                    onChange={(e) => changeRole(u, e.target.value)}
                    disabled={u.email === me}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none disabled:opacity-50"
                    title={u.email === me ? "You can't change your own role" : 'Change role'}
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => removeUser(u)}
                    disabled={u.email === me}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0 disabled:opacity-30"
                    title={u.email === me ? "You can't remove yourself" : 'Remove access'}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
