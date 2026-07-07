'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scale, Eye, EyeOff, Loader2 } from 'lucide-react'
import { authAPI } from '@/lib/api'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      Cookies.set('lexai_token', res.data.token, { expires: 7 })
      toast.success(`Welcome back, ${res.data.user.name}!`)
      router.push('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg">
              <Scale size={20} className="text-navy" />
            </div>
            <span className="font-serif text-2xl font-bold text-navy">LexAI</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to your legal dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gold/20 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
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
                  placeholder="••••••••"
                  className="w-full border border-gold/20 rounded-xl px-4 py-3 pr-10 text-sm text-navy placeholder-gray-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gold transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-gold border border-gold/40 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest hover:bg-navy-mid transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gold/10 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-gold-dark font-semibold hover:underline">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 text-center text-xs text-gray-400">
          Demo: <span className="font-mono">demo@lexai.com</span> / <span className="font-mono">demo1234</span>
        </div>
      </div>
    </div>
  )
}
