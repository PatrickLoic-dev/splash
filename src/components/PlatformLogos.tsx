export function ReactLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  )
}

export function NextjsLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * (80 / 394)} viewBox="0 0 394 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M261.919 0.0330722H330.547V12.7H303.323V79.339H289.71V12.7H261.919V0.0330722Z" fill="currentColor"/>
      <path d="M149.052 0.0330722V12.7H94.0421V33.0772H138.281V45.7441H94.0421V66.6721H149.052V79.339H80.43V12.7H80.4243V0.0330722H149.052Z" fill="currentColor"/>
      <path d="M183.32 0.0661486H165.506L229.312 79.3721H247.178L215.271 39.7464L247.127 0.126654L229.312 0.154184L206.352 28.6697L183.32 0.0661486Z" fill="currentColor"/>
      <path d="M201.6 56.7148L192.679 45.6229L165.455 79.4326H183.32L201.6 56.7148Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M80.907 79.339L17.0151 0H0V79.3059H13.6121V16.9516L63.8067 79.339H80.907Z" fill="currentColor"/>
    </svg>
  )
}

export function VueLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * (226.69 / 261.76)} viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1.3333 0 0 -1.3333 -76.311 313.34)">
        <g transform="translate(178.06 235.01)">
          <path d="m0 0-22.669-39.264-22.669 39.264h-75.491l98.16-170.02 98.16 170.02z" fill="#41b883"/>
        </g>
        <g transform="translate(178.06 235.01)">
          <path d="m0 0-22.669-39.264-22.669 39.264h-36.227l58.896-102.01 58.896 102.01z" fill="#34495e"/>
        </g>
      </g>
    </svg>
  )
}

export function FlutterLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(.061615 0 0 .061615 -1.430818 -1.2754)">
        <defs>
          <path id="fLPa" d="M959.4 500L679.8 779.7l279.6 279.7H639.9L360.2 779.7 639.9 500h319.5zM639.9 20.7L120.6 540l159.8 159.8 679-679.1H639.9z"/>
        </defs>
        <clipPath id="fLPb"><use href="#fLPa"/></clipPath>
        <g clipPath="url(#fLPb)"><path d="M360.3 779.7L520 939.5 959.4 500H639.9z" fill="#39cefd"/></g>
        <defs>
          <path id="fLPc" d="M959.4 500L679.8 779.7l279.6 279.7H639.9L360.2 779.7 639.9 500h319.5zM639.9 20.7L120.6 540l159.8 159.8 679-679.1H639.9z"/>
        </defs>
        <clipPath id="fLPd"><use href="#fLPc"/></clipPath>
        <path clipPath="url(#fLPd)" d="M639.9 20.7h319.5l-679 679.1L120.6 540z" fill="#39cefd"/>
        <defs>
          <path id="fLPe" d="M959.4 500L679.8 779.7l279.6 279.7H639.9L360.2 779.7 639.9 500h319.5zM639.9 20.7L120.6 540l159.8 159.8 679-679.1H639.9z"/>
        </defs>
        <clipPath id="fLPf"><use href="#fLPe"/></clipPath>
        <path clipPath="url(#fLPf)" d="M520 939.5l119.9 119.8h319.5L679.8 779.7z" fill="#03569b"/>
        <g clipPath="url(#fLPb)">
          <path d="M360.282 779.645L520.086 619.84 679.9 779.645 520.086 939.45z" fill="#16b9fd"/>
        </g>
      </g>
    </svg>
  )
}

export function ReactNativeLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  )
}

export const PLATFORM_LOGOS: Record<string, React.FC<{ size?: number }>> = {
  react:          ReactLogo,
  nextjs:         NextjsLogo,
  vue:            VueLogo,
  'react-native': ReactNativeLogo,
  flutter:        FlutterLogo,
}
