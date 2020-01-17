<template>
  <div>
    <a-row :gutter="32">
      <a-col :xs="24" :lg="12">
        <a-card title="缓存" size="small" class="card">
          <q>由于 OneDrive API 在国内访问缓慢，OneHub采用缓存方案将共享文件列表缓存到本地。您可以设置缓存频率。</q>
          <p :style="{marginTop: '1em'}">
            每
            <a-input-number
              size="small"
              :min="5"
              :max="60"
              v-model="config.refresh_interval"
              :style="{width: '4.5em'}"
              @blur="save"
            />
            分钟更新一次缓存。下次更新时间：{{next_update}}
          </p>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-card title="网站标题" size="small" class="card">
          <q>显示在主页左上角的网站名称。</q>
          <p :style="{marginTop: '1em'}">
            <a-input v-model="config.title" @blur="save" />
          </p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: {}
    };
  },
  created() {
    this.update();
  },
  computed: {
    next_update: function() {
      let date = new Date(this.config.next_schedule_update);
      return `${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
    }
  },
  methods: {
    update() {
      this.$http.get("/api/v1/admin/config").then(resp => {
        this.config = resp.data.data;
      });
    },
    save() {
      this.$http.put("/api/v1/admin/config", this.config).then(res => {
        if (res.data.success) {
          this.$message.success("保存成功");
          this.update();
        } else {
          this.$message.success(res.data.message);
          this.config = res.data.data;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
q {
  font-style: italic;
}

.card {
  margin-bottom: 1em;
}
</style>