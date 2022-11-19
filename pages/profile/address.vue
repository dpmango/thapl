<template>
  <main class="page__content">
    <ProfileAddresses :addresses="addresses" @dispatch-update="handleUpdate" />
  </main>
</template>

<script setup>
const { $env, $log } = useNuxtApp()

useHead({
  title: `Личный кабинет - ${$env.projectName}`,
})

const addresses = ref([])
const { data, error: addressesError } = await useAsyncData('profile/get-orders', () =>
  useApi('profile/get-addresses', {
    headers: useHeaders(),
  })
)
addresses.value = data.value

const handleUpdate = async () => {
  const newAddresses = await useApi('profile/get-addresses', {
    headers: useHeaders(),
  })

  addresses.value = [...newAddresses]
}

$log.log('🧙‍♂️ ASYNC ADDRESSES', { addresses: addresses.value })
</script>

<style lang="scss" scoped></style>
