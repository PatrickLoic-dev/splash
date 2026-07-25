import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Manrope } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { I18nProvider } from '@/lib/i18n'
import { CustomCursor } from '@/components/CustomCursor'
import { PageTransition } from '@/components/PageTransition'
import { FooterGate } from '@/components/FooterGate'

// Self-hosted — the previous Fontshare CDN links (Cabinet Grotesk / Satoshi)
// hang indefinitely in sandboxed/offline environments, silently falling back
// to system fonts. Power Grotesk ships locally in public/fonts; Manrope is
// the closest freely-licensed match for Satoshi's geometric grotesk shape.
const power = localFont({
  src: [
    { path: '../../public/fonts/PowerGroteskTrial-Light.ttf',     weight: '300', style: 'normal' },
    { path: '../../public/fonts/PowerGroteskTrial-Regular.ttf',   weight: '400', style: 'normal' },
    { path: '../../public/fonts/PowerGroteskTrial-Medium.ttf',    weight: '500', style: 'normal' },
    { path: '../../public/fonts/PowerGroteskTrial-Bold.ttf',      weight: '700', style: 'normal' },
    { path: '../../public/fonts/PowerGroteskTrial-Heavy.ttf',     weight: '800', style: 'normal' },
    { path: '../../public/fonts/PowerGroteskTrial-Black.ttf',     weight: '900', style: 'normal' },
    { path: '../../public/fonts/PowerGroteskTrial-Italic.ttf',    weight: '400', style: 'italic' },
    { path: '../../public/fonts/PowerGroteskTrial-BoldItalic.ttf', weight: '700', style: 'italic' },
  ],
  variable: '--font-power',
  display: 'swap',
})

const outfit = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

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
    <html lang="en" className={`${power.variable} ${outfit.variable}`}>
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
