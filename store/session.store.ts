import { defineStore, acceptHMRUpdate } from 'pinia'
import { IInit, IAppSettings } from '~/interface/Site'
import { IUser } from '~/interface/User'

export const useSessionStore = defineStore('session', {
  state: () => {
    return {
      api_token: null as string | null,
      user_token: null as string | null,
      user: {} as IUser,
      app_settings: {} as IAppSettings,
      phone: '' as string,
    }
  },
  persist: {
    paths: ['user'],
  },

  getters: {
    isAuthenticated(state) {
      return !!Object.keys(state.user).length
    },
    userNameVerbose(state) {
      if (state.user) {
        const { name, username, user_code } = state.user

        if (name) return name
        if (username) return username
        if (user_code) return user_code
      }
      return null
    },
    isPreorderAvailable(state) {
      try {
        return state.app_settings.order_to_time
      } catch {
        return null
      }
    },
    hasMarketingSection(state) {
      return state.app_settings.app_store_link || state.app_settings.play_store_link
    },
  },
  actions: {
    setInit(payload: IInit) {
      const { api_token, user_token, user, app_settings } = payload

      this.api_token = api_token || null
      this.user_token = user_token || null
      this.user = user || ({} as IUser)
      this.app_settings = app_settings
    },
    setPhone(phone: string) {
      this.phone = phone || ''
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
    updateUser(payload) {
      this.user = {
        ...this.user,
        ...payload,
      }
    },
    logout() {
      this.user_token = null
      this.user = {} as IUser

      const userToken = useCookieState('x-thapl-authorization')
      userToken.value = ''
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot))
}
