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
        {/* Ripple arcs */}
        <path
          d="M8 16 Q16 9 24 16"
          stroke="var(--accent)"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M5 16 Q16 6 27 16"
          stroke="var(--accent)"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M2 16 Q16 3 30 16"
          stroke="var(--accent)"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.2"
        />
        {/* S letterform — shadow glow */}
        <path
          d="M22 9.5C22 7.8 20 6 16 6C11 6 8 8.5 8 12C8 15.5 11.5 16.5 15 17.2C19 18 22 19.5 22 23C22 26 19 26.8 15.5 26.8C12 26.8 9.5 25.2 9.5 23.5"
          stroke="var(--accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.3"
        />
        {/* S letterform — main */}
        <path
          d="M22 9.5C22 7.8 20 6 16 6C11 6 8 8.5 8 12C8 15.5 11.5 16.5 15 17.2C19 18 22 19.5 22 23C22 26 19 26.8 15.5 26.8C12 26.8 9.5 25.2 9.5 23.5"
          stroke="var(--text-primary)"
          strokeWidth="2"
          strokeLinecap="round"
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
