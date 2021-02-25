import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 自动设置REM基准值(html标签字体大小)
import 'amfe-flexible'

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

// 加载全局样式
import './styles/index.less'
//dayjs组件处理相对时间
import './utils/dayjs'



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
