'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { verifyAPI } from '@/lib/api'
import {
  ShieldCheck, Upload, FileText, X, Loader2,
  CheckCircle2, XCircle, AlertCircle, Info,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatFileSize } from '@/lib/utils'

const DOC_TYPES = ['🪪 Aadhaar Card', '🗂 PAN Card', '🛂 Passport', '🗳 Voter ID', '🚗 Driving License', '📄 Other Gov Doc']

const STEPS = [
  'Uploading document...',
  'Running OCR text extraction...',
  'Checking document format...',
  'Verifying ID patterns...',
  'Generating verdict...',
]

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState('')
  const [result, setResult] = useState<any>(null)

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) { setFile(accepted[0]); setResult(null) }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => toast.error('Only PDF, JPG, PNG allowed. Max 10MB.'),
  })

  const handleVerify = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    setProgress(0)

    let si = 0
    const interval = setInterval(() => {
      setStep(STEPS[si] || 'Finalizing...')
      si++
    }, 1200)

    try {
      const res = await verifyAPI.upload(file, setProgress)
      clearInterval(interval)
      setResult(res.data)
      toast.success('Verification complete!')
    } catch (err: any) {
      clearInterval(interval)
      toast.error(err.response?.data?.error || 'Verification failed.')
    } finally {
      setLoading(false)
      setStep('')
      setProgress(0)
    }
  }

  const reset = () => { setFile(null); setResult(null) }

  const verdictStyle = result ? {
    authentic: { bg: 'bg-green-50', border: 'border-green-400', icon: <CheckCircle2 className="text-green-600" size={28} />, title: 'Document Appears Authentic', color: 'text-green-700' },
    suspicious: { bg: 'bg-yellow-50', border: 'border-yellow-400', icon: <AlertCircle className="text-yellow-600" size={28} />, title: 'Suspicious — Manual Review Needed', color: 'text-yellow-700' },
    fake: { bg: 'bg-red-50', border: 'border-red-400', icon: <XCircle className="text-red-600" size={28} />, title: 'Document Likely Fake', color: 'text-red-700' },
    unclear: { bg: 'bg-blue-50', border: 'border-blue-400', icon: <Info className="text-blue-600" size={28} />, title: 'Verdict Unclear', color: 'text-blue-700' },
  }[result.result?.verdict as string] || null : null

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-navy text-gold border border-gold/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            <ShieldCheck size={12} /> Government Document Verification
          </div>
          <h1 className="font-serif text-4xl font-bold text-navy mb-3">
            Verify <span className="text-gold-dark">Gov Documents</span>
          </h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed">
            Upload Aadhaar, PAN, Passport, Voter ID or any government document. AI checks format, ID patterns and flags suspicious content.
          </p>
        </div>

        {/* Supported types */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {DOC_TYPES.map(t => (
            <span key={t} className="text-xs text-gray-400 bg-white border border-gold/15 px-3 py-1.5 rounded-full">{t}</span>
          ))}
        </div>

        {/* Upload Zone */}
        {!result && (
          <div className="mb-6">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                  ${isDragActive ? 'border-gold bg-gold/5' : 'border-gold/30 bg-white hover:border-gold hover:shadow-lg'}`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={28} className="text-gold" />
                </div>
                <h3 className="text-navy font-semibold text-lg mb-1">
                  {isDragActive ? 'Drop document here' : 'Upload Government Document'}
                </h3>
                <p className="text-gray-400 text-sm mb-4">PDF, JPG, PNG · Max 10MB</p>
                <button className="inline-flex items-center gap-2 bg-navy text-gold border border-gold/40 px-6 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide">
                  <Upload size={14} /> Choose File
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gold/20 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <FileText size={22} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy truncate">{file.name}</p>
                    <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                  {!loading && (
                    <button onClick={reset} className="text-gray-300 hover:text-red-400 transition-colors">
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Progress */}
                {loading && (
                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400 flex items-center gap-2">
                        <Loader2 size={13} className="animate-spin" /> {step}
                      </span>
                      <span className="font-medium text-navy">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-navy text-gold border border-gold/40 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide hover:bg-navy-mid disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading
                      ? <><Loader2 size={15} className="animate-spin" /> Verifying...</>
                      : <><ShieldCheck size={15} /> Verify Document</>}
                  </button>
                  {!loading && (
                    <button onClick={reset} className="px-4 py-3 rounded-xl border border-gold/20 text-gray-400 hover:text-red-400 text-sm transition-all">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULTS */}
        {result && verdictStyle && (
          <div className="space-y-5 animate-fade-up">
            {/* Verdict Banner */}
            <div className={`${verdictStyle.bg} border-l-4 ${verdictStyle.border} rounded-2xl p-6`}>
              <div className="flex items-center gap-4 mb-2">
                {verdictStyle.icon}
                <h2 className={`font-serif text-2xl font-bold ${verdictStyle.color}`}>
                  {verdictStyle.title}
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed ml-11">
                {result.result?.verdictReason}
              </p>
              <div className="ml-11 mt-3 flex items-center gap-3">
                <span className="text-xs text-gray-400">Authenticity Score:</span>
                <div className="flex-1 max-w-[200px] h-2 bg-white/70 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${result.result?.authenticityScore}%`,
                      background: result.result?.authenticityScore > 70 ? '#27AE60' : result.result?.authenticityScore > 40 ? '#F39C12' : '#E74C3C'
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-navy">{result.result?.authenticityScore}/100</span>
              </div>
            </div>

            {/* Document Info */}
            <div className="bg-white rounded-xl border border-gold/15 p-5">
              <h3 className="font-serif text-lg font-semibold text-navy mb-4">Document Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Document Type', result.result?.documentType],
                  ['Issuing Authority', result.result?.issuingAuthority || 'Not detected'],
                  ['Name', result.result?.detectedFields?.name || 'Not found'],
                  ['Date of Birth', result.result?.detectedFields?.dob || 'Not found'],
                  ['ID Number', result.result?.detectedFields?.idNumber || 'Not found'],
                  ['Issue Date', result.result?.detectedFields?.issueDate || 'Not found'],
                ].map(([label, val]) => (
                  <div key={label} className="bg-cream rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{label}</p>
                    <p className="text-navy text-sm font-medium">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Format Checks */}
            <div className="bg-white rounded-xl border border-gold/15 p-5">
              <h3 className="font-serif text-lg font-semibold text-navy mb-4">Format Checks</h3>
              <div className="space-y-2">
                {Object.entries(result.result?.formatChecks || {}).map(([key, val]) => {
                  const labels: Record<string, string> = {
                    aadhaarFormat: 'Aadhaar 12-digit format valid',
                    panFormat: 'PAN format valid (AAAAA9999A)',
                    hasPhoto: 'Photo present',
                    hasSignature: 'Signature present',
                    hasWatermark: 'Watermark / security feature detected',
                    hasIssuingAuthority: 'Issuing authority mentioned',
                    hasHologramMention: 'Hologram / security seal mentioned',
                  }
                  const pass = val === true
                  const na = val === null
                  return (
                    <div key={key} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${na ? 'bg-gray-50 text-gray-400' : pass ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {na ? <Info size={15} /> : pass ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      <span className="flex-1">{labels[key] || key}</span>
                      <span className="text-xs opacity-60">{na ? 'N/A' : pass ? 'Pass' : 'Fail'}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Suspicious Indicators */}
            {result.result?.suspiciousIndicators?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="font-serif text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <AlertCircle size={18} /> Suspicious Indicators
                </h3>
                <ul className="space-y-2">
                  {result.result.suspiciousIndicators.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                      <span className="mt-1 flex-shrink-0">⚠</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Fields */}
            {result.result?.missingFields?.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h3 className="font-serif text-lg font-semibold text-yellow-700 mb-3">Missing Fields</h3>
                <div className="flex flex-wrap gap-2">
                  {result.result.missingFields.map((f: string, i: number) => (
                    <span key={i} className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {/* Database Match Result */}
{result.result?.databaseMatch !== null && result.result?.databaseMatch !== undefined && (
  <div className={`rounded-xl border p-5 ${
    result.result.databaseMatch.found ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  }`}>
    <h3 className={`font-serif text-lg font-semibold mb-3 flex items-center gap-2 ${
      result.result.databaseMatch.found ? 'text-green-700' : 'text-red-700'
    }`}>
      {result.result.databaseMatch.found ? '✅' : '❌'} Database Verification
    </h3>

    {result.result.databaseMatch.found ? (
      <div className="space-y-2">
        <p className="text-sm text-green-700 font-medium mb-3">Record found in database!</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['Aadhaar', result.result.databaseMatch.fieldMatches?.aadhaar],
            ['Name', result.result.databaseMatch.fieldMatches?.name],
            ['Date of Birth', result.result.databaseMatch.fieldMatches?.dob],
          ].map(([label, match]) => (
            <div key={label as string} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              match === true ? 'bg-green-100 text-green-700' :
              match === false ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {match === true ? '✓' : match === false ? '✗' : '—'} {label as string}
              <span className="ml-auto text-xs opacity-70">
                {match === true ? 'Match' : match === false ? 'Mismatch' : 'Not found'}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-sm text-red-600">
        Aadhaar number <strong>{result.result.databaseMatch.extractedData?.aadhaar}</strong> not found in database.
      </p>
    )}
  </div>
)}

            {/* Disclaimer */}
            <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 text-xs text-gray-400 leading-relaxed">
              ⚠ <strong>Disclaimer:</strong> This is pattern-based AI analysis only. It cannot access government databases. For legal verification, contact the issuing authority directly. Do not rely solely on this result for critical decisions.
            </div>

            {/* Verify Another */}
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 bg-navy text-gold border border-gold/40 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide hover:bg-navy-mid transition-all"
            >
              <Upload size={14} /> Verify Another Document
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}