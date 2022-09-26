<template>
  <nav class="nav">
    <div class="nav__wrapper">
      <ul ref="navlist" class="nav__list">
        <li v-for="link in menuVisible" :key="link.id">
          <NuxtLink class="nav__link" :to="link.slug">{{ link.title }}</NuxtLink>
        </li>
      </ul>
      <VDropdown :distance="2">
        <div class="nav__more">
          <span>Еще</span>
          <nuxt-icon name="caret" />
        </div>

        <template #popper>
          <ul class="nav__dropdown">
            <li v-for="link in menuHidden" :key="link.id">
              <NuxtLink class="nav__link" :to="link.slug">{{ link.title }}</NuxtLink>
            </li>
          </ul>
        </template>
      </VDropdown>
    </div>
  </nav>
</template>

<script setup>
import _ from 'lodash'
import { useSessionStore, useProductStore } from '~/store'

const navlist = ref(null)
const hideFromIdx = ref(99)

const api = useApi
const session = useSessionStore()
const productStore = useProductStore()

const headers = useHeaders()

const { data, error } = await useAsyncData('categories', () =>
  api('catalog/get-categories', {
    method: 'GET',
    headers,
  })
)

if (data) productStore.setCategories(data.value)
// console.log('productStore.categories', productStore.categories.length)

const menuVisible = computed(() => {
  return productStore.categories.filter((x, idx) => idx < hideFromIdx.value)
})

const menuHidden = computed(() => {
  return productStore.categories.filter((x, idx) => idx >= hideFromIdx.value)
})

const hiddenStartsFromIdx = () => {
  hideFromIdx.value = 99
  nextTick(() => {
    const containerWidth = navlist.value.offsetWidth
    const navChilds = navlist.value.children

    let lastWidth = 0
    for (let i = 0; i < navChilds.length; i++) {
      const navLink = navChilds[i]
      const navLinkWidth = navLink.offsetWidth + 8

      lastWidth += navLinkWidth

      if (lastWidth >= containerWidth) {
        hideFromIdx.value = i
        return
      }
    }
  })
}

const debouncedResize = _.debounce(hiddenStartsFromIdx, 100)

onMounted(() => {
  hiddenStartsFromIdx()
  window.addEventListener('resize', debouncedResize, false)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize, false)
})
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  min-width: 1px;
  &__wrapper {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    min-width: 1px;
  }
  &__list {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    li {
      display: inline-block;
      flex: 0 0 auto;
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  &__link {
    display: inline-block;
    font-weight: 500;
    font-size: 16px;
    line-height: calc(26 / 16);
    padding: 5px 10px;
    font-weight: 500;
    transition: color 0.25s $ease;
    &:hover {
      color: var(--color-primary);
    }
  }
  &__dropdown {
    padding: 20px 14px;
    max-height: 268px;
    overflow-y: auto;
  }
  &__more {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    padding: 5px 10px;
    cursor: pointer;
    transition: color 0.25s $ease;
    .nuxt-icon {
      font-size: 10px;
      margin-left: 8px;
    }
    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
