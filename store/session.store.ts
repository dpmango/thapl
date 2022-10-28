import { defineStore, acceptHMRUpdate } from 'pinia'
import { IInit, IAppSettings, ISiteSettings } from '~/interface/Site'
import { IUser } from '~/interface/User'

export const useSessionStore = defineStore('session', {
  state: () => {
    return {
      api_token: null,
      user_token: null,
      user: {} as IUser,
      app_settings: {} as IAppSettings,

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
    isPreorderAvailable(state) {
      try {
        return state.app_settings.order_to_time
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot))
}
