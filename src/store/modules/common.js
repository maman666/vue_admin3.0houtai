
import { GetCategory } from "@/api/news";
const state = {
    qiniuUrl : 'http://qmcwn2x0a.hn-bkt.clouddn.com/' //七牛云储存图片前缀地址(一个月失效)
}
const getters = {
    qiniuUrl : state => state.qiniuUrl
}
const actions = {
    getCategoryInfo(content,requestData){
        return new Promise((resolve,reject)=>{
            return GetCategory({}).then(response=>{
                // console.log(response);
                resolve(response)
            }).catch(error=>{
                console.log(error);
                reject(error)
            })
        })
    }
}

export default {
    namespaced:true,
    state,
    getters,
    actions
};