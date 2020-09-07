<template>

  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import { reactive, ref, isRef, toRefs, onMounted, computed } from "@vue/composition-api";
export default {
  name: "svgIcon",
  props:{
      iconClass:{
          type:String,
          default:'',
          
      },
      className:{
          type:String,
          default:''
      }
  },
  setup(props, { root }) {
      console.log(props.iconClass)
      console.log(props.className)
      //计算属性 得出最终结果 返回出去
      const iconName = computed(()=>`#icon-${props.iconClass}`);
      const svgClass = computed(()=>{
        if(props.className){
          return `svg-icon ${props.className}`
        }else{
          return `svg-icon`
        }
      })
    return {
      iconName,
      svgClass
    };
  }
};
</script>

<style lang="scss" scoped>
.svg-icon{
  width: 1em;
  height: 1em;
  fill:currentColor;//svg加上这个样式color输入才会生效
  color: #fff;
  // &.font12{
  //   font-size: 12px;//在class .svg-icon 加上font12 font12这条样式就生效
  // }
  // &.font20{
  //   font-size: 20px;//在class .svg-icon 加上font20 font20这条样式就生效
  // }
}
</style>
