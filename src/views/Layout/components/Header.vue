<template>
    <div id="header-wrap"></div>
</template>

<script>
import '../../../styles/config.scss';
export default {
    
}
</script>

<style lang="scss" scoped>
#header-wrap{
    position: fixed;
    top: 0;
    right: 0;
    left: $navMenu;
    height: 75px;
    background-color:#fff;
    box-shadow:0 3px 16px 0 rgba(0,0,0,.1);
    -webkit-box-shadow:0 3px 16px 0 rgba(0,0,0,.1);
}
</style>
