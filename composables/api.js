export const useApi = (url, options = {}) => {
  const nuxtApp = useNuxtApp()
  const env = nuxtApp.$env

  const logResponce = (res) => {
    if (nuxtApp.ssrContext) {
      if (Array.isArray(res)) {
        console.log('=== shriked array log for SSR ===')
        return res[0]
      }
    }
    return res
  }

  console.log(`FETCH ${url}`)
  return $fetch(`http://localhost:3000/api/${url}`, options)
    .then((res) => {
      // console.log(`${url}`, logResponce(res))
      console.log(`FETCH done ${url}`)
      return res
    })
    .catch((err) => {
      console.log(url, err)
      throw err
    })
}
