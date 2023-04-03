<template>
  <div class="container">
    <div v-if="data.image" class="page__image">
      <img :src="data.image" :alt="data.title" />
    </div>
  </div>

  <div class="container _narrow">
    <template v-if="data.action">
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
    </template>

    <div class="page__content">
      <p v-if="contentRaw" class="text-l" v-html="contentRaw" />
      <ContentUniversal v-if="data.content_data" :blocks="data.content_data.blocks" />
    </div>

    <div v-if="data.gifts?.length" class="page__gifts gifts">
      <div class="gifts__title h4-title">Блюда в подарок</div>
      <div class="row">
        <div v-for="gift in data.gifts" :key="gift.id" class="col col-3 col-md-4 col-sm-6">
          <ProductCard :product="gift" :is-gift="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IPromoPageDto } from '~/interface/Promo'

const props = defineProps({
  data: {
    type: Object as PropType<IPromoPageDto>,
    default: () => ({}),
  },
})

const contentRaw = computed(() => {
  const doc = props.data.description

  return doc ? doc.replace(/\n/g, '<br />') : null
})
</script>

<style lang="scss" scoped>
.page {
  &__image {
    position: relative;
    z-index: 1;
    margin: 36px 0;
    border-radius: var(--card-border-radius);
    overflow: hidden;
    font-size: 0;
    img {
      max-width: 100%;
    }
  }
  &__copy {
    margin: 36px 0;
  }
  &__gifts {
    margin-top: 36px;
  }
}

.gifts {
  // &__title{}
  .card {
    margin-top: 24px;
  }
}
</style>
