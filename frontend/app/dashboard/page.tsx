'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StatCard from '@/components/ui/StatCard'
import EmptyState from '@/components/ui/EmptyState'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import { dashboardAPI, documentAPI } from '@/lib/api'
import { formatDate, getRiskColor, getRiskLabel, getTypeColor, getVerdict, truncate } from '@/lib/utils'
import { FileText, TrendingUp, AlertTriangle, ShieldCheck, Trash2, Eye, Plus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    try {
      const [statsRes, docsRes] = await Promise.all([
        dashboardAPI.stats(),
        documentAPI.getAll({ limit: 20 }),
      ])
      setStats(statsRes.data)
      setDocuments(docsRes.data.documents)
    } catch (err) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return
    setDeleting(id)
    try {
      await documentAPI.delete(id)
      toast.success('Document deleted')
      setDocuments((prev) => prev.filter((d) => d._id !== id))
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <DashboardSkeleton />
    </div>
  )

  const statCards = [
    { label: 'Total Analyzed', val: stats?.totalDocuments || 0, icon: FileText, color: '#0D1B2A' },
    { label: 'Risks Flagged', val: stats?.totalRisks || 0, icon: AlertTriangle, color: '#E74C3C' },
    { label: 'Benefits Found', val: stats?.totalBenefits || 0, icon: TrendingUp, color: '#27AE60' },
    { label: 'Verified Docs', val: stats?.verifiedDocs || 0, icon: ShieldCheck, color: '#2980B9' },
  ]

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-3xl font-bold text-navy">My Documents</h1>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 bg-navy text-gold border border-gold/40 px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-navy-mid transition-all"
          >
            <Plus size={14} />
            New Analysis
          </button>
        </div>
        <p className="text-gray-400 text-sm mb-8">Your document analysis history and insights</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Analyzed" value={stats?.totalDocuments || 0} icon={FileText} color="#0D1B2A" />
          <StatCard label="Risks Flagged" value={stats?.totalRisks || 0} icon={AlertTriangle} color="#E74C3C" />
          <StatCard label="Benefits Found" value={stats?.totalBenefits || 0} icon={TrendingUp} color="#27AE60" />
          <StatCard label="Verified Docs" value={stats?.verifiedDocs || 0} icon={ShieldCheck} color="#2980B9" />
        </div>

        {/* Avg risk score banner */}
        {stats?.totalDocuments > 0 && (
          <div className="bg-navy rounded-xl border border-gold/20 px-6 py-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-cream/50 text-xs uppercase tracking-widest mb-1">Average Risk Score</p>
              <p className="font-serif text-2xl font-bold" style={{ color: getRiskColor(stats.avgRiskScore) }}>
                {stats.avgRiskScore} / 100
              </p>
            </div>
            <div className="text-right">
              <p className="text-cream/50 text-xs uppercase tracking-widest mb-1">Opportunities Found</p>
              <p className="font-serif text-2xl font-bold text-gold">{stats?.totalOpportunities || 0}</p>
            </div>
            <div className="text-right">
              <p className="text-cream/50 text-xs uppercase tracking-widest mb-1">Suspicious Docs</p>
              <p className="font-serif text-2xl font-bold text-red-400">{stats?.suspiciousDocs || 0}</p>
            </div>
          </div>
        )}

        {/* History Table */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gold/15">
            <EmptyState
              icon="📂"
              title="No documents yet"
              description="Upload your first legal document to get started with AI-powered analysis."
              action={
                <button
                  onClick={() => router.push('/')}
                  className="bg-navy text-gold border border-gold/40 px-5 py-2 rounded-lg text-sm font-semibold"
                >
                  Upload Document
                </button>
              }
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gold/15 overflow-hidden">
            <table className="w-full">
              <thead className="bg-navy">
                <tr>
                  {['Document', 'Type', 'Date', 'Risk Score', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const typeColor = getTypeColor(doc.documentType)
                  const verdict = getVerdict(doc.verification?.verdict)
                  return (
                    <tr key={doc._id} className="border-b border-gold/10 hover:bg-gold/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-gold flex-shrink-0" />
                          <span className="font-medium text-navy text-sm">{truncate(doc.originalName, 32)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                          style={{ background: typeColor.bg, color: typeColor.text }}>
                          {doc.documentType}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{formatDate(doc.createdAt)}</td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-sm" style={{ color: getRiskColor(doc.riskScore) }}>
                          {doc.riskScore}/100
                        </span>
                        <span className="text-xs text-gray-400 ml-1">({getRiskLabel(doc.riskScore)})</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium" style={{ color: verdict.color }}>{verdict.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/analyze/${doc._id}`)}
                            className="flex items-center gap-1.5 text-xs bg-navy/5 hover:bg-navy text-navy hover:text-gold border border-navy/10 px-3 py-1.5 rounded-lg transition-all font-medium"
                          >
                            <Eye size={12} /> View
                          </button>
                          <button
                            onClick={() => handleDelete(doc._id)}
                            disabled={deleting === doc._id}
                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                          >
                            {deleting === doc._id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
