<template>
  <div v-if="quickFilter.categories" class="filter">
    <div class="filter__wrapper">
      <ul class="filter__categories">
        <li v-for="category in quickFilter.categories">
          <div
            class="filter__link text-m"
            :class="[activeFilterKey === category.product_key && '_active']"
            @click="setFilter(category.product_key)"
          >
            {{ category.label }}
          </div>
        </li>
      </ul>

      <!-- <div class="filter__more text-m">Фильтры</div> -->
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useProductStore } from '~/store'

const productStore = useProductStore()
const { quickFilter, activeFilterKey } = storeToRefs(productStore)

const setFilter = (key) => {
  activeFilterKey.value = key
}
</script>

<style lang="scss" scoped>
.filter {
  position: fixed;
  z-index: 8;
  bottom: 28px;
  left: 0;
  right: 0;
  padding: 0 20px;
  pointer-events: none;
  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: all;
  }
  &__categories {
    display: flex;
    align-items: center;
    margin-right: 20px;
    background: var(--component-background);
    box-shadow: var(--box-shadow-large);
    border-radius: 50px;
    li {
      flex: 0 0 auto;
      &:last-child {
        .filter__link::after {
          display: none;
        }
      }
    }
  }
  &__link {
    position: relative;
    font-weight: 500;
    padding: 10px 24px;
    color: var(--color-gray);
    cursor: pointer;
    transition: color 0.25s $ease;
    &::after {
      display: inline-block;
      content: ' ';
      position: absolute;
      right: 0;
      top: 50%;
      height: 20px;
      width: 1px;
      transform: translateY(-50%);
      background: var(--color-separator);
    }

    &._active {
      color: var(--color-font);
    }
    &:hover {
      color: var(--color-primary);
    }
  }

  &__more {
    background: var(--component-background);
    box-shadow: var(--box-shadow-large);
    border-radius: 50px;
  }
}

@include r($sm) {
  .filter {
    bottom: 0px;
    padding: 0 0px;
    &__wrapper {
      display: block;
    }
    &__categories {
      justify-content: center;
      margin-right: 0px;
      border-radius: 0px;
      li {
        flex: 0 0 auto;
        &:last-child {
          .filter__link::after {
            display: none;
          }
        }
      }
    }
    &__link {
      position: relative;
      font-weight: 500;
      padding: 10px 24px;
      color: var(--color-gray);
      cursor: pointer;
      transition: color 0.25s $ease;
      &::after {
        display: inline-block;
        content: ' ';
        position: absolute;
        right: 0;
        top: 50%;
        height: 20px;
        width: 1px;
        transform: translateY(-50%);
        background: var(--color-separator);
      }

      &._active {
        color: var(--color-font);
      }
      &:hover {
        color: var(--color-primary);
      }
    }
  }
}
</style>
