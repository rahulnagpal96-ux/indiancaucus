import { buildWelcomeEmail } from '../../lib/welcomeEmail'
import AdminLayout from '../../components/AdminLayout'

export async function getServerSideProps() {
  return { props: { html: buildWelcomeEmail('Jane') } }
}

export default function EmailPreview({ html }) {
  return (
    <AdminLayout title="Welcome Email Preview">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-gray-500 text-sm">This is exactly what new subscribers receive. Rendered at full email width (600px).</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Live template</span>
        </div>
      </div>

      {/* Subject preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 mb-4 flex items-center gap-3">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide shrink-0">Subject</span>
        <span className="text-gray-800 text-sm font-medium">Welcome to Indian Caucus of Secaucus</span>
      </div>

      {/* Email render */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-gray-400 text-xs ml-2 font-mono">welcome email · from: newsletter@indiancaucusofsecaucus.org</span>
        </div>
        <div
          className="w-full overflow-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </AdminLayout>
  )
}
