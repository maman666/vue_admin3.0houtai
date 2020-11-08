
import router from './index';
import {getToken,removeToken,removeUsername} from '@/utils/app.js';
import store from '../store/index';

//声明白名单 来判断避免 next('参数') 造成死循环
const whiteRouter = ['/login'];//indexOf方法，判断数组是否存在某个对象，不存在返回-1

//路由守卫
router.beforeEach((to,from,next)=>{
    if(getToken()){
        if(to.path==='/login'){
            //输入网址为login 把token username清除掉
            removeToken();
            removeUsername();
            //把vuex state数据清除
            store.commit('app/SET_TOKEN','');
            store.commit('app/SET_USERNAME','');
            next();
        }else{
            //获取用户的角色
            //动态路由分配的权限
            next();
        }
        
        /** 
         * 1. to -> /console (重定向)
         * 2.to-> /consolemain 
        */

    }else{
        if(whiteRouter.indexOf(to.path) !== -1){
            next(); //to 不带参数指向to 不带参数的情况下不会触发beforeEach 最后还是会走这里
        }else{
            next('/login');//带参数就会触发beforeEach 路由守卫
        }
    }
    // console.log('to:',to)//进入的页面（进入到当前的页面）
    // console.log('from:',from) //上一个页面（来自哪里）
    // console.log('next:',next)
    // next(); //参数为空的话 调用to指令往下面跑
  })