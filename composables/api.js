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

  return $fetch(fetchUrl, options)
    .then((res) => {
      // $log.log(`${url}`, logResponce(res))
      $log.logServer(`👌 +FETCH ${url}`)
      return res
    })
    .catch((err) => {
      $log.error(`❌ (err) FETCH ${url}`, err)
      throw err
    })
}
