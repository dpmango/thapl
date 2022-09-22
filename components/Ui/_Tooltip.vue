<template>
  <VTooltip class="tooltip">
    <nuxt-icon v-if="icon" :name="icon" :opacity="true" />
    <template #popper>
      <div class="tooltip__content text-xs">
        <slot></slot>
      </div>
    </template>
  </VTooltip>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: 'close',
  },
})
</script>

<style lang="scss" scoped>
.tooltip {
  .nuxt-icon {
    font-size: 24px;
    color: var(--color-gray);
  }
  &__content {
    color: var(--color-gray);
    :deep(strong) {
      font-weight: 600;
      font-size: 14px;
    }
    :deep(p) {
      margin-top: 8px;
      &:first-child {
        margin-top: 0;
      }
    }
    :deep(a) {
      color: var(--color-primary);
    }
  }
}
</style>

<style lang="scss">
.v-popper--theme-tooltip {
  .v-popper {
    &__inner {
      max-width: 280px;
      background: white;
      box-shadow: 0px 13px 31px -10px rgba(151, 163, 172, 0.36);
      border-radius: 8px;
      color: var(--color-font);
      padding: 12px;
    }
    &__arrow-outer {
      border-color: white;
    }
  }
}
</style>
