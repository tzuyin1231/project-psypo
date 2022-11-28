<template>
  <Modal
    v-model="isShow"
    @on-cancel="onClose"
    width="50%"
    style="align-item: center"
  >
    <p style="font-size: 20px; font-weight: bold">
      {{ articleTitle }}
    </p>
    <br />
    <p>文：{{ nickname }}</p>
    <p>撰寫時間：{{ createTime }}</p>
    <Divider dashed />
    <p
      style="
        white-space: pre-wrap;
        font-size: 17px;
        font-family: Microsoft JhengHei;
      "
    >
      {{ articleContent }}
    </p>
    <br /><br />
    <!-- <Tag v-for="item in tags" :key="item.id"> {{ item.name }}</Tag> -->
    <!-- 因為TAG沒有@click，但是上網找到可以用@click.native的方式 -->
    <Button type="text" @click="doLikeArticle" v-if="!liked"
      ><Icon type="ios-heart-outline" size="25" />{{ numsOfLike }}</Button
    >
    <Button type="text" @click="doLikeArticle" v-if="liked"
      ><Icon type="ios-heart" size="25" />{{ numsOfLike }}</Button
    >
    <!-- <Button type="text"><Icon type="md-star" size="25" /></Button> -->
    <Button
      shape="circle"
      icon="ios-download-outline"
      type="primary"
      @click="renderDoc"
      >下載word檔</Button
    >
    <Divider orientation="left">評論</Divider>
    <Row style="background: #eee; padding: 5px 10px">
      <Col span="24">
        <List item-layout="vertical">
          <ListItem v-if="!commentData.length">尚未有人發表評論</ListItem>
          <ListItem
            v-else
            v-for="item in commentData"
            :key="item.commentId"
            shadow
          >
            <Card dis-hover>
              <p slot="title">{{ item.nickname }}</p>
              <p
                style="white-space: pre-wrap; font-size: 17px; text-align: left"
              >
                {{ item.commentContent }}
              </p>
              <p slot="extra">
                <Button
                  type="text"
                  v-if="!item.commentUserStatus"
                  @click.native="
                    doLikeComment(item.commentUserStatus, item.commentId)
                  "
                  ><Icon type="ios-thumbs-up-outline" size="30" />{{
                    item.numsOfLike
                  }}</Button
                >
                <Button
                  type="text"
                  v-else
                  @click.native="
                    doLikeComment(item.commentUserStatus, item.commentId)
                  "
                  ><Icon type="ios-thumbs-up" size="30" />{{
                    item.numsOfLike
                  }}</Button
                >
              </p>
            </Card>
          </ListItem>
          <!-- <ListItem v-else v-for="item in commentData" :key="item.commentId">
        <ListItemMeta :description="item.nickname" />
        <span style="white-space: pre-wrap; font-size: 17px; text-align: left">
          {{ item.commentContent }}
        </span>
        <template slot="action">
          <Button
            type="text"
            v-if="!item.commentUserStatus"
            @click.native="
              doLikeComment(item.commentUserStatus, item.commentId)
            "
            ><Icon type="ios-thumbs-up-outline" size="30" />{{
              item.numsOfLike
            }}</Button
          >
          <Button
            type="text"
            v-else
            @click.native="
              doLikeComment(item.commentUserStatus, item.commentId)
            "
            ><Icon type="ios-thumbs-up" size="30" />{{
              item.numsOfLike
            }}</Button
          >
        </template>
      </ListItem> -->
        </List>
      </Col>
    </Row>
    <Divider orientation="left">我要發表看法</Divider>
    <Input
      type="textarea"
      show-word-limit
      :autosize="true"
      placeholder="留言..."
      v-model="commentArea"
      maxlength="500"
    />
    <p slot="footer">
      <Button type="info" @click="doAddComment()">發表評論</Button
      ><Button type="info" @click="onClose()">關閉</Button>
    </p>
  </Modal>
</template>
<script>
import axios from "axios";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import $store from "../../store.js";
export default {
  props: {
    attrShow: {
      type: Boolean,
      default: false,
    },
    articleId: {
      type: String,
    },
  },
  data() {
    return {
      commentId: "",
      commentUserStatus: "",
      commentArea: "",
      commentData: [],
      numsOfLike: 0,
      liked: false,
      likedComment: false,
      articleTitle: "",
      nickname: "",
      createTime: "",
      articleContent: "",
      isShow: this.attrShow,
      data: [],
    };
  },
  methods: {
    // 產出word
    loadFile(url, callback) {
      PizZipUtils.getBinaryContent(url, callback);
    },
    renderDoc() {
      // const output = this.data;
      const outputTitle = this.articleTitle;
      const outputNickname = this.nickname;
      const createTime = this.createTime;
      const articleContent = this.articleContent;
      this.loadFile("input.docx", function (error, content) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        doc.setData({
          // data: output,
          articleTitle: outputTitle,
          nickname: outputNickname,
          createTime: createTime,
          articleContent: articleContent,
        });
        try {
          // render the document
          doc.render();
        } catch (error) {
          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation;
              })
              .join("\n");
            console.log("errorMessages", errorMessages);
          }
          throw error;
        }
        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        // Output the document using Data-URI
        saveAs(out, outputTitle.concat(".docx"));
      });
    },
    // 文章按讚動作
    async doLikeArticle() {
      var like = 0;
      // api新增或更新按讚資料表中的狀態
      await axios.post("/doLikeArticle", {
        userId: $store.state.userId,
        articleId: this.articleId,
      });
      // 已經按讚狀態下按 => 讚數-1；尚未按讚狀態下按 => 讚數+1
      if (this.liked) {
        like = -1;
      } else {
        like = 1;
      }
      // api更新文章資料表中的總讚數
      await axios.post("/doUpdLike", {
        articleId: this.articleId,
        userId: $store.state.userId,
        like: like,
      });
      // 重新查詢，以渲染最新總讚數
      this.homeDoQryArticle();
    },
    async homeDoQryArticle() {
      try {
        var response = await axios.post("/homeDoQryArticle", {
          articleId: this.articleId,
          nowUserId: $store.state.userId,
        });
        if (response.data[0].articleUserStatus == "1") {
          this.liked = true;
        } else {
          this.liked = false;
        }
        //把時間的毫秒去掉
        for (var i = 0; i < response.data.length; i++) {
          var length = response.data[i].createTime.length;
          response.data[i].createTime = response.data[i].createTime.substr(
            0,
            length - 2
          );
        }
        this.data = response.data[0];
        this.articleTitle = response.data[0].articleTitle;
        this.nickname = response.data[0].nickname;
        this.articleContent = response.data[0].articleContent;
        this.createTime = response.data[0].createTime;
        this.numsOfLike = response.data[0].numsOfLike;
      } catch (error) {
        console.log(error);
      }
    },
    onClose() {
      this.$emit("updateStatus", false);
      this.commentArea = "";
    },
    // 新增評論
    async doAddComment() {
      var reg = /(^\s*$)/g;
      if (this.commentArea && !reg.test(this.commentArea)) {
        try {
          await axios.post("/doAddComment", {
            articleId: this.articleId,
            commentContent: this.commentArea,
            userId: $store.state.userId,
          });
          this.commentArea = "";
          await axios.post("doUpdNumsOfComment", {
            articleId: this.articleId,
            comment: 1,
            userId: $store.state.userId,
          });
          this.doQryComment();
        } catch (error) {
          console.log(error);
        }
      } else {
        this.$Message.error("評論不得為空");
      }
    },
    // 查詢評論
    async doQryComment() {
      try {
        var response = await axios.post("/doQryComment", {
          articleId: this.articleId,
          nowUserId: $store.state.userId,
        });
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].commentUserStatus == "1") {
            response.data[i].commentUserStatus = true;
          } else {
            response.data[i].commentUserStatus = false;
          }
        }
        this.commentData = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 評論按讚動作
    async doLikeComment(commentUserStatus, commentId) {
      var like = 0;
      // api新增或更新按讚資料表中的狀態
      await axios.post("/doLikeComment", {
        userId: $store.state.userId,
        commentId: commentId,
      });
      // 已經按讚狀態下按 => 讚數-1；尚未按讚狀態下按 => 讚數+1
      if (commentUserStatus == 1) {
        like = -1;
      } else {
        like = 1;
      }
      // api更新文章資料表中的總讚數
      await axios.post("/doUpdLikeComment", {
        commentId: commentId,
        userId: $store.state.userId,
        like: like,
      });
      // 重新查詢，以渲染最新總讚數
      this.doQryComment();
    },
  },
  watch: {
    attrShow() {
      this.isShow = this.attrShow;
      if (this.isShow) {
        this.doQryComment();
        this.homeDoQryArticle();
      }
    },
    // liked() {
    //   this.doGetLike();
    // },
  },
};
</script>
<style>
/* .test {
  font-size: 40px;
} */
.ivu-modal-body {
  padding: 40px 30px;
}
</style>
