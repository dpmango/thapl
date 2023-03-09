<template>
  <section v-if="lastOrder" class="last">
    <div class="container">
      <h2 class="last__title h2-title">Ваш последний заказ</h2>
      <div class="row">
        <div class="col col-8 col-lg-12">
          <OrderPreview class="last__order" :order="lastOrder" />
        </div>

        <!-- primary actions -->
        <div class="col col-2 col-lg-6 col-sm-12">
          <!-- pay -->
          <div
            v-if="lastOrder.can_be_payed"
            class="last__action action _primary"
            @click="handlePay"
          >
            <div class="action__icon hidden-sm">
              <nuxt-icon name="credit-card" />
            </div>
            <div class="action__title h6-title">Оплатить <br />заказ</div>
          </div>
          <!-- time_to_delivery  -->
          <div v-if="lastOrder.time_to_delivery" class="last__action action _primary">
            <div class="action__icon hidden-sm">
              <nuxt-icon name="clock" />
            </div>
            <div class="action__title h6-title">
              Будет через <br />
              {{ lastOrder.time_to_delivery }} минут
            </div>
          </div>
          <!-- rate -->
          <div
            v-if="$env.useTestimonials && lastOrder.user_can_send_review"
            class="last__action action _review"
            @click="handleRate"
          >
            <div class="action__icon hidden-sm">
              <nuxt-icon name="like" />
            </div>
            <div class="action__title h6-title">Оценить <br />заказ</div>
          </div>
        </div>

        <!-- secondary actions -->
        <div class="col col-2 col-lg-6 col-sm-12">
          <!-- cancel -->
          <div
            v-if="lastOrder.can_be_canceled"
            class="last__action action _review"
            @click="handleCancel"
          >
            <div class="action__icon hidden-sm">
              <nuxt-icon name="close" />
            </div>
            <div class="action__title h6-title">Отменить <br />заказ</div>
          </div>

          <!-- repeat -->
          <div
            v-if="[30, 5].includes(lastOrder.status)"
            class="last__action action _review"
            @click="handleRepeat"
          >
            <div class="action__icon hidden-sm">
              <nuxt-icon name="cart" />
            </div>
            <div class="action__title h6-title">Повторить <br />заказ</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { $env, $log } = useNuxtApp()

const lastOrder = ref(null)

const { data: lastOrderData, error: lastOrderError } = await useAsyncData(
  'profile/get-last-order',
  () =>
    useApi('profile/get-last-order', {
      headers: useHeaders(),
    })
)

lastOrder.value = lastOrderData.value

$log.log('🧙‍♂️ ASYNC LAST ORDER', { lastOrder: lastOrder.value })

const { handleDelivery, handleCancel, handlePay, handleRate, handleRepeat } = useOrder({
  orderID: lastOrder.value?.id || null,
  cart: lastOrder.value?.cart || [],
})

// Запрос обновлений каждую минуту
const timerUpdate = ref(null)

onMounted(() => {
  timerUpdate.value = setInterval(() => {
    lastOrder.value = useApi('profile/get-last-order', {
      headers: useHeaders(),
    })
  }, 1 * 60 * 1000)
})

onBeforeUnmount(() => {
  clearTimeout(timerUpdate.value)
})
</script>

<style lang="scss" scoped>
.last {
  margin: 60px 0 80px;
  &__title {
    margin-bottom: 36px;
  }
  &__action {
    flex: 1 0 auto;
  }
  // &__order{}
}

@include r($lg) {
  .last {
    &__order {
      margin-bottom: 16px;
    }
  }
}

@include r($sm) {
  .last {
    &__action {
      margin-top: 8px;
    }
  }
}

.action {
  border-radius: var(--card-border-radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px 10px;
  background: var(--color-bg);
  &__icon {
    font-size: 24px;
    margin-bottom: 12px;
  }
  // &__title {
  //   // margin-top: 12px;
  // }
  &._primary {
    background: rgba(var(--color-primary-rgb), 0.12);
    color: var(--color-primary);
  }
  &._review {
    cursor: pointer;
  }
}

@include r($sm) {
  .action {
    padding: 10px 20px;
    &__title {
      br {
        display: none;
      }
    }
  }
}
</style>
