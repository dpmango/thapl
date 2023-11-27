<template>
  <UiModal name="marketing" position="center">
    <div class="marketing">
      <div class="marketing__title h2-title">Так будет удобнее</div>
      <div class="marketing__description text-m">
        Вы можете скачать наши мобильные приложения, чтобы гораздо удобнее совершать заказы и
        получать скидки.
      </div>

      <ul class="marketing__apps">
        <UiAtomMobileApps />
      </ul>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore, useUiStore } from '~/store'

const uiStore = useUiStore()
const { modal } = storeToRefs(uiStore)
const marketingCookie = useCookieState('marketing-seen', 60 * 60 * 24 * 7)

watch(
  () => modal.value,
  (newModal, oldModal) => {
    if (!newModal.length && oldModal.includes('marketing')) {
      marketingCookie.value = 'true'
    }
  }
)
</script>

<style lang="scss" scoped>
.marketing {
  text-align: center;
  &__apps {
    margin-top: 28px;
  }
  &__description {
    margin-top: 24px;
  }
  &__apps {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 20px -42px 0;
    :deep li {
      margin: 12px 12px;
    }
  }
}

@include r($md) {
  .marketing {
    &__apps {
      margin-left: 0;
      margin-right: 0;
    }
  }
}

@include r(440) {
  .marketing {
    &__apps {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      :deep li {
        margin: 4px 0;
      }
    }
  }
}
</style>
