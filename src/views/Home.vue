<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">云E办</div>
        <div>
          <el-button
            type="text"
            size="medium"
            @click="goChat"
            style="color:#000;margin-right:10px"
            icon="el-icon-bell"
          ></el-button>
          <el-dropdown class="userInfo" @command="commandHandler">
            <span class="el-dropdown-link">
              {{ user.name }}<i><img :src="user.userFace" alt="头像"/></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="loginout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router v-for="(item, index) in routes" :key="index">
            <el-submenu index="1" v-if="!item.hidden">
              <template slot="title">
                <i
                  style="color:#1accff; margin-right: 10px"
                  :class="item.iconCls"
                ></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item
                :index="children.path"
                v-for="(children, index) in item.children"
                :key="index"
                >{{ children.name }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            v-if="this.$router.currentRoute.path != '/home'"
          >
            <el-breadcrumb-item :to="{ path: '/home' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>{{
              this.$router.currentRoute.name
            }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div v-else class="homeWelcome">欢迎来到云E办系统</div>
          <router-view class="homeRouterView" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // user: JSON.parse(window.sessionStorage.getItem("user")),
    };
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
    user(){
      return this.$store.state.currentAdmin
    }
  },
  methods: {
    goChat() {
      this.$router.push("/chat");
    },
    commandHandler(command) {
      if (command == "loginout") {
        this.$confirm("此操作将注销登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.postRequest("/logout");
            //清空用户信息
            window.sessionStorage.removeItem("tokenStr");
            window.sessionStorage.removeItem("user");
            this.$store.commit("initRoutes", []);
            //页面的跳转
            this.$router.replace("/");
          }).catch(() => {
            this.$message({
              type: "info",
            });
          });
      }
      if(command == 'userinfo'){
        this.$router.push('/userinfo')
      }
      if(command == 'setting'){
        this.$router.push('/setting')
      }
    },
  },
};
</script>

<style>
.homeHeader {
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}
.homeHeader .title {
  font-size: 30px;
  font-family: 楷体;
  color: white;
}
.homeHeader .userInfo {
  cursor: pointer;
}
.el-dropdown span {
  line-height: 54px;
}
.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-left: 10px;
  vertical-align: middle;
}
.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文楷体;
  color: #409eff;
  margin-top: 10px;
}
.homeRouterView {
  margin-top: 10px;
}
</style>
