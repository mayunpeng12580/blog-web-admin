<template>
  <div id="login-from">
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="用户名：" prop="pass" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-input v-model="ruleForm.pass" type="password" autocomplete="off" placeholder="请输入用户名" />
        </a-form-model-item>
      <a-form-model-item has-feedback label="密码：" prop="checkPass"  :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-input-password v-model="ruleForm.checkPass" type="password" placeholder="请输入密码" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 2 }">
        <a-button type="primary" @click="submitForm('ruleForm')" block size="default">登录</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  data() {
    let checkPending;
    let checkAge = (rule, value, callback) => {
      clearTimeout(checkPending);
      if (!value) {
        return callback(new Error("Please input the age"));
      }
      checkPending = setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("Please input digits"));
        } else {
          if (value < 18) {
            callback(new Error("Age must be greater than 18"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        age: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
        age: [{ validator: checkAge, trigger: "change" }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });

        this.$router.push({ path: '/' })
    }
  }
};
</script>

<style>
#login-from {
  width: 100%;
}
</style>