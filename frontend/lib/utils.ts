import { format } from 'date-fns'

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, hh:mm a')
}

export function getRiskColor(score: number): string {
  if (score >= 70) return '#E74C3C'
  if (score >= 40) return '#F39C12'
  return '#27AE60'
}

export function getRiskLabel(score: number): string {
  if (score >= 70) return 'High Risk'
  if (score >= 40) return 'Medium Risk'
  return 'Low Risk'
}

export function getTypeColor(type: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    NDA: { bg: '#EBF5FB', text: '#1A5276' },
    Lease: { bg: '#EAF4EE', text: '#1E8449' },
    Employment: { bg: '#F4ECF7', text: '#6C3483' },
    Service: { bg: '#FEF9E7', text: '#7D6608' },
    Government: { bg: '#EAECEE', text: '#2C3E50' },
    Other: { bg: '#F2F3F4', text: '#717D7E' },
  }
  return map[type] || map['Other']
}

export function getClauseBadge(type: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    risk: { bg: '#FDECEA', text: '#C0392B' },
    benefit: { bg: '#EAF4EE', text: '#1E8449' },
    opportunity: { bg: '#EBF5FB', text: '#1A5276' },
    neutral: { bg: '#FEF9E7', text: '#7D6608' },
  }
  return map[type] || map['neutral']
}

export function getVerdict(verdict: string): { label: string; color: string } {
  if (verdict === 'authentic') return { label: '✓ Verified', color: '#27AE60' }
  if (verdict === 'suspicious') return { label: '⚠ Suspicious', color: '#E74C3C' }
  return { label: '? Unclear', color: '#F39C12' }
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.substring(0, n) + '...' : str
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
