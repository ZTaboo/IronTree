import axios from "axios";

const baseURL = "http://localhost:8080"

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export const get = (api) => {
    let url = baseURL + api
    return axios.get(url)
}