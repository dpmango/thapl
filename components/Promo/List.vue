<template>
  <div class="list row">
    <div v-for="(x, idx) in list" :key="idx" class="col col-6 col-sm-12">
      <NuxtLink :to="`/promo/${x.slug}`" class="promo">
        <div class="promo__image">
          <img :src="x.image" :alt="x.title" />
        </div>

        <div class="promo__content">
          <div class="promo__title h4-title">
            {{ x.title }}
          </div>
          <div v-if="promoEnds(x)" class="promo__end-note text-s fw-500 c-primary">
            До конца акции осталось {{ promoEnds(x) }}
          </div>
          <div v-if="x.description_short" class="promo__description text-s c-gray">
            {{ x.description_short }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import djs from 'dayjs'

import { IPromoListDto } from '~/interface/Promo'

const props = defineProps({
  list: {
    type: Array as PropType<IPromoListDto[]>,
    default: () => [],
  },
})

const promoEnds = (promo: IPromoListDto) => {
  if (!promo.finish_on) return null

  const dateEnds = djs(promo.finish_on)
  const diff = djs().diff(dateEnds, 'days')

  if (diff) {
    return `${diff} ${Plurize(diff, 'день', 'дня', 'дней')}`
  }

  return null
}
</script>

<style lang="scss" scoped>
.list {
  margin-top: 36px;
  overflow: hidden;
}

.promo {
  margin-bottom: 48px;
  &__image {
    position: relative;
    z-index: 1;
    margin: 0px 0;
    border-radius: var(--card-border-radius);
    overflow: hidden;
    font-size: 0;
    img {
      max-width: 100%;
    }
  }
  &__content {
    margin-top: 16px;
  }
  &__end-note {
    margin-top: 4px;
  }
  &__description {
    margin-top: 12px;
  }
}
</style>
