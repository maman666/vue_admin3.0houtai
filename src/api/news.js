import service from '@/utils/request.js'

//获取列表信息
export function GetList(data){
   return service.request({
        method:"post",
        url:"/news/getList/",
        data
    })
 }
//新增信息
export function AddInfo(data){
   return service.request({
        method:"post",
        url:"/news/add/",
        data
    })
 }
//添加一级分类
 export function AddFirstCategory(data){
   return service.request({
        method:"post",
        url:"/news/addFirstCategory/",
        data
    })
 }

 //获取分类的接口
 export function GetCategory(data){
    return service.request({
         method:"post",
         url:"/news/getCategory/",
         data
     })
  }

  //删除分类的接口
 export function DeleteCategory(data){
   return service.request({
        method:"post",
        url:"/news/deleteCategory/",
        data
    })
 }

 //修改分类的接口
 export function EditCategory(data){
   return service.request({
        method:"post",
        url:"/news/editCategory/",
        data
    })
 }