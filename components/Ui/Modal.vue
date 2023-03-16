<template>
  <div class="modal" :class="modifiers" @click="closeModal">
    <div class="modal__wrapper" @click.prevent.stop>
      <div v-if="modalParams?.closable" class="modal__close" @click="closeModal">
        <nuxt-icon name="close" />
      </div>
      <div class="modal__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '~/store'
import { lockBody, unlockBody } from '#imports'

const ui = useUiStore()
const { modal: activeModal, modalParams } = storeToRefs(ui)

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'center',
    validator: (v: string) => ['center', 'aside'].includes(v),
  },
  height: {
    type: String,
    default: '',
    validator: (v: string) => ['', 'fill'].includes(v),
  },
  size: {
    type: String,
    default: 'normal',
    validator: (v: string) => ['normal', 'large', 'x-large'].includes(v),
  },
  padding: {
    type: Boolean,
    default: true,
  },
  scrolling: {
    type: Boolean,
    default: true,
  },
})

const modifiers = computed(() => [
  `modal-${props.name}`,
  isModalActive.value && '_active',
  `_${props.position}`,
  `_${props.size}`,
  `_${props.height}`,
  !props.padding && '_no-padding',
  !props.scrolling && '_no-scrolling',
])

const isModalActive = computed(() => {
  return activeModal.value.includes(props.name)
})

const closeModal = () => {
  if (modalParams.value?.closable === false) {
    return false
  }

  if (isModalActive.value) {
    ui.closeModal()
  }
}

watch(
  () => isModalActive.value,
  (newVal) => {
    if (newVal) {
      lockBody()
    } else {
      unlockBody()
    }
  }
)
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: var(--modal-background);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s $ease;
  will-change: opacity;

  &__wrapper {
    width: 100%;
    max-height: 100%;
    position: relative;
    transition: transform 0.25s $ease;
    will-change: transform;
  }

  &__content {
    width: 100%;
    background: var(--modal-body-background);
    box-shadow: var(--box-shadow--extra-large);
    overflow-y: auto;
    min-height: 1px;
    height: 100%;
  }

  &__close {
    position: absolute;
    z-index: 2;
    top: 50%;
    width: 48px;
    height: 48px;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--modal-body-background);
    border-radius: 50%;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.25s $ease;
    &:hover {
      color: var(--color-primary);
    }
  }
  &._center {
    padding: 20px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .modal {
      &__close {
        right: -68px;
      }
      &__wrapper {
        transform: translate(0, 24px);
      }
      &__content {
        border-radius: var(--card-border-radius);
      }
    }
  }

  &._normal {
    .modal {
      &__wrapper {
        max-width: 432px;
      }
      &__content {
        padding: 48px 64px;
      }
    }
  }
  &._large {
    .modal {
      &__wrapper {
        max-width: 832px;
      }
      &__content {
        padding: 48px 64px;
      }
    }
  }

  &._x-large {
    .modal {
      &__wrapper {
        max-width: 968px;
      }
      &__content {
        padding: 48px 48px;
      }
    }
  }

  &._aside {
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    .modal {
      &__wrapper {
        max-width: 516px;
        transform: translate(100%, 0);
      }
      &__close {
        left: -68px;
      }
    }
  }
  &._fill {
    .modal {
      &__wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      &__content {
        display: flex;
        flex-direction: column;
      }
    }
  }

  &._no-padding {
    .modal__content {
      padding: 0;
    }
  }
  &._no-scrolling {
    .modal__content {
      overflow-y: hidden;
    }
  }

  &._active {
    pointer-events: all;
    opacity: 1;
    .modal__wrapper {
      transform: none;
    }
  }
}

@include r(1120) {
  .modal {
    &._x-large {
      .modal {
        &__close {
          top: 14px;
          left: auto;
          right: 8px;
          transform: none;
        }
      }
    }
  }
}

@include r($lg) {
  .modal {
    &._large {
      .modal {
        &__close {
          top: 14px;
          left: auto;
          right: 8px;
          transform: none;
        }
      }
    }
  }
}

@include r($md) {
  .modal {
    &._normal {
      .modal {
        // &__wrapper {
        //   // max-width: 432px;
        // }
        &__content {
          padding: 24px;
        }
      }
    }

    &._large {
      .modal {
        &__content {
          padding: 24px;
        }
      }
    }

    &._aside {
      .modal {
        &__close {
          top: 16px;
          left: auto;
          right: 6px;
          transform: none;
        }
      }
    }

    &._no-padding {
      .modal__content {
        padding: 0;
      }
    }
  }
}

@include r($sm) {
  .modal {
    &._normal {
      .modal {
        &__close {
          top: 14px;
          left: auto;
          right: 8px;
          transform: none;
        }
      }
    }

    // центрированные модальные в мобильной версии
    // normal прибиты к низу
    // large и x_large растянуты на 100% высоты
    &._center {
      padding: 0;
      .modal {
        &__content {
          border-radius: var(--card-border-radius-sm);
        }
      }

      &._normal {
        .modal {
          &__wrapper {
            margin-top: auto;
            max-width: 100%;
          }
          &__content {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
      }

      &._large,
      &._x-large {
        .modal {
          &__wrapper {
            height: 100%;
          }
          &__content {
            border-radius: 0;
          }
        }
      }
    }
  }
}
</style>
