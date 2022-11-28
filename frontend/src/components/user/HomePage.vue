<template>
  <div>
    <header>
      <ButtonGroup>
        <Button @click="setOrder()" v-if="!pressedHottest" disabled
          ><Icon type="ios-funnel" />最新文章</Button
        >
        <Button @click="setOrder()" v-else
          ><Icon type="ios-funnel" />最新文章</Button
        >
        <Button @click="setOrder('NUMS_OF_LIKE')" disabled v-if="pressedHottest"
          ><Icon type="ios-funnel" />熱門文章</Button
        >
        <Button @click="setOrder('NUMS_OF_LIKE')" v-else
          ><Icon type="ios-funnel" />熱門文章</Button
        ></ButtonGroup
      >
    </header>
    <Scroll height="650">
      <List item-layout="vertical" class="list">
        <ListItem v-for="item in data" :key="item.articleId" class="listItem">
          <ListItemMeta
            :title="item.articleTitle"
            :description="item.nickname"
          />
          <span style="white-space: pre-wrap; font-size: 17px"
            >{{ item.articleContent.slice(0, 100) }}...</span
          >
          <br /><br />
          <Button @click="openModal(item.articleId)">閱讀更多</Button>
          <template slot="action">
            <li>
              <Icon
                type="ios-heart-outline"
                size="20"
                v-if="!item.articleUserStatus"
              />
              <Icon type="ios-heart" size="20" v-if="item.articleUserStatus" />
              {{ item.numsOfLike }}
            </li>
            <li>
              <Icon type="ios-chatbubbles-outline" size="20" />{{
                item.numsOfComment
              }}
            </li>
          </template>
        </ListItem>
      </List>
    </Scroll>
    <ReadingPage
      @updateStatus="updateStatus"
      :attrShow="showModal"
      :articleId="articleId"
    ></ReadingPage>
  </div>
</template>
<script>
import ReadingPage from "./ReadingPage.vue";
import axios from "axios";
import $store from "../../store";
export default {
  components: { ReadingPage },
  data() {
    return {
      pressedHottest: false,
      order: "",
      data: [],
      dataFirst: [],
      showModal: false,
      searchingColumn: "",
      articleId: "",
      searchingCondition: "",
    };
  },
  methods: {
    async homeDoQryArticle() {
      try {
        var response = await axios.post("/homeDoQryArticle", {
          articleTitle: $store.state.searchingColumn,
          filter: $store.state.searchingCondition,
          status: "2",
          order: this.order,
          nowUserId: $store.state.userId,
        });
        // 根據使用者按讚與否渲染不同icon
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].articleUserStatus == "1") {
            response.data[i].articleUserStatus = true;
          } else {
            response.data[i].articleUserStatus = false;
          }
        }
        this.data = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    updateStatus(el) {
      this.showModal = el;
    },
    openModal(articleId) {
      this.showModal = true;
      this.articleId = articleId;
    },
    setOrder(order) {
      if (order == "NUMS_OF_LIKE") {
        this.pressedHottest = true;
      } else {
        this.pressedHottest = false;
      }
      this.order = order;
      this.homeDoQryArticle(this.searchingColumn);
    },
  },
  created() {
    this.homeDoQryArticle();
  },
  computed: {
    watchVuexDoSearching() {
      return $store.state.doSearching;
    },
  },
  watch: {
    showModal() {
      if (!this.showModal) {
        this.homeDoQryArticle();
      }
    },
    watchVuexDoSearching() {
      this.homeDoQryArticle();
    },
  },
};
</script>
<style>
.ivu-list-vertical .ivu-list-item-meta-title {
  font-size: 24px;
}
.listItem {
  padding-left: 50px;
  padding-right: 50px;
}
.list {
  padding-right: 10px;
}
header {
  background: rgb(124, 128, 153);
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
}
.filter {
  margin: 20px;
}
.listItem {
  border-radius: 5px;
  margin: 5px;
  padding: 15px 30px;
}
.listItem:hover {
  box-shadow: 2px 5px 20px rgba(0, 0, 0, 0.453);
}
</style>
