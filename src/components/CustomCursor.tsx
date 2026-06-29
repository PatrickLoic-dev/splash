'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let rx = -100, ry = -100
    let dx = -100, dy = -100
    let raf: number

    const onMove = (e: MouseEvent) => {
      dx = e.clientX
      dy = e.clientY
    }

    const tick = () => {
      // dot follows instantly
      dot.style.transform  = `translate(${dx}px, ${dy}px)`
      // ring lags behind
      rx += (dx - rx) * 0.12
      ry += (dy - ry) * 0.12
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(tick)
    }

    const onEnter = () => {
      dot.style.opacity  = '1'
      ring.style.opacity = '1'
    }
    const onLeave = () => {
      dot.style.opacity  = '0'
      ring.style.opacity = '0'
    }

    const onDown = () => {
      dot.style.transform  = `translate(${dx}px, ${dy}px) scale(0.5)`
      ring.style.width  = '40px'
      ring.style.height = '40px'
      ring.style.marginLeft = '-20px'
      ring.style.marginTop  = '-20px'
    }
    const onUp = () => {
      dot.style.transform  = `translate(${dx}px, ${dy}px) scale(1)`
      ring.style.width  = '32px'
      ring.style.height = '32px'
      ring.style.marginLeft = '-16px'
      ring.style.marginTop  = '-16px'
    }

    document.addEventListener('mousemove',  onMove)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mousedown',  onDown)
    document.addEventListener('mouseup',    onUp)
    raf = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mousedown',  onDown)
      document.removeEventListener('mouseup',    onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6,
          marginLeft: -3, marginTop: -3,
          borderRadius: '50%',
          background: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          transition: 'opacity 0.2s, transform 0.08s',
          willChange: 'transform',
        }}
      />
      {/* ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32,
          marginLeft: -16, marginTop: -16,
          borderRadius: '50%',
          border: '1.5px solid var(--accent)',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: 0,
          transition: 'opacity 0.2s, width 0.2s, height 0.2s, margin 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
