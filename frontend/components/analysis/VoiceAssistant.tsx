'use client'
import { useState } from 'react'
import { Volume2, VolumeX, Mic, MicOff, Send, Bot, Loader2 } from 'lucide-react'
import { useVoice } from '@/hooks/useVoice'
import { useLang } from '@/lib/LanguageContext'

interface Message {
  role: 'user' | 'ai'
  text: string
}

interface Props {
  summary: string
  clauses: any[]
  docType: string
}

export default function VoiceAssistant({ summary, clauses, docType }: Props) {
  // Always use global lang from context — auto updates when language changes
  const { lang, t } = useLang()
  const { speak, stopSpeaking, speaking, startListening, stopListening, listening } = useVoice(lang)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const askAI = async (question: string) => {
    if (!question.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    try {
      const context = `Document Type: ${docType}\nSummary: ${summary}\n\nClauses:\n${
        clauses.map(c => `${c.title} (${c.type}): ${c.text}`).join('\n')
      }`

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const cookieMatch = document.cookie.match(/lexai_token=([^;]+)/)
      const token = cookieMatch ? cookieMatch[1] : ''

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question, context, lang }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      const answer = data.answer
      setMessages(prev => [...prev, { role: 'ai', text: answer }])
      speak(answer)
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error getting answer. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (listening) { stopListening(); return }
    startListening((text) => { setInput(text); askAI(text) })
  }

  const handleSpeak = () => {
    if (speaking) { stopSpeaking(); return }
    speak(summary)
  }

  return (
    <div className="bg-white rounded-xl border border-gold/15 overflow-hidden">
      {/* Header */}
      <div className="bg-navy px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-gold" />
          <span className="text-gold font-semibold text-sm">Voice Assistant</span>
          {speaking && (
            <span className="flex items-center gap-1 text-gold/60 text-xs">
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
              {t('speaking')}
            </span>
          )}
        </div>
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${
            speaking
              ? 'bg-gold/20 text-gold border-gold/40'
              : 'text-cream/60 border-cream/10 hover:text-gold hover:border-gold/30'
          }`}
        >
          {speaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
          {speaking ? t('stopListening') : t('listenToSummary')}
        </button>
      </div>

      {/* Chat messages */}
      <div className="h-48 overflow-y-auto p-4 space-y-3 bg-cream/30">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            <Bot size={28} className="mx-auto mb-2 text-gray-200" />
            {t('askQuestion')} 👇
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-navy text-gold rounded-br-sm'
                : 'bg-white border border-gold/15 text-navy rounded-bl-sm shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gold/15 px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm">
              <Loader2 size={14} className="animate-spin text-gold" />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-gold/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && askAI(input)}
          placeholder={t('voicePlaceholder')}
          className="flex-1 bg-cream border border-gold/20 rounded-lg px-3 py-2 text-sm text-navy placeholder-gray-300 focus:outline-none focus:border-gold transition-all"
        />
        <button
          onClick={handleVoiceInput}
          className={`p-2 rounded-lg border transition-all ${
            listening
              ? 'bg-red-50 border-red-300 text-red-500 animate-pulse'
              : 'border-gold/20 text-gray-400 hover:text-gold hover:border-gold/40'
          }`}
        >
          {listening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        <button
          onClick={() => askAI(input)}
          disabled={!input.trim() || loading}
          className="p-2 rounded-lg bg-navy text-gold border border-gold/40 hover:bg-navy-mid disabled:opacity-40 transition-all"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}