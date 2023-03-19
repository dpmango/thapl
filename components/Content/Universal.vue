<template>
  <div class="content wysiwyg">
    <div v-for="block in blocks" :key="block.id" class="content__section">
      <template v-if="block.type === 'header'">
        <h1 v-if="block.data.level === 1" v-html="block.data.text" />
        <h2 v-if="block.data.level === 2" v-html="block.data.text" />
        <h3 v-if="block.data.level === 3" v-html="block.data.text" />
        <h4 v-if="block.data.level === 4" v-html="block.data.text" />
        <h5 v-if="block.data.level === 5" v-html="block.data.text" />
        <h6 v-if="block.data.level === 6" v-html="block.data.text" />
      </template>

      <template v-else-if="block.type === 'paragraph'">
        <p v-html="block.data.text" />
      </template>

      <template v-else-if="block.type === 'list'">
        <ol v-if="block.data.style === 'ordered'">
          <li v-for="li in block.data.items" v-html="li" />
        </ol>
        <ul v-else-if="block.data.style === 'unordered'">
          <li v-for="li in block.data.items" v-html="li" />
        </ul>
      </template>

      <template v-else-if="block.type === 'quote'">
        <figure>
          <blockquote>
            <p v-html="block.data.text" />
          </blockquote>

          <figcaption v-html="block.data.caption" />
        </figure>
      </template>

      <template v-else-if="block.type === 'image'">
        <ContentMediaSlider class="content__slider" :slides="[block.data.file]" />
      </template>
      <template v-else-if="block.type === 'simpleImage'">
        <ContentMediaSlider class="content__slider" :slides="[block.data]" />
      </template>

      <template v-else-if="block.type === 'delimiter'">
        <hr />
      </template>

      <template v-else-if="block.type === 'raw'">
        <div v-html="block.data.html"></div>
      </template>

      <template v-else-if="block.type === 'code'">
        <div v-html="block.data.code" />
      </template>

      <!-- <template v-else>
        {{ block }}
      </template> -->
    </div>
  </div>
</template>

<script setup lang="ts">
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
