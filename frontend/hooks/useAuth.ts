'use client'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { authAPI } from '@/lib/api'

interface User {
  _id: string
  name: string
  email: string
  plan: string
  documentsAnalyzed: number
  createdAt: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('lexai_token')
    if (!token) {
      setLoading(false)
      return
    }
    authAPI.me()
      .then(res => setUser(res.data.user))
      .catch(() => Cookies.remove('lexai_token'))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    Cookies.remove('lexai_token')
    setUser(null)
    window.location.href = '/login'
  }

  const isLoggedIn = !!Cookies.get('lexai_token')

  return { user, loading, logout, isLoggedIn }
}
