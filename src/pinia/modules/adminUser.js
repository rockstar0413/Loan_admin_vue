
import { defineStore } from 'pinia'
import config from "@/config"
import axios from 'axios'
export const adminUserStore = defineStore('adminUser', {
  state: () => ({
    adminUserList: [],
  }),
  actions: {
    // 清除用户信息
    clearAdminUserinfo() {
      this.adminUserList = null
    },
    // 获取用户信息
    setAdminUserList(adminUserList) {
      this.adminUserList = adminUserList;
    },
    async getAdminUserList(name, pageNum) {
      try {
        const url = config.api.GET_ADMIN_USER_LIST;
        const response = (await axios.get(`${url}?name=${name}&page=${pageNum}&results=5`)).data;
        this.setAdminUserList(response.adminUserList.data);
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    async updateAdminUser(id, name, last_login_IP, password, status) {
      try {
        const url = config.api.UPDATE_ADMIN_USER;
        let data = {
          id: id,
          name: name,
          last_login_IP: last_login_IP,
          password: password,
          status: status,
        };
        const response = (await axios.put(url, data)).data;
        return response;
      } catch (e) {
        console.log(e);
      }
    }
  },
})
