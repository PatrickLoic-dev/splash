import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { I18nProvider } from '@/lib/i18n'
import { CustomCursor } from '@/components/CustomCursor'
import { PageTransition } from '@/components/PageTransition'
import { FooterGate } from '@/components/FooterGate'

export const metadata: Metadata = {
  title: 'Splash — Learn animations that ship',
  description: 'Ten fundamental animation patterns explained in depth and implemented for React, Next.js, Vue, React Native, and Flutter. Production-grade code, no fluff.',
  keywords: ['framer-motion', 'react', 'animation', 'nextjs', 'vue', 'flutter', 'react-native'],
  authors: [{ name: 'Splash' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Splash — Learn animations that ship',
    description: 'Ten fundamental animation patterns for every major platform. Production-grade code.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500,400,300&display=swap" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400,300&display=swap" />
      </head>
      <body>
        <ThemeProvider>
          <I18nProvider>
            <CustomCursor />
            <PageTransition>
              {children}
            </PageTransition>
            <FooterGate />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
