const Layout = () => import('@/layout/index.vue')
const Chanel = () => import('@/views/chanel-management/chanel/index.vue')

export default [
  {
    path: '/chanel-management',
    component: Layout,
    name: 'chanel-management',
    meta: {
      title: 'menu.chanelManagement',
    },
    icon: 'User',
    children: [
      {
        path: '/chanel',
        name: 'chanel',
        component: Chanel,
        meta: {
          title: 'menu.chanel',
          affix: true,
        },
      },
    ],
  },
]
