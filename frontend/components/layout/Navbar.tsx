'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Scale, LayoutDashboard, Upload, LogOut, User, ShieldCheck } from 'lucide-react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useLang } from '@/lib/LanguageContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { lang, setLang, t } = useLang()

  const logout = () => {
    Cookies.remove('lexai_token')
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const navLinks = [
    { href: '/',          label: t('contractAnalysis'), icon: Upload },
    { href: '/verify',    label: t('govVerification'),  icon: ShieldCheck },
    { href: '/dashboard', label: t('dashboard'),        icon: LayoutDashboard },
  ]

  return (
    <nav className="bg-navy border-b border-gold/20 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
          <Scale size={16} className="text-navy" />
        </div>
        <span className="font-serif text-gold text-xl font-bold tracking-wide">LexAI</span>
      </Link>

      <div className="flex items-center gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === href
                ? 'text-gold bg-gold/10 border border-gold/30'
                : 'text-cream/60 hover:text-gold hover:bg-gold/10'
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher lang={lang} setLang={setLang} />
        <Link href="/profile" className="text-cream/60 hover:text-gold transition-colors">
          <User size={16} />
        </Link>
        <button onClick={logout} className="text-cream/50 hover:text-red-400 transition-colors">
          <LogOut size={15} />
        </button>
      </div>
    </nav>
  )
}