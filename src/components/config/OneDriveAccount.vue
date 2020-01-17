<template>
  <div>
    <p v-if="profile.displayName">
      已绑定 OneDrive 账号：
      <span style="font-weight: 600;">{{profile.displayName}}</span>
      ({{profile.userPrincipalName}})
    </p>

    <a-row :gutter="32">
      <a-col :xs="24" :lg="12" v-for="drive in drives" :key="drive.id">
        <a-card v-if="drive.id" size="small">
          <div slot="title">
            {{drive.name}} ({{drive.driveType}})
            <span v-if="current_drive === drive.id">(当前)</span>

            <a-button type="link" size="small" v-else @click="setCurrent(drive.id)">设为当前</a-button>
          </div>
          <a :href="drive.webUrl" slot="extra" target="_blank">前往</a>
          <p class="drive-id">
            <span style="font-weight: 600;">ID：</span>
            <code>{{drive.id}}</code>
          </p>
          <p>
            <span style="font-weight: 600;">共享目录路径：</span>
            <code>{{drive_item_path}}</code>
            <a-button
              type="link"
              size="small"
              v-if="current_drive === drive.id && drive_item_path !== ''"
              @click="setItem()"
            >[修改共享路径]</a-button>
            <a-spin v-if="drive_item_path === ''">
              <a-icon slot="indicator" type="loading" spin />
            </a-spin>
          </p>
          <p>
            <span style="font-weight: 600;">存储空间：</span>
            {{prettyBytes(drive.quota.used)}} / {{prettyBytes(drive.quota.total)}}
            <a-progress
              :percent="drive.quota.used / drive.quota.total * 100"
              size="small"
              :showInfo="false"
            />
          </p>
        </a-card>
      </a-col>
    </a-row>

    <a-spin v-if="loading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
    </a-spin>

    <a-modal
      title="选择共享目录"
      v-model="treeVisible"
      :footer="null"
      :maskStyle="{backdropFilter: 'blur(4px)'}"
      :closable="closable"
      :maskClosable="closable"
      :destroyOnClose="true"
    >
      <drive-item @success="itemSet" />
    </a-modal>
  </div>
</template>

<script>
const prettyBytes = require("pretty-bytes");
import DriveItem from "@/components/init/DriveItem.vue";

export default {
  data() {
    return {
      loading: true,
      profile: {},
      drives: [],
      current_drive: "",
      treeVisible: false,
      closable: true,
      drive_item: {}
    };
  },
  created() {
    this.update();
  },
  components: { DriveItem },
  computed: {
    drive_item_path: function() {
      if (this.drive_item.parentReference) {
        let path = this.drive_item.parentReference.path.split(":")[
          this.drive_item.parentReference.path.split(":").length - 1
        ];
        if (path[path.length - 1] === "/") {
          return path + this.drive_item.name;
        } else {
          return path + "/" + this.drive_item.name;
        }
      } else {
        return "";
      }
    }
  },
  methods: {
    update() {
      this.drives = [];
      this.current_drive = "";
      this.drive_item = {};
      this.loading = true;

      this.$http.get("/api/v1/admin/profile").then(res => {
        this.profile = res.data.data;
        this.$http.get("/api/v1/admin/drives").then(resp => {
          this.drives = resp.data.data;
          this.loading = false;
        });
        this.$http.get("/api/v1/admin/profile/drive").then(resp => {
          this.current_drive = resp.data.data;
        });
        this.$http.get("/api/v1/admin/profile/item").then(resp => {
          this.drive_item = resp.data.data;
          // (resp.data.data);
        });
      });
    },
    prettyBytes(quota) {
      return prettyBytes(quota);
    },
    setCurrent(id) {
      this.$http
        .put("/api/v1/admin/drive", {
          drive_id: id
        })
        .then(() => {
          this.treeVisible = true;
          this.closable = false;
        });
    },
    setItem() {
      this.treeVisible = true;
      this.closable = true;
    },
    itemSet() {
      this.treeVisible = false;
      this.update();
    }
  }
};
</script>

<style lang="less" scoped>
.drive-id {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>