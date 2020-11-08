
import { GetCategory } from "@/api/news";
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
    actions
};