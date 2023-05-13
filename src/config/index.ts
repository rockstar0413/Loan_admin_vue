const SERVER_API = "http://208.87.201.195:80"
//const SERVER_API = "http://127.0.0.1:8000"
export const HOST_URL = "http://127.0.0.1:5173"
const config = {
  api: {
    SIGN_IN: SERVER_API + "/api/users/login",
    SIGN_UP: SERVER_API + "/api/users/register",
    GET_USER_LIST: SERVER_API + "/api/admin/userList",
    GET_USER_BY_ID: SERVER_API + "/api/admin/getUserById",
    UPDATE_USER_LOGIN_STATUS: SERVER_API + "/api/admin/updateUserLoginStatus",
    UPDATE_USER_MAIN_INFORMATION: SERVER_API + "/api/admin/updateUserMainInformation",
    DELETE_USER: SERVER_API + "/api/admin/deleteUser",
    GET_CHANNEL_LIST: SERVER_API + "/api/admin/channelList",
    ADD_CHANNEL: SERVER_API + "/api/admin/addChannel",
    EDIT_CHANNEL: SERVER_API + "/api/admin/updateChannel",
    GET_ORDER_LIST: SERVER_API + "/api/admin/orderList",
    UPDATE_ORDER: SERVER_API + "/api/admin/updateOrder",
    UPDATE_APP_STATUS: SERVER_API + "/api/admin/updateAppStatus",
    UPDATE_ORDER_INSURANCE: SERVER_API + "/api/admin/updateOrderInsurance",
    GET_FEEDBACK_LIST: SERVER_API + "/api/admin/feedbackList",
    UPDATE_FEEDBACK_STATUS: SERVER_API + "/api/admin/updateFeedbackStatus",
    DELETE_FEEDBACK: SERVER_API + "/api/admin/deleteFeedback",
    GET_ADMIN_USER_LIST: SERVER_API + "/api/admin/adminUserList",
    UPDATE_ADMIN_USER: SERVER_API + "/api/admin/updateAdminUser",
  },
};

export default config;
