<template>
  <div id="nav-wrap">
    <svg-icon iconClass="Vue" className="Vue"></svg-icon>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
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
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, { root }) {
    /**
     * data数据
     */
    //控制导航的展开和收缩
    const isCollapse = ref(false);
    //拿到路由的配置
    const routers = reactive(root.$router.options.routes);
    console.log(routers);
    /***
     * 函数
     */
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    return {
      isCollapse,
      handleOpen,
      handleClose,
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
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
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
  }
}
.el-menu-vertical-demo.el-menu{
  border-right: none;
}
</style>
