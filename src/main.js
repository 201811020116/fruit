import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

//导入富文本编辑器及其样式
import VueQuillEditor from "vue-quill-editor/src";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入全局样式表
import './assets/css/global.css'
// 导入图表样式
import './assets/icon/iconfont.css'
// axios配置
import axios from "axios";
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    console.log(config);
    config.headers.authorization = window.sessionStorage.getItem('token')
    return config
    })

// 将其注册为全局性的组件
Vue.use(VueQuillEditor)
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
