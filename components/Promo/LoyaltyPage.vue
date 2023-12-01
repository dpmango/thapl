<template>
  <div class="container _narrow">
    <h1 class="h2-title">{{ data.title }}</h1>

    <div class="page__content">
      <div v-if="data.user_balance_data || data.loyalty_groups?.length" class="lvls">
        <div v-if="data.user_balance_data" class="lvls__description">
          <div class="lvls__total c-primary">{{ data.user_balance_data?.balance }}</div>
          <span class="text-l text-md-s">бонусных рублей на вашем счету</span>
        </div>
        <div v-if="data.loyalty_groups?.length" class="lvls__grid">
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

      <div v-if="pointsAccural || data.points_write_off" class="writeoff row">
        <div v-if="pointsAccural" class="writeoff__col">
          <div class="writeoff__box">
            <div class="writeoff__value c-primary">{{ pointsAccural }}%</div>
            <div class="text-l text-md-s">
              от стоимости каждого заказа возвращаются в виде бонусов
            </div>
          </div>
        </div>

        <div v-if="pointWriteOff" class="writeoff__col">
          <div class="writeoff__box">
            <div class="writeoff__value c-primary">{{ pointWriteOff }}%</div>
            <div class="text-l text-md-s">от стоимости любого заказа можно оплатить бонусами</div>
          </div>
        </div>
      </div>

      <p v-if="contentRaw" class="text-l" v-html="contentRaw" />
      <ContentUniversal v-if="data.rules_conditions" :blocks="data.rules_conditions.blocks" />

      <PromoLoyaltyTransactions v-if="data.transactions" :transactions="data.transactions" />

      <div v-if="data.ref_program_enabled && data.user_code" class="page__copy">
        <UiCopy :text="data.user_code" :action-text="'скопировать промокод'">
          <div class="h2-title c-primary">
            {{ data.user_code }}
          </div>
        </UiCopy>
      </div>

      <!-- <template v-if="data.ref_program_enabled">
        <div v-if="data.user_code" class="page__copy">
          <UiCopy :text="data.user_code" :action-text="'скопировать приглашение'">
            <div class="h2-title c-primary">
              {{ data.ref_program_message?.replace('[CODE]', data.user_code) }}
            </div>
          </UiCopy>
        </div>
      </template> -->

      <template v-if="data.ref_program_enabled && data.referral_conditions">
        <ContentUniversal
          v-if="data.referral_conditions"
          :blocks="data.referral_conditions.blocks"
        />
      </template>

      <template v-if="data.ref_program_enabled && data.ref_program_text">
        <p class="text-l" data-source="data.ref_program_text" v-html="data.ref_program_text" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ILoyaltyPageDto } from '~/interface'
import { spacesRegex } from '#imports'

definePageMeta({
  middleware: [useAuthGuard],
})

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

const pointsAccural = computed(() => {
  if (props.data.user_group?.current_group.base_points_accrual) {
    return props.data.user_group?.current_group.base_points_accrual
  }

  return props.data.points_accrual
})

const pointWriteOff = computed(() => {
  if (props.data.user_group?.current_group.base_points_write_off) {
    return props.data.user_group?.current_group.base_points_write_off
  }
  return props.data.points_write_off
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
      padding-right: 0;
    }
    &__total {
      padding-right: 32px;
      font-size: 20px;
      margin-bottom: 4px;
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

.writeoff {
  margin-bottom: 36px;
  display: flex;
  flex-wrap: wrap;
  margin-left: -16px;
  margin-right: -16px;
  &__box {
    padding: 32px;
    border-radius: var(--card-border-radius);
    background: rgba(var(--color-primary-rgb), 0.12);
  }
  &__col {
    width: 100%;
    flex: 0 0 50%;
    max-width: 50%;
    padding-left: 16px;
    padding-right: 16px;
  }
  &__value {
    font-size: 32px;
    margin-bottom: 8px;
  }
}

@include r($md) {
  .writeoff {
    &__value {
      font-size: 20px;
      margin-bottom: 4px;
    }

    &__box {
      padding: 24px;
    }
  }
}

@include r($sm) {
  .writeoff {
    margin-left: -6px;
    margin-right: -6px;

    &__col {
      padding-left: 6px;
      padding-right: 6px;
    }

    &__box {
      padding: 16px;
    }
  }
}
</style>
