
import { defineStore } from 'pinia'
import config from "@/config"
import axios from 'axios'
export const channelStore = defineStore('channel', {
  state: () => ({
    channelList: [],
  }),
  actions: {
    // 获取用户信息
    setChannelList(channelList) {
      this.channelList = channelList;
    },
    async getChannelList() {
      try {
        const url = config.api.GET_CHANNEL_LIST;
        const response = (await axios.get(url)).data;
        this.setChannelList(response.channelList);
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    async addChannel(channel_id, name) {
      try {
        const url = config.api.ADD_CHANNEL;
        let data = {
          channel_id: channel_id,
          name: name,
        };
        const response = (await axios.post(url, data)).data;
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    async editChannel(id, channel_id, name) {
      try {
        const url = config.api.EDIT_CHANNEL;
        let data = {
          id: id,
          channel_id: channel_id,
          name: name,
        };
        const response = (await axios.put(url, data)).data;
        return response;
      } catch (e) {
        console.log(e);
      }
    }
  },
})
