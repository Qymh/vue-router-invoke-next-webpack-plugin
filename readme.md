# vue-router-invoke-next-webpack-plugin

Automatic generate routes of `vue-router` based on the directory, both supported vue2.x or vue3.x

## Usage

### Download

```yaml
yarn add vue-router-invoke-next-webpack-plugin@alpha -D
```

## Options

| Options  |       Type       | Required |     Default      |                                         Description |
| -------- | :--------------: | :------: | :--------------: | --------------------------------------------------: |
| root     |      String      |   true   |        ''        | the directory which should be watched and generated |
| alias    |      String      |  false   |     'Invoke'     |                          the root directory's alias |
| version  | String or Number |  false   |        3         |                                  vue version 2 or 3 |
| language |      String      |  false   |   'typescript'   |                            typescript or javascript |
| mode     |      String      |  false   |    'history'     |                                     hash or history |
| dist     |      String      |  false   | `{root}/.invoke` |             the output directory of generatic route |

## Using In Webpack

webpack.config.js

```js
const Invoke = require('vue-router-invoke-next-webpack-plugin');

module.exports = {
  // omit some options
  mode: ...,
  entry: ...,

  // you [must] set alias path the same as Invoke's Root Option
  resolve: {
    alias: {
      'Invoke': ROOT
    }
  }

  // use plugins
  plugins: [
    new Invoke({
      // should be the same as resolve.alias.Invoke
      root: ROOT
    })
  ]
}
```

Also you need make sure the value of `process.env.NODE_ENV` is equal to `development` or `production` in diffrent enviroment

## Using In VueCli

vue.config.js

```js
const Invoke = require('vue-router-invoke-next-webpack-plugin');
const path = require('path');

module.exports = {
  // omit other options...
  configureWebpack(config) {
    // you [must] set alias path the same as Invoke's Root Option
    config.resolve.alias.Invoke = path.resolve(process.cwd(), 'src/views');
    config.plugins.push(
      new Invoke({
        // should be the same as resolve.alias.Invoke
        root: path.resolve(process.cwd(), 'src/views')
      })
    );
  }
};

// or another way..

module.exports = {
  // omit other options...
  configureWebpack: {
    resolve: {
      alias: {
        // you [must] set alias path the same as Invoke's Root Option
        Invoke: path.resolve(process.cwd(), 'src/views')
      }
    },
    plugins: [
      new Invoke({
        // should be the same as resolve.alias.Invoke
        root: path.resolve(process.cwd(), 'src/views')
      })
    ]
  }
};
```

## Using With Typescript

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "Invoke/*": ["views/*"]
    }
  }
}
```

you may need add `baseUrl` and `paths` for friendly check

## What Is The Root Option

The `ROOT` option which means the aim directory to be watched, for an example

```tree
src
├── app.vue
├── main.js
└── views
    ├── index.vue
    ├── shop
    │   └── index.vue
    └── user
        └── index.vue
```

`path.resolve(process.cwd(), 'src/views')` should be the `root` path which be watched to generate routes for `vue-router`

## How to Generate Routes

We split routes into `Single` `Dynamic` and `Nested` route

The below examples depends on the same options

webpack.config.js

```js
const Invoke = require('vue-router-invoke-next-webpack-plugin');
const path = require('path');

module.exports = {
  // omit some options
  mode: ...,
  entry: ...,

  // you [must] set alias path the same as Invoke's root option
  resolve: {
    alias: {
      'Invoke': path.resolve(process.cwd(), 'src/views')
    }
  }

  plugins:[
    new Invoke({
      // should be the same as resolve.alias.Invoke
      root: path.resolve(process.cwd(), 'src/views')
    })
  ]
}
```

### Single

A directory which has a file called `index.vue`(no sensitive to capital and small letter) can be translated to single route

```tree
src
├── app.vue
├── main.js
└── views
    ├── index.vue
    ├── shop
    │   ├── index.vue
    │   └── star
    │       └── index.vue
    └── user
        └── index.vue
```

The routes will be auto generated to the file `src/views/.invoke/router.js`

You can change the default output directory which is `${root}/.invoke` by using the `dist` option

src/views/.invoke/router.js

```js
import { createRouter, createWebHistory } from 'vue-router';

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,

  routes: [
    {
      name: 'index',
      path: '/',
      component: () => import('Invoke/index.vue')
    },
    {
      name: 'shop',
      path: '/shop',
      component: () => import('Invoke/shop/index.vue')
    },
    {
      name: 'shop-star',
      path: '/shop/star',
      component: () => import('Invoke/shop/star/index.vue')
    },
    {
      name: 'user',
      path: '/user',
      component: () => import('Invoke/user/index.vue')
    }
  ]
});
```

### Dynamic

A directory which start with `_` and has a file which called `index.vue` can be translated to dynamic route

```tree
src
├── app.vue
├── main.js
└── views
    ├── _user
    │   └── index.vue
    ├── index.vue
    └── shop
        ├── _star
        │   └── index.vue
        └── index.vue
```

src/views/.invoke/router.js

```js
import { createRouter, createWebHistory } from 'vue-router';

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,

  routes: [
    {
      name: 'index',
      path: '/',
      component: () => import('Invoke/index.vue')
    },
    {
      name: 'user',
      path: '/:user',
      component: () => import('Invoke/_user/index.vue')
    },
    {
      name: 'shop',
      path: '/shop',
      component: () => import('Invoke/shop/index.vue')
    },
    {
      name: 'shop-star',
      path: '/shop/:star',
      component: () => import('Invoke/shop/_star/index.vue')
    }
  ]
});
```

### Nested

A directory has the same name as its first file will be translated to nested route

```tree
src
├── app.vue
├── main.js
└── views
    ├── index.vue
    └── nest
        ├── child
        │   └── index.vue
        ├── inner
        │   └── index.vue
        └── nest.vue
```

src/views/.invoke/router.js

```js
import { createRouter, createWebHistory } from 'vue-router';

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,

  routes: [
    {
      name: 'index',
      path: '/',
      component: () => import('Invoke/index.vue')
    },
    {
      name: 'nest',
      path: '/nest',
      component: () => import('Invoke/nest/nest.vue'),

      children: [
        {
          name: 'nest-child',
          path: 'child',
          component: () => import('Invoke/nest/child/index.vue')
        },
        {
          name: 'nest-inner',
          path: 'inner',
          component: () => import('Invoke/nest/inner/index.vue')
        }
      ]
    }
  ]
});
```

## Route Options

route options just like `meta` `redirect` you can set by using `route.yml`

```tree
src
├── app.vue
├── main.js
└── views
    ├── index.vue
    └── single
        ├── index.vue
        └── route.yml
```

route.yml

```yaml
meta:
  number: 123
  string: 'string'
  boolean: true

redirect: '/test'
```

src/views/.invoke/router.js

```js
import { createRouter, createWebHistory } from 'vue-router';

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,

  routes: [
    {
      name: 'index',
      path: '/',
      component: () => import('Invoke/index.vue')
    },
    {
      name: 'single',
      path: '/single',
      component: () => import('Invoke/single/index.vue'),

      meta: {
        number: 123,
        string: 'string',
        boolean: true
      },

      redirect: '/test'
    }
  ]
});
```

## Router Options

options of `vue-router` you can set it by `Invoke` Options

webpack.config.js

```js
const Invoke = require('vue-router-invoke-next-webpack-plugin');
const path = require('path');

module.exports = {
  // omit some options
  mode: ...,
  entry: ...,

  // you [must] set alias path the same as Invoke's root option
  resolve: {
    alias: {
      'Invoke': path.resolve(process.cwd(), 'src/views')
    }
  }

  plugins: [
    new Invoke({
      // should be the same as resolve.alias.Invoke
      root: path.resolve(process.cwd(), 'src/views'),
      scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition;
        } else {
          return { left: 0, top: 0 };
        }
      },
    })
  ]
}
```

```tree
src
├── app.vue
├── main.js
└── views
    └── index.vue
```

src/views/.invoke/router.js

```js
import { createRouter, createWebHistory } from 'vue-router';

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,
  routes: [
    {
      name: 'index',
      path: '/',
      component: () => import('Invoke/index.vue')
    }
  ],
  scrollBehavior: function scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        left: 0,
        top: 0
      };
    }
  }
});
```

## Change Default Alias

If you want to change default alias `Invoke` you can use the option called `alias`

webpack.config.js

```js
const Invoke = require('vue-router-invoke-next-webpack-plugin');
const path = require('path');

module.exports = {
  // omit some options
  mode: ...,
  entry: ...,

  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src/views')
    }
  }

  plugins:[
    new Invoke({
      // should be the same as resolve.alias.@
      root: path.resolve(process.cwd(), 'src/views'),
      // change default alias
      alias: '@',
      scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition;
        } else {
          return { left: 0, top: 0 };
        }
      },
    })
  ]
}
```

```tree
src
├── app.vue
├── main.js
└── views
    └── index.vue
```

src/views/.invoke/router.js

```js
import { createRouter, createWebHistory } from 'vue-router';

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,
  routes: [
    {
      name: 'index',
      path: '/',
      // has changed default alias
      component: () => import('@/index.vue')
    }
  ]
});
```
