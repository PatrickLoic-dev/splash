'use client'

interface LogoProps {
  size?: number
  className?: string
  showWordmark?: boolean
}

export function Logo({ size = 32, className = '', showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Water droplet — body */}
        <path
          d="M16 4 C16 4 8 14 8 19.5 C8 24.1 11.6 28 16 28 C20.4 28 24 24.1 24 19.5 C24 14 16 4 16 4 Z"
          fill="#7C3AED"
        />
        {/* Highlight gloss */}
        <ellipse
          cx="12.5"
          cy="18"
          rx="2"
          ry="3.5"
          fill="rgba(255,255,255,0.35)"
          transform="rotate(-15 12.5 18)"
        />
      </svg>
      {showWordmark && (
        <span
          style={{
            fontFamily: 'var(--font-power)',
            fontWeight: 300,
            fontSize: size * 0.65,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          splash
        </span>
      )}
    </div>
  )
}
