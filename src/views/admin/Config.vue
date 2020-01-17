<template>
  <div class="about">
    <h1>配置</h1>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="环境配置" key="1">
        <env-config />
      </a-tab-pane>
      <a-tab-pane tab="OneDrive 账户" key="2">
        <one-drive-account />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import OneDriveAccount from "@/components/config/OneDriveAccount.vue";
import EnvConfig from "@/components/config/EnvConfig.vue";
export default {
  components: { OneDriveAccount, EnvConfig }
};
</script>