export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 200,
      height: 420,
      borderRadius: 34,
      border: '2.5px solid var(--border-strong)',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
      flexShrink: 0,
    }}>
      {/* Dynamic island / notch */}
      <div style={{
        position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
        width: 68, height: 18, borderRadius: 10,
        background: 'var(--bg-tertiary)',
        zIndex: 10,
        border: '1px solid var(--border)',
      }} />
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 28, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        padding: '0 16px', zIndex: 5,
      }}>
        <span style={{
          fontSize: 8.5, fontFamily: 'var(--font-outfit)', fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '-0.01em',
        }}>
          9:41
        </span>
        <span style={{
          fontSize: 8, fontFamily: 'var(--font-outfit)',
          color: 'var(--text-primary)', letterSpacing: '0.02em',
        }}>
          ▌▌▌ ◻
        </span>
      </div>
      {/* Screen content — starts below status bar */}
      <div style={{
        position: 'absolute', top: 28, left: 0, right: 0, bottom: 20,
        overflow: 'hidden',
      }}>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
        width: 56, height: 3.5, borderRadius: 2,
        background: 'var(--text-tertiary)', opacity: 0.6,
      }} />
    </div>
  )
}
