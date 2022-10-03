const lastTime = new Date().getTime()

export const PerformanceLog = (DEV_perf, name) => {
  const DEV_perf_end = performance.now()

  console.log(
    `PERF :: ${name} :: ${(DEV_perf_end - DEV_perf).toFixed(2)} ms :: fromstart ${(
      new Date().getTime() - lastTime
    ).toFixed(2)} ms`
  )
}
