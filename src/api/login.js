import service from '@/utils/request.js'

//获取验证码
 export function GetSms(data){
   return service.request({
        method:"post",
        url:"/getSms/",
        data
    })
 }

 //注册接口
 export function Register(data){
   return service.request({
     method:"post",
     url:"/register/",
     data
   })
 }