import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => {
    return {
      api_token: null,
      user_token: null,
      user: {},
      app_settings: {},
      phone: '',
    }
  },
  actions: {
    setInit(payload) {
      const { api_token, user_token, user, app_settings } = payload

      this.api_token = api_token
      this.user_token = user_token
      this.user = user
      this.app_settings = app_settings
    },
    setPhone(phone) {
      this.phone = phone
    },
  },
})
