<template>
  <!-- 打api確認帳號是否重複: 重複的話則登入(檢查密碼與資料庫是否相符) -->
  <div class="login">
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="100"
      style="padding: 50px"
    >
      <FormItem label="帳號" prop="pin">
        <!-- v-model="formValidate.pin" -->
        <Input
          maxlength="11"
          style="width: 240px"
          placeholder="請輸入身分證字號"
          @blur="formValidate.pin"
          @input="whileInput"
          :value="idInput"
          ><Icon type="ios-contact" slot="prefix"
        /></Input>
      </FormItem>
      <FormItem label="密碼" prop="password">
        <Input
          maxlength="12"
          :type="passwordShow"
          style="width: 240px"
          v-model="formValidate.password"
          placeholder="請輸入密碼"
        >
          <Button
            :icon="eyeCloseOpen"
            type="text"
            slot="append"
            @click="changeShow(eyeCloseOpen)"
          ></Button
        ></Input>
        <!-- <img :src="paSrc" alt="" @click="changePassward"> -->
      </FormItem>
    </Form>
    <p slot="footer" class="buttons">
      <span>
        <Button @click="openRegisterModal()" style="margin-left: 8px"
          >註冊</Button
        ><Button @click="handleSubmit('formValidate')" style="margin-left: 8px"
          >登入</Button
        >
      </span>
    </p>
    <RegisterPage
      @updateStatus="updateStatus"
      :attrShow="showModalRegisterPage"
    ></RegisterPage>
  </div>
</template>
<script>
import RegisterPage from "./RegisterPage.vue";
import $store from "../../store";
import axios from "axios";
import $cookies from "vue-cookies";
export default {
  components: { RegisterPage },
  data() {
    //身分證驗證
    const checkPin = (rule, value, callback) => {
      //1. 格式：第一碼英文、第二碼1/2、其他8碼為0-9
      let reg = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/;
      if (!reg.test(value)) {
        return callback(new Error("身分證格式錯誤"));
      }
      //2. 檢核碼驗算
      //2.1 宣告總和暫存變數
      let amount = 0;
      //2.2 第1碼加權計算用
      let pinCode = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      let firstValRule = [
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "34",
        "18",
        "19",
        "20",
        "21",
        "22",
        "35",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "32",
        "30",
        "31",
        "33",
      ];
      //2.3 後8碼加權計算用
      let restRule = [8, 7, 6, 5, 4, 3, 2, 1];
      //2.4 第一碼英文字母換算成數字並儲存到firstVal、並加到amount
      for (var i = 0; i < firstValRule.length; i++) {
        if (value[0] == pinCode[i]) {
          var firstVal = firstValRule[i];
          amount += firstVal[0] * 1;
          amount += firstVal[1] * 9;
          break;
        }
      }
      let startPoint = 1;
      for (var j = 0; j < restRule.length; j++, startPoint++) {
        amount += value[startPoint] * restRule[j];
      }
      //2.5 檢核碼checkNo宣告
      let checkNo = 0;
      if (amount % 10 != 0) {
        checkNo += 10 - (amount % 10);
      } else {
        checkNo = 0;
      }
      //2.6 檢核結果
      if (checkNo != value[9]) {
        return callback(new Error("請輸入正確的身分證字號"));
      } else {
        return callback();
      }
    };
    const checkNoBlankNoChinese = (rule, value, callback) => {
      if (this.noChinese(value)) {
        callback(new Error("不能有中文"));
      } else {
        if (this.noBlank(value)) {
          callback(new Error("不能有空白"));
        } else {
          callback();
        }
      }
    };
    return {
      idInput: "",
      showModalRegisterPage: false,
      passwordShow: "password",
      eyeCloseOpen: "md-eye-off",
      formValidate: { pin: "", password: "" },
      ruleValidate: {
        pin: [
          {
            required: true,
            message: "請輸入帳號",
            trigger: "blur",
          },
          { validator: checkPin, trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "請輸入密碼",
            trigger: "blur",
          },
          {
            min: 8,
            message: "密碼至少8位數",
            trigger: "blur",
          },
          {
            max: 12,
            message: "密碼至多12位數",
            trigger: "blur",
          },
          { validator: checkNoBlankNoChinese, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    whileInput() {
      let txt = this.idInput;
      let actualId = "";
      if (txt.length > 8) {
        console.log(txt.length);
        this.idInput[8] = "*";
        this.idInput[9] = "*";
        this.idInput[10] = "*";
      }
      console.log(actualId);
    },
    openRegisterModal() {
      this.showModalRegisterPage = true;
    },
    async doGetUser() {
      try {
        const response = await axios.post("/doGetUser", {
          pin: this.formValidate.pin,
        });
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async doCheckUserPassword() {
      const response = await axios.post("/doCheckUserPassword", {
        pin: this.formValidate.pin,
        password: this.formValidate.password,
      });
      return response.data;
    },
    async handleSubmit(name) {
      // 驗證表單內容是否符合格式(form validate)
      this.$refs[name].validate(async (valid) => {
        //如果符合格式，則去打api，並印出回傳結果
        if (valid) {
          var result = await this.doGetUser();
          // 身分證是否已存有帳號
          if (result.userId != undefined) {
            result = await this.doCheckUserPassword();
            // 密碼是否相符
            if (result.token) {
              this.$Message.success("歡迎回來  " + result.nickname);
              this.$router.push("/");
              $store.commit("setToken", result.token);
              $store.commit("setUserId", result.userId);
              $store.commit("setNickname", result.nickname);
              $store.commit("setUserStatus", result.status);
              $store.commit("setLoginOrNot", true);
              $cookies.set("token", result.token);
            } else {
              this.$Message.error("登入失敗，請重新輸入");
            }
          } else {
            this.$Message.info("帳號尚未註冊，請先註冊");
            this.openRegisterModal();
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    changeShow(eyeCloseOpen) {
      if (eyeCloseOpen == "md-eye-off") {
        this.eyeCloseOpen = "md-eye";
        this.passwordShow = "text";
        return;
      } else {
        this.eyeCloseOpen = "md-eye-off";
        this.passwordShow = "password";
        return;
      }
    },
    updateStatus(el) {
      // 關閉對話框，從子元件接收到的值false賦值給showModal
      this.showModalRegisterPage = el;
    },
    noBlank: function (value) {
      var reg = /(^\s*$)/g;
      return reg.test(value);
    },
    noChinese: function (value) {
      var reg = /[\u4E00-\u9FA5]/g;
      return reg.test(value);
    },
  },
  computed: {
    vuexToken() {
      return $store.state.token;
    },
  },
};
</script>
<style>
/* .ivu-layout-content{
  display: flex;
  justify-content: center;
}
.buttons{
  display: flex;
  justify-content: flex-end;
} */
</style>
