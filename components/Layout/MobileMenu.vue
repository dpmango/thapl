<template>
  <div class="mobile-menu" :style="style" :class="[ui.mobileMenuActive && '_active']">
    <div class="mobile-menu__bg" @click="closeMobile"></div>
    <div class="mobile-menu__box">
      <div class="mobile-menu__actions">
        <div v-if="$env.useRegions" class="selector" @click="() => ui.setModal({ name: 'region' })">
          <div class="selector__title text-s c-gray">
            <span>{{ $t('header.city') }}</span>
          </div>
          <div class="selector__value text-m c-primary">
            <span class="selector__overflow">{{ currentRegionName }}</span>
            <nuxt-icon name="caret" />
          </div>
        </div>

        <div class="selector" @click="() => ui.setModal({ name: 'address' })">
          <div class="selector__title text-s c-gray">
            <span v-if="currentAddress?.type === 'takeaway'">{{
              $t('header.takeawayAddress')
            }}</span>
            <span v-else>{{ $t('header.deliveryAddress') }}</span>
          </div>
          <div class="selector__value text-m c-primary">
            <span class="selector__overflow">
              <template v-if="currentAddress">{{ currentAddress.name }}</template>
              <template v-else>{{ $t('header.wantAddress') }}</template>
            </span>
            <nuxt-icon name="caret" />
          </div>
        </div>

        <NuxtLink v-if="app_settings.loyalty?.enabled" to="/loyalty" class="action">
          <div class="action__icon">
            <nuxt-icon name="heart" />
          </div>
          <div class="action__text">{{ $env.loyaltyTitle }}</div>
        </NuxtLink>

        <div v-if="!isAuthenticated" class="action" @click="() => ui.setModal({ name: 'auth' })">
          <div class="action__icon">
            <nuxt-icon name="login" />
          </div>
          <div class="action__text">Войти в личный кабинет</div>
        </div>

        <NuxtLink v-else to="/profile" class="action">
          <div class="action__icon">
            <nuxt-icon name="login" />
          </div>
          <div class="action__text">{{ session.userNameVerbose }}</div>
        </NuxtLink>

        <div
          v-if="$env.useContacts"
          class="action"
          @click="() => ui.setModal({ name: 'contacts' })"
        >
          <div class="action__icon"><nuxt-icon name="dialog" /></div>
          <div class="action__text">Контакты</div>
        </div>
      </div>

      <!-- nav -->
      <nav class="mobile-menu__nav">
        <div v-if="$env.useSearch" class="mobile-menu__search" @click="openSearch">
          <UiInput icon="search" value="" icon-position="left" placeholder="Поиск блюд" />
        </div>
        <ul class="nav">
          <li v-for="link in productStore.navCategories" :key="link.id">
            <LayoutNavLink :link="link" @on-click="closeMobile" />
          </li>
        </ul>
      </nav>

      <nav v-if="app_settings.site_mobile_menu" class="mobile-menu__nav">
        <ul class="nav _secondary">
          <li v-for="link in app_settings.site_mobile_menu" :key="link.id">
            <UiAtomLinkType class="nav__link" :link="link" />
          </li>
        </ul>
      </nav>

      <div v-if="hasMarketingSection" class="mobile-menu__nav">
        <ul class="socials">
          <UiAtomMobileApps />
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore, useSessionStore, useProductStore, useDeliveryStore } from '~/store'
import { lockBody, unlockBody } from '#imports'

const { $env } = useNuxtApp()

const ui = useUiStore()
const session = useSessionStore()
const productStore = useProductStore()
const deliveryStore = useDeliveryStore()
const { mobileMenuOffest } = storeToRefs(ui)
const { app_settings, hasMarketingSection, isAuthenticated } = storeToRefs(session)
const { currentRegionName, currentAddress } = storeToRefs(deliveryStore)

const closeMobile = () => {
  ui.setMobileMenu(false)
}

const style = computed(() => {
  const height = `${mobileMenuOffest.value}px`
  return {
    top: height,
    height: `calc(100% - ${height})`,
  }
})

const openSearch = () => {
  ui.setSearchActive(true)
  ui.setMobileMenu(false)
}

watch(
  () => ui.mobileMenuActive,
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
.mobile-menu {
  position: fixed;
  z-index: 98;
  left: 0;
  top: 50px;
  width: 100%;
  height: calc(100% - 50px);
  pointer-events: none;

  &._active {
    @include r($md) {
      pointer-events: all;
      border-top: 1px solid var(--color-border);
      .mobile-menu {
        &__bg {
          opacity: 1;
        }
        &__box {
          transform: translateX(0);
        }
      }
    }
  }

  &__bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--modal-background);
    transition: opacity 0.25s $ease;
    opacity: 0;
  }

  &__box {
    position: absolute;
    left: 0;
    top: 0;
    width: 85%;
    max-width: 414px;
    height: 100%;
    background: var(--header-background);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 0 0px 48px;
    transition: transform 0.25s $ease;
    transform: translateX(-100%);
    will-change: transform;
  }

  &__actions {
    padding: 0 24px;
    border-bottom: 1px solid var(--color-border);
  }
  &__nav {
    padding: 20px 24px 0;
  }
  &__search {
    margin: 8px 0 20px;
  }
}

@include r($mobile-s) {
  .mobile-menu {
    &__box {
      width: 100%;
    }
  }
}

.action {
  text-align: center;
  display: flex;
  align-items: center;
  padding: 16px 0;
  line-height: 1.62;
  border-top: 1px solid var(--color-border);
  transition: color 0.25s $ease;
  cursor: pointer;

  &__icon {
    flex: 0 0 calc(18px + 16px);
    font-size: 16px;
  }
  &__text {
    font-weight: 500;
  }
  &:hover {
    color: var(--color-primary);
  }
}

.nav {
  list-style: none;
  padding: 0 0 20px;
  border-bottom: 1px solid var(--color-border);
  li {
    display: block;
    flex: 0 0 auto;
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__link {
    display: inline-block;
    font-weight: 500;
    font-size: 16px;
    line-height: calc(26 / 16);
    padding: 4px 0px;
    font-weight: 500;
    transition: color 0.25s $ease;
    &:hover {
      color: var(--color-primary);
    }
  }
  &._secondary {
    .nav__link {
      font-weight: 400;
    }
  }
}

.socials {
  margin: 4px -12px;
  display: flex;
  flex-wrap: wrap;
  :deep(li) {
    flex: 0 0 168px;
    padding: 0 12px;
  }
}

.selector {
  margin: 0 -24px;
  cursor: pointer;
  margin-bottom: 10px;
  &:first-child {
    margin-top: 12px;
  }
  &__title {
    position: relative;

    span {
      position: relative;
      z-index: 2;
      background: var(--header-background);
      padding-left: 8px;
      padding-right: 8px;
      margin-left: 16px;
    }
    &::before {
      display: inline-block;
      content: ' ';
      position: absolute;
      top: 50%;
      height: 1px;
      transform: translateY(-50%);
      left: 0;
      right: 0;
      background: var(--color-border);
    }
  }
  &__value {
    display: flex;
    align-items: center;
    margin-top: 6px;
    padding: 0 24px;
  }
  &__overflow {
    font-weight: 500;
    @include text-overflow();
    padding-right: 16px;
  }
  .nuxt-icon {
    margin-left: auto;
    font-size: 12px;
  }
}
</style>
