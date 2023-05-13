/*
 *  ┌───┐   ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┐
 *  │Esc│   │ F1│ F2│ F3│ F4│ │ F5│ F6│ F7│ F8│ │ F9│F10│F11│F12│ │P/S│S L│P/B│  ┌┐    ┌┐    ┌┐
 *  └───┘   └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┘  └┘    └┘    └┘
 *  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───────┐ ┌───┬───┬───┐ ┌───┬───┬───┬───┐
 *  │~ `│! 1│@ 2│# 3│$ 4│% 5│^ 6│& 7│* 8│( 9│) 0│_ -│+ =│ BacSp │ │Ins│Hom│PUp│ │N L│ / │ * │ - │
 *  ├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─────┤ ├───┼───┼───┤ ├───┼───┼───┼───┤
 *  │ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{ [│} ]│ | \ │ │Del│End│PDn│ │ 7 │ 8 │ 9 │   │
 *  ├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤ └───┴───┴───┘ ├───┼───┼───┤ + │
 *  │ Caps │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  │               │ 4 │ 5 │ 6 │   │
 *  ├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────────┤     ┌───┐     ├───┼───┼───┼───┤
 *  │ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│  Shift   │     │ ↑ │     │ 1 │ 2 │ 3 │   │
 *  ├─────┬──┴─┬─┴──┬┴───┴───┴───┴───┴───┴──┬┴───┼───┴┬────┬────┤ ┌───┼───┼───┐ ├───┴───┼───┤ E││
 *  │ Ctrl│    │Alt │         Space         │ Alt│    │    │Ctrl│ │ ← │ ↓ │ → │ │   0   │ . │←─┘│
 *  └─────┴────┴────┴───────────────────────┴────┴────┴────┴────┘ └───┴───┴───┘ └───────┴───┴───┘
 *
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2021-07-26 16:16:36
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */

import { createRouter, createWebHashHistory } from 'vue-router'

import background from './modules/background';

import redirect from './modules/redirect'
import error from './modules/error'
import login from './modules/login'
import chanelManagement from './modules/chanel-management'
//import test from './modules/test'
import systemSetting from './modules/system-setting'
import loanManagement from './modules/loan-management'
// import sportsBetting from './modules/sports-betting'
// import lottery from './modules/lottery'
// import account from './modules/account'
// import payment from './modules/payment'
// import analytics from './modules/analytics'
// import systemlog from './modules/systemlog'
// import humanManagement from './modules/humanManagement'
// import statistics from './modules/statistics'
/* 菜单栏的路由 */

// 后台主页
export const backgroundRoutes = [...background]

// user setting
export const loanManagementRoutes = [...loanManagement]

// 固定菜单
export const chanelManagementRoutes = [...chanelManagement]

// system setting
export const systemSettingRoutes = [...systemSetting]
// // 动态菜单
// export const asyncRoutes = [...test]
// // sports betting
// export const sportsBettingRoutes = [...sportsBetting]
// // lottery
// export const lotteryRoutes = [...lottery]
// //humanmanagement
// export const humanManagementRoutes = [...humanManagement]
// // payment
// export const paymentsRoutes = [...payment]
// //Statistics
// export const statisticsRoutes = [...statistics]
// // analytics
// export const analyticsRoutes = [...analytics]
// // systemlog
// export const systemlogsRoutes = [...systemlog]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/order',
    },
    ...redirect, // 统一的重定向配置
    ...login,

    ...loanManagementRoutes,
    ...backgroundRoutes,

    // ...humanManagementRoutes,
    ...chanelManagementRoutes,
    ...systemSettingRoutes,

    // ...sportsBettingRoutes,
    // ...lotteryRoutes,
    // ...paymentsRoutes,
    // ...statisticsRoutes,
    // ...analyticsRoutes,
    // ...systemlogsRoutes,
    ...error,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

export default router
