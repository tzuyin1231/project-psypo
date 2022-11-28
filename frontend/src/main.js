import Vue from "vue";
import App from "./App.vue";
import ViewUI from "view-design";
import VueRouter from "vue-router";
import "view-design/dist/styles/iview.css";
import LoginPage from "./components/user/LoginPage.vue";
import HomePage from "./components/user/HomePage.vue";
import PersonalPage from "./components/user/PersonalPage.vue";
import AdminPage from "./components/admin/AdminPage.vue";
import $store from "./store";
import $cookies from "vue-cookies";
import axios from "axios";
import "./api";
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: HomePage },
    {
      path: "/login",
      component: LoginPage,
      beforeEnter: (to, from, next) => {
        if (!$store.state.loginOrNot) {
          return next();
        } else {
          sessionStorage.clear();
          window.location.reload();
          alert("已登出，請重新登入");
          next();
          return;
        }
      },
    },
    {
      path: "/personal",
      component: PersonalPage,
      beforeEnter: (to, from, next) => {
        if ($store.state.token) {
          return next();
        } else {
          alert("無效頁面，請重新登入");
          next("/login");
          sessionStorage.clear();
          window.location.reload();
          return;
        }
      },
    },
    {
      path: "/admin",
      component: AdminPage,
      beforeEnter: (to, from, next) => {
        if ($store.state.userStatus == "1") {
          return next();
        } else {
          alert("無效頁面，請重新登入");
          next("/login");
          sessionStorage.clear();
          $cookies.set("token", "");
          window.location.reload();
          return;
        }
      },
    },
  ],
});
Vue.use(ViewUI);
Vue.use(VueRouter);
Vue.use($cookies);
new Vue({
  $store,
  render: (h) => h(App),
  router,
}).$mount("#app");
