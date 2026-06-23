export function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: 'var(--bg)',
    }}>
      {/* Chrome bar */}
      <div style={{
        height: 36,
        background: 'var(--bg-tertiary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 6,
        flexShrink: 0,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        <div style={{
          flex: 1, height: 20, borderRadius: 5, marginLeft: 10,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', paddingLeft: 8,
        }}>
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-outfit)',
            color: 'var(--text-tertiary)',
            userSelect: 'none',
          }}>
            localhost:3000
          </span>
        </div>
      </div>
      {/* Page content */}
      <div style={{ minHeight: 240, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
