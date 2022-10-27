<template>
  <div class="error">
    <div class="container">
      <UiAtomErrorMessage title="Что то пошло не так...">
        <template #content>
          Произошла непредвиденная ошибка, но мы уже работаем над ее исправлением. <br />
          Если ошибка не уходит, попробуйте обновить свой браузер до актуальной версии
        </template>
        <template #action>
          <UiButton type="button" to="/">Перейти на главную</UiButton>
        </template>
      </UiAtomErrorMessage>
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

@include r($md) {
  .error {
    &__wrapper {
      margin: 68px auto;
      min-height: 1px;
    }
  }
}

@include r($sm) {
  .error {
    &__wrapper {
      margin: 52px auto;
    }
  }
}
</styles>
