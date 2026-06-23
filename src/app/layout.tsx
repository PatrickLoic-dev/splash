import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { I18nProvider } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Splash — Framer Motion Variants',
  description: 'Collection de variants Framer Motion prêts à l\'emploi. Fade, slide, stagger, spring, morphing. Import en une ligne.',
  keywords: ['framer-motion', 'react', 'animation', 'variants', 'nextjs'],
  authors: [{ name: 'Splash' }],
  openGraph: {
    title: 'Splash — Framer Motion Variants',
    description: 'Reusable, composable Framer Motion variants for React.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
