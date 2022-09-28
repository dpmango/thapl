<template>
  <div class="empty">
    <div class="empty__icon">
      <nuxt-icon name="cart" />
    </div>
    <div class="empty__title h4-title">В корзине пусто</div>
    <div class="empty__text text-m">
      Зайдите в меню, выберите блюда, которые хотите съесть, а мы оперативно доставим ваш заказ от 1
      000 ₽.
    </div>
    <div class="empty__cta">
      <UiButton to="/catalog">Перейти в меню</UiButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  margin: auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &__icon {
    font-size: 60px;
  }
  &__title {
    margin-top: 24px;
  }
  &__text {
    margin-top: 16px;
    text-align: center;
    max-width: 330px;
  }
  &__cta {
    margin-top: 28px;
  }
}
</style>
