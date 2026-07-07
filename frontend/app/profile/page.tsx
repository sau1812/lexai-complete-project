'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { authAPI } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { User, Mail, Calendar, FileText, Crown, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authAPI.me()
      .then(res => setUser(res.data.user))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <Loader2 size={28} className="animate-spin text-gold" />
      </div>
    </div>
  )

  const planColors: Record<string, { bg: string; text: string }> = {
    free: { bg: '#F2F3F4', text: '#717D7E' },
    pro: { bg: '#FEF9E7', text: '#7D6608' },
    enterprise: { bg: '#EAF4EE', text: '#1E8449' },
  }
  const plan = planColors[user?.plan] || planColors.free

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-bold text-navy mb-8">My Profile</h1>

        {/* Avatar Card */}
        <div className="bg-white rounded-2xl border border-gold/20 p-8 mb-5">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-navy flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-3xl font-bold text-gold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy">{user?.name}</h2>
              <span
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mt-1"
                style={{ background: plan.bg, color: plan.text }}
              >
                <Crown size={10} />
                {user?.plan} plan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Mail, label: 'Email', val: user?.email },
              { icon: Calendar, label: 'Member since', val: user?.createdAt ? formatDate(user.createdAt) : '—' },
              { icon: FileText, label: 'Documents analyzed', val: user?.documentsAnalyzed || 0 },
              { icon: User, label: 'Account ID', val: user?._id?.slice(-8).toUpperCase() },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-cream rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={13} className="text-gold" />
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</span>
                </div>
                <p className="text-navy font-medium text-sm truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Card */}
        <div className="bg-navy rounded-2xl border border-gold/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold text-cream mb-1">Current Plan: {user?.plan?.toUpperCase()}</h3>
              <p className="text-cream/40 text-sm">
                {user?.plan === 'free'
                  ? 'Upgrade to Pro for unlimited analyses and priority support.'
                  : 'Thank you for being a valued subscriber!'}
              </p>
            </div>
            {user?.plan === 'free' && (
              <button className="flex-shrink-0 bg-gold text-navy font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all uppercase tracking-wide">
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
