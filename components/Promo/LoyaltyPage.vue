<template>
  <div class="container _narrow">
    <h1 class="h2-title">{{ data.title }}</h1>

    <div class="page__content">
      <p v-if="contentRaw" class="text-l" v-html="contentRaw" />
      <ContentUniversal v-if="data.rules_conditions" :blocks="data.rules_conditions.blocks" />

      <PromoLoyaltyTransactions v-if="data.transactions" :transactions="data.transactions" />

      <template v-if="data.ref_program_enabled">
        <div v-if="data.user_code" class="page__copy">
          <UiCopy :text="data.user_code" :action-text="'скопировать промокод'">
            <div class="h2-title c-primary">
              {{ data.ref_program_message?.replace('[CODE]', data.user_code) }}
            </div>
          </UiCopy>
        </div>
      </template>

      <template v-if="data.referral_conditions">
        <ContentUniversal
          v-if="data.referral_conditions"
          :blocks="data.referral_conditions.blocks"
        />
      </template>

      <template v-if="data.ref_program_text">
        <p class="text-l" data-source="data.ref_program_text" v-html="data.ref_program_text" />
      </template>
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
    p + p {
      margin-top: 1em;
    }
  }
}
</style>
