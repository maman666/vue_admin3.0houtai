<template>
  <div id="nav-wrap">
    <svg-icon  iconClass="Vue" className="Vue"></svg-icon>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <!-- template作为一个模板标签来渲染 遇到v-for v-if在一起的时候 注意key写在实际渲染的标签里 -->
      <template v-for="(item,index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index+''">
          <!-- 一级菜单 -->
          <template slot="title">
             <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"></svg-icon>
            <span slot="title">{{item.meta.name}}</span>
          </template>
          <!-- 子级菜单 -->
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.id"
            :index="subItem.path"
          >{{subItem.meta.name}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
   
  </div>
</template>

<script>
import "../../../styles/config.scss";
import { reactive, ref, isRef, toRefs, onMounted,computed } from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, { root }) {
    /**
     * data数据
     */
    //控制导航的展开和收缩
    // const isCollapse = ref(false);
    //拿到路由的配置
    const routers = reactive(root.$router.options.routes);
    // console.log(routers);
    /** 
     * computed监听
    */
   //菜单栏展开和收缩
   const isCollapse = computed(()=>{
     return root.$store.state.app.isCollapse
   })
    /***
     * 函数
     */
   
    return {
      isCollapse,
      routers
    };
  }
};
</script>

<style lang="scss" scoped>
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  // width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  @include webkit(transition,all .3s ease 0s);
  svg{
    font-size: 20px;
    margin-right: 10px;
  }
  .svg-icon.info{
    fill:currentColor;
    color: #fff ;
    font-size: 20px;
  }
  .svg-icon.Vue{
    font-size: 92px;
    text-align: center;
    margin: 28px 0 25px 68px;
    @include webkit(transition,all .3s ease 0s);
  }
}
.open{
  #nav-wrap{width:$navMenu;}
}
.close{
    #nav-wrap{width:64px;}
    #nav-wrap .svg-icon.Vue{
      font-size:50px;
      margin:25px 10px 25px 5px;
    }
}
.el-menu-vertical-demo.el-menu{
  border-right: none;
}
</style>
