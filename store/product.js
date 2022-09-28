import { defineStore, acceptHMRUpdate } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => {
    return {
      catalog: [],
      // categories: [],
    }
  },
  getters: {
    navCategories(state) {
      const categoryProps = (x) => ({
        id: x.id,
        title: x.title,
        slug: x.slug,
      })

      return state.catalog.reduce((acc, category) => {
        acc.push(categoryProps(category))

        // if (category.sub_categories) {
        //   category.sub_categories.forEach((sub_category) => {
        //     acc.push(categoryProps(sub_category))
        //   })
        // }

        return acc
      }, [])
    },
  },
  actions: {
    async getCatalog() {
      const headers = useHeaders()
      const { $env } = useNuxtApp()

      let data = []

      if ($env.catalogType === 'singlepage') {
        data = await useApi('catalog/get-main-page-categories', {
          method: 'GET',
          headers,
        })
      }
      // else if ($env.catalogType === 'categories') {
      // } else if ($env.catalogType === 'conceptions') {
      // }

      console.log(`++ Catalog set with ${data.length} categories ++`)
      this.catalog = [...data]

      return data
    },
    async getCategories() {
      console.log('TODO - getCategories triggered')
      const data = await useApi('catalog/get-categories', {
        method: 'GET',
        headers,
      })

      this.categories = [...data]

      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}
