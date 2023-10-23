<template>
  <div class="copy" v-bind="$attrs">
    <div class="copy__box" @click="handleCopyClick">
      <div ref="textRef" class="copy__content">
        <slot />
      </div>
      <div
        v-tooltip="{ content: 'Скопировано', shown: showCopyTooltip, triggers: [] }"
        class="copy__action"
      >
        <UiButton theme="accent" size="small">{{ actionText }}</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { copyToClipboard } from '#imports'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  actionText: {
    type: String,
    default: 'Скопировать',
  },
})

const showCopyTooltip = ref(false)
const textRef = ref(null)

let timer
const handleCopyClick = async () => {
  if (!textRef.value) return
  await copyToClipboard(props.text, textRef.value).then(() => {
    showCopyTooltip.value = true

    clearTimeout(timer)
    timer = setTimeout(() => {
      showCopyTooltip.value = false
    }, 2000)
  })
}
</script>

<style lang="scss" scoped>
.copy {
  &__box {
    background: rgba(var(--color-primary-rgb), 0.12);
    border: 0;
    border-radius: var(--card-border-radius);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 24px 32px;
    cursor: pointer;
  }
  &__content {
    flex: 1 1 auto;
    padding-right: 16px;
    min-width: 1px;
    overflow-wrap: break-word;
    // @include text-overflow;
  }
  &__action {
    margin: 8px 0;
    flex: 0 0 auto;
  }
}

@include r($sm) {
  .copy {
    &__box {
      padding: 16px 24px;
    }
  }
}
</style>
