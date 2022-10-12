import { defineStore, acceptHMRUpdate } from 'pinia'
import { IInit, IAppSettings, ISiteSettings } from '~/interface/Site'

export const useSessionStore = defineStore('session', {
  state: () => {
    return {
      api_token: null,
      user_token: null,
      user: {} as any,
      app_settings: {} as IAppSettings,
      region: null,
      regions: [],
      phone: '',
    }
  },
  persist: {
    paths: ['user'],
  },
  getters: {
    userNameVerbose(state) {
      if (state.user) {
        const { name, username, user_code } = state.user

        if (name) return name
        if (username) return username
        if (user_code) return user_code
      }
      return null
    },
    currentRegionName(state) {
      try {
        return state.regions.find((x) => x.id === state.region).title
      } catch {
        return null
      }
    },
  },
  actions: {
    setInit(payload: IInit) {
      const { api_token, user_token, user, app_settings } = payload

      this.api_token = api_token
      this.user_token = user_token
      this.user = user
      this.app_settings = app_settings
    },
    setPhone(phone) {
      this.phone = phone
    },
    setSession(payload) {
      const { user, user_token } = payload
      this.user = {
        ...user,
      }
      this.user_token = user_token

      const userToken = useCookieState('x-thapl-authorization')
      userToken.value = user_token
    },
    setCurrentRegion(region) {
      this.region = region
    },
    async getRegions(region) {
      const headers = useHeaders()

      const data = await useApi('organization/get-regions', {
        method: 'GET',
        headers,
      })

      this.regions = [...data]

      return []
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot))
}
