<template>
  <div class="content wysiwyg">
    <div v-for="block in blocks" :key="block.id" class="content__section">
      <template v-if="block.type === 'header'">
        <h1 v-if="block.data.level === 1">{{ block.data.text }}</h1>
        <h2 v-if="block.data.level === 2">{{ block.data.text }}</h2>
        <h3 v-if="block.data.level === 3">{{ block.data.text }}</h3>
        <h4 v-if="block.data.level === 4">{{ block.data.text }}</h4>
        <h5 v-if="block.data.level === 5">{{ block.data.text }}</h5>
        <h6 v-if="block.data.level === 6">{{ block.data.text }}</h6>
      </template>

      <template v-else-if="block.type === 'paragraph'">
        <p>{{ block.data.text }}</p>
      </template>

      <template v-else-if="block.type === 'list'">
        <ol v-if="block.data.style === 'ordered'">
          <li v-for="li in block.data.items">{{ li }}</li>
        </ol>
        <ul v-else-if="block.data.style === 'unordered'">
          <li v-for="li in block.data.items">{{ li }}</li>
        </ul>
      </template>

      <template v-else-if="block.type === 'quote'">
        <figure>
          <blockquote>
            <p>
              {{ block.data.text }}
            </p>
          </blockquote>
          <figcaption>
            {{ block.data.caption }}
          </figcaption>
        </figure>
      </template>

      <template v-else-if="block.type === 'image'">
        <ContentMediaSlider class="content__slider" :slides="[block.data.file]" />
      </template>

      <template v-else-if="block.type === 'delimiter'">
        <hr />
      </template>

      <!-- <template v-else>
        {{ block }}
      </template> -->
    </div>

    <!-- <div class="content__section">
      <h4>Идеальные ингредиенты</h4>
      <p>
        Почему мы так хотим познакомиться? Потому что дальше пицца делает всё сама. Люди видят, что
        она вкусная, и возвращаются снова. Нам главное первый раз это показать.
      </p>

      <p>
        Вообще пицца — очень простая штука, её сложно испортить. Достаточно хороших ингредиентов и
        правильного теста. Это конструктор, если детали качественные, то и результат будет в
        порядке. Вот они, наши детали.
      </p>
    </div>

    <div class="content__section">
      <div class="row content__plates">
        <div class="col col-6 col-sm-12">
          <div class="content__plate">
            <h6>Тесто</h6>
            <p>
              Самая тонкая вещь. Главное - сделать его «живым». Это целый квест из граммов,
              градусов, процентов и часов с минутами. Процесс непростой, но у нас получается!
            </p>
          </div>
        </div>
        <div class="col col-6 col-sm-12">
          <div class="content__plate">
            <h6>Моцарелла</h6>
            <p>
              Сыр в пицце - ключевой ингредиент. Мы используем настоящую моцареллу от российских
              поставщиков. Сыр должен тянуться, как на картинке.
            </p>
          </div>
        </div>
        <div class="col col-6 col-sm-12">
          <div class="content__plate">
            <h6>Начинка</h6>
            <p>
              Есть два главных правила вкусной начинки: не экономить на начинке; фанатично соблюдать
              режим хранения. Это и весь секрет.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="content__section">
      <h4>Одинаково вкусно в Москве и Сыктывкаре</h4>
      <p>
        Кто угодно может сделать вкусную пиццу. А шеф-повар итальянского ресторана сделает и вовсе
        шедевр. Он молодец. Но представьте, что вам нужно сделать вкусную пиццу в сотнях пиццерий,
        за сотни километров друг от друга. Это наш случай, у нас их вон уже сколько:
      </p>
    </div>

    <div class="content__section">
      <h4>Единые стандарты</h4>
      <p>
        Цифровые технологии помогают нам вовремя замечать, если что-то идёт неправильно. Но как
        понять, что правильно, а что нет? Для этого у нас есть стандарты. Вот, например, про мытьё
        рук:
      </p>
      <ol>
        <li>Выходил из кухни</li>
        <li>
          Наши стандарты — это не какие-то заумные схемы и формулы, а супер-понятные правила. У нас
          их сотни, буквально про всё. Именно так мы умудряемся делать всё хорошо и одновременно
          быстро расти.
        </li>
        <li>
          Нужна сила, благодаря которой стандарты будут соблюдаться. Для нас этой силой стала
          открытость.
        </li>
      </ol>
      <p>
        Кто угодно может написать сотню правил, но само по себе это не работает. Нужна сила,
        благодаря которой стандарты будут соблюдаться. Для нас этой силой стала открытость. Мы
        сделали всё настолько прозрачным, что отступать от стандартов просто не получается.
      </p>
      <ul>
        <li>Выходил из кухни</li>
        <li>
          Наши стандарты — это не какие-то заумные схемы и формулы, а супер-понятные правила. У нас
          их сотни, буквально про всё. Именно так мы умудряемся делать всё хорошо и одновременно
          быстро расти.
        </li>
        <li>
          Нужна сила, благодаря которой стандарты будут соблюдаться. Для нас этой силой стала
          открытость.
        </li>
      </ul>
    </div>

    <div class="content__section">
      <h4>Одинаково вкусно в Москве и Сыктывкаре</h4>
      <p>
        Кто угодно может сделать вкусную пиццу. А шеф-повар итальянского ресторана сделает и вовсе
        шедевр. Он молодец. Но представьте, что вам нужно сделать вкусную пиццу в сотнях пиццерий,
        за сотни километров друг от друга. Это наш случай, у нас их вон уже сколько:
      </p>
      <figure>
        <blockquote>
          <p>
            Если вы испытываете похожие чувства — прочитайте нашу книгу, и может быть мы станем
            друзьями. Если считаете, что это полная ерунда и так не бывает — всё равно прочитайте и
            расскажите, что думаете
          </p>
        </blockquote>
        <figcaption>
          Федор Овчинников
          <cite>Создатель</cite>
        </figcaption>
      </figure>
      <p>
        Наши стандарты — это не какие-то заумные схемы и формулы, а супер-понятные правила. У нас их
        сотни, буквально про всё. Именно так мы умудряемся делать всё хорошо и одновременно быстро
        расти.
      </p>
      <UiButton theme="secondary">Написать в Телеграм</UiButton>
    </div>

    <div class="content__section">
      <h4>Одинаково вкусно в Москве и Сыктывкаре</h4>
      <p>
        Кто угодно может сделать вкусную пиццу. А шеф-повар итальянского ресторана сделает и вовсе
        шедевр. Он молодец. Но представьте, что вам нужно сделать вкусную пиццу в сотнях пиццерий,
        за сотни километров друг от друга. Это наш случай, у нас их вон уже сколько:
      </p>
      <ContentMediaSlider
        class="content__slider"
        :slides="[
          {
            img: 'https://images.freeimages.com/images/large-previews/af4/sparklers-2-1200038.jpg',
          },
          { img: 'https://images.freeimages.com/images/large-previews/ebd/flamenco-1551386.jpg' },
          {
            img: 'https://images.freeimages.com/images/large-previews/631/yellow-flowers-1463581.jpg',
          },
        ]"
      />
    </div>

    <div class="content__section">
      <h4>Одинаково вкусно в Москве и Сыктывкаре</h4>
      <p>
        Кто угодно может сделать вкусную пиццу. А шеф-повар итальянского ресторана сделает и вовсе
        шедевр. Он молодец. Но представьте, что вам нужно сделать вкусную пиццу в сотнях пиццерий,
        за сотни километров друг от друга. Это наш случай, у нас их вон уже сколько:
      </p>
      <ContentMediaScroller
        class="content__slider"
        :slides="[
          {
            img: 'https://images.freeimages.com/images/large-previews/af4/sparklers-2-1200038.jpg',
          },
          { img: 'https://images.freeimages.com/images/large-previews/ebd/flamenco-1551386.jpg' },
          {
            img: 'https://images.freeimages.com/images/large-previews/631/yellow-flowers-1463581.jpg',
          },
        ]"
      />
    </div>

    <div class="content__section">
      <h4>Одинаково вкусно в Москве и Сыктывкаре</h4>
      <p>
        Кто угодно может сделать вкусную пиццу. А шеф-повар итальянского ресторана сделает и вовсе
        шедевр. Он молодец. Но представьте, что вам нужно сделать вкусную пиццу в сотнях пиццерий,
        за сотни километров друг от друга. Это наш случай, у нас их вон уже сколько:
      </p>
      <ContentVideo
        class="content__video"
        :ar="460 / 768"
        placeholder="https://images.freeimages.com/images/large-previews/ebd/flamenco-1551386.jpg"
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />
    </div> -->
  </div>
</template>

<script setup>
const props = defineProps({
  blocks: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="scss">
.content {
  &__section {
    margin: 36px 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__video,
  &__slider {
    margin: 36px 0;
  }
  &__plates {
    margin-bottom: -32px;
  }
  &__plate {
    background: rgba(var(--color-primary-rgb), 0.12);
    border-radius: var(--card-border-radius);
    padding: 28px;
    margin-bottom: 32px;
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--color-primary);
      margin: 0;
      & + p {
        margin-top: 0.5em;
      }
    }
  }
}

@include r($md) {
  .content {
    &__section {
      margin: 28px 0;
    }
    &__video,
    &__slider {
      margin: 28px 0;
    }
    &__plates {
      margin-bottom: -12px;
    }
    &__plate {
      padding: 20px;
      margin-bottom: 12px;
    }
  }
}
</style>
