'use client'
import { CheckCircle2, XCircle, AlertCircle, Shield } from 'lucide-react'

interface Verification {
  structureValid: boolean
  requiredFieldsPresent: boolean
  formatConsistent: boolean
  suspiciousPatterns: boolean
  idFormatValid?: boolean | null
  verdict: 'authentic' | 'suspicious' | 'unclear'
  verdictText: string
}

export default function VerificationPanel({ verification }: { verification: Verification }) {
  const checks = [
    {
      label: 'Document structure is valid',
      pass: verification.structureValid,
      note: verification.structureValid ? 'Structure OK' : 'Invalid structure',
    },
    {
      label: 'All required fields present',
      pass: verification.requiredFieldsPresent,
      note: verification.requiredFieldsPresent ? 'All found' : 'Missing fields',
    },
    {
      label: 'Format is consistent',
      pass: verification.formatConsistent,
      note: verification.formatConsistent ? 'Consistent' : 'Inconsistency detected',
    },
    {
      label: 'No suspicious patterns',
      pass: !verification.suspiciousPatterns,
      note: !verification.suspiciousPatterns ? 'Clean' : 'Patterns flagged',
    },
  ]

  if (verification.idFormatValid !== null && verification.idFormatValid !== undefined) {
    checks.push({
      label: 'ID format (Aadhaar/PAN) valid',
      pass: verification.idFormatValid,
      note: verification.idFormatValid ? 'Valid format' : 'Invalid ID format',
    })
  }

  const verdictStyles = {
    authentic: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      icon: <CheckCircle2 size={20} className="text-green-600" />,
      title: 'Document appears authentic',
      titleColor: 'text-green-700',
    },
    suspicious: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      icon: <XCircle size={20} className="text-red-600" />,
      title: 'Suspicious patterns detected',
      titleColor: 'text-red-700',
    },
    unclear: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      icon: <AlertCircle size={20} className="text-yellow-600" />,
      title: 'Verdict is unclear',
      titleColor: 'text-yellow-700',
    },
  }

  const vs = verdictStyles[verification.verdict] || verdictStyles.unclear

  return (
    <div className="space-y-4">
      {/* Checks list */}
      <div className="bg-white rounded-xl border border-gold/15 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center">
            <Shield size={20} className="text-navy" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-navy text-lg">Document Verification</h3>
            <p className="text-xs text-gray-400">Pattern-based authenticity check</p>
          </div>
        </div>

        <div className="space-y-2">
          {checks.map((check, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                check.pass
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {check.pass ? (
                <CheckCircle2 size={16} className="flex-shrink-0" />
              ) : (
                <XCircle size={16} className="flex-shrink-0" />
              )}
              <span className="flex-1">{check.label}</span>
              <span className="text-xs opacity-70">{check.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verdict */}
      <div
        className={`${vs.bg} border-l-4 ${vs.border} rounded-xl p-5`}
      >
        <div className="flex items-center gap-3 mb-2">
          {vs.icon}
          <h4 className={`font-semibold ${vs.titleColor}`}>{vs.title}</h4>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{verification.verdictText}</p>
        <p className="text-xs text-gray-400 mt-3">
          ⚠ Note: This is pattern-based detection only. For legal verification, consult a certified professional.
        </p>
      </div>
    </div>
  )
}
