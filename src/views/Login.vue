<template>
  <div class="body">
    <el-form ref="loginForm" :model="loginForm" :rules="rules" @keyup.enter.native="login()" class="login-box"
      status-icon>
      <h3 class="login-title">登录页面</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" show-password prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" style="width: 150px; vertical-align: middle;"
          prefix-icon="el-icon-picture-outline-round" placeholder="请输入验证码"></el-input>
        <img class="login-captcha" :src="imgURL" @click="refreshCaptcha()" alt="图片加载失败" title="看不清楚？换一张" />
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" @click="login()" type="primary" icon="el-icon-s-promotion">登录</el-button>
        <el-button class="login-btn" @click="reset()" type="primary" plain icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { postRequest } from "@/utils/api";

export default {
  name: "Login",
  data() {
    return {
      imgURL: "",
      loginForm: {
        username: "",
        password: "",
        code: ""
      },
      rules: {
        username: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
      }
    };
  },
  mounted() {
    this.refreshCaptcha();
  },
  methods: {
    login() {
      this.$refs["loginForm"].validate(async (valid) => {
        if (!valid) {
          return false
        }
        const res = await postRequest('/login', this.loginForm)
        this.$message.success(res.data.message)

        // postRequest("/login", this.loginForm).then(res => {
        //   if (res.data === "success") {
        //     that.$router.replace("/home");
        //     that.$message.success("登录成功");
        //   } else if (res.data === "fail") {
        //     that.$message.warning("用户名与密码不匹配");
        //   }
        // }).catch(error => {
        //   console.log(error);
        //   that.$message.error("服务器异常");
        // });
      });
    },
    reset() {
      this.loginForm.username = "";
      this.loginForm.password = "";
    },
    refreshCaptcha() {
      // 加上访问时间戳，防止图片缓存
      this.imgURL = "http://localhost:8081/captcha?timeStamp=" + new Date().getTime();
    }
  }
};
</script>

<style>
.body {
  width: 100%;
  height: 100%;
  background: url(../assets/bg.png) no-repeat;
  background-size: cover;
  position: fixed;
}

.login-box {
  border: 1px solid #dcdfe6;
  width: 300px;
  margin: 100px auto;
  padding: 35px 30px 15px 30px;
  border-radius: 10px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  font-size: 20px;
  margin: 0 auto 40px auto;
  color: #00aaff;
}

.login-btn {
  width: 45%;
  border-radius: 5px;
}

.login-captcha {
  margin-left: 15px;
  display: inline-block;
  border-radius: 4px;
  height: 40px;
  border: 1px solid #0093e6;
  cursor: pointer;
  vertical-align: middle;
  box-sizing: border-box;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1)
}

#captcha:hover {
  border-color: #df0100;
}
</style>