import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);
//引入布局组件
import Layout from '@/views/Layout/Layout.vue'

const routes = [
  {
    path: "/",
    redirect: "login",
    hidden:true,
    meta:{
      name:"主页"
    }
  },
  {
    path:"/login",
    name:"Login",
    hidden:true,
    meta:{
      name:"登录"
    },
    component:()=>import("../views/login/Login3.0.vue")
  },
  /** 
   * 控制台
  */
  {
    path:"/console",
    name:"Console",
    redirect:'consolemain', //路由重定向
    meta:{
      name:"控制台"
    },
    component:Layout,
    //二级路由 看看他显示在哪个区域 <router-view></router-view>
    children:[
      {
        path:"/consolemain",
        name:"ConsoleMain",
        meta:{
          name:"首页"
        },
        component:()=>import("../views/Console/ConsoleMain.vue") //局部区域显示的内容
      }
    ]
  },
  /**
   * 信息管理
   */
  {
    path:"/info",
    name:"Info",
    meta:{
      name:"信息管理"
    },
    component:Layout,
    //二级路由 看看他显示在哪个区域 <router-view></router-view>
    children:[
      {
        path:"/infoList",
        name:"InfoList",
        meta:{
          name:"信息列表"
        },
        component:()=>import("../views/Info/InfoList.vue") //局部区域显示的内容
      },
      {
        path:"/infoCategory",
        name:"InfoCategory",
        meta:{
          name:"信息分类"
        },
        component:()=>import("../views/Info/InfoCategory.vue") //局部区域显示的内容
      }
    ]
  },

  /**
   * 用户管理
   */
  {
    path:"/user",
    name:"User",
    meta:{
      name:"用户管理"
    },
    component:Layout,
    //二级路由 看看他显示在哪个区域 <router-view></router-view>
    children:[
      {
        path:"/userList",
        name:"UserList",
        meta:{
          name:"用户列表"
        },
        component:()=>import("../views/User/UserList.vue") //局部区域显示的内容
      }
      
    ]
  }
  
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  routes
});

export default router;
