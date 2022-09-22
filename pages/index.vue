<template>
  <main class="page__content">
    <PromoSlider />
    <DevInfo />
    <ProductPopular />
    <ProductCategory
      v-for="category in categories"
      :key="category.id"
      :name="category.name"
      :list="category.dump"
    />
    <InfoAbout />
  </main>
</template>

<script setup>
// definePageMeta({ layout: 'default' })

useHead({
  title: 'Главная',
})

const categories = ref([
  {
    id: 1,
    name: 'Бургеры и сендвичи',
    dump: [...Array(3)],
  },
  {
    id: 2,
    name: 'Супы',
    dump: [...Array(5)],
  },
])
</script>
