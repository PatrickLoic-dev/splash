'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip entirely on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Make elements visible now that we know it's a pointer device
    dot.style.display  = 'block'
    ring.style.display = 'block'

    let rx = -200, ry = -200
    let dx = -200, dy = -200
    let raf: number
    let isHoveringTarget = false

    const setDefault = () => {
      isHoveringTarget = false
      ring.style.transition = 'opacity 0.2s, width 0.25s ease, height 0.25s ease, border-radius 0.25s ease, margin 0.25s ease, transform 0.0s'
      ring.style.width       = '32px'
      ring.style.height      = '32px'
      ring.style.borderRadius = '50%'
      ring.style.marginLeft  = '-16px'
      ring.style.marginTop   = '-16px'
      ring.style.background  = 'transparent'
      ring.style.border      = '1.5px solid var(--accent)'
      dot.style.opacity = '1'
    }

    const setOnTarget = (el: Element) => {
      isHoveringTarget = true
      const rect = el.getBoundingClientRect()
      const w = rect.width  + 8
      const h = rect.height + 8
      const br = parseFloat(getComputedStyle(el).borderRadius) + 4

      ring.style.transition = 'opacity 0.2s, width 0.2s ease, height 0.2s ease, border-radius 0.2s ease, margin 0.2s ease, transform 0.15s ease'
      ring.style.width       = `${w}px`
      ring.style.height      = `${h}px`
      ring.style.borderRadius = `${br}px`
      ring.style.marginLeft  = `${-w / 2}px`
      ring.style.marginTop   = `${-h / 2}px`
      ring.style.background  = 'rgba(163,230,53,0.07)'
      ring.style.border      = '1.5px solid var(--accent)'
      rx = rect.left + rect.width  / 2
      ry = rect.top  + rect.height / 2
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      dot.style.opacity = '0'
    }

    const SELECTORS = 'a, button, [role="button"], input, select, textarea, label, [tabindex]'

    const onMove = (e: MouseEvent) => {
      dx = e.clientX
      dy = e.clientY
      const target = (e.target as Element)?.closest(SELECTORS)
      if (target) {
        setOnTarget(target)
      } else if (isHoveringTarget) {
        setDefault()
      }
    }

    const onEnter = () => { dot.style.opacity = '1'; ring.style.opacity = '1' }
    const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0' }
    const onDown  = () => { dot.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)` }
    const onUp    = () => { dot.style.transform = `translate(${dx}px, ${dy}px) scale(1)` }

    const tick = () => {
      dot.style.transform = `translate(${dx}px, ${dy}px)`
      if (!isHoveringTarget) {
        rx += (dx - rx) * 0.12
        ry += (dy - ry) * 0.12
        ring.style.transform = `translate(${rx}px, ${ry}px)`
      }
      raf = requestAnimationFrame(tick)
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

  // Always render the DOM nodes — hidden by default, shown only if pointer device (set in effect)
  return (
    <>
      <div ref={dotRef} style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0,
        width: 6, height: 6, marginLeft: -3, marginTop: -3,
        borderRadius: '50%',
        background: 'var(--accent)',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        willChange: 'transform',
      }} />
      <div ref={ringRef} style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0,
        width: 32, height: 32, marginLeft: -16, marginTop: -16,
        borderRadius: '50%',
        border: '1.5px solid var(--accent)',
        pointerEvents: 'none',
        zIndex: 99998,
        opacity: 0,
        transition: 'opacity 0.2s',
        willChange: 'transform',
      }} />
    </>
  )
}
