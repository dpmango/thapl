<template>
  <main class="page__content">
    <ProfileAddresses :addresses="addresses" @dispatch-update="handleUpdate" />
  </main>
</template>

<script setup lang="ts">
import { IProfileAddressesDto } from '~/interface/Dto/Profile.dto'
const { $env, $log } = useNuxtApp()

useHead({
  title: `Личный кабинет - ${$env.projectName}`,
})

const addresses = ref<IProfileAddressesDto[]>([])
const { data, error: addressesError } = await useAsyncData(
  'profile/get-orders',
  () =>
    useApi('profile/get-addresses', {
      headers: useHeaders(),
    }) as Promise<IProfileAddressesDto[]>
)

addresses.value = data.value || []

const handleUpdate = async () => {
  const newAddresses = (await useApi('profile/get-addresses', {
    headers: useHeaders(),
  })) as IProfileAddressesDto[]

  addresses.value = [...newAddresses]
}

$log.log('🧙‍♂️ ASYNC ADDRESSES', { addresses: addresses.value })
</script>

<style lang="scss" scoped></style>
