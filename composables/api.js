export const useApi = (url, options = {}) => {
  const nuxtApp = useNuxtApp()
  const env = nuxtApp.$env

  return $fetch(`http://localhost:3000/api/${url}`, options)
    .then((res) => {
      console.log(`${url}`, res)
      return res
    })
    .catch((err) => {
      console.log(url, err)
      throw err
    })
}
