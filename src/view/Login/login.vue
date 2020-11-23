<template>
  <div id="login-from">
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="用户名：" prop="username" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-input v-model="ruleForm.username" type="text" autocomplete="off" placeholder="请输入用户名" />
        </a-form-model-item>
      <a-form-model-item has-feedback label="密码：" prop="password"  :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-input-password v-model="ruleForm.password" type="password" placeholder="请输入密码" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 2 }">
        <a-button type="primary" @click="submitForm('ruleForm')" block size="default">登录</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  name:'login',
  data() {

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
    
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "change" }],
        password: [{ validator: validatePass, trigger: "change" }],
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
          let data = this.ruleForm
          data.password = md5(data.password)
          this.$axios({
            url: "http://127.0.0.1:9000/api/login",
            method: "post",
            data: data
          })
            .then(res => {
              console.log(res);
              let { code, msg } = res.data;
              if (code == 200) {
                this.$message.success(msg);
                this.$router.push({ path: '/home' })
              } else {
                this.$message.error(msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });



        } else {
          console.log("error submit!!");
          return false;
        }
      });

    }
  }
};
</script>

<style>
#login-from {
  width: 100%;
}
</style>