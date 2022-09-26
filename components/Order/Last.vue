<template>
  <section class="last">
    <div class="container">
      <h2 class="last__title h2-title">Ваш последний заказ</h2>
      <div class="row">
        <div class="col col-8">
          <OrderPreview class="last__order" />
        </div>
        <div class="col col-2">
          <div class="last__action action _time">
            <div class="action__icon">
              <nuxt-icon name="clock" />
            </div>
            <div class="action__title h6-title">
              Будет через <br />
              20 минут
            </div>
          </div>
        </div>
        <div class="col col-2">
          <div class="last__action action _review">
            <div class="action__icon">
              <nuxt-icon name="like" />
            </div>
            <div class="action__title h6-title">Оценить <br />заказ</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.last {
  margin: 60px 0 80px;
  &__title {
    margin-bottom: 36px;
  }
  &__action {
    flex: 1 0 auto;
  }
}

.action {
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px 10px;
  background: var(--color-bg);
  &__icon {
    font-size: 24px;
  }
  &__title {
    margin-top: 12px;
  }
  &._time {
    background: rgba(var(--color-primary-rgb), 0.12);
    color: var(--color-primary);
  }
  &._review {
    cursor: pointer;
  }
}
</style>
