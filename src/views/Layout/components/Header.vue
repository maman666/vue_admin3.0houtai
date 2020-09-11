<template>
  <div id="header-wrap">
    <div class="pull-left header-icon">
      <!-- 在edge内核中只有点击svg边缘部分才会触发click事件 为svg图标外面包裹一层元素 -->
      <a href="javascript:;" @click="navMenuState"><svg-icon iconClass="menu" class="menu" ></svg-icon></a>
    </div>
    <div class="pull-right header-icon">
      <div class="user-info pull-left">管理员</div>
      <svg-icon iconClass="exit" class="exit"></svg-icon>
    </div>
  </div>
</template>

<script>
import "../../../styles/config.scss";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
export default {
  name:"headerNav",
  setup(props,{root}){
    const navMenuState = ()=>{
      root.$store.commit('SET_COLLAPSE');
    }
    return {
      navMenuState
    }
  }
};
</script>

<style lang="scss" scoped>
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  // left: $navMenu;
  height: 75px;
  background-color: #fff;
  line-height: 75px;
  // box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  // -webkit-box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  @include webkit(box-shadow,0 3px 16px 0 rgba(0, 0, 0, 0.1));
  .pull-left {
    float: left;
  }
  .pull-right {
    float: right;
  }
}
.open{
  #header-wrap{left:$navMenu;}
}
.close{
  #header-wrap{left:64px;}
}
.header-icon {
  padding: 0 32px;
  svg {
    fill: currentColor;
    color: #000;
    font-size: 25px;
    margin-bottom: -8px;
    cursor: pointer;
  }
}
.pull-right.header-icon {
  padding: 0;
  .user-info.pull-left{
      font-size: 14px;
  }
  .svg-icon.exit {
    padding: 0 32px;
  }
}

.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
}
</style>
