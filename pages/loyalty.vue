<template>
  <main class="page__content page">
    <PromoLoyaltyPage
      v-if="data"
      :data="{
        ...data,
      }"
    />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ILoyaltyPageDto } from '~/interface'
import { useSessionStore } from '~/store'

const { $env, $log } = useNuxtApp()

const route = useRoute()
const sessionStore = useSessionStore()
const { user } = storeToRefs(sessionStore)

const data = ref<ILoyaltyPageDto | null>(null)

const fetchLoyalty = async () => {
  const res = (await useApi('loyalty/get-conditions', {
    method: 'GET',
    headers: useHeaders(),
    params: {
      list_type: 3,
    },
  })) as ILoyaltyPageDto

  if (res) {
    data.value = res
  }

  return res
}
const { data: asyncData, error } = await useAsyncData('loyalty/get-conditions', fetchLoyalty)
if (asyncData.value) {
  data.value = asyncData.value
}

$log.log('🧙‍♂️ ASYNC LOYALTY', { data: data.value })

useHead({
  title: () => `${data.value?.title} - ${$env.projectName}`,
})

watch(
  () => user.value,
  (newVal) => {
    if (newVal) {
      fetchLoyalty()
    }
  }
)
</script>

<style lang="scss" scoped>
.page {
  margin: 80px 0 120px;
  &__crumbs {
    margin: 36px 0;
  }
  &__copy {
    margin: 36px 0;
  }
}
</style>
