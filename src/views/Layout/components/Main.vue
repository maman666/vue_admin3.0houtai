<template>
    <div id="main-wrap">
        main
        <router-view></router-view>
    </div>
</template>

<script>
import '../../../styles/config.scss';
export default {
    
}
</script>

<style lang="scss" scoped>
#main-wrap{
    position: fixed;
    top: 75px;
    left: $navMenu;
    right: 0;
    bottom: 0;
    border: 30px solid #f7f7f7;
    border-bottom: none;
    box-sizing:border-box;
    -webkit-box-sizing: border-box;
}
</style>
