<template>
  <div
    ref="navRef"
    class="nav js-nav-cat"
    :class="[ui.mobileMenuActive && '_hidden']"
    :style="{ top: `${stickyTop}px` }"
  >
    <div ref="scrollerRef" class="nav__scroller">
      <ul class="nav__list">
        <li v-for="(link, idx) in productStore.navCategories" :key="link.id">
          <LayoutNavLink
            class="nav__link"
            :link="link"
            :nav-scroll-offset="navScrollOffset"
            :active="activeAnchor === idx"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Категории навигации для singlepage представления
// используется на мобльном
// для десктоп - смотреть в папке Layout/Nav/NavScroller

import _ from 'lodash'
import { useProductStore, useUiStore } from '~/store'
import { createScrollableAnchors } from '~~/utils/Elements'

const { $env } = useNuxtApp()

const productStore = useProductStore()
const ui = useUiStore()

// sticky position
const navRef = ref(null)
const stickyTop = ref(80)
const setHeaderOffset = () => {
  try {
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0
    const headerTransform = window.innerWidth <= 767 ? 12 : 12
    const headerPadding = window.innerWidth <= 767 ? 1 : 12

    stickyTop.value = headerHeight - headerTransform - headerPadding
  } catch {}
}

const navScrollOffset = computed(() => {
  try {
    return Math.ceil(stickyTop.value + navRef.value.offsetHeight)
  } catch {
    return 0
  }
})

// aniamate anchors on scroll
const activeAnchor = ref(null)
const scrollerRef = ref(null)

const handleLinksScroll = () => {
  // TODO - refactor to refs
  const scrollTop = window.scrollY
  const smoothLinks = document.querySelectorAll('.js-nav-cat .nav__link')
  const { sections, links } = createScrollableAnchors(smoothLinks)

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    if (Math.ceil(scrollTop) >= section.offsetTop - navScrollOffset.value) {
      activeAnchor.value = links.findIndex((x) => x.name === section.id)
      return
    } else {
      activeAnchor.value = null
    }
  }
}

// auto-set scroller position
watch(
  () => activeAnchor.value,
  (newVal) => {
    const smoothLinks = document.querySelectorAll('.js-nav-cat .nav__link')
    const activeLink = smoothLinks[newVal]
    if (!activeLink) return
    const activeLinkBbox = activeLink.getBoundingClientRect()
    const containerPadding = 24

    const rightPos = window.innerWidth - (activeLinkBbox.left + activeLinkBbox.width)
    const curScroll = scrollerRef.value.scrollLeft

    // const targetScroll = curScroll + rightPos * -1 // active on right
    const targetScroll = curScroll + activeLinkBbox.left - containerPadding // active on left
    scrollerRef.value.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }
)

const debouncedResize = _.debounce(setHeaderOffset, 100)
const throttledScroll = _.throttle(handleLinksScroll, 100)

onMounted(() => {
  setHeaderOffset()
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
  display: none;
  position: sticky;
  z-index: 12;
  // top: 84px;
  background: var(--component-background);
  &__scroller {
    display: flex;
    padding: 0px 24px 16px;
    overflow-x: auto;
  }
  &__list {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    &::after {
      display: inline-block;
      content: ' ';
      flex: 0 0 auto;
      width: 24px;
      height: 1px;
    }
    li {
      flex: 0 0 auto;
      min-width: 1px;
      &:last-child {
        .nav__link {
          margin-right: 0;
        }
      }
    }
  }
  &__link {
    display: inline-block;
    margin-right: 16px;
    padding: 7px 20px;
    background: var(--color-bg);
    border-radius: 30px;
    font-weight: 500;
    font-size: 14px;
    line-height: calc(22 / 14);
    color: var(--color-gray);
    &._active {
      background: var(--color-background);
      color: var(--color-font);
      box-shadow: var(--box-shadow-large);
    }
  }
}

@include r($md) {
  .nav {
    display: block;
    &._hidden {
      visibility: hidden;
    }
  }
}
</style>
