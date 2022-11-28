<template>
  <Tabs type="card" @on-click="trigger">
    <TabPane label="我的文章" name="article">
      <Page
        :current.sync="currentPage"
        :page-size="pageSize"
        :total="totalCount"
        width="100"
        @on-change="personalDoQryArticlePages()"
        show-total
        class="page"
      ></Page>
      <Table
        height="700"
        :columns="articleColumn"
        :data="tableData"
        no-data-text="尚未發表文章"
        class="table"
      >
        <template slot-scope="{ row }" slot="status">
          {{ getStatusNm(row.status) }}
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="text" @click="showModalViewArticle(index)"
            ><Icon size="20" type="ios-search-outline"
          /></Button>
          <Button type="text" @click="showModalEditArticle(index)"
            ><Icon size="20" type="ios-create-outline"
          /></Button>
          <Button type="text" @click="showConfirm(index)"
            ><Icon size="20" type="ios-trash-outline"
          /></Button>
          <strong> {{ row.index }} </strong>
        </template></Table
      >
      <PersonalPageArticle
        :attrShow="modalViewArticle"
        @updateStatus="updateStatus"
        :articleId="articleId"
        :editMode="editMode"
      ></PersonalPageArticle>
    </TabPane>
    <TabPane label="我的評論" name="comment">
      <!-- <Scroll height="750"> -->
      <!-- <Collapse accordion>
          accordion 是否开启手风琴模式，开启后每次至多展开一个面板
          <Panel
            v-for="(folder, parent_index) in folders"
            :key="folder.articleId"
          >
            <Button type="text"><Icon type="md-open" size="20" /></Button>
            {{ folder.when }}
            <p slot="content">
              上面code是來自摺疊面板、陣列第一維
              <List>
                <Row type="flex" justify="center" class="code-row-bg">
                  <Col
                    span="20"
                    v-for="(item, index) in folder.content"
                    :key="item.commentId"
                  >
                    <ListItem>
                      <ListItemMeta
                        v-show="!item.openInput"
                        :title="item.time"
                        :description="item.comment"
                      >
                      </ListItemMeta>
                      <Input
                        v-show="item.openInput"
                        v-model="item.comment"
                        type="textarea"
                        :autosize="true"
                      />
                       <template slot="action">
                        <li
                          style="
                            display: flex;
                            align-items: end;
                            flex-direction: column;
                          "
                        >
                          <Button
                            v-show="!item.openInput"
                            @click="open(parent_index, index)"
                            >修改</Button
                          >
                          <Button
                            v-show="item.openOnce && item.openInput"
                            @click="close(parent_index, index)"
                            >確認</Button
                          >
                          <Button
                            v-show="item.openOnce && item.openInput"
                            @click="close(parent_index, index)"
                            >取消</Button
                          >
                        </li>
                        <li style="display: flex; align-items: end">
                          <Icon type="md-star" size="25" /> 123
                        </li>
                        <li style="display: flex; align-items: end">
                          <Icon type="md-heart" size="20" />
                          {{ item.commentNumsOfLike }}
                        </li>
                      </template>
                    </ListItem>
                  </Col>
                </Row>
              </List>
            </p>
          </Panel></Collapse> -->
      <Table
        :columns="columnsComment"
        :data="dataComment"
        no-data-text="尚未發表評論"
        class="table"
      ></Table>
      <!-- </Scroll> -->
    </TabPane>
    <!-- <TabPane label="收藏的文章">标签三的内容</TabPane> -->
    <!-- <TabPane label="我的訂閱">标签三的内容</TabPane> -->
    <!-- <TabPane label="帳號管理"><AccountManage></AccountManage></TabPane> -->
  </Tabs>
</template>
<script>
// import AccountManage from "./AccountManage.vue";
import axios from "axios";
import PersonalPageArticle from "./PersonalPageArticle.vue";
import $store from "../../store";
import expandRow from "./TableExpand.vue";
export default {
  components: {
    // AccountManage,
    PersonalPageArticle,
  },
  data() {
    return {
      sortType: "DESC",
      pageSize: 10,
      totalCount: 0,
      currentPage: 1,
      articleColumn: [
        {
          title: "撰寫時間",
          key: "createTime",
          sortable: "true",
          width: 110,
        },
        {
          title: "文章狀態",
          slot: "status",
          width: 120,
        },
        { title: "備註", key: "articleMemo", width: 150 },
        {
          title: "文章標題",
          key: "articleTitle",
          width: 400,
        },
        {
          title: "讚數",
          key: "numsOfLike",
          sortable: "true",
          width: 100,
        },
        { title: "動作", slot: "action", align: "center" },
      ],
      columnsComment: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
              },
            });
          },
        },
        {
          title: "文章標題",
          key: "articleTitle",
        },
        {
          title: "評論時間",
          key: "createTime",
        },
      ],
      dataComment: [],
      tableData: [],
      // commentData: [
      //   {
      //     time: "2022/01/01",
      //     content:
      //       "評論內容評論內容評論內容評論 \
      //       評論內容評論內容評論內容評論 \
      //       評論內容評論內容評論內容評論 \
      //       評論內容評論內容評論內容評論 \
      //       內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容",
      //     commentNumsOfLike: "1",
      //   },
      //   {
      //     time: "2022/01/31",
      //     content:
      //       "評論內容評論內容評論內容評論 \
      //       內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內容評論內 \
      //       容評論內容評論內容評論內容評論內容評論內容評論內容評論內容",
      //     commentNumsOfLike: "100",
      //   },
      // ],
      // folders: [
      //   {
      //     articleId: "12",
      //     when: "今天",
      //     content: [
      //       {
      //         commentId: "1",
      //         time: "2022/10/5 19:00:00",
      //         comment: "",
      //         commentNumsOfLike: "1238",
      //         openInput: false,
      //         openOnce: 0,
      //       },
      //       {
      //         commentId: "2",
      //         time: "2022/10/5 20:00:00",
      //         comment: "10/5",
      //         commentNumsOfLike: "12",
      //         openInput: false,
      //         openOnce: 0,
      //       },
      //     ],
      //   },
      //   {
      //     articleId: "13",
      //     when: "明天",
      //     content: [
      //       {
      //         commentId: "3",
      //         time: "2022/10/6 19:30:00",
      //         comment: "星期四",
      //         commentNumsOfLike: "55",
      //         openInput: false,
      //         openOnce: 0,
      //       },
      //       {
      //         commentId: "4",
      //         time: "2022/10/6 21:30:00",
      //         comment: "10/6",
      //         commentNumsOfLike: "88",
      //         openInput: false,
      //         openOnce: 0,
      //       },
      //     ],
      //   },
      //   {
      //     articleId: "55",
      //     when: "後天",
      //     content: [
      //       {
      //         commentId: "5",
      //         time: "2022/10/7 19:30:00",
      //         comment: "星期五",
      //         commentNumsOfLike: "8925",
      //         openInput: false,
      //         openOnce: 0,
      //       },
      //       {
      //         commentId: "6",
      //         time: "2022/10/7 20:30:00",
      //         comment: "10/7",
      //         commentNumsOfLike: "4555",
      //         openInput: false,
      //         openOnce: 0,
      //       },
      //       {
      //         commentId: "7",
      //         time: "2022/10/6 22:30:00",
      //         comment: "連假之前最後一天",
      //         commentNumsOfLike: "48",
      //         openInput: false,
      //         openOnce: 0,
      //       },
      //     ],
      //   },
      // ],
      modalViewArticle: false,
      articleId: "",
      editMode: false,
    };
  },
  methods: {
    async personalDoQryArticlePages() {
      try {
        const response = await axios.post("/personalDoQryArticlePages", {
          userId: $store.state.userId,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          sortType: this.sortType,
        });
        this.totalCount = response.data.totalCount;
        //把時間的毫秒去掉
        for (var i = 0; i < response.data.resultList.length; i++) {
          var length = response.data.resultList[i].createTime.length;
          response.data.resultList[i].createTime = response.data.resultList[
            i
          ].createTime.substr(0, length - 2);
        }
        this.tableData = response.data.resultList;
      } catch (error) {
        console.log(error);
      }
    },
    async personalDoQryComment() {
      try {
        var response = await axios.post("/personalDoQryComment", {
          userId: $store.state.userId,
        });
        for (var i = 0; i < response.data.length; i++) {
          var length = response.data[i].createTime.length;
          response.data[i].createTime = response.data[i].createTime.substr(
            0,
            length - 2
          );
        }
        this.dataComment = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async trigger(name) {
      if (name == "comment") {
        this.personalDoQryComment();
      }
    },
    open(parent_index, index) {
      //不曉得有沒有更好的方法
      this.folders[parent_index].content[index].openInput = true;
      this.folders[parent_index].content[index].openOnce += 1;
    },
    close(parent_index, index) {
      this.folders[parent_index].content[index].openInput = false;
    },
    showModalViewArticle(index) {
      this.articleId = this.tableData[index].articleId;
      this.modalViewArticle = true;
      this.editMode = false;
    },
    showModalEditArticle(index) {
      var result = confirm("是否進行文章修改?文章修改後需經再次審核。");
      if (result) {
        this.articleId = this.tableData[index].articleId;
        this.modalViewArticle = true;
        this.editMode = true;
      }
    },
    updateStatus(value) {
      // Modal關閉、回傳是否為編輯框
      this.modalViewArticle = value.updateStatus;
      this.editMode = value.editMode;
    },
    getStatusNm(status) {
      switch (status) {
        case "0": {
          return "已刪除";
        }
        case "1": {
          return "待審";
        }
        case "2": {
          return "審查通過";
        }
        case "3": {
          return "審查不通過";
        }
      }
    },
    async showConfirm(index) {
      var ans = confirm("確定刪除文章嗎?刪除後，若要新增需要再次通過審核");
      if (ans) {
        try {
          await axios.post("/doUpdArticle", {
            articleId: this.tableData[index].articleId,
            userId: $store.state.userId,
            status: "0",
          });
          this.personalDoQryArticlePages();
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.personalDoQryArticlePages();
  },
  computed: {
    watchVuexWrote() {
      return $store.state.wrote;
    },
  },
  watch: {
    modalViewArticle() {
      if (!this.modalViewArticle && this.editMode) {
        this.personalDoQryArticlePages();
      }
    },
    watchVuexWrote() {
      this.personalDoQryArticlePages();
    },
  },
};
</script>
<style>
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
  height: 500px;
  margin-top: -16px;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
  background: #fff;
  padding: 16px;
}
.demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-color: transparent;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  border-color: #fff;
}
.page {
  margin: 10px;
}
.table {
  padding: 10px;
}
</style>
