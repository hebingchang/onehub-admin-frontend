<template>
  <div>
    <p class="title">选择挂载的网盘</p>
    <p>请选择想要挂载的网盘：</p>
    <a-spin v-if="loading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
    </a-spin>
    <div style="margin-bottom: 2em;">
      <a-radio-group v-if="!loading" v-model="driveId">
        <a-radio v-for="drive in drives" :value="drive.id" :key="drive.id">
          {{drive.name}} ({{drive.driveType }})
          <a
            :href="drive.webUrl"
            target="_blank"
          >{{drive.webUrl}}</a>
        </a-radio>
      </a-radio-group>
    </div>
    <a-button v-if="driveId !== ''" @click="submit">下一步</a-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      drives: [],
      driveId: ""
    };
  },
  created() {
    this.$http
      .get("/api/v1/admin/drives", {
        headers: {
          Token: localStorage.getItem("secret")
        }
      })
      .then(res => {
        this.drives = res.data.data;
        this.loading = false;
      });
  },
  methods: {
    submit() {
      this.$http
        .put(
          "/api/v1/admin/drive",
          {
            drive_id: this.driveId
          },
          {
            headers: {
              Token: localStorage.getItem("secret")
            }
          }
        )
        .then(() => {
          this.$emit("success");
        });
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  font-size: 1.6em;
}
</style>