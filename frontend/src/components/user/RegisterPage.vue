<template>
  <!-- 打api確認帳號是否重複: 重複的話則登入(檢查密碼與資料庫是否相符)、不重複則跳到註冊modal -->
  <div class="login">
    <Modal
      title="註冊資訊"
      v-model="isShow"
      @on-cancel="onClose"
      @on-visible-change="handleReset('registerFormValidate')"
    >
      <Form
        ref="registerFormValidate"
        :model="registerFormValidate"
        :rules="registerRuleValidate"
        :label-width="120"
      >
        <FormItem label="帳號" prop="pin">
          <Input
            maxlength="11"
            v-model="registerFormValidate.pin"
            style="width: 240px"
            placeholder="請輸入身分證字號"
            ><Icon type="ios-contact" slot="prefix"
          /></Input>
        </FormItem>
        <FormItem label="密碼" prop="password">
          <Input
            maxlength="12"
            :type="passwordShow"
            style="width: 240px"
            v-model="registerFormValidate.password"
            placeholder="請輸入8-12長的密碼"
            ><Button
              :icon="eyeCloseOpen"
              type="text"
              slot="append"
              @click="changeShow(eyeCloseOpen, 1)"
            ></Button
          ></Input>
        </FormItem>
        <FormItem label="密碼確認" prop="passwordAgain">
          <Input
            maxlength="12"
            :type="passwordShowAgain"
            style="width: 240px"
            v-model="registerFormValidate.passwordAgain"
            placeholder="請再次輸入密碼"
            ><Button
              :icon="eyeCloseOpenAgain"
              type="text"
              slot="append"
              @click="changeShow(eyeCloseOpenAgain, 2)"
            ></Button
          ></Input>
        </FormItem>
        <FormItem label="綽號" prop="nickname">
          <Input
            maxlength="12"
            show-word-limit
            style="width: 240px"
            v-model="registerFormValidate.nickname"
            placeholder="請輸入綽號"
          ></Input>
        </FormItem>
      </Form>
      <p slot="footer">
        <span>
          <!-- <Button
          type="warning"
          @click="handleReset('formValidate')"
          style="margin-left: 8px"
          >清空欄位</Button
        > -->
          <Button
            type="info"
            @click="handleSubmit('registerFormValidate')"
            style="margin-left: 8px"
            >註冊</Button
          >
        </span>
      </p>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    attrShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    //身分證驗證
    const checkPin = async (rule, value, callback) => {
      //1. 格式：第一碼英文、第二碼1/2、其他8碼為0-9
      let reg = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/;
      if (!reg.test(value)) {
        return callback(new Error("身分證格式錯誤"));
      } else {
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
          // return callback();
          var result = await this.doGetUser();
          // 身分證是否已存有帳號
          if (result.userId != undefined) {
            return callback(new Error("帳號已存在，請至登入頁面"));
          } else {
            return callback();
          }
        }
      }
    };
    //再次輸入密碼是否一致的檢核
    const checkCorrect2 = (rule, value, callback) => {
      if (this.registerFormValidate.passwordAgain != "") {
        if (value != this.registerFormValidate.passwordAgain) {
          return callback(new Error("密碼再次輸入不相符"));
        } else {
          return callback();
        }
      } else {
        return callback();
      }
    }; //再次輸入密碼是否一致的檢核
    const checkCorrect1 = (rule, value, callback) => {
      if (this.registerFormValidate.password != "") {
        if (value != this.registerFormValidate.password) {
          return callback(new Error("密碼再次輸入不相符"));
        } else {
          return callback();
        }
      } else {
        return callback();
      }
    };
    const checkNoBlankNoChinese = (rule, value, callback) => {
      if (this.noChinese(value)) {
        callback(new Error("不能有中文"));
      } else {
        if (this.noBlank(value)) {
          callback(new Error("不能為全空白"));
        } else {
          callback();
        }
      }
    };
    const checkNoBlank = (rule, value, callback) => {
      if (this.noBlank(value)) {
        callback(new Error("不能為全空白"));
      } else {
        callback();
      }
    };
    const checkUniqueNickname = async (rule, value, callback) => {
      var result = await axios.post("/doGetUserNickname", {
        nickname: this.registerFormValidate.nickname,
      });
      if (result.data.length) {
        callback(new Error("該綽號已存在"));
      } else {
        callback();
      }
    };
    return {
      isShow: this.attrShow,
      passwordShow: "password",
      eyeCloseOpen: "md-eye-off",
      passwordShowAgain: "password",
      eyeCloseOpenAgain: "md-eye-off",
      registerFormValidate: {
        pin: "",
        password: "",
        passwordAgain: "",
        nickname: "",
      },
      registerRuleValidate: {
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
          { validator: checkCorrect2, trigger: "blur" },
        ],
        passwordAgain: [
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
          { validator: checkCorrect1, trigger: "blur" },
        ],
        nickname: [
          {
            required: true,
            message: "請輸入綽號",
            trigger: "blur",
          },
          {
            max: 12,
            message: "綽號至多12個字",
            trigger: "blur",
          },
          { validator: checkNoBlank, trigger: "blur" },
          { validator: checkUniqueNickname, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    async doAddUser() {
      try {
        await axios.post("/doAddUser", {
          pin: this.registerFormValidate.pin,
          password: this.registerFormValidate.password,
          nickname: this.registerFormValidate.nickname,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async doGetUser() {
      try {
        const response = await axios.post("/doGetUser", {
          pin: this.registerFormValidate.pin,
        });
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
    handleSubmit(name) {
      // 驗證表單內容是否符合格式(form validate)
      this.$refs[name].validate(async (valid) => {
        //如果符合格式，則去打api，並印出回傳結果
        if (valid) {
          await this.doAddUser();
          this.$Message.success("註冊成功，請重新登入");
          this.onClose();
        } else {
          this.$Message.error("註冊失敗，請重新輸入");
        }
      });
    },
    changeShow(eyeCloseOpen, index) {
      if (eyeCloseOpen == "md-eye-off") {
        if (index == 1) {
          this.eyeCloseOpen = "md-eye";
          this.passwordShow = "text";
        } else if (index == 2) {
          this.eyeCloseOpenAgain = "md-eye";
          this.passwordShowAgain = "text";
        }
      } else {
        if (index == 1) {
          this.eyeCloseOpen = "md-eye-off";
          this.passwordShow = "password";
        } else if (index == 2) {
          this.eyeCloseOpenAgain = "md-eye-off";
          this.passwordShowAgain = "password";
        }
      }
    },
    onClose() {
      this.$emit("updateStatus", false);
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
  watch: {
    //監聽對話框狀態變化、監聽子元件在父元件的show
    attrShow() {
      this.isShow = this.attrShow;
    },
  },
};
</script>
