<template>
  <div class="about">
    <h1>控制台</h1>
    <div>
      <a-row :gutter="16">
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-card>
            <a-statistic title="文件" :value="stats.files_count" suffix="个"></a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-card>
            <a-statistic title="目录" :value="stats.folders_count" suffix="个"></a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-card>
            <a-statistic title="下次更新" :value="stats.next_update" />
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stats: {}
    };
  },
  created() {
    this.update();
  },
  methods: {
    update() {
      this.$http
        .get("/api/v1/admin/stats", {
          headers: {
            Token: localStorage.getItem("secret")
          }
        })
        .then(res => {
          let date = new Date(res.data.data.next_schedule_update);
          res.data.data.next_update = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          this.stats = res.data.data;
        });
    }
  }
};
</script>