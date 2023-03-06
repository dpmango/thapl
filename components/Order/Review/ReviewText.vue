<template>
  <div class="review">
    <OrderReviewHead
      title="Отзыв о заказе"
      description="Мы обрабатываем все отзывы, чтобы постоянно улучшать качество работы"
    />

    <div class="review__body">
      <UiInput type="textarea" rows="3" :value="review" />
    </div>

    <div class="review__cta">
      <UiButton>Оставить отзыв</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const review = ref('')
</script>
