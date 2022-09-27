<template>
  <div class="modal" :class="modifiers" @click="closeModal">
    <div class="modal__wrapper" @click.prevent.stop>
      <div class="modal__close" @click="closeModal">
        <nuxt-icon name="close" />
      </div>
      <div class="modal__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUiStore } from '~/store'

const ui = useUiStore()
const { modal: activeModal } = storeToRefs(ui)

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'center',
    validator: (v) => ['center', 'aside'].includes(v),
  },
  size: {
    type: String,
    default: 'normal',
    validator: (v) => ['normal', 'wide'].includes(v),
  },
})

const modifiers = computed(() => [
  `modal-${props.name}`,
  isModalActive.value && '_active',
  `_${props.position}`,
  `_${props.size}`,
])

const isModalActive = computed(() => {
  return activeModal.value === props.name
})

const closeModal = () => {
  if (isModalActive.value) {
    ui.closeModal()
  }
}
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
  }

  &__content {
    width: 100%;
    background: var(--modal-body-background);
    box-shadow: var(--box-shadow--extra-large);
    border-radius: var(--card-border-radius);
    overflow-y: auto;
    min-height: 1px;
    height: 100%;
  }

  &__close {
    position: absolute;
    right: -68px;
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
    transition: opacity 0.25s $ease;
    &:hover {
      opacity: 0.7;
    }
  }
  &._center {
    padding: 20px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

  &._active {
    pointer-events: all;
    opacity: 1;
  }
}
</style>
