import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => {
    return {
      mobileMenuActive: false,
      modal: '1',
      modalParams: null,
    }
  },
  actions: {
    setMobileMenu(v) {
      this.mobileMenuActive = v
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
