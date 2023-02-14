const lastTime = new Date().getTime()

export const APP_VERSION = '2.0.2'

export const PerformanceLog = (DEV_perf, name, fromStart) => {
  const DEV_perf_end = performance.now()

  const fromStartTag = fromStart
    ? `:: fromstart ${(new Date().getTime() - lastTime).toFixed(2)} ms`
    : ''

  console.log(`PERF :: ${name} :: ${(DEV_perf_end - DEV_perf).toFixed(2)} ms ${fromStartTag}`)
}
