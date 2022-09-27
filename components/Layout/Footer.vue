<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__wrapper">
        <div class="footer__section">
          <div class="footer__section-title">Меню</div>
          <ul class="footer__section-list">
            <li v-for="link in menuLinks">
              <NuxtLink :to="link.slug">{{ link.title }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer__section">
          <div class="footer__section-title">Компания</div>
          <ul class="footer__section-list">
            <li v-for="link in companyLinks">
              <NuxtLink :to="link.href">{{ link.label }}</NuxtLink>
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
import { useProductStore } from '~~/store'

const productStore = useProductStore()

const menuLinks = productStore.categories

const companyLinks = ref([
  { href: '#', label: 'О нас' },
  { href: '#', label: 'Доставка' },
  { href: '#', label: 'Офферта' },
  { href: '#', label: 'Пользовательское соглашение' },
  { href: '#', label: 'Политика обработки персональных данных' },
  { href: '#', label: 'Согласие на обработку персональных данных' },
  { href: '#', label: 'О нас' },
  { href: '#', label: 'О нас' },
])
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
