/*
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-27 16:41:46
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */
import { defineStore } from 'pinia'
import {
  backgroundRoutes,

  loanManagementRoutes,
  chanelManagementRoutes,
  systemSettingRoutes,
  // sportsBettingRoutes,
  // lotteryRoutes,
  // humanManagementRoutes,
  // paymentsRoutes,
  // statisticsRoutes,
  // analyticsRoutes,
  // systemlogsRoutes,
} from '@/router'
import router from '@/router'
import { ref } from 'vue'

export const useMenus = defineStore('menu', () => {
  const generateUrl = (path, parentPath) => {
    return path.startsWith('/')
      ? path
      : path
      ? `${parentPath}/${path}`
      : parentPath
  }

  const getFilterRoutes = (targetRoutes, ajaxRoutes) => {
    const filterRoutes = []

    ajaxRoutes.forEach(item => {
      const target = targetRoutes.find(target => target.name === item.name)

      if (target) {
        const { children: targetChildren, ...rest } = target
        const route = {
          ...rest,
        }

        if (item.children) {
          route.children = getFilterRoutes(targetChildren, item.children)
        }

        filterRoutes.push(route)
      }
    })

    return filterRoutes
  }

  const getFilterMenus = (arr, parentPath = '') => {
    const menus = []

    arr.forEach(item => {
      if (!item.hidden) {
        const menu = {
          url: generateUrl(item.path, parentPath),
          title: item.meta.title,
          icon: item.icon,
        }
        if (item.children) {
          if (item.children.filter(child => !child.hidden).length <= 1) {
            menu.url = generateUrl(item.children[0].path, menu.url)
          } else {
            menu.children = getFilterMenus(item.children, menu.url)
          }
        }
        menus.push(menu)
      }
    })

    return menus
  }

  const menus = ref([])
  const setMenus = data => {
    menus.value = data
  }
  const generateMenus = async () => {
    // 生成菜单
    const menus = getFilterMenus([
      ...backgroundRoutes,
      ...loanManagementRoutes,
      ...chanelManagementRoutes,
      ...systemSettingRoutes,

      // ...humanManagementRoutes,
      
      // ...sportsBettingRoutes,
      // ...lotteryRoutes,
      
      // ...paymentsRoutes,
      // ...statisticsRoutes,
      // ...analyticsRoutes,
      // ...systemlogsRoutes,
    ])
    setMenus(menus)
  }
  return {
    menus,
    setMenus,
    generateMenus,
  }
})
