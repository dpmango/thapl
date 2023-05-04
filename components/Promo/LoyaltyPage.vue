<template>
  <div class="container _narrow">
    <h1 class="h2-title">{{ data.title }}</h1>

    <!-- <template v-if="data.action">
      <div
        v-if="data.action === 'copy_promo_code' && data.action_data?.code"
        class="page__copy"
        :style="data.action_button_color ? { backgroundColor: data.action_button_color } : {}"
      >
        <UiCopy
          :text="data.action_data.code"
          :action-text="data.action_title || 'скопировать промокод'"
        >
          <div class="h2-title c-primary">{{ data.action_data.code }}</div>
        </UiCopy>
      </div>
    </template> -->

    <div class="page__content">
      <p v-if="contentRaw" class="text-l" v-html="contentRaw" />
      <ContentUniversal v-if="data.rules_conditions" :blocks="data.rules_conditions.blocks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ILoyaltyPageDto } from '~/interface'

const props = defineProps({
  data: {
    type: Object as PropType<ILoyaltyPageDto>,
    default: () => ({}),
  },
})

const contentRaw = computed(() => {
  if (props.data.rules_conditions) return null
  const doc = props.data.conditions_text

  return doc ? doc.replace(/\n/g, '<br />') : null
})
</script>

<style lang="scss" scoped>
.page {
  &__copy {
    margin: 36px 0;
  }
  &__content {
    margin-top: 36px;
  }
}
</style>
