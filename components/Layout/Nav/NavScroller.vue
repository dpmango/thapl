<template>
  <nav class="nav js-nav" :class="[`nav-${$env.catalogType}`]">
    <div class="nav__wrapper">
      <ul ref="navlist" class="nav__list">
        <li v-for="(link, idx) in menuVisible" :key="link.id">
          <LayoutNavLink :link="link" :active="activeAnchor === idx" />
        </li>
      </ul>
      <VDropdown :distance="2">
        <div class="nav__more" :class="[menuHidden.length === 0 && '_empty']">
          <span>Еще</span>
          <nuxt-icon name="caret" />
        </div>

        <template #popper>
          <ul class="nav__dropdown">
            <li v-for="(link, idx) in menuHidden" :key="link.id">
              <LayoutNavLink :link="link" :active="activeAnchor === idx + menuVisible.length - 1" />
            </li>
          </ul>
        </template>
      </VDropdown>
    </div>
  </nav>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useProductStore } from '~/store'
import { createScrollableAnchors } from '~~/utils/Elements'

const navlist = ref<HTMLElement | null>(null)
const hideFromIdx = ref(99)

const { $env } = useNuxtApp()

const productStore = useProductStore()

const menuVisible = computed(() => {
  return productStore.navCategories.filter((x, idx) => idx < hideFromIdx.value)
})

const menuHidden = computed(() => {
  return productStore.navCategories.filter((x, idx) => idx >= hideFromIdx.value)
})

const hiddenStartsFromIdx = () => {
  hideFromIdx.value = 99
  nextTick(() => {
    const containerWidth = navlist.value?.offsetWidth || 0
    const navChilds = navlist.value?.children || []

    let lastWidth = 0
    for (let i = 0; i < navChilds.length; i++) {
      const navLink = navChilds[i] as HTMLElement
      const navLinkWidth = navLink.offsetWidth + 8

      lastWidth += navLinkWidth

      if (lastWidth >= containerWidth) {
        hideFromIdx.value = i
        return
      }
    }
  })
}

// aniamate anchors on scroll
const activeAnchor = ref<number | null>(null)

const handleLinksScroll = () => {
  const scrollTop = window.scrollY
  const smoothLinks = document.querySelectorAll('.js-nav .nav__link')
  const { sections, links } = createScrollableAnchors(smoothLinks)

  const header = document.querySelector('.header__bottom') as HTMLElement
  const headerOffset = (header?.offsetHeight || 0) + 24

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    if (scrollTop >= section.offsetTop - headerOffset) {
      activeAnchor.value = links.findIndex((x) => x.name === section.id)
      return
    } else {
      activeAnchor.value = null
    }
  }
}

const debouncedResize = _.debounce(hiddenStartsFromIdx, 100)
const throttledScroll = _.throttle(handleLinksScroll, 100)

onMounted(() => {
  hiddenStartsFromIdx()
  window.addEventListener('resize', debouncedResize, false)
  window.addEventListener('scroll', throttledScroll, false)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize, false)
  window.removeEventListener('scroll', throttledScroll, false)
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
    &._empty {
      opacity: 0;
    }
    .nuxt-icon {
      font-size: 10px;
      margin-left: 8px;
    }
    &:hover {
      color: var(--color-primary);
    }
  }
}

.nav-singlepage {
  .nav__link {
    &._active {
      color: var(--color-primary);
    }
  }
}
.nav-catalog {
  .nav {
    &__link {
      &.router-link-active {
        color: var(--color-primary);
      }
    }
  }
}
</style>
