<template>
  <div class="card">
    <div class="card__image">
      <div class="card__badges">
        <UiBadge theme="green" size="small">Хит продаж</UiBadge>
        <UiBadge theme="blue" size="small">-20%</UiBadge>
      </div>
    </div>
    <div class="card__body">
      <div class="card__title h4-title">Том-Ям с креветками</div>
      <div class="card__description text-s c-gray">
        Ветчина, картошечка, моцарелла, соус альфредо
      </div>
      <div class="card__actions">
        <div class="card__price text-l">220 ₽</div>
        <div class="card__add">
          <UiButton theme="secondary">Выбрать</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
})
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  &__image {
    position: relative;
    border-radius: 16px;
    font-size: 0;
    padding-bottom: var(--product-card-ar);
    background: var(--color-bg);
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      max-width: auto;
      object-fit: cover;
    }
  }
  &__badges {
    position: absolute;
    z-index: 2;
    top: 8px;
    left: 8px;
    display: flex;
    align-items: center;
    .badge {
      margin-right: 4px;
    }
  }
  &__body {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
  }
  // &__title{}
  &__description {
    margin-top: 12px;
  }
  &__actions {
    padding-top: 16px;
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
