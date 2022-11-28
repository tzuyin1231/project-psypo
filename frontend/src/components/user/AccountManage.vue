<template>
  <!-- 綽號更改要確認是否為唯一值 -->
  <!-- 綽號input格要預先綁定原本綽號 -->
  <div>
    <Row type="flex" justify="center" class="code-row-bg" align="middle">
      <Col span="4"></Col>
      <Col span="16">
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 32px 32px;
          "
        >
          <List>
            <ListItem style="align-items: center">
              <ListItemMeta
                title="綽號"
                description="修改可能會影響原有的知名度"
              />
              <template slot="action">
                <li>
                  <Button @click="modal1 = true">更改</Button>
                  <Modal title="更改綽號" v-model="modal1" @on-cancel="cancel">
                    <Form
                      ref="nicknameFormValidate"
                      :model="nicknameFormValidate"
                      :rules="nicknameRuleValidate"
                      :label-width="80"
                    >
                      <FormItem label="綽號" prop="nickname">
                        <Input
                          v-model="nicknameFormValidate.nickname"
                          placeholder="Enter customer's id"
                        >
                        </Input>
                      </FormItem>
                      <FormItem label="密碼" prop="password">
                        <Input
                          v-model="nicknameFormValidate.password"
                          placeholder="請輸入登入密碼"
                        ></Input>
                      </FormItem>
                    </Form>
                    <p slot="footer">
                      <span>
                        <Button
                          type="warning"
                          @click="handleReset('nicknameFormValidate')"
                          style="margin-left: 8px"
                          >清空欄位</Button
                        >
                        <Button type="info" @click="handleSubmit()"
                          >確認新增</Button
                        >
                      </span>
                    </p>
                  </Modal>
                </li>
              </template>
            </ListItem>
            <ListItem style="align-items: center">
              <ListItemMeta title="密碼" description="" />
              <template slot="action">
                <li>
                  <Button @click="modal2 = true">更改</Button>
                  <Modal title="更改密碼" v-model="modal2" @on-cancel="cancel">
                    <Form
                      ref="passwordFormValidate"
                      :model="passwordFormValidate"
                      :rules="passwordRuleValidate"
                      :label-width="80"
                    >
                      <FormItem label="目前密碼" prop="oldPassword">
                        <Input
                          type="password"
                          v-model="passwordFormValidate.oldPassword"
                          placeholder="請輸入目前密碼"
                        >
                        </Input>
                      </FormItem>
                      <FormItem label="新密碼" prop="newPassword">
                        <Input
                          type="password"
                          v-model="passwordFormValidate.newPassword"
                          placeholder="請輸入新密碼"
                        ></Input>
                      </FormItem>
                      <FormItem label="再次輸入新密碼" prop="newPasswordAgain">
                        <Input
                          type="password"
                          v-model="passwordFormValidate.newPasswordAgain"
                          placeholder="請再次輸入新密碼"
                        ></Input>
                      </FormItem>
                    </Form>
                    <p slot="footer">
                      <span>
                        <Button
                          type="warning"
                          @click="handleReset('passwordFormValidate')"
                          style="margin-left: 8px"
                          >清空欄位</Button
                        >
                        <Button type="info" @click="handleSubmit()"
                          >確認新增</Button
                        >
                      </span>
                    </p>
                  </Modal>
                </li>
              </template>
            </ListItem>
          </List>
        </div>
      </Col>
      <Col span="4"> </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    const checkCorrect = (rule, value, callback) => {
      if (value != this.passwordFormValidate.newPassword) {
        return callback(new Error("密碼輸入不正確"));
      }
    };
    return {
      nicknameFormValidate: { nickname: "", password: "" },
      nicknameRuleValidate: {
        nickname: [
          {
            required: true,
            message: "此欄位為必填",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "此欄位為必填",
            trigger: "blur",
          },
        ],
      },
      passwordFormValidate: {
        oldPassword: "",
        newPassword: "",
        newPasswordAgain: "",
      },
      passwordRuleValidate: {
        oldPassword: [
          {
            required: true,
            message: "此欄位為必填",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "此欄位為必填",
            trigger: "blur",
          },
        ],
        newPasswordAgain: [
          {
            required: true,
            message: "此欄位為必填",
            trigger: "blur",
          },
          { validator: checkCorrect, trigger: "blur" },
        ],
      },
      modal1: false,
      modal2: false,
    };
  },
  methods: {
    ok() {
      //   this.$Message.info("Clicked ok");
    },
    cancel() {
      //   this.$Message.info("Clicked cancel");
    },
  },
};
</script>
