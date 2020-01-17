<template>
  <div>
    <p class="title" v-if="!brief">设置管理员密码</p>
    <p v-if="!brief">为保证后台安全，您必须设置管理员密码</p>
    <a-form :form="form">
      <a-form-item v-bind="brief ? BriefLayout: formItemLayout" label="密码">
        <a-input
          v-decorator="[
          'password',
          {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          },
        ]"
          type="password"
        />
      </a-form-item>
      <a-form-item v-bind="brief ? BriefLayout: formItemLayout" label="确认密码">
        <a-input
          v-decorator="[
          'confirm',
          {
            rules: [
              {
                required: true,
                message: '请确认您的密码',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          },
        ]"
          type="password"
          @blur="handleConfirmBlur"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: brief ? 5 : 3 }">
        <a-button @click="handleSubmit">{{brief ? '完成' : '下一步'}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import sha256 from "crypto-js/sha256";

export default {
  data() {
    return {
      confirmDirty: false,
      BriefLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 }
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 }
        }
      }
    };
  },
  props: ["brief"],
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    handleSubmit() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.$http.put("/api/v1/admin/secret", values).then(() => {
            localStorage.setItem("secret", sha256(values.password).toString());
            this.$emit("success");
          });
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("密码不一致");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  font-size: 1.6em;
}
</style>