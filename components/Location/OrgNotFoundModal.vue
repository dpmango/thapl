<template>
  <UiModal name="orgnotfound">
    <div class="closed">
      <div class="h2-title">Не доставляем</div>
      <p class="text-m">К сожалению мы не можем доставить по этому адресу. Выберите другой адрес</p>
      <div class="closed__cta">
        <UiButton @click="ui.setModal({ name: 'address' })">Сменить адрес</UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup>
import { useUiStore } from '~/store'

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
