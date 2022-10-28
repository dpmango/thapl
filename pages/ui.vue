<template>
  <main class="page__content ui">
    <div class="container">
      <div class="ui__section">
        <div class="row">
          <div class="col col-6 col-md-12">
            <div class="ui__section-title h2-title">Заголовки</div>

            <div class="wysiwyg">
              <h1 class="h1-title">H1 title</h1>
              <h2 class="h2-title">H2 title</h2>
              <h3 class="h3-title">H3 title</h3>
              <h4 class="h4-title">H4 title</h4>
              <h5 class="h5-title">H5 title</h5>
              <h6 class="h6-title">H6 title</h6>
            </div>
          </div>

          <div class="col col-6 col-md-12">
            <div class="ui__section-title h2-title">Параграфы</div>
            <div class="wysiwyg">
              <p class="text-l">
                Имеется спорная точка зрения, гласящая примерно следующее: стремящиеся вытеснить
                традиционное производство, нанотехнологии, которые представляют собой яркий пример
                континентально-европейского типа
              </p>
              <p class="text-m">
                Имеется спорная точка зрения, гласящая примерно следующее: стремящиеся вытеснить
                традиционное производство, нанотехнологии, которые представляют собой яркий пример
                континентально-европейского типа
              </p>
              <p class="text-s">
                Имеется спорная точка зрения, гласящая примерно следующее: стремящиеся вытеснить
                традиционное производство, нанотехнологии, которые представляют собой яркий пример
                континентально-европейского типа
              </p>
              <p class="text-xs">
                Имеется спорная точка зрения, гласящая примерно следующее: стремящиеся вытеснить
                традиционное производство, нанотехнологии, которые представляют собой яркий пример
                континентально-европейского типа
              </p>
            </div>
          </div>
          <div class="col col-6 col-md-12">
            <div class="ui__section-title h2-title">Цвета</div>

            <p class="text-m c-font">цвет c-font</p>
            <p class="text-m c-gray">цвет c-gray</p>
            <p class="text-m c-primary">цвет c-primary</p>
            <p class="text-m c-green">цвет c-green</p>
            <p class="text-m c-red">цвет c-red</p>
          </div>

          <div class="col col-6 col-md-12">
            <div class="ui__section-title h2-title">Списки</div>

            <ul class="ul-primary">
              <li>.ul-primary</li>
              <li>.ul-primary</li>
              <li>.ul-primary</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="ui__section">
        <div class="ui__section-title h2-title">Иконки</div>
        <div class="ui__icons">
          <nuxt-icon
            v-for="(icon, idx) in icons"
            :key="idx"
            v-tooltip="icon"
            :fill="typeof icon === 'object'"
            :name="typeof icon === 'object' ? icon.name : icon"
          />
        </div>
        <div class="ui__icons"></div>
      </div>

      <div class="ui__section">
        <div class="ui__section-title h2-title">Кнопки</div>
        <p class="text-s c-gray">iconLeft / iconRight принимает любые иконки</p>
        <div class="ui__buttons">
          <UiButton size="large" icon-left="heart">Текст</UiButton>
          <UiButton size="large" icon-right="login">Текст</UiButton>
          <UiButton to="/" size="large">Текст</UiButton>
          <UiButton size="medium">Текст</UiButton>
          <UiButton size="small">Текст</UiButton>
        </div>
        <div class="ui__buttons">
          <UiButton theme="secondary" size="medium" icon-left="search">Текст</UiButton>
          <UiButton theme="secondary" size="medium" icon-right="caret">Текст</UiButton>
          <UiButton theme="secondary" size="large">Текст</UiButton>
          <UiButton theme="secondary" size="medium">Текст</UiButton>
          <UiButton theme="secondary" size="small">Текст</UiButton>
        </div>
        <div class="ui__buttons">
          <UiButton theme="accent" size="small" icon-left="clock">Текст</UiButton>
          <UiButton theme="accent" size="small" icon-right="like">Текст</UiButton>
          <UiButton theme="accent" size="large">Текст</UiButton>
          <UiButton theme="accent" size="medium">Текст</UiButton>
          <UiButton theme="accent" size="small">Текст</UiButton>
        </div>
      </div>

      <div class="ui__section">
        <div class="ui__section-title h2-title">Инпуты</div>
        <div class="text-s c-gray">
          Компоненты контролируются от родителя по :checked (как :value). Изминение @onChange
        </div>
        <div class="ui__checkboxes">
          <UiCheckbox :checked="checkbox" @change="checkbox = !checkbox">Текст</UiCheckbox>
          <UiCheckbox :checked="true">Текст</UiCheckbox>
          <UiCheckbox :disabled="true">Текст</UiCheckbox>
          <UiCheckbox :error="true">Текст</UiCheckbox>
        </div>
        <div class="ui__checkboxes">
          <UiCheckbox type="radio" :checked="radio" @change="radio = !radio">Текст</UiCheckbox>
          <UiCheckbox type="radio" :checked="true">Текст</UiCheckbox>
          <UiCheckbox type="radio" :disabled="true">Текст</UiCheckbox>
          <UiCheckbox type="radio" :error="true">Текст</UiCheckbox>
        </div>
      </div>

      <div class="ui__section">
        <div class="ui__section-title h2-title">Компоненты</div>

        <div class="ui__component">
          <UiCrumbs class="instruction__crumbs" :list="crumbs" />
        </div>
        <div class="ui__component">
          <UiCopy
            class="ui__copy"
            text="Текст для копирования в буфер браузера. Копирается при клике в любую область этого бокса"
          >
            <p class="text-l">Тыкните для копирования</p>
          </UiCopy>
        </div>
        <div class="ui__component">
          <UiPagination :meta="paginationMeta" @on-сhange="handlePagination" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// definePageMeta({ layout: 'default', header: 'page' })

const checkbox = ref(false)
const radio = ref(false)

const crumbs = [
  {
    href: '/page',
    label: 'Хлебная',
  },
  {
    href: '/page/1',
    label: 'Крошка',
  },
]

const paginationMeta = ref({
  page: 1,
  count: 100,
  limit: 5,
})

const handlePagination = (v) => {
  paginationMeta.value.page = v
}

const icons = [
  'heart',
  'login',
  'dialog',
  'search',
  'caret',
  'clock',
  'like',
  'dislike',
  'close',
  'cart',
  'cart-outline',
  'location',
  'high-load',
  'SocialApple',
  { name: 'SocialGoogleplay' },
]
</script>

<style lang="scss" scoped>
.ui {
  &__section {
    margin: 40px 0;
  }
  &__section-title {
    margin-top: 24px;
    margin-bottom: 20px;
  }

  &__icons {
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;
    font-size: 30px;
    color: var(--color-primary);
    .nuxt-icon {
      margin-right: 20px;
    }
  }
  &__buttons,
  &__checkboxes {
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: -8px;
    .button,
    .cb {
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }

  &__copy {
    margin: 20px 0;
    max-width: 500px;
  }
  &__component {
    margin-top: 16px;
  }
}
</style>
