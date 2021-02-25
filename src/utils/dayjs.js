/**
 * 初始化dayjs相关配置
 */
import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

//配置使用处理相对时间
dayjs.extend(relativeTime)
//配置中文语言包
dayjs.locale('zh-cn')

//把处理相对时间代码封装为全局过滤器
Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})

Vue.filter('datetime', value => {
  return dayjs(value).format('MM-DD HH:mm')
})