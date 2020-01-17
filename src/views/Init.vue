<template>
  <div class="container">
    <a-row class="flex-box">
      <a-col :xs="24" :sm="24" :md="20" :lg="16" :xl="12">
        <a-steps :current="current">
          <a-step title="欢迎" />
          <a-step title="绑定账号" description="绑定微软账号" />
          <a-step title="设置密码" description="设置管理密码" />
          <a-step title="选择驱动器" description="选择挂载网盘" />
          <a-step title="设置路径" description="选择分享路径" />
        </a-steps>

        <div class="step-container">
          <welcome v-if="current === 0" />
          <bind-onedrive v-if="current === 1" @success="current_success = true" />
          <set-password v-if="current === 2" @success="next" />
          <drive v-if="current === 3" @success="next" />
          <drive-item v-if="current === 4" @success="success" />
        </div>

        <a-button @click="next" v-if="current_success || current === 0">下一步</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Welcome from "@/components/init/Welcome.vue";
import BindOnedrive from "@/components/init/BindOnedrive.vue";
import SetPassword from "@/components/init/SetPassword.vue";
import Drive from "@/components/init/Drive.vue";
import DriveItem from "@/components/init/DriveItem.vue";

export default {
  data() {
    return {
      current: 0,
      current_success: false
    };
  },
  created() {
    document.title = "OneHub 初始化";
    this.$http.get("/api/v1/public/has-config").then(res => {
      if (res.data.data) {
        this.$router.push({ path: "/" });
      }
    });
  },
  components: { Welcome, BindOnedrive, SetPassword, Drive, DriveItem },
  methods: {
    next() {
      this.current++;
      this.current_success = false;
    },
    success() {
      let vm = this;
      this.$success({
        title: "成功",
        content: (
          <div>
            <p>您已成功配置 OneHub，即将进入管理后台</p>
          </div>
        ),
        closable: false,
        maskClosable: false,
        onOk() {
          vm.$router.push({ path: "/" });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
}
.flex-box {
  width: 100vw;
  margin-top: 20vh;
  display: flex;
  justify-content: center;
}

.step-container {
  margin-top: 2em;
}
</style>