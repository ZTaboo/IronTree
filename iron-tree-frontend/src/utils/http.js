import axios from "axios";
import localforage from "localforage";

const baseURL = "http://localhost:8080"

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});

export const get = async (api) => {
    let userInfo = await localforage.getItem("user")
    let url = baseURL + api
    return axios.get(url, {
        headers: userInfo ? {
            "username": userInfo.username,
            "Authorization": userInfo.token
        } : {}
    })
}

export const post = async (api, data) => {
    let userInfo = await localforage.getItem("user")
    let url = baseURL + api
    return axios.post(url, data, {
        headers: userInfo ? {
            "username": userInfo.username,
            "Authorization": userInfo.token
        } : {}
    })
}