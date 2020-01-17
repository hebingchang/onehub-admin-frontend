<template>
  <div class="drive-item-init">
    <p class="title">选择分享路径</p>
    <p>请选择想要分享的网盘路径。不支持直接共享根目录。</p>
    <a-spin v-if="loading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
    </a-spin>
    <div style="margin-bottom: 2em;" class="tree-container">
      <a-tree
        @select="onSelect"
        :loadData="onLoadData"
        :treeData="treeData"
        :replaceFields="replaceFields"
      />
    </div>
    <a-button v-if="selectedId !== ''" @click="submit">完成</a-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      treeData: [],
      currentPath: "/",
      replaceFields: {
        children: "children",
        title: "name",
        key: "id"
      },
      selectedId: ""
    };
  },
  created() {
    this.$http
      .post(
        "/api/v1/admin/drive-item",
        {
          path: "/"
        },
        {
          headers: {
            Token: localStorage.getItem("secret")
          }
        }
      )
      .then(res => {
        this.treeData = res.data.data.filter(item => {
          return !!item.folder;
        });
        this.loading = false;
      });
  },
  methods: {
    submit() {
      this.$http
        .put(
          "/api/v1/admin/drive-item",
          {
            item_id: this.selectedId
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
    },
    onSelect(e) {
      this.selectedId = e[0];
    },
    onLoadData(treeNode) {
      this.currentPath = treeNode.dataRef.id;
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        this.$http
          .post(
            "/api/v1/admin/drive-item",
            {
              path: this.currentPath
            },
            {
              headers: {
                Token: localStorage.getItem("secret")
              }
            }
          )
          .then(res => {
            treeNode.dataRef.children = res.data.data.filter(item => {
              return !!item.folder;
            });
            this.treeData = [...this.treeData];
            resolve();
          });
      });
    }
  }
};
</script>
<style lang="less">
.drive-item-init .title {
  font-size: 1.6em;
}

.drive-item-init
  .tree-container
  .ant-tree
  li
  .ant-tree-node-content-wrapper.ant-tree-node-selected {
  color: white;
}
</style>