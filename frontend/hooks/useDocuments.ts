'use client'
import { useState, useCallback } from 'react'
import { documentAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export function useDocuments() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })

  const fetchDocuments = useCallback(async (params?: { page?: number; limit?: number; type?: string }) => {
    setLoading(true)
    try {
      const res = await documentAPI.getAll(params)
      setDocuments(res.data.documents)
      setPagination(res.data.pagination)
    } catch {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteDocument = useCallback(async (id: string) => {
    try {
      await documentAPI.delete(id)
      setDocuments(prev => prev.filter(d => d._id !== id))
      toast.success('Document deleted')
      return true
    } catch {
      toast.error('Failed to delete document')
      return false
    }
  }, [])

  return { documents, loading, pagination, fetchDocuments, deleteDocument }
}
