import { defineStore, acceptHMRUpdate } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => {
    return {
      mobileMenuActive: false,
      mobileMenuOffest: 0,
      modal: null,
      modalParams: null,
    }
  },
  actions: {
    setMobileMenu(payload) {
      if (typeof payload === 'object') {
        const { active, offset } = payload
        this.mobileMenuActive = active
        this.mobileMenuOffest = offset
      } else {
        this.mobileMenuActive = payload
      }
    },
    setModal({ name, params }) {
      this.modal = name

      if (params) {
        this.modalParams = params
      }
    },
    closeModal() {
      this.modal = null
      this.modalParams = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
