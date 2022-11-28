import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);
// 定義一個新的 Vue Store
const store = new Vuex.Store({
  state: {
    searchingColumn: null,
    userId: "",
    token: "",
    userStatus: "",
    loginOrNot: false,
    nickname: "",
    searchingCondition: "",
    doSearching: 0,
    wrote: 0,
  },
  mutations: {
    //mutate 本身單字的意思是就是「變異」，人如其名就是拿來變動 state 用的。
    setSearchingColumn(state, searchingColumn) {
      state.searchingColumn = searchingColumn;
    },
    setToken(state, token) {
      state.token = token;
    },
    setUserStatus(state, userStatus) {
      state.userStatus = userStatus;
    },
    setLoginOrNot(state, loginOrNot) {
      state.loginOrNot = loginOrNot;
    },
    setNickname(state, nickname) {
      state.nickname = nickname;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setSearchingCondition(state, searchingCondition) {
      state.searchingCondition = searchingCondition;
    },
    setDoSearching(state) {
      state.setDoSearching += 1;
    },
    setWrote(state) {
      state.setWrote += 1;
    },
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })], //persistedstate維持vuex狀態
});
export default store;
