<template>
  <ul class="nav">
    <li>
      <NuxtLink to="/profile">Профиль</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/profile/orders">Заказы</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/profile/address">Адреса</NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.nav {
  display: flex;
  align-items: center;
  li {
    flex: 0 0 auto;
    margin-right: 44px;
    &:last-child {
      margin-right: 0;
    }
  }
  a {
    font-weight: 500;
    font-size: 28px;
    line-height: calc(38 / 28);
    color: var(--color-gray);
    text-decoration-line: underline;
    transition: color 0.25s $ease;
    &.router-link-exact-active {
      color: var(--color-font);
      text-decoration-line: none;
    }
    &:hover {
      color: var(--color-font);
    }
  }
}
</style>
