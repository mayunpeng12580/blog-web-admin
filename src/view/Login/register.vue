<template>
  <div id="register-from">
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
      <a-form-model-item
        has-feedback
        label="用户名："
        prop="username"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-input v-model="ruleForm.username" type="text" autocomplete="off"></a-input>
      </a-form-model-item>
      <a-form-model-item
        has-feedback
        label="密码："
        prop="password"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-input-password v-model="ruleForm.password" type="password" validate-status="warning" />
      </a-form-model-item>
      <a-form-model-item
        has-feedback
        label="确认密码："
        prop="checkPass"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-input-password v-model="ruleForm.checkPass" type="password" />
      </a-form-model-item>
      <a-form-model-item
        has-feedback
        label="验证码："
        id="code"
        prop="code"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-input v-model="ruleForm.code" type="text" class="code" />
        <a-button type="primary" style="float: right; margin-top:4px;" @click="getCode">{{codeTxt}}</a-button>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 2 }">
        <a-button type="primary" @click="submitForm('ruleForm')" block size="default">注册</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  name:'register',
  data() {
    let checkPending;
    //检查验证码
    let checkCode = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error("请输入验证码"));
      } else if (value != this.code) {
        console.log(this.code)
        callback(new Error("验证码错误!"));
      } else {
        callback();
      }
    };
    //检验用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("用户名不能为空"));
      } else if (value.length < 2 || value.length > 6) {
        callback(new Error("用户名长度为2-6位"));
      } else {
        // if (this.ruleForm.checkPass !== "") {
        //   this.$refs.ruleForm.validateField("checkPass");
        // }
        callback();
      }
    };
    //检查密码
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (value.length < 2 || value.length > 18) {
        callback(new Error("密码长度为2-18位"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    //确认密码
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        password: "",
        checkPass: "",
        code: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "change" }],
        password: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
        code: [{ validator: checkCode, trigger: "change" }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      code: null,
      codeTxt: '获取验证码'
    };
  },
  methods: {
    //获取验证码
    getCode() {
      this.codeTxt = "获取中";
      this.$axios({
            url: "http://127.0.0.1:9000/api/getCode",
            method: "get"
          })
            .then(res => {
              let { code, data } = res.data;
              if (code == 200) {
                this.$message.success("您的验证码是：" + data);
                this.codeTxt = "重新获取";
                console.log(data)
                this.code = data
              } else {
                this.$message.error(data);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
    },
    //提交注册信息
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = this.ruleForm
          data.password = md5(data.password)
          this.$axios({
            url: "http://127.0.0.1:9000/api/user/addUser",
            method: "post",
            data: data
          })
            .then(res => {
              console.log(res);
              let { code, msg } = res.data;
              if (code == 200) {
                this.$message.success(msg);
                this.$router.push({ path: "/login" });
              } else {
                this.$message.error(msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    
    
    
  }
};
</script>

<style>
#register-from {
  width: 100%;
}

#register-from .code {
  width: 48%;
}
</style>