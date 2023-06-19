<template>
  <div class="transactions">
    <div class="h4-title transactions__title">Транзакции</div>
    <table class="transactions__table">
      <thead>
        <tr>
          <td>Дата и время операции</td>
          <td>Сумма бонусов</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tr, idx) in transactions" :key="idx">
          <td>{{ tr.date }}</td>
          <td>
            <span class="tr-price" :class="[tr.value < 0 && '_negative']">
              {{ formatPrice(tr.value) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ILoyaltyUserTransaction } from '~/interface'

const props = defineProps({
  transactions: {
    type: Array as PropType<ILoyaltyUserTransaction[]>,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.transactions {
  margin: 36px 0;
  &__title {
  }
  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    thead {
      td {
        font-weight: 500;
        font-size: 14px;
        line-height: calc(22 / 14);
        color: var(--color-gray);
      }
    }
    td {
      border-bottom: 1px solid var(--color-border);
      font-weight: 400;
      font-size: 16px;
      line-height: calc(24 / 16);
      padding: 16px 0;
      &:last-child {
        text-align: right;
      }
    }
  }
}

.tr-price {
  font-weight: 500;
  color: var(--color-green);
  &._negative {
    color: var(--color-red);
  }
}

@include r($md) {
  .transactions {
    margin: 24px 0;
  }
}
</style>
