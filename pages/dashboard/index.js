import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Link from 'next/link'

function StatCard({ label, value, sub, gradient, icon, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={{ background: gradient }}
        >
          {icon}
        </div>
      </div>
      <div>
        {loading ? (
          <div className="h-9 w-20 bg-gray-100 rounded-lg animate-pulse mb-1" />
        ) : (
          <p className="text-3xl font-black text-gray-900 leading-none">{value ?? '—'}</p>
        )}
        <p className="text-gray-500 text-sm font-medium mt-1">{label}</p>
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function fmtMoney(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function DashboardHome() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)
  const [settingUp, setSettingUp] = useState(false)
  const [setupMsg, setSetupMsg] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [syncingResend, setSyncingResend] = useState(false)
  const [resendResult, setResendResult] = useState(null)
  const [stripe, setStripe] = useState(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setDbError(true)
        else setStats(d)
        setLoading(false)
      })
      .catch(() => { setDbError(true); setLoading(false) })

    fetch('/api/admin/stripe-stats')
      .then(r => r.json())
      .then(d => { if (!d.error) setStripe(d) })
      .catch(() => {})
  }, [])

  async function setupDb() {
    setSettingUp(true)
    const r = await fetch('/api/admin/setup-db', { method: 'POST' })
    const d = await r.json()
    if (d.ok) {
      setSetupMsg('Tables created! Reloading…')
      setTimeout(() => window.location.reload(), 1400)
    } else {
      setSetupMsg(`Error: ${d.error}`)
      setSettingUp(false)
    }
  }

  async function syncMailchimp() {
    setSyncing(true)
    setSyncResult(null)
    const r = await fetch('/api/admin/sync-mailchimp', { method: 'POST' })
    const d = await r.json()
    setSyncing(false)
    setSyncResult(d)
    if (d.ok) {
      // Refresh stats after sync
      fetch('/api/admin/stats').then(r => r.json()).then(d => { if (!d.error) setStats(d) })
    }
  }

  async function syncResend() {
    setSyncingResend(true)
    setResendResult(null)
    const r = await fetch('/api/admin/sync-resend', { method: 'POST' })
    const d = await r.json()
    setSyncingResend(false)
    setResendResult(d)
  }

  return (
    <AdminLayout title="Overview">
      {/* DB setup banner */}
      {dbError && (
        <div className="mb-6 flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <svg width="18" height="18" className="text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-900 text-sm">Database not initialized</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Click "Set up" to create the subscribers and campaigns tables in your Vercel Postgres database.
            </p>
            {setupMsg && <p className="text-amber-800 text-xs mt-1 font-medium">{setupMsg}</p>}
          </div>
          <button
            onClick={setupDb}
            disabled={settingUp}
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-60"
          >
            {settingUp ? 'Setting up…' : 'Set up database'}
          </button>
        </div>
      )}

      {/* Always-visible DB migration button */}
      {!dbError && (
        <div className="mb-5 flex justify-end">
          <button
            onClick={setupDb}
            disabled={settingUp}
            className="text-xs font-semibold border border-gray-200 bg-white px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            {settingUp ? 'Running…' : setupMsg || 'Run DB migrations'}
          </button>
        </div>
      )}

      {/* Welcome */}
      <div className="mb-7">
        <h2 className="text-gray-900 font-black text-2xl">
          Welcome back 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening with your community list.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard
          label="Active subscribers"
          value={stats?.total?.toLocaleString()}
          sub="On your mailing list"
          gradient="linear-gradient(135deg, #1a2744, #2d4a8a)"
          loading={loading}
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="New this month"
          value={stats?.thisMonth?.toLocaleString()}
          sub={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          gradient="linear-gradient(135deg, #059669, #10b981)"
          loading={loading}
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          }
        />
        <StatCard
          label="Phone numbers"
          value={stats?.phones?.toLocaleString()}
          sub="Ready for SMS"
          gradient="linear-gradient(135deg, #7c3aed, #a855f7)"
          loading={loading}
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />
        <StatCard
          label="Campaigns sent"
          value={stats?.campaigns?.toLocaleString()}
          sub="All time"
          gradient="linear-gradient(135deg, #e85d04, #f97316)"
          loading={loading}
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          }
        />
      </div>

      {/* Stripe revenue */}
      <div className="mb-6 md:mb-8">
        <h3 className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-3">Donations</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Total raised', value: stripe ? fmtMoney(stripe.totalRaised) : null, sub: 'Last 100 donations', color: 'linear-gradient(135deg,#059669,#10b981)' },
            { label: 'This month', value: stripe ? fmtMoney(stripe.thisMonth) : null, sub: new Date().toLocaleString('default', { month: 'long' }), color: 'linear-gradient(135deg,#e85d04,#f97316)' },
            { label: 'Donors', value: stripe?.donorCount ?? null, sub: 'Unique donors', color: 'linear-gradient(135deg,#1a2744,#2d4a8a)' },
            { label: 'Recurring', value: stripe?.recurring ?? null, sub: 'Monthly supporters', color: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
          ].map(({ label, value, sub, color }) => (
            <Link key={label} href="/dashboard/donors" className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-7 h-7 rounded-lg mb-3" style={{ background: color }} />
              <p className="text-2xl font-black text-gray-900">
                {loading || (!stripe && !dbError) ? <span className="text-gray-200 text-xl">—</span> : (value ?? '—')}
              </p>
              <p className="text-gray-500 text-xs font-medium mt-0.5">{label}</p>
              <p className="text-gray-400 text-xs">{sub}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h3 className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-3">Quick actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              href: '/dashboard/campaigns',
              label: 'Send Email Campaign',
              desc: 'Compose and send to all subscribers',
              gradient: 'linear-gradient(135deg, #e85d04, #f97316)',
              icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              ),
            },
            {
              href: '/dashboard/subscribers',
              label: 'Manage Subscribers',
              desc: 'View, search, and export your list',
              gradient: 'linear-gradient(135deg, #1a2744, #243660)',
              icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
            },
            {
              href: '/dashboard/subscribers?import=1',
              label: 'Import Contacts',
              desc: 'Upload a CSV with emails & phones',
              gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              ),
            },
          ].map(({ href, label, desc, gradient, icon }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ background: gradient }}
              >
                {icon}
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm group-hover:text-[#e85d04] transition-colors">
                  {label}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mailchimp sync */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-gray-800 font-bold text-sm">Sync from Mailchimp</h3>
            <p className="text-gray-400 text-xs mt-1">
              Import all existing Mailchimp subscribers into your database. Safe to run multiple times — duplicates are skipped.
            </p>
            {syncResult && (
              <div className={`mt-3 text-xs font-medium ${syncResult.ok ? 'text-green-600' : 'text-red-600'}`}>
                {syncResult.ok
                  ? `✓ ${syncResult.imported} imported, ${syncResult.skipped} skipped (${syncResult.total} total in Mailchimp)`
                  : `Error: ${syncResult.error}`}
              </div>
            )}
          </div>
          <button
            onClick={syncMailchimp}
            disabled={syncing || dbError}
            className="shrink-0 flex items-center gap-2 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            {syncing ? (
              <>
                <svg className="animate-spin" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Syncing…
              </>
            ) : (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Sync Mailchimp
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-gray-800 font-bold text-sm">Sync database to Resend</h3>
            <p className="text-gray-400 text-xs mt-1">
              Push every subscriber in your database into Resend so broadcasts reach newly imported contacts too.
            </p>
            {resendResult && (
              <div className={`mt-3 text-xs font-medium ${resendResult.ok ? 'text-green-600' : 'text-red-600'}`}>
                {resendResult.ok
                  ? `✓ ${resendResult.synced} synced, ${resendResult.skipped} skipped (${resendResult.total} total in database)`
                  : `Error: ${resendResult.error}`}
              </div>
            )}
          </div>
          <button
            onClick={syncResend}
            disabled={syncingResend || dbError}
            className="shrink-0 flex items-center gap-2 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
          >
            {syncingResend ? (
              <>
                <svg className="animate-spin" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Syncing…
              </>
            ) : (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Sync Resend
              </>
            )}
          </button>
        </div>
      </div>

    </AdminLayout>
  )
}
