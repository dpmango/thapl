<template>
  <div class="profile">
    <div class="container _narrow">
      <ProfileNav class="profile__nav" />

      <div class="profile__info">
        <div class="row">
          <div class="profile__info-col col col-6 col-sm-12">
            <span class="text-s c-gray">Имя</span>
            <div v-if="user.name" class="h5-title">{{ user.name }}</div>
            <div v-else class="h5-title c-gray">—</div>
          </div>
          <div class="profile__info-col col col-6 col-sm-12">
            <span class="text-s c-gray">Телефон</span>
            <div v-if="user.phone" class="h5-title">{{ user.username }}</div>
            <div v-else class="h5-title c-gray">—</div>
          </div>
          <div class="profile__info-col col col-6 col-sm-12">
            <span class="text-s c-gray">Электронная почта</span>
            <div v-if="user.phone" class="h5-title">{{ user.email }}</div>
            <div v-else class="h5-title c-gray">—</div>
          </div>
          <div class="profile__info-col col col-6 col-sm-12">
            <span class="text-s c-gray">Дата рождения</span>
            <div v-if="user.phone" class="h5-title">{{ user.birthday }}</div>
            <div v-else class="h5-title c-gray">—</div>
          </div>
        </div>
      </div>

      <div class="profile__cta">
        <UiButton theme="primary" to="/profile/edit">Редактировать данные</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store'

const sessionStore = useSessionStore()
const { user } = storeToRefs(sessionStore)
</script>

<style lang="scss" scoped>
.profile {
  margin: 60px 0 120px;
  &__nav {
  }
  // &__info {
  // }
  &__info-col {
    margin-top: 36px;
  }
  &__cta {
    margin-top: 48px;
  }
}

@include r($sm) {
  .profile {
    margin: 32px 0 72px;
    &__info-col {
      margin-top: 20px;
    }
    &__cta {
      margin-top: 28px;
    }
  }
}
</style>
