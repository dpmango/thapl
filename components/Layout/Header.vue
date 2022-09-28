<template>
  <header
    class="header"
    :class="[variant && `header-${variant}`, scrolled && '_scroll']"
    :style="{ transform: `translate(0, -${topHeight}px)` }"
  >
    <div class="container">
      <!-- topbar -->
      <div ref="topRef" class="header__top row">
        <div class="header__hamburger" @click="toggleMobile">
          <div class="hamburger" :class="[ui.mobileMenuActive && '_active']">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div class="col header__logo">
          <NuxtLink to="/">
            <img :src="site_settings.main_logo" alt="logo" />
          </NuxtLink>
        </div>

        <div v-if="$env.useRegions" class="col header__tile hidden-lg">
          <div class="tile _action" @click="() => ui.setModal({ name: 'region' })">
            <span class="tile__label tile__overflow">Город</span>
            <div class="tile__value">
              <span class="tile__overflow">{{ session.currentRegionName }}</span>
              <nuxt-icon name="caret" />
            </div>
          </div>
        </div>

        <div class="col header__tile hidden-md">
          <div class="tile _action" @click="() => ui.setModal({ name: 'address' })">
            <span class="tile__label tile__overflow">Адрес доставки</span>
            <div class="tile__value">
              <span class="tile__overflow">Укажите адрес</span>
              <nuxt-icon name="caret" />
            </div>
          </div>
        </div>

        <div class="col header__tile hidden-lg">
          <div class="tile">
            <span class="tile__label tile__overflow">Время работы</span>
            <div class="tile__value">
              <span>10:00 – 22:00</span>
            </div>
          </div>
        </div>

        <div class="header__actions-mobile visible-md">
          <div class="action" @click="() => ui.setModal({ name: 'cart' })">
            <div class="action__icon">
              <nuxt-icon name="cart" />
            </div>
          </div>
        </div>

        <div class="col header__actions row">
          <div class="col">
            <NuxtLink to="/ui" class="action">
              <div class="action__icon">
                <nuxt-icon name="heart" />
              </div>
              <div class="action__text">Бонусы</div>
            </NuxtLink>
          </div>
          <div v-if="!session.user" class="col">
            <div class="action" @click="() => ui.setModal({ name: 'auth' })">
              <div class="action__icon">
                <nuxt-icon name="login" />
              </div>
              <div class="action__text">Войти</div>
            </div>
          </div>
          <div v-else class="col">
            <NuxtLink to="/profile" class="action">
              <div class="action__icon">
                <nuxt-icon name="login" />
              </div>
              <div class="action__text">{{ session.userNameVerbose }}</div>
            </NuxtLink>
          </div>
          <div class="col">
            <div class="action">
              <div class="action__icon"><nuxt-icon name="dialog" /></div>
              <div class="action__text">Контакты</div>
            </div>
          </div>
        </div>
      </div>

      <!-- bottom -->
      <div class="header__bottom">
        <div class="header__search">
          <NuxtIcon name="search" />
        </div>
        <LayoutHeaderNav class="header__nav" />
        <div class="header__cta" @click="() => ui.setModal({ name: 'cart' })">
          <UiButton>Корзина</UiButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import _ from 'lodash'
import { useSessionStore, useUiStore } from '~/store'

const ui = useUiStore()
const session = useSessionStore()
const { $env } = useNuxtApp()
const {
  app_settings: { site_settings },
} = session

defineProps({
  variant: {
    type: String,
    default: 'main',
    validator: (x) => ['main'].includes(x),
  },
})

const scrolled = ref(false)
const topHeight = ref(0)
const topRef = ref(null)

const toggleMobile = () => {
  ui.setMobileMenu(!ui.mobileMenuActive)
}

// this.scrollSticky = _.throttle(this.handleSticky, 50)
const scrollSticky = () => {
  if (!topRef.value) return

  const scrollTop = window.scrollY
  const triggerHeight = window.innerWidth <= 767 ? 0 : topRef.value.offsetHeight

  scrolled.value = scrollTop > triggerHeight
  topHeight.value = scrollTop > triggerHeight ? triggerHeight : 0
}

onMounted(() => {
  window.addEventListener('scroll', scrollSticky, false)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollSticky, false)
})
</script>

<style lang="scss" scoped>
.header {
  z-index: 9;
  top: 0;
  background: var(--header-background);
  transition: box-shadow 0.25s $ease;
  will-change: transform;
  &__top {
    align-items: center;
    flex-wrap: nowrap;
    padding: 40px 0 12px;
  }
  &__logo {
    flex: 0 0 auto;
    font-size: 0;
    a {
      width: var(--logo-space);
    }
  }
  &__tile {
    flex: 0 1 $col2;
  }
  &__actions {
    margin-left: auto;
    flex-direction: row;
  }

  &__bottom {
    display: flex;
    align-items: center;
    padding: 12px 0;
  }
  &__search {
    flex: 0 0 auto;
    padding-right: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.25s $ease;
    &:hover {
      color: var(--color-primary);
    }
  }
  &__nav {
    flex: 1 1 auto;
    padding: 0 80px 0 0px;
  }
  &__cta {
    flex: 0 0 auto;
  }
  &__hamburger {
    display: none;
  }
  &._scroll {
    position: sticky;
    box-shadow: var(--box-shadow-large);
  }
  // &:hover {
  //   transform: none !important;
  //   transition: transform 0.25s $ease;
  // }
}

@include r($xl) {
  .header {
    &__logo {
    }
  }
}

@include r($lg) {
  .header {
    &__top {
      padding: 24px 0 12px;
    }
    &__tile {
      flex: 0 0 auto;
    }
    &__nav {
      padding-right: 20px;
    }
  }
}

@include r($md) {
  .header {
    transform: none !important;
    transition: transform 0.25s $ease, box-shadow 0.25s $ease;
    &._scroll {
      transform: translateY(-12px) !important;
    }
    &__top {
      margin-left: 0;
      margin-right: 0;
      padding: 24px 0 12px;
    }
    &__logo {
      margin-left: auto;
      margin-right: auto;
      a {
        width: var(--logo-space-md);
      }
    }
    &__hamburger {
      display: block;
      padding: 10px;
      margin-left: -10px;
      &:hover {
        .hamburger span {
          color: var(--color-primary);
        }
      }
    }
    &__actions-mobile {
      margin-right: -10px;
      .action {
        padding: 10px;
      }
    }
    &__actions {
      display: none;
    }
    &__bottom {
      display: none;
    }
  }
}

.tile {
  line-height: 1.62;
  display: flex;
  flex-direction: column;
  &__label {
    color: var(--color-gray);
  }
  &__value {
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    min-width: 1px;
    .nuxt-icon {
      font-size: 10px;
      margin-left: 8px;
    }
  }
  &__overflow {
    @include text-overflow();
  }
  &._action {
    cursor: pointer;
    .tile__value {
      color: var(--color-primary);
      transition: color 0.25s $ease;
    }
    &:hover {
      .tile__value {
        color: rgba(var(--color-primary-rgba), 0.8);
      }
    }
  }
}

.action {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.62;
  transition: color 0.25s $ease;
  cursor: pointer;

  &__icon {
    font-size: 18px;
  }
  &__text {
    margin-top: 4px;
    font-weight: 600;
  }
  &:hover {
    color: var(--color-primary);
  }
}
</style>
