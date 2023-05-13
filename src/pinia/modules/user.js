
import { defineStore } from 'pinia'
import config from "@/config"
import axios from 'axios'
export const userStore = defineStore('user', {
  state: () => ({
    userList: [],
    selectedUser: {}
  }),
  actions: {
    // 清除用户信息
    clearUserinfo() {
      this.userinfo = null
    },
    // 获取用户信息
    setUserList(userList) {
      this.userList = userList;
    },
    setSelectedUser(user) {
      this.selectedUser = user;
    },
    getSelectedUser() {
      return this.selectedUser;
    },
    async getUserList(phone_number, card_name, channel, pageNum) {
      try {
        const url = config.api.GET_USER_LIST;
        const response = (await axios.get(`${url}?phone_number=${phone_number}&id_card_name=${card_name}&channel_id=${channel}&page=${pageNum}&results=5`)).data;
        this.setUserList(response.userList);
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    async getUserById(id) {
      try {
        const url = config.api.GET_USER_BY_ID;

        console.log(url, id)
        const response = (await axios.get(`${url}?id=${id}`)).data;
        console.log(response)
        this.setSelectedUser(response.user);
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    async updateUserLoginStatus(id, login_status) {
      try {
        const url = config.api.UPDATE_USER_LOGIN_STATUS;
        let data = {
          id: id,
          login_status: login_status,
        };
        const response = (await axios.put(url, data)).data;
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    async updateUserMainInformation(id, phone_number, status, password, login_status) {
      try {
        const url = config.api.UPDATE_USER_MAIN_INFORMATION;
        let data = {
          id: id,
          phone_number: phone_number,
          status: status,
          password: password,
          login_status: login_status,
        };
        const response = (await axios.put(url, data)).data;
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    async deleteUser(id) {
      try {
        const url = config.api.DELETE_USER;
        const response = (await axios.delete(`${url}?id=${id}`)).data;
        return response;
      } catch (e) {
        console.log(e);
      }
    }
  },
})
