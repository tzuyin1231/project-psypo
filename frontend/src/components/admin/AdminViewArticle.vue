<template>
  <Modal
    v-model="isShow"
    @on-cancel="onClose"
    width="50%"
    style="align-item: center"
  >
    <p slot="header">文章內容</p>
    <p>
      <strong>文： {{ data.nickname }}</strong>
    </p>
    <br />
    <p>
      <strong>撰寫時間： {{ data.createTime }}</strong>
    </p>
    <br />
    <br />
    <h1>
      <strong>標題： {{ data.articleTitle }}</strong>
    </h1>
    <br />
    <br />
    <br />
    <span style="white-space: pre-wrap; font-size: 17px; text-align: left">{{
      data.articleContent
    }}</span
    ><br /><br />
    <p slot="footer"></p>
  </Modal>
</template>
<script>
import axios from "axios";
import $store from "../../store";
export default {
  props: {
    attrShow: {
      type: Boolean,
      default: false,
    },
    articleId: {
      type: String,
    },
    articleStatus: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      data: "",
      isShow: this.attrShow,
    };
  },
  methods: {
    onClose() {
      this.$emit("updateStatus", false);
    },
    async adminDoQryArticle(articleId) {
      try {
        const response = await axios.post("/adminDoQryArticle", {
          articleId: articleId,
          status: this.articleStatus,
        });
        //把時間的毫秒去掉
        for (var i = 0; i < response.data.length; i++) {
          var length = response.data[i].createTime.length;
          response.data[i].createTime = response.data[i].createTime.substr(
            0,
            length - 2
          );
        }
        this.data = response.data[0];
      } catch (error) {
        console.log(error);
      }
    },
    async handleSubmit(name) {
      await this.$refs[name].validate(async (valid) => {
        if (valid) {
          try {
            await axios.post("/adminVerifyArticle", {
              articleId: this.articleId,
              userId: $store.state.userId,
              status: "1",
            });
            this.$Message.success("新增資料成功!");
          } catch (error) {
            console.log(error);
          }
        } else {
          this.$Message.error("新增資料失敗!");
        }
      });
    },
    async confirm(name) {
      await this.handleSubmit(name);
      this.onClose();
    },
  },
  watch: {
    async attrShow() {
      this.isShow = this.attrShow;
      if (this.isShow) {
        await this.adminDoQryArticle(this.articleId);
      }
    },
  },
};
</script>
