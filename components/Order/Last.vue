<template>
  <section v-if="lastOrder" class="last">
    <div class="container">
      <h2 class="last__title h2-title">Ваш последний заказ</h2>
      <div class="row">
        <div class="col col-8 col-lg-12">
          <OrderPreview class="last__order" :order="lastOrder" />
        </div>
        <div class="col col-2 col-lg-6 col-sm-12">
          <div class="last__action action _time">
            <div class="action__icon hidden-sm">
              <nuxt-icon name="clock" />
            </div>
            <div class="action__title h6-title">
              Будет через <br />
              {{ lastOrder.time_to_delivery }} минут
            </div>
          </div>
        </div>
        <div class="col col-2 col-lg-6 col-sm-12">
          <div v-if="$env.useTestimonials" class="last__action action _review">
            <div class="action__icon hidden-sm">
              <nuxt-icon name="like" />
            </div>
            <div class="action__title h6-title">Оценить <br />заказ</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { $env, $log } = useNuxtApp()

const { data: lastOrder, error: lastOrderError } = await useAsyncData(
  'profile/get-last-order',
  () =>
    useApi('profile/get-last-order', {
      headers: useHeaders(),
    })
)

$log.log('🧙‍♂️ ASYNC LAST ORDER', { lastOrder: lastOrder.value })
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
  &__title {
    // margin-top: 12px;
  }
  &._time {
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
