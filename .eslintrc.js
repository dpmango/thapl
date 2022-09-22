module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['static/', '**/*.min.js'],
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    quotes: ['error', 'single'],
    'prettier/prettier': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/prop-name-casing': 'off',
    'vue/require-default-prop': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-undef': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/require-v-for-key': 'off',
    camelcase: 'off',
  },
}
