declare module '*.css'

import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '@/lib/LanguageContext'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'LexAI — Legal Document Analyzer',
  description: 'AI-powered legal document analysis. Detect risks, benefits, and verify authenticity in seconds.',
  keywords: ['legal document', 'contract analysis', 'AI', 'risk detection', 'NDA', 'lease agreement'],
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans bg-cream min-h-screen flex flex-col`}>
        <LanguageProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0D1B2A',
                color: '#F8F4ED',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '8px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#C9A84C', secondary: '#0D1B2A' } },
              error: { iconTheme: { primary: '#E74C3C', secondary: '#F8F4ED' } },
            }}
          />
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}