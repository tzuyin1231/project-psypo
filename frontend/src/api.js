import axios from "axios";
import $store from "./store";
//baseUrl是在你发出请求的时候添加在请求的前面的字段，他指向你要请求的地址。
axios.defaults.baseURL = "/api";
// 設置 request 攔截器
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // 會員系統需驗證身份時
    if ($store.state.token) {
      config.headers["Authorization"] = `Bearer ${$store.state.token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// 設置 response 攔截器
axios.interceptors.response.use(
  // 如果回應200表示正常連線，可以返回資料結果，反之reject
  (response) => {
    // 如果回應200表示正常連線，可以返回資料結果，反之reject
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 根據不同的回應碼來訂製不同的錯誤訊息
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "Request Error!";
          break;
        case 401: //No permission, need login.
          window.location.href = "/login";
          alert("請先登入");
          break;
        case 403:
          // alert("Access denied!");
          window.location.href = "/login";
          break;
        case 404:
          // 自動帶入 request 地址的寫法
          error.message = `Address not exist: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "Request timeout!";
          break;
        case 500:
          error.message = "Server inside error!";
          break;
        case 501:
          error.message = "Service not allowed!";
          break;
        case 502:
          error.message = "Bad gateway!";
          break;
        case 503:
          error.message = "No service!";
          break;
        case 504:
          error.message = "Gateway timeout!";
          break;
        case 505:
          error.message = "http version not supported!";
          break;
        default:
          break;
      }
    }
    console.log("error", error);
    return error;
  }
);
