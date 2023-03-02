<template>
  <li class="li" :class="[modifier && `_${modifier}`]" v-bind="$attrs">
    <p class="li__title" :class="[modifier === 'large' ? 'h5-title' : 'text-m']">{{ title }}</p>
    <div v-if="description" class="li__content c-gray">
      <div v-for="desc in description" class="li__content-str">
        <span v-if="desc" :class="[modifier === 'large' ? 'text-m' : 'text-s']">
          <UiAtomLongWords :text="desc" />
        </span>
      </div>
    </div>
  </li>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: {
    type: [String, Array],
    default: '',
  },
  modifier: String,
})
</script>

<style lang="scss" scoped>
.li {
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  &._large {
    padding: 36px 0;
  }
  &__title {
    transition: color 0.25s $ease;
  }
  &__content {
    margin-top: 4px;
    display: flex;
    align-items: center;
  }
  &__content-str {
    display: inline-flex;
    align-items: center;
    span {
      display: inline-flex;
      align-items: center;
      &::after {
        display: inline-block;
        content: ' ';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        margin-left: 12px;
        margin-right: 12px;
        background: var(--color-border);
      }
    }
    &:last-child {
      span::after {
        display: none;
      }
    }
  }
  &:hover {
    .li {
      &__title {
        color: var(--color-primary);
      }
    }
  }
  &:last-child {
    border-bottom: 0;
  }
}
</style>
