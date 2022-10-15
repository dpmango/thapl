import { useSessionStore, useUiStore } from '~/store'

export const useInit = async () => {
  const { $env, $log } = useNuxtApp()

  const session = useSessionStore()
  const ui = useUiStore()

  const apiCookie = useCookieState('x-thapl-apitoken')
  const userCookie = useCookieState('x-thapl-authorization')
  const regionCookie = useCookieState('x-thapl-region-id')

  const headers = {}
  if (apiCookie.value) {
    headers['x-thapl-apitoken'] = apiCookie.value
  }
  if (userCookie.value) {
    headers['x-thapl-authorization'] = userCookie.value
  }
  if (regionCookie.value) {
    headers['x-thapl-region-id'] = regionCookie.value
  }

  const { data, error } = await useAsyncData('init', () =>
    useApi('api-client/init/', {
      method: 'POST',
      headers,
      body: {
        lang: 'ru',
        device_type: -1,
      },
    })
  )

  $log.log('🧙‍♂️ ASYNC INIT', data.value)

  if (data) {
    const { api_token, user_token } = data.value

    session.setInit(data.value)
    apiCookie.value = api_token
    userCookie.value = user_token

    // ask for region first
    if ($env.useRegions && !regionCookie.value) {
      ui.setModal({ name: 'region', params: { closable: false } })
    }

    return { api_token, user_token }
  }

  return null
}
