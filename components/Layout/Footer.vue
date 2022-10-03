<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__wrapper">
        <div class="footer__section">
          <div class="footer__section-title">Меню</div>
          <ul class="footer__section-list">
            <li v-for="link in productStore.navCategories">
              <NuxtLink :to="link.slug">{{ link.title }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="app_settings.site_footer_menu" class="footer__section">
          <div class="footer__section-title">Компания</div>
          <ul class="footer__section-list">
            <li v-for="link in app_settings.site_footer_menu">
              <NuxtLink
                :to="link.target_url || link.target_id.slug"
                :target="link.target_url ? '_blank' : ''"
              >
                {{ link.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="app_settings.app_store_id" class="footer__section">
          <div class="footer__section-title">Мобильные приложения</div>
          <ul class="footer__social-list">
            <li v-if="app_settings.app_store_id">
              <a :href="app_settings.app_store_id">
                <img src="~/assets/img/app-store.svg" alt="app store" />
              </a>
            </li>
          </ul>
        </div>

        <div class="footer__section">
          <div class="footer__bottom">
            <div class="footer__copy">© 2020 Thapl.com, все права защищены</div>
            <a href="/" target="_blank" class="footer__developer">
              <img src="~/assets/img/developer.svg" alt="MainBrain" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useProductStore, useSessionStore } from '~~/store'

const productStore = useProductStore()
const sessionStore = useSessionStore()
const { app_settings } = storeToRefs(sessionStore)
</script>

<style lang="scss" scoped>
.footer {
  &__wrapper {
    border-top: 1px solid var(--color-border);
    padding: 20px 0 60px;
  }
  &__section {
    margin-top: 40px;
  }
  &__section-title {
    font-weight: 500;
    color: var(--color-primary);
  }
  &__section-list {
    margin: 12px -6px;
    display: flex;
    flex-wrap: wrap;
    line-height: 1.62;
    li {
      flex: 0 0 auto;
      margin-right: 10px;
      &::after {
        display: inline-block;
        content: ' ';
        width: 4px;
        height: 4px;
        margin-left: 10px;
        border-radius: 50%;
        vertical-align: middle;
        background: var(--color-border);
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
    }
    a {
      display: inline-block;
      padding: 6px 6px;
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-primary);
      }
    }
  }
  &__social-list {
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    li {
      flex: 0 0 auto;
      margin-right: 20px;
    }
  }
  &__bottom {
    display: flex;
    justify-content: space-between;
  }
  &__copy {
    color: var(--color-gray);
  }
  &__developer {
    font-size: 0;
  }
}
</style>
