'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

interface VariantCardProps {
  name: string
  description: string
  variants: Variants
  code: string
  category: string
}

export function VariantCard({ name, description, variants, code, category }: VariantCardProps) {
  const [playing, setPlaying] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  const replay = () => {
    setPlaying(false)
    setTimeout(() => setPlaying(true), 80)
  }

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      style={{
        borderRadius: 14,
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Preview area */}
      <div
        style={{
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-tertiary)',
          position: 'relative',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 12,
            fontSize: 10,
            fontFamily: 'var(--font-outfit)',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
          }}
        >
          {category}
        </span>

        <AnimatePresence mode="wait">
          {playing && (
            <motion.div
              key="preview"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: 'var(--accent)',
                opacity: 0.9,
              }}
            />
          )}
        </AnimatePresence>

        {/* Replay */}
        <button
          onClick={replay}
          aria-label="Replay animation"
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: 6,
            border: '1px solid var(--border-strong)',
            background: 'var(--bg-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: 'var(--text-tertiary)',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
        >
          ↺
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3
            style={{
              fontFamily: 'var(--font-power)',
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            {name}
          </h3>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setShowCode(v => !v)}
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-outfit)',
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid var(--border-strong)',
                background: showCode ? 'var(--accent-faint)' : 'transparent',
                color: showCode ? 'var(--accent)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {`</>`}
            </button>
            <button
              onClick={copy}
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-outfit)',
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid var(--border-strong)',
                background: copied ? 'var(--accent-faint)' : 'transparent',
                color: copied ? 'var(--accent)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? '✓' : 'copy'}
            </button>
          </div>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: 13,
            color: 'var(--text-tertiary)',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>

        {showCode && (
          <motion.pre
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: 14,
              padding: '12px 14px',
              borderRadius: 8,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              fontSize: 11.5,
              fontFamily: 'ui-monospace, monospace',
              color: 'var(--text-secondary)',
              overflowX: 'auto',
              lineHeight: 1.6,
              whiteSpace: 'pre',
            }}
          >
            {code}
          </motion.pre>
        )}
      </div>
    </div>
  )
}
