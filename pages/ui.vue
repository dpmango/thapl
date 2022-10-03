<template>
  <main class="page__content ui">
    <div class="container">
      <div class="ui__section">
        <div class="ui__section-title h2-title">Заголовки</div>
        <div class="wysiwyg">
          <h1 class="h1-title">H1 title</h1>
          <h2 class="h2-title">H2 title</h2>
          <h3 class="h3-title">H3 title</h3>
          <h4 class="h4-title">H4 title (subtitle-1)</h4>
          <h5 class="h5-title">H5 title (subtitle-2)</h5>
        </div>
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
    </div>
  </main>
</template>

<script setup>
// definePageMeta({ layout: 'default', header: 'page' })

const checkbox = ref(false)
const radio = ref(false)
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
  'location',
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
}
</style>
