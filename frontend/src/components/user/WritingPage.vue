<template>
  <!-- 要顯示user名字 -->
  <Modal
    v-model="isShow"
    width="50%"
    @on-cancel="onClose()"
    @on-visible-change="handleReset('writingPageFormValidate')"
  >
    <p slot="header"><span>心理學科普文章撰寫</span></p>
    <Form
      ref="writingPageFormValidate"
      :model="writingPageFormValidate"
      :rules="writingPageRuleValidate"
      :label-width="80"
    >
      <FormItem label="文：" prop="nickname">{{ vuexNickname }} </FormItem
      ><FormItem label="標題" prop="title">
        <Input
          v-model="writingPageFormValidate.title"
          placeholder="請輸入標題"
          type="textarea"
          show-word-limit
          maxlength="50"
        ></Input>
      </FormItem>
      <FormItem label="內容" prop="content">
        <Input
          v-model="writingPageFormValidate.content"
          placeholder="請輸入內容"
          show-word-limit
          type="textarea"
          :rows="20"
          maxlength="1800"
        ></Input>
      </FormItem>
      <!-- <Select v-model="tagSelected" filterable multiple>
        <Option
          v-for="item in tagList"
          :value="item.tagName"
          :key="item.tagId"
          >{{ item.tagName }}</Option
        >
      </Select> -->
    </Form>
    <p slot="footer">
      <span>
        <Button
          type="warning"
          @click="handleReset('writingPageFormValidate')"
          style="margin-left: 8px"
          >清空所有欄位</Button
        >
        <Button type="info" @click="handleSubmit('writingPageFormValidate')"
          >送出審核</Button
        >
      </span>
    </p>
  </Modal>
</template>
<script>
import axios from "axios";
import $store from "../../store";
export default {
  props: { attrShow: { default: false, type: Boolean } },
  data() {
    const checkNoBlank = (rule, value, callback) => {
      if (this.noBlank(value)) {
        callback(new Error("不能為全空白"));
      } else {
        callback();
      }
    };
    return {
      // tagList: [],
      // tagSelected: [],
      isShow: this.attrShow,
      nickname: "",
      writingPageFormValidate: { title: "", content: "" },
      writingPageRuleValidate: {
        title: [
          {
            required: true,
            min: 5,
            message: "標題不得少於5個字",
            trigger: "blur",
          },
          { validator: checkNoBlank, trigger: "blur" },
        ],
        content: [
          {
            required: true,
            min: 100,
            message: "內文不得少於100個字",
            trigger: "blur",
          },
          { validator: checkNoBlank, trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    attrShow() {
      this.isShow = this.attrShow;
    },
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          await this.doAddArticle();
          $store.state.wrote += 1;
          this.$Message.success("Success!");
          this.onClose();
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleCreate2(val) {
      this.cityList4.push({
        value: val,
        label: val,
      });
    },
    onClose() {
      this.$emit("updateStatus", false);
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    async doAddArticle() {
      try {
        await axios.post("/doAddArticle", {
          userId: $store.state.userId,
          articleTitle: this.writingPageFormValidate.title,
          articleContent: this.writingPageFormValidate.content,
        });
      } catch (error) {
        console.log(error);
      }
    },
    noBlank: function (value) {
      var reg = /(^\s*$)/g;
      return reg.test(value);
    },
  },
  computed: {
    nowPage() {
      return this.page;
    },
    vuexNickname() {
      return $store.state.nickname;
    },
  },
};
</script>
