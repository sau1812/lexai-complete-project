'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, Loader2, Scale } from 'lucide-react'
import { documentAPI } from '@/lib/api'
import { formatFileSize } from '@/lib/utils'
import { useLang } from '@/lib/LanguageContext'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'text/plain': ['.txt'],
}

const STEPS = [
  'Extracting text content...',
  'Identifying document type...',
  'Analyzing clauses...',
  'Detecting red flags...',
  'Generating insights...',
  'Building timeline...',
  'Finalizing report...',
]

export default function UploadZone() {
  const router = useRouter()
  const { lang, t } = useLang()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState('')

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDropRejected: (files) => {
      const err = files[0]?.errors[0]
      if (err?.code === 'file-too-large') toast.error('File too large. Max 10MB.')
      else toast.error('Only PDF, JPG, PNG, TXT files allowed.')
    },
  })

  const handleAnalyze = async () => {
    if (!file) return
    setUploading(true)
    setProgress(0)

    let si = 0
    const interval = setInterval(() => {
      setStep(STEPS[si] || 'Finalizing...')
      si++
    }, 1800)

    try {
      const res = await documentAPI.uploadWithLang(file, lang, setProgress)
      clearInterval(interval)
      toast.success('Document analyzed successfully!')
      router.push(`/analyze/${res.data.document._id}`)
    } catch (err: any) {
      clearInterval(interval)
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
      setStep('')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
            ${isDragActive ? 'border-gold bg-gold/5 scale-[1.01]' : 'border-gold/30 bg-white hover:border-gold hover:shadow-lg'}`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-gold" />
          </div>
          <h3 className="text-navy font-semibold text-lg mb-1">
            {isDragActive ? 'Drop your document here' : t('uploadZoneTitle')}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{t('uploadZoneSub')}</p>
          <button className="inline-flex items-center gap-2 bg-navy text-gold border border-gold/40 px-6 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-navy-mid transition-all">
            <Upload size={14} />
            {t('chooseFile')}
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gold/20 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy truncate">{file.name}</p>
              <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
            </div>
            {!uploading && (
              <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-400 transition-colors">
                <X size={18} />
              </button>
            )}
          </div>

          {uploading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500 flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin" />
                  {step}
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
              onClick={handleAnalyze}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 bg-navy text-gold border border-gold/40 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all hover:bg-navy-mid disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? <><Loader2 size={15} className="animate-spin" /> {t('analyzing')}</>
                : <><Scale size={15} /> {t('analyzeBtn')}</>}
            </button>
            {!uploading && (
              <button onClick={() => setFile(null)}
                className="px-4 py-3 rounded-xl border border-gold/20 text-gray-500 hover:border-red-200 hover:text-red-400 text-sm transition-all">
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {['📋 NDA', '🏠 Lease', '💼 Employment', '🤝 Service', '🏛 Government', '🏦 Loan'].map(ty => (
          <span key={ty} className="text-xs text-gray-400 bg-white border border-gold/10 px-3 py-1.5 rounded-full">{ty}</span>
        ))}
      </div>
    </div>
  )
}