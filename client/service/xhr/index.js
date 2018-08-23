// axios兼容
import axios from 'axios'
import {Config} from '../../config'

// 两种处理服务端渲染的方式，目前采用第二种，开发环境客户端要做代理，处理跨域问题
// 服务端直接调用node端的请求
// axios兼容，node端可以请求
export default (type, url, param = {}) => {
  return new Promise((resolve, reject) => {
    axios.create({
      baseURL: Config.baseURL
    })[type]('/home/list', param).then(res => {
      let response = res.data
      if (+response.code === 0) {
        resolve(response.data)
      } else {
        // toast提示 todo
        // reject()
      }
    }).catch(err => {
      console.log(err)
    })
  })
}
