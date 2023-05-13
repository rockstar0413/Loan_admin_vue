const Layout = () => import('@/layout/index.vue')
const UserAccount = () => import('@/views/loan-management/userAccount/index.vue')
const Data = () => import('@/views/loan-management/data/index.vue')
const Order = () => import('@/views/loan-management/order/index.vue')

export default [
  {
    path: '/loan-management',
    component: Layout,
    name: 'loan-management',
    meta: {
      title: 'menu.loanManagement',
    },
    icon: 'User',
    children: [
      {
        path: '/userAccount',
        name: 'userAccount',
        component: UserAccount,
        meta: {
          title: 'menu.userAccount',
          affix: true,
        },
      },
      {
        path: '/data',
        name: 'data',
        component: Data,
        meta: {
          title: 'menu.data',
          affix: true,
        },
      },
      {
        path: '/order',
        name: 'order',
        component: Order,
        meta: {
          title: 'menu.order',
          affix: true,
        },
      },
    ],
  },
]
