export const useApi = (url, options = {}) => {
  const config = useRuntimeConfig()
  return $fetch(`${config.public.apiBase}${url}`, options)
    .then((res) => {
      console.log(`${url}`, res)
      return res
    })
    .catch((err) => {
      console.log(url, err)
      throw err
    })
}
