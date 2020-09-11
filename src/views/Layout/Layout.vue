<template>
    <div id="layout" :class="[menuStatus?'close':'open']">
        <LayoutHeader></LayoutHeader>
        <LayoutMain></LayoutMain>
        <LayoutNav></LayoutNav>
        
    </div>
</template>

<script>
import LayoutHeader from './components/Header.vue';
import LayoutMain from './components/Main.vue';
import LayoutNav from './components/Nav.vue';
import { reactive, ref, isRef, toRefs, onMounted,computed} from "@vue/composition-api";

export default {
    name:"layout",
    components:{
        LayoutHeader,
        LayoutMain,
        LayoutNav
        
    },
    setup(props,{root}){
        /** 
         * 监听菜单的展开和收缩 决定往里面推 还是往外面展开
        */
       const menuStatus = computed(()=>root.$store.state.isCollapse);
      
       return {
           menuStatus
       }
    }
}
</script>

<style lang="scss" scoped>
#layout{

}
</style>
