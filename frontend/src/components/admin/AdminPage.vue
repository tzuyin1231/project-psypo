<template>
  <!-- api通過、未過 -->
  <div>
    <Row>
      <Col span="4">
        <Card dis-hover>
          <!-- 通过设置属性dis-hover来禁用鼠标悬停显示阴影的效果。 -->
          <p slot="title">{{ toVerifyNum }}</p>
          <p>待審核文章</p>
        </Card>
      </Col>
      <!-- <Col span="4" offset="1">
        offset 栅格左侧的间隔格数，间隔内不可以有栅格
        <Card dis-hover>
          <p slot="title">{{ countOfReportComment }}</p>
          <p>被舉報評論</p>
        </Card>
      </Col> -->
    </Row>
    <br />
    <Tabs :animated="false">
      <TabPane label="文章">
        <Table
          border
          height="700"
          :columns="columns"
          :data="tableData"
          no-data-text="暫無待審核文章"
        >
          <!-- <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template> -->
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="info"
              size="small"
              style="margin-right: 5px"
              @click="showModalViewArticle(index)"
              >內文</Button
            >
            <Button
              type="warning"
              size="small"
              style="margin-right: 5px"
              @click="showConfirm(index)"
              >審核通過</Button
            >
            <Button
              type="error"
              size="small"
              style="margin-right: 5px"
              @click="showModalNotPass(index)"
              >審核未過</Button
            >
            <strong> {{ row.index }} </strong>
          </template>
        </Table>
        <Modal
          v-model="modalNotPass"
          title="審核未通過"
          @on-ok="handleSubmit('formValidate')"
          @on-visible-change="handleReset('formValidate')"
        >
          <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80"
            ><FormItem label="原因" prop="memo">
              <Select
                v-model="formValidate.memo"
                placeholder="請選擇不通過審核的原因"
              >
                <Option value="notRelatedToPsychology">和心理學無關</Option>
                <Option value="titleIsNotRelatedToContent">文不對題</Option>
                <Option value="tooManyWrongWords">錯字太多影響閱讀</Option>
                <Option value="noScientificResearch"
                  >尚未有科學研究支持該論述</Option
                >
              </Select>
            </FormItem>
          </Form>
        </Modal>
      </TabPane>
      <!-- <TabPane label="評論"></TabPane>
      <TabPane label="使用者"></TabPane> -->
    </Tabs>
    <AdminViewArticle
      :attrShow="modalViewArticle"
      @updateStatus="updateStatus"
      :articleId="articleId"
      :articleStatus="'1'"
    />
  </div>
</template>
<script>
import axios from "axios";
import AdminViewArticle from "./AdminViewArticle.vue";
import $store from "../../store";
export default {
  components: { AdminViewArticle },
  data() {
    return {
      memoMessage: "",
      formValidate: {
        memo: "",
      },
      ruleValidate: {
        memo: [{ required: true, message: "請填入原因", trigger: "blur" }],
      },
      modalNotPass: false,
      articleId: "",
      toVerifyNum: 0,
      modalViewArticle: false,
      tableData: [],
      columns: [
        { title: "發文者", key: "nickname", width: 100 },
        { title: "文章標題", key: "articleTitle" },
        { title: "新增時間", key: "createTime", width: 110 },
        { title: "更新時間", key: "updateTime", width: 110 },
        { title: "動作", slot: "action", align: "center", width: 300 },
      ],
    };
  },
  methods: {
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    async showConfirm(index) {
      var ans = confirm("確定審核通過嗎?");
      if (ans) {
        try {
          await axios.post("/adminVerifyArticle", {
            articleId: this.tableData[index].articleId,
            userId: $store.state.userId,
            status: "2",
          });
          this.adminDoQryArticle();
        } catch (error) {
          console.log(error);
        }
      }
    },
    async adminDoQryArticle(articleId) {
      try {
        const response = await axios.post("/adminDoQryArticle", {
          articleId: articleId,
          status: "1",
          order: "UPDATE_TIME",
        });
        //把時間的毫秒去掉
        for (var i = 0; i < response.data.length; i++) {
          var length = response.data[i].createTime.length;
          response.data[i].createTime = response.data[i].createTime.substr(
            0,
            length - 2
          );
          response.data[i].updateTime = response.data[i].updateTime.substr(
            0,
            length - 2
          );
        }
        this.tableData = response.data;
        this.toVerifyNum = this.tableData.length;
      } catch (error) {
        console.log(error);
      }
    },
    showModalViewArticle(index) {
      this.articleId = this.tableData[index].articleId;
      this.modalViewArticle = true;
    },
    showModalNotPass(index) {
      this.modalNotPass = true;
      this.articleId = this.tableData[index].articleId;
    },
    updateStatus(el) {
      this.modalViewArticle = el;
    },
    handleSubmit(name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          switch (this.formValidate.memo) {
            case "notRelatedToPsychology": {
              this.memoMessage = "和心理學無關";
              break;
            }
            case "titleIsNotRelatedToContent": {
              this.memoMessage = "文不對題";
              break;
            }
            case "tooManyWrongWords": {
              this.memoMessage = "錯字太多影響閱讀";
              break;
            }
            case "noScientificResearch": {
              this.memoMessage = "尚未有科學研究支持該論述";
              break;
            }
          }
          await axios.post("/adminVerifyArticle", {
            articleId: this.articleId,
            userId: $store.state.userId,
            status: "3",
            articleMemo: this.memoMessage,
          });
          this.$Message.success("Success!");
          this.adminDoQryArticle();
        } else {
          this.$Message.error("請輸入審核未通過的原因");
        }
      });
    },
  },
  created() {
    this.adminDoQryArticle();
  },
  computed: {
    watchVuexWrote() {
      return $store.state.wrote;
    },
  },
  watch: {
    watchVuexWrote() {
      this.adminDoQryArticle();
    },
  },
};
</script>
