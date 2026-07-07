'use client'
import { useState, useRef, useCallback } from 'react'
import type { Language } from '@/lib/i18n'

// Language code mapping for Web Speech API
const SPEECH_LANG_MAP: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  ta: 'ta-IN',
  te: 'te-IN',
}

export function useVoice(lang: Language) {
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  const speechLang = SPEECH_LANG_MAP[lang]

  // ── Text to Speech ──────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    // Clean text — remove emojis and markdown
    const clean = text
      .replace(/[#*_`~>\[\]]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .trim()

    const chunks = clean.match(/.{1,200}(?:\s|$)/g) || [clean]

    let i = 0
    setSpeaking(true)

    const speakChunk = () => {
      if (i >= chunks.length) { setSpeaking(false); return }
      const utt = new SpeechSynthesisUtterance(chunks[i])
      utt.lang = speechLang
      utt.rate = 0.92
      utt.pitch = 1.05

      // Pick best available voice for language
      const voices = window.speechSynthesis.getVoices()
      const match = voices.find(v => v.lang.startsWith(speechLang.split('-')[0]))
      if (match) utt.voice = match

      utt.onend = () => { i++; speakChunk() }
      utt.onerror = () => { setSpeaking(false) }
      window.speechSynthesis.speak(utt)
    }

    // Voices may not be loaded yet
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speakChunk
    } else {
      speakChunk()
    }
  }, [speechLang])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  // ── Speech to Text ──────────────────────────────────
  const startListening = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser. Use Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = speechLang
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setTranscript(text)
      onResult(text)
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [speechLang])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { speak, stopSpeaking, speaking, startListening, stopListening, listening, transcript }
}