<template>
  <div class="toggle" :class="[`_${size}`, autosize && '_autosize', error && '_error']">
    <label
      v-for="(item, idx) in list"
      :key="item.id || idx"
      class="toggle__item"
      :class="[value === (item.id || idx) && '_active']"
      @click.prevent="() => change(item.id || idx)"
    >
      <span class="toggle__text">
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
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['medium', 'small'].includes(v),
  },
  autosize: {
    type: Boolean,
    default: false,
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
  border-radius: 30px;
  background: var(--color-bg);
  &__item {
    flex: 0 0 auto;
    border-radius: 30px;
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

  &._medium {
    .toggle {
      &__item {
        padding: 10px 24px;
      }
      &__text {
        font-size: 16px;
        line-height: calc(26 / 16);
      }
    }
  }

  &._small {
    .toggle {
      &__item {
        padding: 8px 16px;
      }
      &__text {
        font-size: 12px;
        line-height: calc(20 / 12);
      }
    }
  }

  &._autosize {
    display: flex;
    .toggle__item {
      flex: 1 1 auto;
      padding-left: 8px;
      padding-right: 8px;
      text-align: center;
    }
  }
}
</style>
