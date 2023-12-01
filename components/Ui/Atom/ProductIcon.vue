<template>
  <span class="icon">
    <span v-if="product.is_hot">
      <img src="~/assets/img/hot.png" srcset="~/assets/img/hot@2x.png 2x" title="Острое" />
    </span>
    <span v-if="product.is_healthy">
      <img
        src="~/assets/img/vegetarian.png"
        srcset="~/assets/img/vegetarian@2x.png 2x"
        title="Здоровое"
      />
    </span>
    <span v-if="product.is_new">
      <img src="~/assets/img/new.png" srcset="~/assets/img/new@2x.png 2x" title="Новое" />
    </span>
    <span v-if="product.is_best">
      <img src="~/assets/img/hit.png" srcset="~/assets/img/hit@2x.png 2x" title="Хит" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { IProduct } from 'interface'

const props = defineProps<{ product: IProduct }>()
</script>

<style lang="scss">
.icon {
  font-size: 0;
  span + span {
    margin-left: 6px;
  }
}
</style>
