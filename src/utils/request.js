/**
 *  请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '@/store'

const request = axios.create({
  baseURL:'http://ttapi.research.itcast.cn', // 基础路径
  transformResponse:[function (data) {
    try{
      return JSONbig.parse(data)
    } catch(err){
      return data
    }
  }]
})



// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const { user } = store.state
  //如果用户已登录，统一给接口设置token信息
  if(user){
    config.headers.Authorization = `Bearer ${user.token}`
  } 
  // console.log(config)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})


// 导出
export default request