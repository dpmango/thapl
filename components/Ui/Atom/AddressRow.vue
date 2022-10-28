<template>
  <li class="li" v-bind="$attrs">
    <p class="li__title text-m">{{ title }}</p>
    <div v-if="description" class="li__content c-gray">
      <span v-for="desc in description" class="text-s">
        <UiAtomLongWords :text="desc" />
      </span>
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
})
</script>

<style lang="scss" scoped>
.li {
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  &__title {
    transition: color 0.25s $ease;
  }
  &__content {
    margin-top: 4px;
    display: flex;
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
      &:last-child {
        &::after {
          display: none;
        }
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
