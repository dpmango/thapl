<template>
  <div class="story">
    <div v-if="story.background_image" class="story__bg">
      <img :src="story.background_image" :alt="story.header || ''" />
    </div>

    <div class="story__content">
      <div
        v-if="story.action && buttonDomPosition === 'before'"
        v-tooltip="{ content: 'Скопировано', shown: showCopyTooltip, triggers: [] }"
        class="story__action"
        :style="storyStyles.buttonXY"
      >
        <UiButton block size="large" :style="storyStyles.button" @click="handleActionClick">
          {{ story.button_text }} {{ story.button_vertical_alignment }}
        </UiButton>
      </div>

      <div class="story__content-wrapper" :style="storyStyles.contentY">
        <span v-if="story.header" class="story__title" :style="storyStyles.contentX">
          <span class="h2-title" :style="storyStyles.header">
            {{ story.header }} {{ story.header_vertical_alignment }}
          </span>
        </span>

        <div v-if="story.text" class="story__text">
          <div class="h4-title" :style="storyStyles.text">{{ story.text }}</div>
        </div>
      </div>

      <div
        v-if="story.action && buttonDomPosition === 'after'"
        v-tooltip="{ content: 'Скопировано', shown: showCopyTooltip, triggers: [] }"
        class="story__action"
        :style="storyStyles.buttonXY"
      >
        <UiButton block size="large" :style="storyStyles.button" @click="handleActionClick">
          {{ story.button_text }} {{ story.button_vertical_alignment }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StyleValue } from 'nuxt/dist/app/compat/capi'
import { IStoriesDto } from '~/interface/Promo'
import { copyToClipboard } from '#imports'
import { useUiStore } from '~/store'

const props = defineProps<{
  story: IStoriesDto
}>()

const router = useRouter()
const ui = useUiStore()

const buttonDomPosition = computed(() => {
  const { header_vertical_alignment: header, button_vertical_alignment: button } = props.story

  let isBefore = false
  if (header === 'center' && button === 'top') {
    isBefore = true
  } else if (header === 'bottom' && [null, 'center', 'top'].includes(button)) {
    isBefore = true
  } else if (button === 'top' && header !== 'top') {
    isBefore = true
  }

  return isBefore ? 'before' : 'after'
})

const storyStyles = computed(() => {
  const {
    header_text_color,
    header_background_color,
    header_vertical_alignment,
    header_horizontal_alignment,
    text_color,
    text_background_color,
    text_vertical_alignment,
    text_horizontal_alignment,
    button_text_color,
    button_background_color,
    button_horizontal_alignment,
    button_vertical_alignment,
  } = props.story

  const createAlignStyle = (
    alignY?: typeof header_vertical_alignment,
    alignX?: typeof header_horizontal_alignment
  ) => {
    const css = {} as any
    if (alignY === 'bottom') {
      css.marginTop = 'auto'
    }
    if (alignY === 'center') {
      css.marginTop = 'auto'
      css.marginBottom = 'auto'
    }

    if (alignX === 'center') {
      css.marginLeft = 'auto'
      css.marginRight = 'auto'
    } else if (alignX === 'right') {
      css.marginLeft = 'auto'
    }

    return css
  }

  const styles = {
    header: {
      color: header_text_color || '',
      backgroundColor: header_background_color || '',
      textAlign: header_horizontal_alignment || 'left',
    },
    text: {
      color: text_color || '',
      backgroundColor: text_background_color || '',
      textAlign: text_horizontal_alignment || 'left',
    },
    button: {
      color: button_text_color || '',
      backgroundColor: button_background_color || '',
    },
    contentY: {
      ...createAlignStyle(header_vertical_alignment),
    },
    contentX: {
      ...createAlignStyle(null, header_horizontal_alignment),
    },
    buttonXY: {
      ...createAlignStyle(button_vertical_alignment, button_horizontal_alignment),
    },
  } as any

  // фиксы при перекрытии стилей центрирования
  if (header_vertical_alignment === 'center' && button_vertical_alignment === 'center') {
    styles.contentY.marginBottom = '0px'
    styles.buttonXY.marginTop = '0px'
  }

  if (header_vertical_alignment === 'center' && button_vertical_alignment === 'bottom') {
    styles.contentY.marginBottom = '0px'
  }

  if (header_vertical_alignment === 'bottom' && button_vertical_alignment === 'center') {
    styles.contentY.marginTop = '0px'
  }
  if (header_vertical_alignment === 'bottom' && button_vertical_alignment === 'bottom') {
    styles.buttonXY.marginTop = '0px'
  }

  // оступы для фона текстов
  if (styles.header.backgroundColor) {
    styles.header.paddingLeft = '8px'
    styles.header.paddingRight = '8px'
  }

  if (styles.text.backgroundColor) {
    styles.text.paddingLeft = '8px'
    styles.text.paddingRight = '8px'
  }

  return styles as {
    [key: string]: StyleValue | undefined
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
  }
  &__content-wrapper {
    display: flex;
    flex-direction: column;
  }
  &__title {
    display: inline-flex;
    border-radius: var(--button-border-radius);
  }
  &__text {
    margin-top: 1em;
    border-radius: var(--button-border-radius);
  }
  &__action {
    padding-top: 24px;
  }
}

@include r($md) {
  .story {
    &__content {
      padding: 32px 24px;
    }
    &__action {
      padding-top: 16px;
    }
  }
}
</style>
