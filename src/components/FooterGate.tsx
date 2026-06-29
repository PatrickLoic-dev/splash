'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function FooterGate() {
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  // Hide footer when viewing a pattern detail (/learn?slug=...)
  const isDetail = pathname?.startsWith('/learn') && !!searchParams.get('slug')
  if (isDetail) return null
  return <Footer />
}
