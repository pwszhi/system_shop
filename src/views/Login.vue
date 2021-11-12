<template>
  <div>
    <el-form
      ref="form"
      v-loading="loading"
      element-loading-text="正在登录..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :model="loginForm"
      :rules="rules"
      class="loginContainer"
    >
      <h3 class="logintitle">登录系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          placeholder="账号"
          auto-complete="false"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
          auto-complete="false"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          type="text"
          placeholder="点击图片更换验证码"
          auto-complete="false"
          style="width:250px;margin-right:5px"
        ></el-input>
        <img :src="captchaUrl" alt="验证码" @click="updateCaptcha" />
      </el-form-item>
      <el-checkbox v-model="checked">记住密码</el-checkbox>
      <el-button
        type="primary"
        style="width:100%;margin-top:12px"
        @click="submitLogin"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      captchaUrl: "/captcha?time=" + new Date(),
      loginForm: {
        username: "admin",
        password: "123",
        code: "",
      },
      loading: false,
      checked: true,
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = "/captcha?time=" + new Date();
    },
    submitLogin() {
      // console.log(this.$refs.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest("/login", this.loginForm).then((resp) => {
            // console.log(resp)
            //加载成功
            this.loading = false;
            if (resp) {
              //存储用户token
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              window.sessionStorage.setItem("tokenStr", tokenStr);
              //跳转首页
              let path = this.$route.query.redirect;
              this.$router.push(
                path == "/" || path == undefined ? "/home" : path
              );
            }
          });
        } else {
          this.$message.error("请补全信息后提交");
          return false;
        }
      });
    },
  },
};
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: border-box;
  margin: 200px auto;
  width: 350px;
  padding: 15px 35px 15px;
  background-color: white;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 5px #ccc;
}

.logintitle {
  margin: 0 auto 50px auto;
  text-align: center;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
