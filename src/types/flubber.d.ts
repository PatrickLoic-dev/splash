declare module 'flubber' {
  interface InterpolateOptions {
    maxSegmentLength?: number
    string?: boolean
  }
  export function interpolate(
    from: string,
    to: string,
    options?: InterpolateOptions
  ): (t: number) => string
}
