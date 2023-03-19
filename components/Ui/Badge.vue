<template>
  <div class="badge" :class="[theme && `_${theme}`, size && `_${size}`, mods]" v-bind="$attrs">
    <span v-if="icon" class="badge__icon">
      <nuxt-icon :name="icon" />
    </span>
    <span class="badge__text">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  theme: {
    type: String,
    default: '',
    validator: (x) => ['primary', 'danger', 'success', 'green', 'blue'].includes(x),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (x) => ['medium', 'small'].includes(x),
  },
  icon: {
    type: String,
    default: '',
  },
  clickable: {
    type: Boolean,
    default: false,
  },
})

const mods = computed(() => {
  return {
    _clickable: props.clickable,
  }
})
</script>

<style lang="scss" scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-style: normal;
  border: 1px solid transparent;
  transition: color 0.25s $ease, border 0.25s $ease, border 0.25s $ease;
  &._clickable {
    cursor: pointer;
  }
  &__icon {
    flex: 0 0 auto;
    margin-right: 0.45em;
    .nuxt-icon {
      font-size: 0.8em;
    }
  }

  &._primary {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-primary);
    font-weight: 600;
  }

  &._danger {
    background: var(--color-red);
    border-color: var(--color-red);
    color: white;
  }

  &._success {
    background: var(--color-green);
    border-color: var(--color-green);
    color: white;
  }

  &._green {
    background: var(--badge-green-background);
    border-color: var(--badge-green-background);
    color: var(--badge-green-color);
  }

  &._blue {
    background: var(--badge-blue-background);
    border-color: var(--badge-blue-background);
    color: var(--badge-blue-color);
  }

  &._medium {
    font-size: 16px;
    border-radius: 8px;
    padding: 7px 15px;
  }

  &._small {
    font-weight: 600;
    font-size: 12px;
    border-radius: 4px;
    padding: 6px 7px;
    text-transform: uppercase;
  }
}
</style>
