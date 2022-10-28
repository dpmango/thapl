<template>
  <UiModal name="contacts" position="aside" height="fill">
    <div class="contact">
      <div class="contact__head visible-sm">
        <div class="h4-title">Контакты</div>
      </div>

      <div class="contact__list">
        <li v-for="contact in list">
          <span class="text-m text-sm-s fw-500 c-gray">{{ contact.label }}</span>
          <a
            :href="contact.value"
            :target="contact.text ? '_blank' : ''"
            class="h2-title h6-title-sm"
            :class="[contact.text && '_link']"
          >
            {{ contact.text || contact.value }}
          </a>
        </li>
      </div>
    </div>
  </UiModal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store'
import { clearSocialLink } from '~/utils'

const sessionStore = useSessionStore()
const {
  app_settings: { default_phone, tg, whatsapp, facebook, instagram },
} = sessionStore

const list = computed(() => {
  const all = [
    { label: 'Телефон', value: default_phone },
    // { label: 'Электронная почта', value: default_phone },
    { label: 'Телеграм', value: tg, text: clearSocialLink(tg) },
    { label: 'WhatsApp', value: whatsapp, text: clearSocialLink(whatsapp) },
    { label: 'Фейсбук', value: clearSocialLink(facebook) },
    {
      label: 'Инстаграм',
      value: instagram,
      text: clearSocialLink(instagram),
    },
    { label: 'Адрес', value: null },
  ]

  return all.filter((x) => x.value)
})
</script>

<style lang="scss" scoped>
.contact {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  &__list {
    margin: auto 0;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 28px;
      &:last-child {
        margin-bottom: 0;
      }
      a {
        display: inline-block;
        margin-top: 8px;
        transition: color 0.25s $ease;
        &._link {
          text-decoration: underline;
          text-decoration-skip-ink: all;
          &:hover {
            color: var(--color-primary);
          }
        }
      }
    }
  }
}

@include r($sm) {
  .contact {
    &__head {
      margin-bottom: 28px;
      padding-right: 30px;
    }
    &__list {
      margin: 0;
      li {
        align-items: flex-start;
        margin-bottom: 20px;
        a {
          margin-top: 4px;
        }
      }
    }
  }
}
</style>
