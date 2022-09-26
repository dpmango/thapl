import { useSessionStore } from '~/store'

export const useInit = async () => {
  const api = useApi

  const session = useSessionStore()
  const apiToken = useCookie('x-thapl-apitoken')
  const userToken = useCookie('x-thapl-authorization')

  const headers = {}
  if (apiToken.value) {
    headers['x-thapl-apitoken'] = apiToken.value
  }
  if (userToken.value) {
    headers['x-thapl-authorization'] = userToken.value
  }

  const { data, error } = await useAsyncData('init', () =>
    api('api-client/init/', {
      method: 'POST',
      headers,
      body: {
        lang: 'ru',
        device_type: -1,
      },
    })
  )

  if (data) {
    const { api_token, user_token } = data.value

    session.setInit(data.value)
    apiToken.value = api_token
    userToken.value = user_token

    return { api_token, user_token }
  }

  return null
}
