<template>
  <UiModal name="contacts" position="aside" height="fill">
    <div class="contact">
      <div class="contact__head visible-sm">
        <div class="h4-title">Контакты</div>
      </div>

      <!-- Контакты -->
      <div class="contact__list" :class="[contacts?.restaurants_count && '_has-restaurants']">
        <li v-for="contact in list">
          <span class="text-m text-sm-s fw-500 c-gray">{{ contact.label }}</span>
          <a
            :href="contact.value"
            :target="contact.text ? '_blank' : '#'"
            class="h2-title h6-title-sm"
            :class="[contact.text && '_link']"
          >
            {{ contact.text }}
          </a>
        </li>
      </div>

      <!-- Рестораны -->
      <div
        v-if="contacts?.restaurants_count && restaurantList?.length"
        class="contact__restaurants restaurants"
      >
        <div v-if="$env.useRegions" class="restaurants__more">
          <UiButton theme="secondary" to="/restaurants">Все рестораны на карте</UiButton>
        </div>
        <div v-else-if="contacts.restaurants_count === 1" class="restaurants__single">
          <span class="text-m text-sm-s fw-500 c-gray">Адрес</span>
          <NuxtLink :to="`/restaurants/${restaurantList[0].id}`" class="h2-title h6-title-sm">
            {{ restaurantList[0].address }}
          </NuxtLink>
        </div>
        <div v-else class="restaurants__all">
          <span class="text-m text-sm-s fw-500 c-gray">Рестораны</span>
          <ul class="restaurants__list">
            <li v-for="restaurant in restaurantList">
              <NuxtLink :to="`/restaurants/${restaurant.id}`" class="restaurants__box">
                <span class="text-m text-sm-s fw-500">{{
                  restaurant.title || restaurant.address
                }}</span>
                <div class="restaurants__contact-row fw-500 c-gray">
                  <span v-if="restaurant.phone" class="text-s">
                    {{ restaurant.phone }}
                  </span>
                  <span v-if="restaurant.working_hours" class="text-s">
                    {{ restaurant.working_hours }}
                  </span>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { clearSocialLink, buildLink } from '#imports'
import { useContactStore } from '~/store'

const { $env, $log } = useNuxtApp()

const contactStore = useContactStore()
const { contacts, restaurantList } = storeToRefs(contactStore)

const list = computed(() => {
  if (contacts.value) {
    const { phone, telegram, facebook, instagram, vk, email, wu } = contacts.value

    const all = [
      { label: 'Телефон', value: `tel:${(phone || '').replace(/\s/g, '')}`, text: phone },
      { label: 'Электронная почта', value: `mailto:${email}`, text: email },
      { label: 'Телеграм', value: buildLink(telegram), text: clearSocialLink(telegram) },
      { label: 'WhatsApp', value: buildLink(wu), text: clearSocialLink(wu) },
      { label: 'Фейсбук', value: buildLink(facebook), text: clearSocialLink(facebook) },
      { label: 'ВКонтакте', value: buildLink(vk), text: clearSocialLink(vk) },
      {
        label: 'Инстаграм',
        value: buildLink(instagram),
        text: clearSocialLink(instagram),
      },
    ]

    return all.filter((x) => x.value && x.text) as {
      label: string
      value: string
      text?: string
    }[]
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

    &._has-restaurants {
      margin-bottom: 0;
    }
  }
  &__restaurants {
    margin-top: 28px;
    margin-bottom: auto;
  }
}

.restaurants {
  &__more {
    display: flex;
    justify-content: center;
  }
  &__single {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 28px;
    a {
      display: inline-block;
      margin-top: 8px;
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-primary);
      }
    }
  }
  &__all {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  &__list {
    list-style: none;
    margin: 8px 0 0;
    width: 100%;
    li {
      width: 100%;
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
  &__box {
    display: block;
    border-radius: 12px;
    background: #fff;
    box-shadow: var(--box-shadow-large);
    padding: 24px;
    transition: box-shadow 0.25s $ease;
    &:hover {
      box-shadow: var(--box-shadow-extra-large);
    }
  }
  &__contact-row {
    margin-top: 4px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    span {
      position: relative;
      padding-right: 36px;
      &::after {
        display: inline-block;
        content: ' ';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 18px;
        background: var(--color-border);
        width: 4px;
        height: 4px;
        border-radius: 50%;
      }
      &:last-child {
        padding-right: 0;
        ::after {
          display: none;
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
    &__restaurants {
      margin-top: 20px;
    }
  }

  .restaurants {
    &__single {
      align-items: flex-start;
    }
    &__all {
      align-items: flex-start;
    }
    &__box {
      text-align: left;
      padding: 16px;
    }
    &__contact-row {
      justify-content: flex-start;
    }
  }
}
</style>
