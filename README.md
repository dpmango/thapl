# Thapl

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


#### заметки
- [ ] open_item_page_to_add - индикатор открывать окно товара или сразу добавлять в корзину
- [ ] формировать вид меню по NUXT_PUBLIC_CATALOG_TYPE /catalog/get-main-page-categories, /catalog/get-conceptions , /catalog/get-categories ,
- [ ] фильтры товаров vegan и т.д. не показывать если таких товаров нет в списках
- [ ] по настройке спрашивать выбор города - отдельные поддомены, запомнить город
- [ ] сохранение адресов доставки
