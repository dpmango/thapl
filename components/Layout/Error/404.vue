<template>
  <div class="error">
    <div class="container">
      <div class="error__wrapper">
        <UiAtomErrorMessage title="Ошибка 404" image="error-not-found.svg">
          <template #content>
            Возможно, она когда-то была доступна по этой ссылке, но сейчас ее не существует.
            Попробуйте найти то, что ищете, начав с главной страницы.
          </template>
          <template #action>
            <UiButton type="button" to="/">Перейти на главную</UiButton>
          </template>
        </UiAtomErrorMessage>
      </div>
    </div>
  </div>
</template>

<styles lang="scss" scoped>
.error {
  &__wrapper {
    max-width: 432px;
    margin: 32px auto;
    min-height: calc(100vh - 215px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .error {
      max-width: 100%;
    }
  }
}
</styles>
