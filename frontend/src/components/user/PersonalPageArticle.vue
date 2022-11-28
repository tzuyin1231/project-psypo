<template>
  <Modal
    v-model="isShow"
    @on-visible-change="resetModal()"
    @on-cancel="onClose"
    width="50%"
    style="align-item: center"
  >
    <p slot="header">
      <span>文章內容</span>
    </p>
    <span
      ><strong>文： {{ data.nickname }}</strong></span
    ><br />
    <span
      ><strong>撰寫時間： {{ data.createTime }}</strong></span
    >
    <br />
    <br />
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
    >
      <FormItem label="標題：" prop="title" v-if="editMode">
        <Input
          maxlength="50"
          show-word-limit
          v-model="formValidate.title"
          placeholder="請輸入文章標題"
        ></Input>
      </FormItem>
      <h1 v-else>
        <strong>標題： {{ data.articleTitle }}</strong>
      </h1>
      <br />
      <FormItem label="內文：" prop="content" v-if="editMode">
        <Input
          :rows="20"
          type="textarea"
          maxlength="1800"
          show-word-limit
          v-model="formValidate.content"
          placeholder="請輸入文章內容"
        ></Input>
      </FormItem>
      <span
        style="white-space: pre-wrap; font-size: 17px; text-align: left"
        v-else
        >{{ data.articleContent }}</span
      ><br /><br />
      <Tag v-for="item in tags" :key="item.id" @click.native="print(item.name)">
        {{ item.name }}</Tag
      >
    </Form>
    <p slot="footer" v-if="editMode">
      <span>
        <Button @click="onClose()">取消</Button>
        <Button type="primary" @click="confirm('formValidate')"
          >確定</Button
        ></span
      >
    </p>
    <p slot="footer" v-else><span></span></p>
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
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const checkNoBlank = (rule, value, callback) => {
      if (this.noBlank(value)) {
        callback(new Error("不能為全空白"));
      } else {
        callback();
      }
    };
    return {
      data: "",
      tags: "",
      isShow: this.attrShow,
      formValidate: {
        title: "",
        content: "",
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message: "文章標題不得為空",
            trigger: "change",
            min: 5,
            max: 50,
          },
          { validator: checkNoBlank, trigger: "blur" },
        ],
        content: [
          {
            required: true,
            message: "文章內容不得為空",
            trigger: "change",
            min: 100,
            max: 1800,
          },
          { validator: checkNoBlank, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    noBlank: function (value) {
      var reg = /(^\s*$)/g;
      return reg.test(value);
    },
    async personalDoQryArticle(articleId) {
      try {
        const response = await axios.post("/personalDoQryArticle", {
          userId: $store.state.userId,
          articleId: articleId,
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
            await axios.post("/doUpdArticle", {
              articleId: this.articleId,
              userId: $store.state.userId,
              articleTitle: this.formValidate.title,
              articleContent: this.formValidate.content,
              status: "1",
              articleMemo: "已修改",
            });
            this.$Message.success("文章編輯成功!");
          } catch (error) {
            console.log(error);
          }
        } else {
          this.$Message.error("文章編輯失敗!");
        }
      });
    },
    async confirm(name) {
      await this.handleSubmit(name);
      this.onClose();
    },
    resetModal() {
      this.$refs.formValidate.resetFields();
    },
    onClose() {
      this.$emit("updateStatus", {
        updateStatus: false,
        editMode: this.editMode,
      });
    },
  },
  watch: {
    async attrShow() {
      this.isShow = this.attrShow;
      if (this.isShow) {
        await this.personalDoQryArticle(this.articleId);
        this.formValidate.title = this.data.articleTitle;
        this.formValidate.content = this.data.articleContent;
      }
    },
  },
};
</script>
