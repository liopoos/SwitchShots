import axios from 'axios';
import qs from "qs";

// axios config
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.request.use(function (config) {
  if (config.method.toLowerCase() === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, function (error) {
  return Promise.reject(error)
});
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error)
});


export default function run(url, method, data = {}) {
  return new Promise((resolve, reject) => {
    axios.request({
      url,
      method,
      params: method === 'GET' ? data : undefined,
      data: method === 'POST' ? data : undefined,
      timeout: 1000 * 20
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
