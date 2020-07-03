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
      component: () => import('@/index.ts'),
    },
    {
      name: 'dynamic',
      path: '/:dynamic',
      component: () => import('@/_dynamic/index.ts'),
    },
    {
      name: 'dynamicVue',
      path: '/:dynamicVue',
      component: () => import('@/_dynamicVue/index.vue'),
    },
    {
      name: 'multipleNest',
      path: '/multipleNest',
      component: () => import('@/multipleNest/multipleNest.ts'),

      children: [

        {
          name: 'multipleNest-inner1',
          path: 'inner1',
          component: () => import('@/multipleNest/inner1/inner1.ts'),

          children: [

            {
              name: 'multipleNest-inner1-inner2',
              path: 'inner2',
              component: () => import('@/multipleNest/inner1/inner2/inner2.ts'),

              children: [

                {
                  name: 'multipleNest-inner1-inner2-inner3',
                  path: 'inner3',
                  component: () => import('@/multipleNest/inner1/inner2/inner3/index.ts'),
                },
              ],
            },
            {
              name: 'multipleNest-inner1-single',
              path: 'single',
              component: () => import('@/multipleNest/inner1/single/index.ts'),
            },
          ],
        },
      ],
    },
    {
      name: 'multipleSingle',
      path: '/multipleSingle',
      component: () => import('@/multipleSingle/index.ts'),
    },
    {
      name: 'multipleSingle-inner1',
      path: '/multipleSingle/inner1',
      component: () => import('@/multipleSingle/inner1/index.ts'),
    },
    {
      name: 'multipleSingle-inner1-inner2',
      path: '/multipleSingle/inner1/inner2',
      component: () => import('@/multipleSingle/inner1/inner2/index.ts'),
    },
    {
      name: 'nest',
      path: '/nest',
      component: () => import('@/nest/nest.ts'),

      children: [

        {
          name: 'nest-inner',
          path: 'inner',
          component: () => import('@/nest/inner/index.ts'),
        },
        {
          name: 'nest-inner-dynamic',
          path: 'inner/:dynamic',
          component: () => import('@/nest/inner/_dynamic/index.ts'),
        },
      ],
    },
    {
      name: 'nestVue',
      path: '/nestVue',
      component: () => import('@/nestVue/nestVue.vue'),

      children: [

        {
          name: 'nestVue-inner',
          path: 'inner',
          component: () => import('@/nestVue/inner/index.vue'),
        },
        {
          name: 'nestVue-inner-dynamic',
          path: 'inner/:dynamic',
          component: () => import('@/nestVue/inner/_dynamic/index.vue'),
        },
      ],
    },
    {
      name: 'single',
      path: '/single',
      component: () => import('@/single/index.ts'),

      meta: {
        "a": 1
      },
    },
    {
      name: 'singleVue',
      path: '/singleVue',
      component: () => import('@/singleVue/index.vue'),
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