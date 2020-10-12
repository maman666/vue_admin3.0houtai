

import {Login} from '@/api/login';
import {setToken,setUsername,getUsername,removeToken,removeUsername} from '@/utils/app';

//模块化 使用命名空间写法 避免命名冲突
// state数据刚开始要从本地存储或者cookie里面拿 不能刚开始显示不出来
const state = {
    isCollapse:JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    to_ken:'',
    username: getUsername() || ''
}

const getters = {
   isCollapse: state=>state.isCollapse,
   username:state=>state.username
}

const mutations = {//没有回调的处理事件
    SET_COLLAPSE(state,data){
         state.isCollapse = !state.isCollapse;
      // console.log(state.isCollapse)
      //当isCollapse的状态改变 用本地存储把他存起来
      sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse));
      //使用cookie_js存储
      // Cookie.set('isCollapse',JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state,value){
        state.to_ken = value
    },
    SET_USERNAME(state,value){
        state.username = value
    }
}

const actions = {//可以回调处理事件

    //可以进行异步操作 请求接口
    //登录接口
    login({commit},requestData){
      return new Promise((resolve,reject)=>{
        Login(requestData).then(response=>{
            // console.log('content:',content);
            /** content 参数 用来存储token username
             * dispatch: ƒ (_type, _payload, _options)
                commit: ƒ (_type, _payload, _options)
                getters: {}
                state: {__ob__: Observer}
                rootGetters: {}
                rootState: {__ob__: Observer}
                __proto__: Object
             * 
            */
           //请求成功做些事情 存储token username
           let data = response.data.data;
        //    console.log('data:',data)
        //    content.commit('SET_TOKEN',data.token);
        //    content.commit('SET_USERNAME',data.username);
           //解构
           commit('SET_TOKEN',data.token);
           commit('SET_USERNAME',data.username);
           setToken(data.token);
           setUsername(data.username);
          resolve(response)
        }).catch(error=>{
          reject(error);
        })
      })
    },
    //退出接口
    exit({commit}){
        return new Promise((resolve,reject)=>{
            removeToken();
            removeUsername();
            commit('SET_TOKEN','');
            commit('SET_USERNAME','');
            resolve();
        })
    }

}

export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}

//模块化常规写法

// const app ={
//   state: {
//     isCollapse:JSON.parse(sessionStorage.getItem('isCollapse')) || false
//   },
//   mutations: { //没有回调的处理事件
//     SET_COLLAPSE(state,data){
//          state.isCollapse = !state.isCollapse;
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
//  }

// export default app;

