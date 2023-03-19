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
            :target="contact.text ? '_blank' : '#'"
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

<script setup lang="ts">
import { clearSocialLink, buildLink } from '#imports'
import { IPageContactsDto } from '~/interface/Dto/Page.dto'

const { $env, $log } = useNuxtApp()

const { data, error } = await useAsyncData(
  'page/get-contacts-data',
  () =>
    useApi('page/get-contacts-data', {
      method: 'GET',
      headers: useHeaders(),
    }) as Promise<IPageContactsDto>
)

$log.log('🧙‍♂️ ASYNC CONTACTS', { data: data.value })

// if (error && error.value) {
//   setResponseStatus(404)
// }

const list = computed(() => {
  if (data.value) {
    const { phone, telegram, facebook, instagram, vk, email, wu } = data.value

    const all = [
      { label: 'Телефон', value: phone },
      { label: 'Электронная почта', value: email },
      { label: 'Телеграм', value: buildLink(telegram), text: clearSocialLink(telegram) },
      { label: 'WhatsApp', value: buildLink(wu), text: clearSocialLink(wu) },
      { label: 'Фейсбук', value: buildLink(facebook), text: clearSocialLink(facebook) },
      { label: 'ВКонтакте', value: buildLink(vk), text: clearSocialLink(vk) },
      {
        label: 'Инстаграм',
        value: buildLink(instagram),
        text: clearSocialLink(instagram),
      },
      // { label: 'Адрес', value: null },
    ]

    return all.filter((x) => x.value)
  }

  return []
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
