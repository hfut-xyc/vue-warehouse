<template>
  <div>
    <el-header style="background-color: #33b1f5">
      <div class="title">仓库信息管理系统</div>
      <el-dropdown @command="logout" class="dropdown">
        <div class="currentUser">
          <el-avatar src="" style="margin-right: 5px"></el-avatar>
          <label style="font-weight: bold">{{
            this.$store.state.currentUser
          }}</label>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <i class="el-icon-delete"></i>退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-container>
      <div id="aside">

      <el-aside width="200px">
        <el-menu
          router
          background-color="#eeeeee"
          :default-openeds="['1', '2']"
          :default-active="this.$route.path"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-home"></i>基本信息
            </template>
            <el-menu-item index="/home/user">
              <i class="el-icon-user"></i>用户管理
            </el-menu-item>
            <el-menu-item index="/home/warehouse">
              <i class="el-icon-coin"></i>仓库管理
            </el-menu-item>
            <el-menu-item index="/home/inventory">
              <i class="el-icon-s-operation"></i>产品管理
            </el-menu-item>
            <el-menu-item index="/home/order">
              <i class="el-icon-date"></i>订单管理
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>数据分析
            </template>
            <el-menu-item index="/home/chart">
              <i class="el-icon-s-data"></i>订单统计
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      </div>

      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item v-text="this.$route.name"></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- show subview here-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logout() {
      let that = this;
      this.$axios
        .get("/logout")
        .then((res) => {
          if (res.data === "success") {
            that.$store.commit("logout");
            that.$router.replace("/login");
            that.$message.success("注销成功");
          }
        })
        .catch((err) => {
          console.log(err);
          that.$message.error("注销失败");
        });
    },
  },
};
</script>

<style>
.aside {
    width: 160px;
    background-color: #0080c9;
    overflow: hidden;
}

.el-aside {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}

.title {
  color: white;
  float: left;
  font-size: large;
  margin-top: 20px;
}

.dropdown {
  color: white;
  float: right;
  cursor: pointer;
  margin-top: 10px;
}

.currentUser {
  display: flex;
  align-items: center;
}
</style>