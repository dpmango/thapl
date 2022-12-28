import { defineStore, acceptHMRUpdate } from 'pinia'

// TODO
// modalParams не работает в режиме наложения (несколько модальных)

export const useUiStore = defineStore('ui', {
  state: () => {
    return {
      mobileMenuActive: false,
      mobileMenuOffest: 0,
      modal: [] as string[],
      modalParams: null as any | null,
      searchActive: false,
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
    setModal({
      name,
      params,
      keepPrevious = false,
    }: {
      name: string
      params?: any
      keepPrevious?: boolean
    }) {
      if (keepPrevious) {
        this.modal.push(name)
      } else {
        this.modal = [name]
      }
      if (params) {
        this.modalParams = params
      }
    },
    closeModal() {
      this.modal = this.modal.slice(0, -1)
      this.modalParams = null
    },
    closeAllModals() {
      this.modal = []
      this.modalParams = null
    },
    setSearchActive(v) {
      this.searchActive = v
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
