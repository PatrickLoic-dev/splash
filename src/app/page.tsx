import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { VariantsGrid } from '@/components/VariantsGrid'
import { AdvancedShowcase } from '@/components/AdvancedShowcase'
import { ScrollProgressBar } from '@/components/animations/ScrollProgress'

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        <VariantsGrid />
        <AdvancedShowcase />
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '32px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: 13,
          color: 'var(--text-tertiary)',
        }}>
          Splash — MIT License
        </span>
      </footer>
    </>
  )
}
