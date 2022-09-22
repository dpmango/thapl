<template>
  <nav class="nav">
    <ul class="nav__list">
      <li v-for="link in menu">
        <NuxtLink class="nav__link" :to="link.href">{{ link.label }}</NuxtLink>
      </li>
      <li class="nav__more">
        <span>Еще</span>
        <nuxt-icon name="caret" />
      </li>
    </ul>
  </nav>
</template>

<script setup>
const menu = ref([
  {
    href: '#',
    label: 'Бургеры и сендвичи',
  },
  {
    href: '#',
    label: 'Большие поке',
  },
  {
    href: '#',
    label: 'Новогоднее меню',
  },
  {
    href: '#',
    label: 'Мини-поке',
  },
  {
    href: '#',
    label: 'Боулы',
  },
  {
    href: '#',
    label: 'Салаты и закуски',
  },
])
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  &__list {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
    a {
      padding: 5px 10px;
      font-weight: 500;
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-primary);
      }
    }
  }
  &__more {
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
