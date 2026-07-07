'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import ClauseCard from '@/components/analysis/ClauseCard'
import DonutChart from '@/components/charts/DonutChart'
import RiskGauge from '@/components/charts/RiskGauge'
import SeverityBarChart from '@/components/charts/BarChart'
import VerificationPanel from '@/components/verification/VerificationPanel'
import VoiceAssistant from '@/components/analysis/VoiceAssistant'
import { documentAPI } from '@/lib/api'
import { useLanguage } from '@/hooks/useLanguage'
import { formatDate, getRiskColor, getRiskLabel, getTypeColor, formatFileSize } from '@/lib/utils'
import {
  FileText, AlertTriangle, TrendingUp, Lightbulb,
  ArrowLeft, Loader2, Flag, MessageSquare, Calendar,
  ThumbsUp, ThumbsDown, Minus, CheckSquare
} from 'lucide-react'
import toast from 'react-hot-toast'
import { AnalysisSkeleton } from '@/components/ui/Skeleton'

const TABS = ['summary', 'clauses', 'redFlags', 'negotiation', 'timeline', 'visualize', 'verification']

export default function AnalyzePage() {
  const { id } = useParams()
  const router = useRouter()
  const { lang, t } = useLanguage()
  const [doc, setDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('summary')

  useEffect(() => {
    documentAPI.getOne(id as string)
      .then(res => setDoc(res.data.document))
      .catch(() => { toast.error('Failed to load document'); router.push('/') })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen bg-cream"><Navbar /><AnalysisSkeleton /></div>
  if (!doc) return null

  const riskCount = doc.clauses?.filter((c: any) => c.type === 'risk').length || 0
  const benCount  = doc.clauses?.filter((c: any) => c.type === 'benefit').length || 0
  const oppCount  = doc.clauses?.filter((c: any) => c.type === 'opportunity').length || 0
  const neuCount  = doc.clauses?.filter((c: any) => c.type === 'neutral').length || 0
  const redFlagClauses = doc.clauses?.filter((c: any) => c.redFlag) || []
  const negotiableClauses = doc.clauses?.filter((c: any) => c.negotiable) || []

  const tabLabels: Record<string, string> = {
    summary: t('summary'),
    clauses: t('clauses'),
    redFlags: t('redFlags'),
    negotiation: t('negotiationTips'),
    timeline: t('timeline'),
    visualize: t('visualize'),
    verification: t('verification'),
  }

  const favorIcon = doc.partyFavorability === 'party1'
    ? <ThumbsUp size={14} className="text-green-500" />
    : doc.partyFavorability === 'party2'
    ? <ThumbsDown size={14} className="text-red-400" />
    : <Minus size={14} className="text-gold" />

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)]">

        {/* Sidebar */}
        <aside className="w-72 bg-navy border-r border-gold/15 p-5 flex-shrink-0 overflow-y-auto">
          <button onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-cream/50 hover:text-gold text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> {t('back')}
          </button>

          <div className="bg-white/5 border border-gold/20 rounded-xl p-4 mb-5">
            <FileText size={28} className="text-gold mb-2" />
            <p className="text-cream text-sm font-semibold break-words mb-2">{doc.originalName}</p>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full"
              style={{ background: 'rgba(201,168,76,0.15)', color: '#F0D98C' }}>
              {doc.documentType}
            </span>
          </div>

          {/* Overall Score */}
          <div className="bg-white/5 border border-gold/20 rounded-xl p-4 mb-4 text-center">
            <p className="text-cream/40 text-[10px] uppercase tracking-widest mb-2">Overall Score</p>
            <div className="font-serif text-4xl font-bold mb-1"
              style={{ color: doc.overallScore >= 60 ? '#27AE60' : doc.overallScore >= 40 ? '#F39C12' : '#E74C3C' }}>
              {doc.overallScore || 0}
            </div>
            <p className="text-cream/40 text-xs">out of 100</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {favorIcon}
              <span className="text-cream/50 text-xs capitalize">{doc.partyFavorability}</span>
            </div>
          </div>

          {/* Risk bars */}
          <div className="mb-4">
            <p className="text-cream/40 text-[10px] uppercase tracking-widest mb-2">Risk Analysis</p>
            {[
              { label: t('risksFound'), count: riskCount, color: '#E74C3C' },
              { label: t('benefits'), count: benCount, color: '#27AE60' },
              { label: t('redFlags'), count: redFlagClauses.length, color: '#C0392B' },
            ].map(({ label, count, color }) => {
              const total = doc.clauses?.length || 1
              return (
                <div key={label} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cream/60">{label}</span>
                    <span className="text-cream font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(count / total) * 100}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats */}
          <p className="text-cream/40 text-[10px] uppercase tracking-widest mb-2">Doc Info</p>
          {[
            ['Analyzed', formatDate(doc.createdAt)],
            ['Clauses', doc.clauses?.length || 0],
            ['Risk Level', getRiskLabel(doc.riskScore)],
            ['Red Flags', doc.redFlagCount || 0],
            ['Negotiable', doc.negotiableCount || 0],
            ['Language', doc.language || 'English'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm py-1.5 border-b border-white/5">
              <span className="text-cream/50">{k}</span>
              <span className="text-cream font-medium"
                style={k === 'Risk Level' ? { color: getRiskColor(doc.riskScore) } : k === 'Red Flags' && Number(v) > 0 ? { color: '#E74C3C' } : {}}>
                {String(v)}
              </span>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-4">
            <h1 className="font-serif text-3xl font-bold text-navy">{doc.documentType} Analysis</h1>
            <p className="text-gray-400 text-sm">Analyzed on {formatDate(doc.createdAt)}</p>
            {doc.executiveVerdict && (
              <div className="mt-3 bg-navy/5 border-l-4 border-gold px-4 py-2.5 rounded-r-lg">
                <p className="text-navy font-medium text-sm italic">"{doc.executiveVerdict}"</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mb-6 border-b border-gold/20 overflow-x-auto">
            {TABS.map(t2 => (
              <button key={t2} onClick={() => setTab(t2)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-all flex-shrink-0 ${
                  tab === t2 ? 'border-gold text-navy font-semibold' : 'border-transparent text-gray-400 hover:text-navy'
                }`}>
                {tabLabels[t2]}
                {t2 === 'redFlags' && redFlagClauses.length > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {redFlagClauses.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB: Summary */}
          {tab === 'summary' && (
            <div className="space-y-5 animate-fade-up">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: t('risksFound'), val: riskCount, color: '#E74C3C', icon: AlertTriangle },
                  { label: t('benefits'), val: benCount, color: '#27AE60', icon: TrendingUp },
                  { label: t('opportunities'), val: oppCount, color: '#2980B9', icon: Lightbulb },
                  { label: t('redFlags'), val: redFlagClauses.length, color: '#C0392B', icon: Flag },
                ].map(({ label, val, color, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-xl border border-gold/15 p-4 text-center">
                    <div className="font-serif text-3xl font-bold mb-1" style={{ color }}>{val}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gold/15 border-l-4 border-l-gold p-5">
                <h3 className="font-serif text-lg font-semibold text-navy mb-2">{t('executiveSummary')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{doc.summary}</p>
              </div>

              {/* Voice Assistant */}
              <VoiceAssistant
                summary={doc.summary}
                clauses={doc.clauses || []}
                docType={doc.documentType}
              />

              {/* Top clauses */}
              <div className="space-y-3">
                <h3 className="font-semibold text-navy">Key Clauses</h3>
                {doc.clauses?.slice(0, 3).map((c: any, i: number) => <ClauseCard key={i} clause={c} />)}
              </div>
            </div>
          )}

          {/* TAB: Clauses */}
          {tab === 'clauses' && (
            <div className="space-y-3 animate-fade-up">
              {doc.clauses?.map((c: any, i: number) => <ClauseCard key={i} clause={c} />)}
            </div>
          )}

          {/* TAB: Red Flags */}
          {tab === 'redFlags' && (
            <div className="space-y-4 animate-fade-up">
              {doc.redFlags?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4">
                  <h3 className="font-serif text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <Flag size={18} /> Critical Warnings
                  </h3>
                  <ul className="space-y-2">
                    {doc.redFlags.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                        <span className="mt-0.5 flex-shrink-0">⚠</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {redFlagClauses.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Flag size={32} className="mx-auto mb-2 text-gray-200" />
                  No red flag clauses detected!
                </div>
              ) : (
                redFlagClauses.map((c: any, i: number) => <ClauseCard key={i} clause={c} />)
              )}
            </div>
          )}

          {/* TAB: Negotiation */}
          {tab === 'negotiation' && (
            <div className="space-y-4 animate-fade-up">
              {doc.negotiationTips?.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <h3 className="font-serif text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <MessageSquare size={18} /> {t('negotiationTips')}
                  </h3>
                  <ul className="space-y-2">
                    {doc.negotiationTips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                        <span className="mt-0.5 flex-shrink-0 font-bold">{i + 1}.</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {doc.recommendedActions?.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h3 className="font-serif text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckSquare size={18} /> Recommended Actions Before Signing
                  </h3>
                  <ul className="space-y-2">
                    {doc.recommendedActions.map((a: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <span className="mt-0.5 flex-shrink-0">→</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h3 className="font-semibold text-navy mt-2">Negotiable Clauses ({negotiableClauses.length})</h3>
              {negotiableClauses.map((c: any, i: number) => <ClauseCard key={i} clause={c} />)}
            </div>
          )}

          {/* TAB: Timeline */}
          {tab === 'timeline' && (
            <div className="animate-fade-up">
              {(!doc.timeline || doc.timeline.length === 0) ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar size={32} className="mx-auto mb-2 text-gray-200" />
                  No key dates detected in this document.
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-gold/30 space-y-6">
                  {doc.timeline.map((item: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[29px] w-4 h-4 rounded-full border-2 border-gold bg-white"
                        style={{ background: item.importance === 'high' ? '#E74C3C' : item.importance === 'medium' ? '#F39C12' : '#27AE60' }} />
                      <div className="bg-white rounded-xl border border-gold/15 p-4 ml-2">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-semibold text-navy text-sm">{item.event}</h4>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            item.importance === 'high' ? 'bg-red-50 text-red-600' :
                            item.importance === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                          }`}>{item.importance}</span>
                        </div>
                        {item.date && <p className="text-gold-dark text-sm font-medium mt-1">{item.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Visualize */}
          {tab === 'visualize' && (
            <div className="space-y-5 animate-fade-up">
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-xl border border-gold/15 p-6 flex flex-col items-center">
                  <h3 className="font-serif text-lg font-semibold text-navy mb-4 self-start">Risk Score</h3>
                  <RiskGauge score={doc.riskScore} size={160} />
                </div>
                <div className="bg-white rounded-xl border border-gold/15 p-6">
                  <h3 className="font-serif text-lg font-semibold text-navy mb-1">Distribution</h3>
                  <DonutChart riskCount={riskCount} benefitCount={benCount} opportunityCount={oppCount} neutralCount={neuCount} />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gold/15 p-6">
                <h3 className="font-serif text-lg font-semibold text-navy mb-4">Severity Breakdown</h3>
                <SeverityBarChart data={[
                  { name: 'Critical', value: doc.clauses?.filter((c:any)=>c.type==='risk'&&c.severity===5).length||0, color:'#C0392B' },
                  { name: 'High Risk', value: doc.clauses?.filter((c:any)=>c.type==='risk'&&c.severity===4).length||0, color:'#E74C3C' },
                  { name: 'Red Flags', value: redFlagClauses.length, color:'#E67E22' },
                  { name: 'Benefits', value: benCount, color:'#27AE60' },
                  { name: 'Opps', value: oppCount, color:'#2980B9' },
                  { name: 'Neutral', value: neuCount, color:'#C9A84C' },
                ]} />
              </div>
            </div>
          )}

          {/* TAB: Verification */}
          {tab === 'verification' && doc.verification && (
            <div className="animate-fade-up">
              <VerificationPanel verification={doc.verification} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}