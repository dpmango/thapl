<template>
  <div class="dev-grid" :class="[show && '_show']">
    <div class="container">
      <div class="row">
        <div v-for="(col, idx) in [...Array(12)]" :key="idx" class="col col-1">
          <div class="dev-grid__col"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="dev-toggle" :class="[show && '_active']" @click="toggleGrid">Grid</div>
  <div class="theme-toggle" @click="toggleTheme">Dark</div>
</template>

<script setup>
const show = ref(false)

const toggleGrid = () => {
  show.value = !show.value
}

const toggleTheme = () => {
  const action = document.documentElement.classList.contains('dark-mode') ? 'remove' : 'add'

  document.documentElement.classList[action]('dark-mode')
}
</script>

<style lang="scss" scoped>
.dev-grid {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9;
  opacity: 0;
  &._show {
    opacity: 1;
  }
  &__col {
    height: 100vh;
    background: rgba(var(--color-primary-rgb), 0.1);
  }
}

.dev-toggle,
.theme-toggle {
  position: fixed;
  z-index: 9;
  bottom: 20px;
  left: 20px;
  background: var(--color-font);
  color: var(--color-primary);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  &._active {
    background: var(--color-primary);
  }
}

.theme-toggle {
  bottom: 66px;
}
</style>
