import { useDeliveryStore, useSessionStore, useUiStore } from '~/store'

export const useInit = async () => {
  const { $env, $log } = useNuxtApp()

  const session = useSessionStore()
  const deliveryStore = useDeliveryStore()
  const ui = useUiStore()

  const apiCookie = useCookieState('x-thapl-apitoken')
  const userCookie = useCookieState('x-thapl-authorization')
  const regionCookie = useCookieState('x-thapl-region-id')

  // Начальные заголовки для init запроса
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

  $log.log('🧙‍♂️ USED init HEADERS', headers)

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
    const { api_token, user_token, app_settings } = data.value
    const region_predefined = app_settings?.site_settings?.region_id

    // установка куки и стора
    session.setInit(data.value)
    apiCookie.value = api_token
    userCookie.value = user_token

    if (region_predefined) {
      regionCookie.value = region_predefined
    }

    // запрашивать незакрываемое окно выбора региона
    if ($env.useRegions && !regionCookie.value && !region_predefined) {
      ui.setModal({ name: 'region', params: { closable: false } })
    }

    // Запрос адреса при заходе на сайт
    if (app_settings.ask_address_on_first_enter && !deliveryStore.currentAddress) {
      ui.setModal({ name: 'address' })
    }

    // сообщение Закрытого заказа
    if (app_settings.disable_order) {
      ui.setModal({ name: 'closed' })
    }

    // возвращаемые нереактивные данные в app.vue
    return { api_token, user_token, app_settings, site_settings: app_settings.site_settings }
  }

  return null
}
