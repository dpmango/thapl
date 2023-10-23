<template>
  <div class="search" :class="[ui.searchActive && '_active']">
    <div class="container search__wrapper">
      <div class="search__top">
        <UiInput
          name="search"
          type="search"
          icon="search"
          icon-position="left"
          :value="search"
          @on-change="setSearch"
        />
        <div class="search__close" @click="ui.setSearchActive(false)">
          <NuxtIcon name="close" />
        </div>
      </div>

      <div class="search__scroller">
        <div class="search__grid row">
          <div v-for="product in searchedProducts" :key="product.id" class="col col-6 col-sm-12">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
import { useProductStore, useUiStore } from '~/store'
import {
  PerformanceLog,
  formatUGC,
  prepareSmartSearchRegexp,
  clearMorphologyInSearchTerm,
  lockBody,
  unlockBody,
} from '#imports'
import { IProduct } from '~/interface/Product'

const ui = useUiStore()
const productStore = useProductStore()
const { $env } = useNuxtApp()

const search = ref('')
const resultsLoading = ref(false)

const searchedProducts = ref<IProduct[]>([])

const setSearch = (v) => {
  search.value = v

  requestUpdates()
  // if ($env.catalogType === 'singlepage') {
  //   const searched = findInCatalog(v)
  //   searchedProducts.value = searched
  // } else {
  //   requestUpdates()
  // }
}

// backend-based search
const requestUpdates = debounce(async () => {
  const searchStr = formatUGC(search.value.trim())

  if (searchStr.length >= 2) {
    resultsLoading.value = true

    const result = (await useApi('catalog/search', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        query: searchStr,
      },
    })) as IProduct[]

    if (result) {
      searchedProducts.value = result
    }

    resultsLoading.value = false
  }
}, 500)

// frontend-based search
const findInCatalog = (v) => {
  const searchStr = formatUGC(v.trim())

  if (searchStr.length >= 2) {
    const DEV_perf = performance.now()

    const searchRegex = prepareSmartSearchRegexp(
      clearMorphologyInSearchTerm(searchStr.toLowerCase())
    )

    const filteredList = productStore.flatCatalog.filter((x) => {
      const titleMatch = new RegExp(searchRegex, 'i').test(x.title.toLowerCase())
      const descriptionMatch = new RegExp(searchRegex, 'i').test(x.description.toLowerCase())

      return titleMatch || descriptionMatch
    })

    PerformanceLog(DEV_perf, 'searchedProducts', false)

    return filteredList
  }

  return []
}

watch(
  () => ui.searchActive,
  (newVal) => {
    if (newVal) {
      lockBody()
    } else {
      unlockBody()
    }
  }
)
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--search-background);
  transition: opacity 0.25s $ease, filter 0.25s $ease;
  opacity: 0;
  filter: blur(10px);
  pointer-events: none;
  &._active {
    filter: none;
    opacity: 1;
    pointer-events: all;
  }
  &__wrapper {
    flex: 1 1 auto;
    max-width: 716px;
    min-height: 1px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &__top {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    padding: 32px 0;
    .input {
      flex: 1 1 auto;
      margin-right: 20px;
    }
  }
  &__close {
    flex: 0 0 auto;
    background: var(--component-background);
    box-shadow: var(--box-shadow-extra-large);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.25s $ease;
    .nuxt-icon {
      font-size: 16px;
    }
    &:hover {
      background: var(--color-primary);
      color: var(--color-font-invert);
    }
  }
  &__scroller {
    flex: 1 1 auto;
    padding-right: 68px;
    min-height: 1px;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  &__grid {
    .card {
      margin-bottom: 48px;
    }
  }
}
</style>
