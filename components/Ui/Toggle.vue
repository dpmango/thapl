<template>
  <div class="toggle" :class="[error && '_error']">
    <label
      v-for="(item, idx) in list"
      :key="item.id || idx"
      class="toggle__item"
      :class="[value === (item.id || idx) && '_active']"
      @click.prevent="() => change(item.id || idx)"
    >
      <span class="toggle__text text-m">
        {{ item.label || item }}
      </span>
    </label>
  </div>
</template>

<script setup>
const emit = defineEmits(['onChange'])

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  list: {
    type: Array,
    default: () => [],
  },
  error: {
    type: [String, Boolean],
    required: false,
  },
})

const change = (id) => {
  emit('onChange', id)
}
</script>

<style lang="scss" scoped>
.toggle {
  display: inline-flex;
  align-items: center;
  position: relative;
  border-radius: 22px;
  background: var(--color-bg);
  &__item {
    flex: 0 0 auto;
    padding: 10px 24px;
    border-radius: 22px;
    cursor: pointer;
    transition: background 0.25s $ease, box-shadow 0.25s $ease;
    &._active {
      background: var(--component-background);
      box-shadow: var(--box-shadow-large);
      .toggle__text {
        color: var(--color-font);
      }
    }
    &:hover {
      .toggle__text {
        color: var(--color-font);
      }
    }
  }
  &__text {
    font-weight: 500;
    color: var(--color-gray);
    transition: color 0.25s $ease;
  }
}
</style>
