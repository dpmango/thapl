<template>
  <div class="pagination">
    <div class="pagination__prev" :class="!prevAvailable && '_disabled'" @click="handlePrev">
      <nuxt-icon name="caret"></nuxt-icon>
    </div>
    <div class="pagination__list">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="pagination__item text-m"
        :class="[item === meta.page && '_active', typeof item !== 'number' && '_separator']"
        @click="emit('onChange', item)"
      >
        <span v-if="typeof item === 'number'">{{ item }}</span>
        <span v-else>...</span>
      </div>
    </div>
    <div class="pagination__next" :class="!nextAvailable && '_disabled'" @click="handleNext">
      <nuxt-icon name="caret"></nuxt-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  meta: Object,
})

const emit = defineEmits(['onChange'])

const countWithLimit = computed(() => {
  const { count, limit } = props.meta

  return Math.floor(count / limit)
})

const items = computed(() => {
  const { page, count, limit } = props.meta

  return paginationBuilder(page, countWithLimit.value)
})

const prevAvailable = computed(() => {
  return props.meta.page > 1
})

const nextAvailable = computed(() => {
  return props.meta.page < countWithLimit.value
})

const handlePrev = () => {
  if (prevAvailable) {
    emit('onChange', props.meta.page - 1)
  }
}
const handleNext = () => {
  if (nextAvailable) {
    emit('onChange', props.meta.page + 1)
  }
}

const getRange = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((v, i) => i + start)
}

const paginationBuilder = (currentPage, pageCount) => {
  let delta
  if (pageCount <= 7) {
    // delta === 7: [1 2 3 4 5 6 7]
    delta = 7
  } else {
    // delta === 2: [1 ... 4 5 6 ... 10]
    // delta === 4: [1 2 3 4 5 ... 10]
    delta = currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4
  }

  const range = {
    start: Math.round(currentPage - delta / 2),
    end: Math.round(currentPage + delta / 2),
  }

  if (range.start - 1 === 1 || range.end + 1 === pageCount) {
    range.start += 1
    range.end += 1
  }

  let pages =
    currentPage > delta
      ? getRange(Math.min(range.start, pageCount - delta), Math.min(range.end, pageCount))
      : getRange(1, Math.min(pageCount, delta + 1))

  const withDots = (value, pair) => (pages.length + 1 !== pageCount ? pair : [value])

  if (pages[0] !== 1) {
    pages = withDots(1, [1, '...']).concat(pages)
  }

  if (pages[pages.length - 1] < pageCount) {
    pages = pages.concat(withDots(pageCount, ['...', pageCount]))
  }

  return pages
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  &__list {
    display: flex;
    margin: 0 16px;
  }
  &__item {
    position: relative;
    flex: 0 0 auto;
    margin-right: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-width: 32px;
    min-height: 32px;
    font-weight: 600;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    transition: background 0.25s $ease, border 0.25s $ease;
    &:last-child {
      margin-right: 1px;
    }
    span {
      display: inline-block;
      padding: 2px 4px;
    }
    &._separator {
      pointer-events: none;
      &::after {
        display: inline-block;
        content: ' ';
        position: absolute;
        bottom: -11px;
        right: -11px;
        width: 20px;
        height: 20px;
        background: var(--color-primary);
        transform: rotate(45deg);
      }
    }
    &._active,
    &:hover {
      background: rgba(0, 97, 174, 0.19);
      border-color: transparent;
    }
  }
  &__prev,
  &__next {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-width: 32px;
    min-height: 32px;
    border-radius: 6px;
    font-size: 16px;
    background: var(--color-primary);
    color: white;
    cursor: pointer;
    transition: background 0.25s $ease, color 0.25s $ease;
    &._disabled {
      background: var(--color-bg);
      color: var(--color-disabled);
    }
  }
  &__prev {
    .nuxt-icon {
      transform: rotate(90deg);
    }
  }
  &__next {
    .nuxt-icon {
      transform: rotate(-90deg);
    }
  }
}
</style>
