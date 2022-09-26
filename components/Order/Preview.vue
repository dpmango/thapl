<template>
  <div class="order">
    <div class="order__head text-s">
      <span class="c-gray">12 января 2022, 15:46</span>
      <span class="c-primary">Доставляется</span>
      <span class="c-gray">Васильевский переулок, д. 17, стр. 20, кв. 77</span>
    </div>

    <div class="order__table text-m">
      <div class="order__row">
        <span class="order__label">Веган бургер <span class="c-gray">× 2</span></span>
        <i class="order__sep"></i>
        <span class="order__value c-primary">650 ₽</span>
      </div>
      <div class="order__row">
        <span class="order__label">Сливочный суп с мидиями и морепродуктами</span>
        <i class="order__sep"></i>
        <span class="order__value c-primary">220 ₽</span>
      </div>
      <div class="order__row">
        <span class="order__label"><span class="c-gray">Еще 4 блюда</span></span>
        <i class="order__sep"></i>
        <span class="order__value c-gray">2 312 ₽</span>
      </div>
      <div class="order__row fw-500">
        <span class="order__label">Итого</span>
        <i class="order__sep"></i>
        <span class="order__value">3 624 ₽</span>
      </div>
    </div>
  </div>
</template>

<stlye lang="scss" scoped>
.order {
  background: var(--component-background);
  box-shadow: 0px 16px 48px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 36px 32px 32px 36px;
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    span {
      display: inline-flex;
      align-items: center;
      &::after {
        display: inline-block;
        content: ' ';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--breadcrumbs-separator-color);
        margin-left: 16px;
        margin-right: 16px;
      }
      &:last-child::after {
        display: none;
      }
    }
  }
  &__table {
    margin-top: 20px;
  }
  &__row {
    display: flex;
    align-items: baseline;
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  // &__label{}
  // &__value {
  // }
  &__sep {
    display: inline-block;
    flex: 1 1 auto;
    min-width: 1px;
    margin-left: 12px;
    margin-right: 12px;
    border-bottom: 1px dashed var(--breadcrumbs-separator-color);
  }
}
</stlye>
