/**
 * axios 二次封装
 * 
 * 全局配置
 * 
 * 响应拦截
 * 
 * request 请求的方法
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
    // 设置的基础路径(根路径)，每次发送请求只需要写根路径后面的路径即可，会自动添加根路径
    baseURL: '/user',
    timeout: 5000,
})
 
// 添加请求拦截器
// service.interceptors.request.use(
//     function (config) {
//         // 往header头自动添加token
//         const token = getToken()
//         if (token) {
//             config.headers['token'] = token
//         }
 
//         return config
//     },
//     function (error) {
//         // 对请求错误做些什么
//         return Promise.reject(error)
//     }
// )
 
// 添加响应拦截器
service.interceptors.response.use(
   res=>{
      const {code,data,msg} = res.data 
      if(code ===200) {
        //请求成功
        ElMessage.success(msg)
        return data
      } else if (code===400){
        ElMessage.error(msg)
      }

   })
//request 方法
function request(option){
    option.method = option.method || 'get'
    if (option.method.toLowerCase() === 'get') { //如果为get请求方法，需要将data转化为params;toLowerCase()将字符串中的所有大写字符转换为小写字符。这个方法会返回一个新的字符串，原字符串不会被改变
        //统一一下，属性为data
        option.params = option.data
    }
    return service(option)//返回一个Promise对象
}

['get', 'post', 'put', 'delete'].forEach(item=>{

    request[item]=(url,data,option)=>{
        return request({
            url,
            data,
            method:item
        })
    }
})

 
export default request