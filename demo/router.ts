import {
  createRouter,
  createWebHashHistory
} from 'vue-router';

export const routerHistory = createWebHashHistory();
export const router = createRouter({
  history: routerHistory,

  routes: [

    {
      name: 'index',
      path: '/',
      component: () => import('Invoke/index'),
    },
    {
      name: 'dynamic',
      path: '/:dynamic',
      component: () => import('Invoke/_dynamic/index'),
    },
    {
      name: 'dynamicVue',
      path: '/:dynamicVue',
      component: () => import('Invoke/_dynamicVue/index.vue'),
    },
    {
      name: 'multipleNest',
      path: '/multipleNest',
      component: () => import('Invoke/multipleNest/multipleNest'),

      children: [

        {
          name: 'multipleNest-inner1',
          path: 'inner1',
          component: () => import('Invoke/multipleNest/inner1/inner1'),

          children: [

            {
              name: 'multipleNest-inner1-inner2',
              path: 'inner2',
              component: () => import('Invoke/multipleNest/inner1/inner2/inner2'),

              children: [

                {
                  name: 'multipleNest-inner1-inner2-inner3',
                  path: 'inner3',
                  component: () => import('Invoke/multipleNest/inner1/inner2/inner3/index'),
                },
              ],
            },
            {
              name: 'multipleNest-inner1-single',
              path: 'single',
              component: () => import('Invoke/multipleNest/inner1/single/index'),
            },
          ],
        },
      ],
    },
    {
      name: 'multipleSingle',
      path: '/multipleSingle',
      component: () => import('Invoke/multipleSingle/index'),
    },
    {
      name: 'multipleSingle-inner1',
      path: '/multipleSingle/inner1',
      component: () => import('Invoke/multipleSingle/inner1/index'),
    },
    {
      name: 'multipleSingle-inner1-inner2',
      path: '/multipleSingle/inner1/inner2',
      component: () => import('Invoke/multipleSingle/inner1/inner2/index'),
    },
    {
      name: 'nest',
      path: '/nest',
      component: () => import('Invoke/nest/nest'),

      children: [

        {
          name: 'nest-inner',
          path: 'inner',
          component: () => import('Invoke/nest/inner/index'),
        },
        {
          name: 'nest-inner-dynamic',
          path: 'inner/:dynamic',
          component: () => import('Invoke/nest/inner/_dynamic/index'),
        },
      ],
    },
    {
      name: 'nestVue',
      path: '/nestVue',
      component: () => import('Invoke/nestVue/nestVue.vue'),

      children: [

        {
          name: 'nestVue-inner',
          path: 'inner',
          component: () => import('Invoke/nestVue/inner/index.vue'),
        },
        {
          name: 'nestVue-inner-dynamic',
          path: 'inner/:dynamic',
          component: () => import('Invoke/nestVue/inner/_dynamic/index.vue'),
        },
      ],
    },
    {
      name: 'single',
      path: '/single',
      component: () => import('Invoke/single/index'),

      meta: {
        "a": 1
      },
    },
    {
      name: 'singleVue',
      path: '/singleVue',
      component: () => import('Invoke/singleVue/index.vue'),
    },
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
  },
});