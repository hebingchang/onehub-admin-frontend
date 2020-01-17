<template>
  <a-layout id="container">
    <a-layout-header :style="headerStyle">
      <div>
        <span class="title">OneHub - 管理后台</span>
        <!--<a-button shape="circle" icon="search" class="search-btn" />-->
      </div>
      <div>
        <a-dropdown>
          <a class="ant-dropdown-link" href="#">
            管理员
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="changePasswordVisible = true">修改口令</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="logout">注销</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-layout-header>

    <a-layout class="layout" :style="{marginTop: '50px'}">
      <a-layout-sider width="200" style="background: #fff; margin-top: 24px;">
        <a-menu mode="inline" v-model="current_route" :style="{ height: '100%', borderRight: 0 }">
          <a-menu-item
            :key="`/${item.path}`"
            v-for="item in children"
            @click="$router.push({path: '/' + item.path})"
          >
            <a-icon :type="item.icon" />
            {{item.name}}
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout-content v-if="!loginVisible" :style="{ margin: '24px 16px 0', background: '#fff' }">
        <div class="layout-container">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>

    <a-modal
      title="登录"
      v-model="loginVisible"
      :footer="null"
      :maskStyle="{backdropFilter: 'blur(4px)'}"
      :maskClosable="false"
      :closable="false"
    >
      <p>
        <a-input placeholder="口令" v-model="password" type="password" />
      </p>
      <a-button @click="login">登录</a-button>
    </a-modal>

    <a-modal
      title="修改口令"
      v-model="changePasswordVisible"
      :footer="null"
      :maskStyle="{backdropFilter: 'blur(4px)'}"
      :destroyOnClose="true"
    >
      <set-password @success="onChangeSecret" :brief="true" />
    </a-modal>
  </a-layout>
</template>

<script>
import sha256 from "crypto-js/sha256";
import SetPassword from "@/components/init/SetPassword.vue";

export default {
  name: "home",
  components: { SetPassword },
  created() {
    this.$http.get("/api/v1/public/has-config").then(res => {
      if (!res.data.data) {
        this.$router.push({ path: "/init" });
      } else {
        let vm = this;
        document.title = "OneHub - admin";
        let children = this.$router.options.routes.filter(item => {
          return item.path === "/";
        })[0].children;
        this.children = children;
        this.current_route = [this.$router.currentRoute.path];
        this.$http.interceptors.response.use(
          function(response) {
            if (response.data.error) {
              this.$message.error(
                `${response.data.error.code}: ${response.data.error.message}`
              );
            }
            return response;
          },
          function(error) {
            if (error.response.status === 401) {
              vm.loginVisible = true;
            }
            return Promise.reject(error);
          }
        );
      }
    });
  },
  data() {
    return {
      config: {},
      children: [],
      headerStyle: {
        position: "fixed",
        background: "#f6f6f6",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "50px",
        lineHeight: "50px",
        width: "100vw",
        zIndex: 100
      },
      current_route: [],
      loginVisible: false,
      changePasswordVisible: false,
      password: ""
    };
  },
  watch: {
    $route(to) {
      this.current_route = [to.path];
    }
  },
  methods: {
    login() {
      localStorage.setItem("secret", sha256(this.password).toString());
      this.$http
        .get("/api/v1/admin/check-password")
        .then(() => {
          this.password = "";
          this.loginVisible = false;
          this.$message.success("登录成功");
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.password = "";
            this.$message.error("口令错误");
          }
        });
    },
    logout() {
      localStorage.removeItem("secret");
      this.loginVisible = true;
    },
    onChangeSecret() {
      this.$message.success("口令修改成功");
      this.changePasswordVisible = false;
    }
  }
};
</script>

<style>
#container,
.layout {
  background: #fff !important;
}

#container .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.search-btn {
  background-color: #f6f6f6 !important;
}

#container .title {
  font-size: 1.3em;
  font-weight: 300;
  margin-right: 10px;
}

.layout-container {
  padding: 24px;
  background: #fff;
  min-height: 360px;
}

@media only screen and (max-width: 850px) {
  .layout-container {
    padding: 12px;
  }
}

.ant-menu-item-selected {
  background-color: #f9f9f9 !important;
}

.ant-menu-item-active,
.ant-dropdown-menu-item-active {
  background-color: #f1f1f1 !important;
}
</style>