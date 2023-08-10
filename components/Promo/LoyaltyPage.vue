<template>
  <div class="container _narrow">
    <h1 class="h2-title">{{ data.title }}</h1>

    <div class="page__content">
      <div v-if="data.loyalty_groups" class="lvls">
        <div class="lvls__description">
          <div class="lvls__total c-primary">{{ data.points_accrual }}</div>
          <span class="text-l">бонусных рублей на вашем счету</span>
        </div>
        <div class="lvls__grid">
          <div v-for="(group, idx) in data.loyalty_groups" :key="idx" class="lvls__group">
            <div
              :class="[
                'lvls__group-title',
                group.id === data.user_group?.current_group.id && 'c-primary',
              ]"
            >
              {{ group.title }}
            </div>
            <div class="lvls__group-progress">
              <i class="lvls__group-progressfill"></i>
            </div>
            <div class="lvls__group-points">
              {{ group.order_to_earn.toFixed(0).replace(spacesRegex, ' ') }}
            </div>
          </div>
        </div>
      </div>
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
import { spacesRegex } from '#imports'

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

.lvls {
  display: flex;
  margin-bottom: 32px;
  padding: 32px;
  border-radius: var(--card-border-radius);
  background: rgba(var(--color-primary-rgb), 0.12);

  &__description {
    flex: 0 0 calc(180px + 32px);
    padding-right: 32px;
  }
  &__total {
    font-size: 32px;
    margin-bottom: 8px;
  }
  &__grid {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    margin-right: -8px;
  }
  &__group {
    flex: 1 1 auto;
    min-width: 1px;
    font-weight: 500;
    padding-right: 8px;
  }
  &__group-title {
    font-weight: 500;
  }
  &__group-progress {
    margin-top: 8px;
    position: relative;
    z-index: 2;
    overflow: hidden;
    border-radius: 4px;
    height: 8px;
    background: #f3d6cd;
  }
  &__group-progressfill {
    position: absolute;
    top: 0;
    left: 0;
    background: var(--color-primary);
    transition: width 0.25s $ease;
  }
  &__group-points {
    margin-top: 8px;

    color: rgba(var(--color-font-rgb), 0.36);
  }
}

@include r($lg) {
  .lvls {
    &__group {
      font-size: 14px;
    }
  }
}

@include r($md) {
  .lvls {
    display: block;
    &__description {
      max-width: 240px;
      display: flex;
      align-items: center;
    }
    &__total {
      padding-right: 32px;
    }
    &__grid {
      margin-top: 16px;
    }
  }
}

@include r($sm) {
  .lvls {
    padding: 20px;
    &__grid {
      display: block;
    }
    &__group {
      margin-top: 16px;
    }
  }
}
</style>
