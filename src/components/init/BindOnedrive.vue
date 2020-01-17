<template>
  <div class="bind-container">
    <p class="title">绑定 OneDrive 账号</p>
    <p v-if="!has_bind">请单击下面的按钮前往 Microsoft 完成绑定：</p>
    <a-button @click="bind" icon="windows" v-if="!has_bind">绑定</a-button>
    <p v-if="has_bind">
      恭喜，您已经以
      <span
        style="font-weight: 600;"
      >{{user_info.displayName}} ({{user_info.userPrincipalName}})</span> 身份登录。
    </p>
  </div>
</template>

<script>
import consts from "@/consts.js";
export default {
  data() {
    return {
      has_bind: false,
      user_info: {}
    };
  },
  methods: {
    onAuthMessage(e) {
      let data = JSON.parse(e.data);
      if (data.displayName) {
        window.removeEventListener("message", this.onAuthMessage);
        this.has_bind = true;
        this.user_info = data;
        this.$emit("success");
      }
    },
    bind() {
      window.open(consts.API_BASE + "/api/v1/admin/oauth");
      window.addEventListener("message", this.onAuthMessage);
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  font-size: 1.6em;
}
</style>