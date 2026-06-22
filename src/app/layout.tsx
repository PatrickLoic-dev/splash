import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

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

const themeScript = `(function(){try{var t=localStorage.getItem('splash-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if((t||p)==='dark')document.documentElement.classList.add('dark')}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Must be before children — runs synchronously before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} suppressHydrationWarning />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
