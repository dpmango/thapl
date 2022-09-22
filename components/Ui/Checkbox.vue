<template>
  <label
    class="cb checkbox radio"
    :for="id"
    :class="[isRadio && '_radio', checked && '_active', disabled && '_disabled', error && '_error']"
    @click.prevent="change"
  >
    <input
      :id="id"
      class="cb__input"
      :type="type"
      :name="name"
      :disabled="disabled"
      v-bind="$attrs"
      :checked="checked"
    />
    <span class="cb__icon">
      <nuxt-icon name="checkmark" />
    </span>
    <span class="cb__text text-m">
      <slot />
    </span>
  </label>
</template>

<script setup>
// dump component to prevent errors
// @checked is controlled by parent state
import { nanoid } from 'nanoid'
const id = nanoid(10)

const emit = defineEmits(['change'])

const props = defineProps({
  type: {
    type: String,
    default: 'checkbox',
  },
  checked: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: 'name',
  },
  text: {
    type: String,
    default: '',
  },
  error: {
    type: [String, Boolean],
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const isRadio = computed(() => {
  return props.type === 'radio'
})

const change = () => {
  emit('change', !this.checked)
}
</script>

<style lang="scss" scoped>
.cb {
  display: inline-flex;
  align-items: flex-start;
  position: relative;
  font-size: 16px;
  line-height: 145%;

  &__input {
    width: 0.1px;
    height: 0.1px;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
  }

  &__icon {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    min-width: 24px;
    min-height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 2px solid #c8c8c8;
    font-size: 12px;
    color: white;
    cursor: pointer;
    transition: border 0.25s $ease, background 0.25s $ease, outline 0.25s $ease;

    .nuxt-icon {
      opacity: 0;
      transform: scale(0.5);
      pointer-events: none;
      will-change: transform, opacity;
      transition: transform 0.25s $ease, opacity 0.25s $ease;
    }
  }

  &__text {
    cursor: pointer;
    padding-left: 12px;
    color: var(--color-gray);
    transition: color 0.2s;

    strong {
      font-weight: 600;
    }

    a {
      color: var(--color-primary);
      text-decoration: underline;
    }
  }

  &._radio {
    .cb {
      &__icon {
        border-radius: 50%;
        &::after {
          display: inline-block;
          content: ' ';
          position: absolute;
          top: 1px;
          right: 1px;
          bottom: 1px;
          left: 1px;
          background: var(--color-primary);
          opacity: 0.5;
          border-radius: 50%;
          transform: scale(0);
          transition: opacity 0.25s $ease, transform 0.25s $ease;
          will-change: transform, opacity;
        }

        .nuxt-icon {
          display: none !important;
        }
      }
    }
  }

  &:hover {
    .cb__icon {
      border-color: var(--color-primary);
    }
  }

  .cb__input:focus + .cb__icon {
    outline: 4px solid rgba(var(--color-primary-rgb), 0.3);
  }

  &._active {
    .cb {
      &__icon {
        border-color: var(--color-primary);
        &::after {
          transform: scale(1);
          opacity: 1;
        }
        .nuxt-icon {
          opacity: 1;
          transform: scale(1);
        }
      }
      &__text {
        color: var(--color-font);
      }
    }

    &:not(._radio) {
      .cb__icon {
        background: var(--color-primary);
      }
    }
  }

  &._disabled {
    cursor: none;
    pointer-events: none;
    .cb__icon {
      border-color: #aeaeae;
      &::after {
        background: #aeaeae;
      }
    }
    &:not(._active) {
      .cb__icon {
        background: var(--color-bg);
      }
    }
  }
  &._error {
    .cb {
      &__icon {
        border-color: var(--color-red);
        &::after {
          transform: scale(0);
        }
      }
    }
  }
}
</style>
