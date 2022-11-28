<template>
  <Header>
    <Menu mode="horizontal" theme="dark" active-name="1">
      <Row type="flex" justify="start" class="code-row-bg">
        <!-- justify="start" 子元素向左邊排列 -->
        <Col span="4">
          <MenuItem
            name="1"
            router-link
            to="/"
            @click.native="
              resetSearchColumn();
              reloadPage();
            "
          >
            <Icon class="icon-reset" type="ios-home" size="30" />首頁
          </MenuItem>
        </Col>
        <Col span="10">
          <MenuItem name="2">
            <Input
              maxlength="12"
              show-word-limit
              v-model="searchingColumn"
              placeholder="搜尋 刻板印象"
              style="width: 300px"
            ></Input>
            <Select v-model="searchingCondition" style="width: 70px">
              <Option value="ARTICLE_TITLE">標題</Option>
              <Option value="ARTICLE_CONTENT">內文</Option>
              <Option value="NICKNAME">作者</Option>
            </Select>
            <Button
              type="default"
              ghost
              @click="setSearching(searchingColumn, searchingCondition)"
              router-link
              to="/"
              ><Icon class="icon-reset custom-icon" type="ios-search"
            /></Button>
          </MenuItem>
        </Col>
        <Col span="2">
          <MenuItem
            name="3"
            router-link
            to="/admin"
            v-if="vuexUserStatus == 1"
            @click.native="resetSearchColumn()"
          >
            <Button
              type="text"
              ghost
              icon="ios-construct"
              class="custom-icon icon-reset"
            />
          </MenuItem>
        </Col>
        <Col span="2">
          <MenuItem
            name="4"
            router-link
            to="/personal"
            v-if="vuexLoginOrNot"
            @click.native="resetSearchColumn()"
          >
            <Button
              type="text"
              ghost
              icon="md-person"
              class="custom-icon icon-reset"
            />
          </MenuItem>
        </Col>
        <Col span="2">
          <MenuItem
            name="3"
            v-if="vuexLoginOrNot"
            @click.native="resetSearchColumn()"
          >
            <Button
              type="text"
              ghost
              icon="md-create"
              class="custom-icon icon-reset"
              @click="openWritingModal"
            />
          </MenuItem>
        </Col>
        <Col span="4">
          <div>
            <MenuItem
              name="5"
              router-link
              to="/login"
              v-if="!vuexLoginOrNot"
              @click.native="resetSearchColumn()"
            >
              <Icon class="icon-reset" size="30" type="ios-log-in"></Icon>
              註冊/登入
            </MenuItem>
            <MenuItem
              name="6"
              router-link
              to="/"
              v-else
              @click.native="
                logout();
                resetSearchColumn();
              "
            >
              <Icon class="icon-reset" size="30" type="ios-log-out"></Icon>
              登出
            </MenuItem>
          </div>
        </Col>
      </Row>
    </Menu>
    <WritingPage
      :attrShow="showWritingModal"
      @updateStatus="updateWritingModalStatus"
    ></WritingPage>
  </Header>
</template>
<script>
import $cookies from "vue-cookies";
import WritingPage from "./user/WritingPage.vue";
import $store from "../store";
export default {
  components: { WritingPage },
  data() {
    return {
      showWritingModal: false,
      searchingColumn: "",
      searchingCondition: "ARTICLE_TITLE",
    };
  },
  methods: {
    resetSearchColumn() {
      this.searchingColumn = "";
      $store.state.searchingColumn = this.searchingColumn;
    },
    reloadPage() {
      window.location.reload();
    },
    openWritingModal() {
      this.showWritingModal = true;
    },
    updateWritingModalStatus(el) {
      this.showWritingModal = el;
    },
    setSearching() {
      $store.state.searchingColumn = this.searchingColumn;
      $store.state.searchingCondition = this.searchingCondition;
      $store.state.doSearching += 1;
    },
    // setSearchingColumnFilter(searchingCondition){
    //   $store.state.searchingCondition=searchingCondition;
    // },
    logout() {
      sessionStorage.clear();
      window.location.reload();
      $cookies.set("token", "");
    },
  },
  computed: {
    vuexLoginOrNot() {
      return $store.state.loginOrNot;
    },
    vuexUserStatus() {
      return $store.state.userStatus;
    },
  },
  watch: {
    // searchingCondition(){
    //   console.log(this.searchingCondition)
    // }
  },
};
</script>
<style scoped>
.custom-icon {
  font-size: 1.5rem;
  /* background-color: rgb(188, 16, 87); */
}
.ivu-btn:focus {
  box-shadow: none !important;
}
/* .ivu-menu-dark {
  background: hsl(209, 44%, 56%);
} */
.icon-reset {
  position: relative;
  top: 3.5px;
}
</style>
