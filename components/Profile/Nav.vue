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
  overflow-y: auto;
  max-width: 100vw;
  li {
    position: relative;
    flex: 0 0 auto;
    margin-right: 44px;
    &::after {
      display: inline-block;
      content: ' ';
      position: absolute;
      top: 50%;
      right: -22px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--color-border);
    }
    &:last-child {
      margin-right: 0;
      &::after {
        display: none;
      }
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

@include r($md) {
  .nav {
    li {
      margin-right: 36px;
      &::after {
        right: -18px;
      }
    }
    a {
      font-size: 20px;
    }
  }
}
</style>
