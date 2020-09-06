<template>
<div>{{msg}}</div>
  <!-- <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="name"></use>
  </svg> -->
</template>

<script>
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
export default {
  name: "svgIcon",
  props:{
      iconClass:{
          type:String,
          default:'',
          required:true,
          validator:(value)=>{
             return value>100
          }
      },
      className:{
          type:String,
          default:''
      }
  },
  setup(props, { root }) {
      console.log(props.iconClass)
      console.log(props.className)
    const msg = ref("maman666");
    return {
      msg
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
