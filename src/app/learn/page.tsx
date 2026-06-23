import { Suspense } from 'react'
import { LearnPage } from '@/components/LearnPage'

export const metadata = {
  title: 'Learn — Splash',
  description: 'Ten fundamental animation patterns implemented for React, Next.js, Vue 3, React Native, and Flutter.',
}

export default function Learn() {
  return (
    <Suspense fallback={null}>
      <LearnPage />
    </Suspense>
  )
}
