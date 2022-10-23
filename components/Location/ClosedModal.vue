<template>
  <UiModal name="closed">
    <div class="closed">
      <div class="h2-title">Закрыто</div>
      <p class="text-m">
        Сейчас мы закрыты, но вы можете оставить предзаказ на любую предпочтительную дату и время —
        мы с радостью исполним.
      </p>
      <div class="closed__cta">
        <UiButton @click="ui.closeModal()">Оставить предзаказ</UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup>
import { useField, useForm } from 'vee-validate'
import { useDeliveryStore, useUiStore } from '~/store'

const { $env } = useNuxtApp()

const ui = useUiStore()
</script>

<style lang="scss" scoped>
.closed {
  text-align: center;
  .h2-title {
    margin-bottom: 24px;
  }
  &__cta {
    margin-top: 28px;
  }
}
</style>
