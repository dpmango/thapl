export const useApi = (url, options = {}, settings = {}) => {
  const { $env, $log, ssrContext } = useNuxtApp()
  const reqEvent = useRequestEvent()

  const logResponce = (res) => {
    if (ssrContext) {
      if (Array.isArray(res)) {
        $log.log('=== shriked array log for SSR ===')
        return res[0]
      }
    }
    return res
  }

  let fetchUrl = `/api/${url}`
  if (reqEvent) {
    fetchUrl = `http://${reqEvent.req.headers.host}${fetchUrl}`
  } else if (settings.externalUrl) {
    fetchUrl = url
  }

  const DEV_perf_start = performance.now()
  return $fetch(fetchUrl, options)
    .then((res) => {
      // $log.log(`${url}`, logResponce(res))
      const DEV_perf_end = performance.now()

      $log.logServer(`👌 +FETCH ${url} in ${(DEV_perf_end - DEV_perf_start).toFixed(2)} ms`)
      return res
    })
    .catch((err) => {
      $log.error(`❌ (err) FETCH ${url}`, err)
      throw err
    })
}
