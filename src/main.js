import Vue from 'vue'
import App from './App.vue'
import { Button, message, Tree, Row, Col, Layout, Modal, Icon, Spin, Card, Menu, Statistic, Dropdown, Tabs, Input, InputNumber, Progress, Form, Steps, Radio } from 'ant-design-vue';
import router from './router'
import store from './store'
import consts from "@/consts.js"
import axios from 'axios'
import VueAxios from 'vue-axios'

import 'ant-design-vue/dist/antd.less'

Vue.config.productionTip = false

axios.interceptors.request.use(function (config) {
  config.url = consts.API_BASE + config.url

  if (localStorage.getItem("secret")) {
    config.headers.Token = localStorage.getItem("secret")
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

Vue.use(Button)
Vue.use(Tree)
Vue.use(Row)
Vue.use(Col)
Vue.use(Layout)
Vue.use(Modal)
Vue.use(Icon)
Vue.use(Spin)
Vue.use(Card)
Vue.use(Menu)
Vue.use(Statistic)
Vue.use(Dropdown)
Vue.use(Tabs)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Progress)
Vue.use(Form)
Vue.use(Steps)
Vue.use(Radio)
Vue.use(VueAxios, axios)
Vue.prototype.$message = message;
Vue.prototype.$success = Modal.success;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
