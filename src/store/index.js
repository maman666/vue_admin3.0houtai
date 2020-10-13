import Vue from "vue";
import Vuex from "vuex";
// import Cookie from "cookie_js";
// import { Login } from "@/api/login.js";

import app from './modules/app.js';
import login from './modules/login.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    app,
    login
  },
});



//原本index.js

// export default new Vuex.Store({

//   state: {
//     isCollapse:JSON.parse(sessionStorage.getItem('isCollapse')) || false
//   },
//   mutations: { //没有回调的处理事件
//     SET_COLLAPSE(state){
//       state.isCollapse = !state.isCollapse;
//       // console.log(state.isCollapse)
//       //当isCollapse的状态改变 用本地存储把他存起来
//       sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse));
//       //使用cookie_js存储
//       // Cookie.set('isCollapse',JSON.stringify(state.isCollapse));
//     }
//   },
//   actions: {//可以回调处理事件
//     //可以进行异步操作 请求接口
//     //登录接口
//     // login(content,requestData){
//     //   return new Promise((resolve,reject)=>{
//     //     Login(requestData).then(response=>{
//     //       resolve(response)
//     //     }).catch(error=>{
//     //       reject(error);
//     //     })
//     //   })
//     // }
//   },
//   modules: {}
// });
