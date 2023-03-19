<template>
  <div class="crumbs">
    <div class="crumbs__wrapper">
      <ul class="crumbs__list">
        <li v-for="crumb in crumbs">
          <NuxtLink :to="crumb.href" class="h2-title">
            <span>{{ crumb.label }}</span>
            <i>→</i>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  showHome: {
    type: Boolean,
    default: true,
  },
})

const crumbs = computed(() => {
  const defaultList = props.showHome
    ? [
        {
          href: '/',
          label: 'Главная',
        },
      ]
    : []

  return [...defaultList, ...props.list]
})
</script>

<style lang="scss" scoped>
.crumbs {
  // &__wrapper{}
  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: -4px;
    li {
      display: inline-flex;
      &:last-child a {
        pointer-events: none;
        color: var(--color-font);
        i {
          display: none;
        }
      }
    }
    a {
      display: inline-flex;
      align-items: center;
      margin-bottom: 4px;
      color: var(--color-primary);
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-font);
      }
      i {
        font-style: normal;
        margin-right: 8px;
        margin-left: 8px;
      }
    }
  }
}

@include r($md) {
  .crumbs {
    &__list {
      a {
        .nuxt-icon {
          margin-left: 4px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
