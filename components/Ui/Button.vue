<template>
  <component
    :is="getElement"
    :class="['button', theme, size]"
    :href="href"
    :to="to"
    v-bind="$attrs"
  >
    <div class="button__content">
      <i v-if="iconLeft" class="button__icon _left">
        <nuxt-icon :name="iconLeft" />
      </i>
      <slot />
      <i v-if="iconRight" class="button__icon _right">
        <nuxt-icon :name="iconRight" />
      </i>
    </div>
  </component>
</template>

<script setup>
const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps({
  theme: {
    type: String,
    default: 'primary',
    validator: (theme) => ['primary', 'secondary', 'accent', 'link'].includes(theme),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (theme) => ['large', 'medium', 'small'].includes(theme),
  },
  href: String,
  iconRight: String,
  iconLeft: String,
  to: String,
})

const getElement = computed(() => {
  if (props.href) {
    return 'a'
  } else if (props.to) {
    return NuxtLink
  }

  return 'button'
})
</script>

<style lang="scss" scoped>
.button {
  -webkit-appearance: none;
  position: relative;
  padding: 0;
  display: inline-block;
  border: 1px solid transparent;
  box-sizing: border-box;
  border-radius: var(--button-border-radius);
  text-align: center;
  overflow: hidden;
  font-weight: 500;
  cursor: pointer;
  box-shadow: none;
  transition: background 0.25s $ease, color 0.25s $ease, border 0.25s $ease, outline 0.25s $ease,
    box-shadow 0.25s $ease;

  &__content {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
  }

  &__icon {
    flex: 0 0 auto;
    font-size: 1.3334em;
    &._left {
      margin-right: 0.45em;
    }
    &._right {
      margin-left: 0.45em;
    }
  }

  // themes
  &.primary {
    background: var(--color-primary);
    color: var(--color-font-invert);
    &:focus {
      outline: 4px solid rgba(var(--color-primary-rgb), 0.3);
    }
    &:hover {
      box-shadow: 0px 15px 40px rgba(var(--color-primary-rgb), 0.34);
    }
    &:active {
      background: darken(#ec5c2a, 10%);
      box-shadow: none;
      outline: none;
    }

    &[disabled] {
      background: #e3e9ef;
      color: var(--color-disabled);
      pointer-events: none;
    }
  }

  &.secondary {
    background: rgba(var(--color-primary-rgb), 0.12);
    color: var(--color-primary);
    &:focus {
      outline: 4px solid rgba(var(--color-primary-rgb), 0.3);
    }
    &:hover {
      border-color: var(--color-primary);
    }
    &:active {
      color: darken(#ec5c2a, 10%);
    }
  }

  &.accent {
    background: var(--color-green);
    color: #e8f9f1;
    &:focus {
      outline: 4px solid rgba(0, 97, 174, 0.3);
    }
    &:hover {
      box-shadow: 0px 13px 30px -10px #e6e6e6;
    }
    &:active {
      background: #0fbf6b;
    }
  }

  &.link {
    background: transparent;
    color: var(--color-disabled);
    &:focus {
      outline: 4px solid rgba(0, 97, 174, 0.3);
    }
    &:hover {
      color: var(--color-primary);
    }
    &:active {
      color: #005192;
    }
    .button__content {
      padding: 4px 0 !important;
    }
  }

  // sizes
  &.large {
    .button__content {
      padding: 15px 31px;
      font-size: 18px;
      line-height: calc(24 / 18);
    }
  }

  &.medium {
    .button__content {
      padding: 8px 27px;
      font-size: 16px;
      line-height: calc(26 / 16);
    }
  }

  &.small {
    .button__content {
      padding: 7px 15px;
      font-size: 14px;
      line-height: calc(20 / 14);
    }
  }

  &[block] {
    display: block;
    width: 100%;
  }
}
</style>
