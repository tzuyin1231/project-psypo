<template>
  <div class="layout">
    <Layout>
      <MenuHeader></MenuHeader>
      <Layout>
        <!-- <Sider
          hide-trigger
          :style="{ background: '#fff' }"
          v-if="vuexUserStatus == 1"
          ><Menu active-name="2" theme="light" width="auto" :open-names="['2']">
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-construct" />
                管理員
              </template>
              <MenuItem name="Approval" router-link to="/admin">
                <Icon type="md-checkmark-circle-outline" />審核
              </MenuItem>
              <MenuItem name="Statistics" router-link to="/statistics">
                <Icon type="md-stats" />統計數據
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider> -->
        <Layout :style="{ padding: '20px 70px 70px' }">
          <Content
            :style="{
              padding: '24px',
              minHeight: 'calc(100vh - ( 60px + 24px + 24px  + 24px  + 22px ))',
              background: '#fff',
            }"
          >
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import MenuHeader from "./components/MenuHeader.vue";
// import MenuSider from "./components/MenuSider.vue";
import $store from "./store";
export default {
  components: { MenuHeader },
  computed: {
    vuexUserStatus() {
      return $store.state.userStatus;
    },
  },
};
</script>
<style scoped>
.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
/* .ivu-layout-header {
  background: #28457e;
} */
</style>
