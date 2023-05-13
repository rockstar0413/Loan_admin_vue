
import { defineStore } from 'pinia'
import config from "@/config"
import axios from 'axios'
export const feedbackStore = defineStore('feedback', {
  state: () => ({
    feedbackList: [],
  }),
  actions: {

    // 获取用户信息
    setFeedbackList(feedbackList) {
      this.feedbackList = feedbackList;
    },
    async getFeedbackList(pageNum) {
      try {
        const url = config.api.GET_FEEDBACK_LIST;
        const response = (await axios.get(`${url}?page=${pageNum}&results=5`)).data;
        this.setFeedbackList(response.feedbackList.data);
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    async updateFeedbackStatus(id, title, content, status) {
      try {
        const url = config.api.UPDATE_FEEDBACK_STATUS;
        let data = {
          id: id,
          status: status,
        };
        const response = (await axios.put(url, data)).data;
        return response;
      } catch (e) {
        console.log(e);
      }
    },

    async deleteFeedback(id) {
      try {
        const url = config.api.DELETE_FEEDBACK;
        const response = (await axios.delete(`${url}?id=${id}`)).data;
        return response;
      } catch (e) {
        console.log(e);
      }
    }
  },
})
