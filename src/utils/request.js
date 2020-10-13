import axios from 'axios';
import {Message} from 'element-ui'

//创建axios 赋值给service


//http://www.web-jshtml.cn/productApi
const BASEURL =  process.env.NODE_ENV === 'production'?'':'/devApi'; 

const service = axios.create({
    baseURL:BASEURL, //http://192.168.31.47:8080/devApi => http://www.web-jshtml.cn/productapi
    timeout:15000 //超时时间
   
});

// console.log(process.env.NODE_ENV);
// console.log(process.env.VUE_APP_ABC);
// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //后台需要一些什么东西（Token userId cookies 也就是在请求头加参数）
  
    //业务需求


    //最终目的 在请求头添加参数
    config.headers['Tonkey'] = '11111'

    console.log(config.headers)
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么 做业务需求
    let data = response.data;
    //对响应的状态做一下判断 
    if(data.resCode!==0){
        Message.error(data.message);
        return Promise.reject(data);
    }else{
        return response;
    }
    
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });


  export default service;