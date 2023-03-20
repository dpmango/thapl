<template>
  <div class="story">
    <div v-if="story.background_image" class="story__bg">
      <img :src="story.background_image" :alt="story.header || ''" />
    </div>

    <div class="story__content">
      <div v-if="story.header" class="story__title">
        <div class="h2-title" :style="storyStyles.header">{{ story.header }}</div>
      </div>

      <div v-if="story.text" class="story__text">
        <div class="h4-title" :style="storyStyles.text">{{ story.text }}</div>
      </div>

      <div
        v-if="story.action"
        v-tooltip="{ content: 'Скопировано', shown: showCopyTooltip, triggers: [] }"
        class="story__action"
      >
        <UiButton size="large" :style="storyStyles.button" @click="handleActionClick">
          {{ story.button_text }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IStoriesDto } from '~/interface/Promo'
import { copyToClipboard } from '#imports'
import { useUiStore } from '~/store'

const props = defineProps<{
  story: IStoriesDto
}>()

const router = useRouter()
const ui = useUiStore()

const storyStyles = computed(() => {
  const {
    header_text_color,
    header_background_color,
    header_vertical_aligment,
    header_horisontal_aligment,
    text_color,
    text_background_color,
    text_vertical_aligment,
    text_horisontal_aligment,
    button_text_color,
    button_background_color,
    button_horisontal_aligment,
    button_vertical_aligment,
  } = props.story
  return {
    header: {
      color: header_text_color || '',
      backgroundColor: header_background_color || '',
      textAlign: header_horisontal_aligment || 'left',
      // horizontalAlign: header_vertical_aligment || '',
    },
    text: {
      color: text_color || '',
      backgroundColor: text_background_color || '',
      textAlign: text_horisontal_aligment || 'left',
      // horizontalAlign: text_vertical_aligment || '',
    },
    button: {
      color: button_text_color || '',
      backgroundColor: button_background_color || '',
      textAlign: button_horisontal_aligment || 'left',
      // horizontalAlign: button_vertical_aligment || '',
    },
  }
})

const handleActionClick = (e) => {
  const { action, action_data } = props.story
  if (!action) return null

  if (['open_link'].includes(action)) {
    // ссылка
    router.push(action_data.url || '/promo')
  } else if (['open_item'].includes(action)) {
    // открыть продукт
    ui.setModal({ name: 'product', params: { id: action_data.item_id } })
  } else if (['open_category', 'open_conception'].includes(action)) {
    // открыть категорию
    router.push(`/category/${action_data.item_id}`)
  } else if (['copy_promo_code'].includes(action)) {
    // копировать в клипборд и показать уведомление
    handleCopyClick(action_data.code || '')
  } else if (['open_balance'].includes(action)) {
    // перейти в профиль?
    router.push('/profile')
  }

  return null
}

const showCopyTooltip = ref(false)

let timer
const handleCopyClick = async (text: string) => {
  await copyToClipboard(text).then(() => {
    showCopyTooltip.value = true

    clearTimeout(timer)
    timer = setTimeout(() => {
      showCopyTooltip.value = false
    }, 2000)
  })
}
</script>

<style lang="scss" scoped>
.story {
  position: relative;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: var(--promo-stories-ar);
  &__bg {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    img {
      flex: 1 1 auto;
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
  &__content {
    flex: 1 0 auto;
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    z-index: 2;
    padding: 40px 36px;
    .h4-title {
      margin-top: 1em;
    }
  }
  &__title {
    margin-top: auto;
  }
  &__text {
    margin-top: 1em;
  }
  &__action {
    margin-top: 24px;
  }
}

@include r($md) {
  .story {
    &__content {
      padding: 32px 24px;
    }
    &__action {
      margin-top: 16px;
    }
  }
}
</style>
