const Layout = () => import('@/layout/index.vue')
const Background = () => import('@/views/background/index.vue')
//const Reports = () => import('@/views/analytics/reports/index.vue')

export default [
  {
    path: '/background',
    component: Layout,
    name: 'background',
    meta: {
      title: 'menu.background',
    },
    icon: 'DataAnalysis',
    children: [
      {
        path: '/console',
        name: 'console',
        component: Background,
        meta: {
          title: 'menu.console',
          affix: true,
        },
      },
    //   {
    //     path: '/reports',
    //     name: 'reports',
    //     component: Reports,
    //     meta: {
    //       title: 'menu.reports',
    //       affix: true,
    //     },
    //   },
    ],
  },
]
