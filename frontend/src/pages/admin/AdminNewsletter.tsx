import { useState, useEffect } from 'react'
import { Search, Trash2, AlertTriangle, Mail, Download, Users } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { adminFetchNewsletter, adminDeleteSubscriber } from '../../services/api'

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setSubscribers(await adminFetchNewsletter()) }
    catch { toast.error('Failed to load subscribers') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try { await adminDeleteSubscriber(deleteTarget.id); toast.success('Subscriber removed'); setDeleteTarget(null); load() }
    catch { toast.error('Failed to remove subscriber') }
    finally { setDeleting(false) }
  }

  const exportCSV = () => {
    const rows = ['Email,Date Subscribed', ...filtered.map(s => `${s.email},${new Date(s.subscribed_at).toLocaleDateString()}`)].join('\n')
    const blob = new Blob([rows], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `kowope-newsletter-${Date.now()}.csv`
    a.click()
    toast.success(`Exported ${filtered.length} subscribers`)
  }

  const thisMonth = subscribers.filter(s => {
    const d = new Date(s.subscribed_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-earth">Newsletter Subscribers</h1>
          <p className="text-grey-500 text-sm mt-1">View and manage your email list.</p>
        </div>
        <button onClick={exportCSV} disabled={filtered.length === 0}
          className="flex items-center gap-2 px-6 py-3 border border-gold text-gold rounded-xl text-sm font-bold hover:bg-gold/10 transition-colors disabled:opacity-40">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Users size={24} />, label: 'Total Subscribers', value: subscribers.length, color: 'text-earth' },
          { icon: <Mail size={24} />, label: 'New This Month', value: thisMonth, color: 'text-gold' },
          { icon: <Users size={24} />, label: 'Showing (filtered)', value: filtered.length, color: 'text-grey-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-grey-200 p-6 flex items-center gap-5 shadow-sm">
            <div className={`p-3 bg-gold/10 rounded-xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-earth">{s.value}</p>
              <p className="text-xs text-grey-500 font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white p-5 rounded-2xl border border-grey-200 shadow-sm">
        <div className="flex items-center gap-3 bg-grey-100 px-4 py-3 rounded-xl border border-grey-200 max-w-md">
          <Search size={16} className="text-grey-500 shrink-0" />
          <input placeholder="Search by email..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm w-full focus:outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-grey-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-grey-100 text-grey-500 text-[10px] uppercase font-bold tracking-widest">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4">Date Subscribed</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {loading ? Array(5).fill(0).map((_, i) => (
              <tr key={i} className="animate-pulse">{Array(4).fill(0).map((__, j) => <td key={j} className="px-6 py-5"><div className="h-4 bg-grey-100 rounded w-2/3" /></td>)}</tr>
            )) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-20 text-center">
                <Mail size={36} className="mx-auto text-grey-200 mb-3" />
                <p className="text-grey-500 text-sm">{search ? 'No matches found.' : 'No subscribers yet.'}</p>
              </td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id} className="hover:bg-grey-100/30 group transition-all">
                <td className="px-6 py-4 text-xs text-grey-400 font-bold">{i + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">
                      {s.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-earth">{s.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-grey-500">
                  {s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setDeleteTarget(s)} className="opacity-0 group-hover:opacity-100 p-2 text-grey-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t bg-grey-100/20 text-xs text-grey-500 font-semibold">
            {filtered.length} subscriber{filtered.length !== 1 ? 's' : ''} {search && `matching "${search}"`}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-earth/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto"><AlertTriangle size={28} className="text-red-500" /></div>
            <h3 className="text-xl font-bold text-earth">Remove Subscriber?</h3>
            <p className="text-sm text-grey-700">Unsubscribe <strong>{deleteTarget.email}</strong> from the mailing list?</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-grey-200 rounded-xl text-sm font-bold hover:border-gold">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-60">{deleting ? 'Removing...' : 'Remove'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminNewsletter
