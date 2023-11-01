<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__wrapper">
        <div
          v-if="showMenuSection"
          class="footer__section _nav"
          :class="[activeSection === 1 && '_active']"
        >
          <div class="footer__section-title h6-title" @click="handleAccordeon(1)">
            Меню
            <NuxtIcon name="caret" />
          </div>
          <ul class="footer__section-list">
            <li v-for="link in navCategoriesMapper" :key="link.id">
              <NuxtLink :to="link.slug">{{ link.title }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div
          v-if="app_settings.site_footer_menu"
          class="footer__section _nav"
          :class="[activeSection === 2 && '_active']"
        >
          <div class="footer__section-title h6-title" @click="handleAccordeon(2)">
            {{ $env.footerNavTitle }}
            <NuxtIcon name="caret" />
          </div>
          <ul class="footer__section-list">
            <li v-for="link in app_settings.site_footer_menu" :key="link.id">
              <UiAtomLinkType :link="link" />
            </li>
          </ul>
        </div>

        <div v-if="hasMarketingSection" class="footer__section">
          <div class="footer__section-title h6-title hidden-sm">Мобильные приложения</div>
          <ul class="footer__social-list">
            <UiAtomMobileApps />
          </ul>
        </div>

        <div class="footer__section">
          <div class="footer__bottom">
            <div class="footer__copy">© 2020 Thapl.com, все права защищены</div>
            <a href="https://thapl.com" target="_blank" class="footer__developer">
              <img src="~/assets/img/developer.svg" alt="MainBrain" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProductStore, useSessionStore } from '~/store'

const productStore = useProductStore()
const sessionStore = useSessionStore()
const { app_settings, hasMarketingSection } = storeToRefs(sessionStore)
const { navCategories } = storeToRefs(productStore)

const { $env } = useNuxtApp()

const showMenuSection = computed(() => {
  if ($env.catalogType === 'singlepage') {
    return false
  }

  return true
})

const navCategoriesMapper = computed(() => {
  if ($env.catalog === 'singlepage') {
    return navCategories.value
  } else {
    return navCategories.value.map((link) => ({
      ...link,
      slug: `/category/${link.slug}`,
    }))
  }
})

// mobile accardeon
const activeSection = ref(null)
const handleAccordeon = (id) => {
  activeSection.value = activeSection.value === id ? null : id
}
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
    .nuxt-icon {
      display: none;
    }
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
    :deep(li) {
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
    display: inline-block;
    font-size: 0;
  }
}

@include r($sm) {
  .footer {
    &__wrapper {
      padding-top: 0;
      // todo - only if quickFilter
      padding-bottom: 60px;
    }
    &__section {
      margin-top: 24px;
    }
    &__section-list {
      margin: 0;
    }
    &__bottom {
      display: block;
    }
    &__developer {
      margin-top: 12px;
    }
    // accordeon styles
    &__section._nav {
      margin: 0;
      border-bottom: 1px solid var(--color-border);
      .footer {
        &__section-title {
          display: flex;
          align-items: center;
          padding: 16px 0;
          cursor: pointer;
          .nuxt-icon {
            display: block;
            margin-left: auto;
            font-size: 10px;
            transition: transform 0.25s $ease;
          }
        }
        &__section-list {
          overflow-y: hidden;
          height: 0;
          opacity: 0;
          transition: ease 0.3s;
          visibility: hidden;
          li {
            flex: 0 0 100%;
            &::after {
              display: none;
            }
          }
        }
      }
      &._active {
        .footer {
          &__section-title {
            .nuxt-icon {
              transform: rotate(180deg);
            }
          }
          &__section-list {
            height: auto;
            visibility: visible;
            opacity: 1;
            padding-bottom: 16px;
          }
        }
      }
    }
  }
}
</style>
