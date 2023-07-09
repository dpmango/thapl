# Thapl

### Демо

// 549 - тестовый стенд (singlepage)
// 296 - честная рыба
// 445 - город сад

### Режим работы

В файле `nuxt.config.js`

`ssr: Boolean` - Включить/отключить рендеринг страниц на сервере

В файле `/plugins/env.js`
`const useRuntime = Boolean` - использовать .env (true) файл чтобы брать переменные из runtime, либо использовать обьект `window.config` (false) (только с `ssr: false`)

### Темы

В файле `nuxt.config.js`

`theme: orange` - Основная тема страниц

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.
