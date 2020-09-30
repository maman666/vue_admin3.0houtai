

//模块化 使用命名空间写法 避免命名冲突

const state = {
    isCollapse:JSON.parse(sessionStorage.getItem('isCollapse')) || false
}

const getters = {
   isCollapse: state=>state.isCollapse
}

const mutations = {//没有回调的处理事件
    SET_COLLAPSE(state,data){
         state.isCollapse = !state.isCollapse;
      // console.log(state.isCollapse)
      //当isCollapse的状态改变 用本地存储把他存起来
      sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse));
      //使用cookie_js存储
      // Cookie.set('isCollapse',JSON.stringify(state.isCollapse));
    }
}

const actions = {//可以回调处理事件

    //可以进行异步操作 请求接口
    //登录接口
    // login(content,requestData){
    //   return new Promise((resolve,reject)=>{
    //     Login(requestData).then(response=>{
    //       resolve(response)
    //     }).catch(error=>{
    //       reject(error);
    //     })
    //   })
    // }

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

