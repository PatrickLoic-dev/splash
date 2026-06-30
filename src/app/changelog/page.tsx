import { Suspense } from 'react'
import { ChangelogPage } from '@/components/ChangelogPage'

export const metadata = { title: 'Changelog — Splash' }
export default function Page() {
  return <Suspense fallback={null}><ChangelogPage /></Suspense>
}
