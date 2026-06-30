'use client'

import { Suspense } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { Footer } from './Footer'

function FooterGateInner() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  // Hide footer when viewing a pattern detail (/learn?slug=...)
  const isDetail = pathname?.startsWith('/learn') && !!searchParams.get('slug')
  if (isDetail) return null
  return <Footer />
}

export function FooterGate() {
  return (
    <Suspense fallback={null}>
      <FooterGateInner />
    </Suspense>
  )
}
