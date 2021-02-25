import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storege'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    user:getItem(USER_KEY)
    // user:JSON.parse(window.localStorage.getItem('user')) //  当前登录用户登录状态token等数据
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，还需要把数据放到本地存储
      // window.localStorage.setItem('user',JSON.stringify(state.user))
      setItem(USER_KEY, state.user)
      
    }
  },
  actions: {
  },
  modules: {
  }
})
