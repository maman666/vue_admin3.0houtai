
//vuex 结合 HTML5本地储存(优势：参数不显示，劣势：微稍有点大材小用（解决第二种传参参数丢失）
/**
 * 采用密文传播 第一次是有的 刷新再次触发SET_ID SET_TITLE 就没有了
 * 解决办法
 *      html5:本地存储办法 (字符串存储方法)
 *      动态路由：:号形式 缺点：需要配置
 */

const state = {
    id:"" || sessionStorage.getItem('infoId'),
    title:"" || sessionStorage.getItem('infoTitle')
}

const getters = {
    infoId: state => state.id,
    infoTitle:state => state.title
}

const mutations = {
    //以对象的形式传过来（高级的写法）
    UPDATE_STATE_VALUE(state,params){
        for(let key in params){
            state[key] = params[key].value
            //是否存储session
            if(params[key].session){
                sessionStorage.setItem(params[key].sessionKey,params[key].value)
            }
        }
    },
    SET_ID(state,value){
        state.id = value
        console.log(state.id )
        sessionStorage.setItem('infoId',value)
    },
    SET_TITLE(state,value){
        state.title = value
        console.log(state.title )
        sessionStorage.setItem('infoTitle',value)
    }
}

const actions = {

}

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}