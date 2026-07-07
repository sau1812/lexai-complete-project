'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scale, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { authAPI } from '@/lib/api'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

const perks = [
  'AI-powered contract analysis',
  'Fake document detection',
  'Unlimited upload history',
  'Risk & benefit visualization',
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all fields')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      Cookies.set('lexai_token', res.data.token, { expires: 7 })
      toast.success(`Welcome to LexAI, ${res.data.user.name}!`)
      router.push('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-2/5 bg-navy flex-col justify-between p-12 border-r border-gold/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
            <Scale size={18} className="text-navy" />
          </div>
          <span className="font-serif text-xl font-bold text-gold">LexAI</span>
        </div>

        <div>
          <h2 className="font-serif text-4xl font-bold text-cream leading-tight mb-4">
            Legal intelligence,<br />
            <span className="text-gold">made simple.</span>
          </h2>
          <p className="text-cream/50 text-sm leading-relaxed mb-8">
            Join thousands of professionals who trust LexAI to decode complex legal language and protect their interests.
          </p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3 text-sm text-cream/70">
                <CheckCircle2 size={15} className="text-gold flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>

        <p className="text-cream/20 text-xs">Free plan · No credit card required</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center">
                <Scale size={18} className="text-gold" />
              </div>
              <span className="font-serif text-xl font-bold text-navy">LexAI</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl font-bold text-navy mb-1">Create account</h1>
          <p className="text-gray-400 text-sm mb-8">Start analyzing legal documents for free</p>

          <div className="bg-white rounded-2xl border border-gold/20 shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full border border-gold/20 rounded-xl px-4 py-3 text-sm text-navy placeholder-gray-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full border border-gold/20 rounded-xl px-4 py-3 text-sm text-navy placeholder-gray-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full border border-gold/20 rounded-xl px-4 py-3 pr-10 text-sm text-navy placeholder-gray-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gold"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full border border-gold/20 rounded-xl px-4 py-3 text-sm text-navy placeholder-gray-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy text-gold border border-gold/40 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest hover:bg-navy-mid transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account...</> : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gold/10 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-gold-dark font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
