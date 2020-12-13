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
 //删除信息
 export function DeleteInfo(data){
   return service.request({
        method:"post",
        url:"/news/deleteInfo/",
        data
    })
 }
 //编辑信息
 export function EditInfo(data){
   return service.request({
        method:"post",
        url:"/news/editInfo/",
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

 //添加子级分类
 export function AddChildrenCategory(data){
   return service.request({
        method:"post",
        url:"/news/addChildrenCategory/",
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

  //获取全部分类（包含子级）
 export function GetCategoryAll(data){
   return service.request({
        method:"post",
        url:"/news/getCategoryAll/",
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