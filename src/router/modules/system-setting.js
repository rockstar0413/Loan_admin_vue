const Layout = () => import('@/layout/index.vue')

const SystemNotifications = () =>
  import('@/views/system-setting/feedback/index.vue')
const SystemSMS = () => import('@/views/system-setting/systemSMS/index.vue')
const Member = () => import('@/views/system-setting/member/index.vue')

export default [
  {
    path: '/system-setting',
    component: Layout,
    name: 'system-setting',
    meta: {
      title: 'menu.systemSetting',
    },
    icon: 'Setting',
    children: [
      {
        path: '/systemSMS',
        name: 'systemSMS',
        component: SystemSMS,
        meta: {
          title: 'menu.systemSmss',
          affix: true,
        },
      },
      {
        path: '/member',
        name: 'member',
        component: Member,
        meta: {
          title: 'menu.adminUser',
          affix: true,
        },
      },
      {
        path: '/feedback',
        name: 'feedback',
        component: SystemNotifications,
        meta: {
          title: 'menu.feedback',
          affix: true,
        },
      },
    ],
  },
]
