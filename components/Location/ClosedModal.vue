<template>
  <UiModal name="closed">
    <div class="closed">
      <div class="h2-title">Закрыто</div>
      <template v-if="isPreorderAvailable">
        <p class="text-m">
          Сейчас мы закрыты, но вы можете оставить предзаказ на любую предпочтительную дату и время
          — мы с радостью исполним.
        </p>
        <div class="closed__cta">
          <UiButton @click="ui.closeModal()">Оставить предзаказ</UiButton>
        </div>
      </template>
      <template v-else>
        <p class="text-m">Сейчас мы закрыты, оформите заказ в рабочее время</p>
        <div class="closed__cta">
          <UiButton @click="ui.closeModal()">Закрыть</UiButton>
        </div>
      </template>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore, useUiStore } from '~/store'

const { $env } = useNuxtApp()

const ui = useUiStore()
const sessionStore = useSessionStore()
const { isPreorderAvailable } = storeToRefs(sessionStore)
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
