'use client'

import { useEffect, useState } from 'react'

export function useBreakpoint() {
  const [width, setWidth] = useState(1200)

  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  return {
    isMobile:  width < 640,
    isTablet:  width >= 640 && width < 900,
    isDesktop: width >= 900,
    width,
  }
}
