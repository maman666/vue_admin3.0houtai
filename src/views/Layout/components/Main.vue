<template>
    <div id="main-wrap">
        <div class="main-content">
            <div class="content"><router-view></router-view></div>
        </div>
        
    </div>
</template>

<script>
import '../../../styles/config.scss';
export default {
    
}
</script>

<style lang="scss" scoped>
#main-wrap{
    height: 100vh;
    position: fixed;
    top: 75px;
    // left: $navMenu;
    right: 0;
    bottom: 0;
    border: 30px solid #f7f7f7;
    border-bottom: none;
    // box-sizing:border-box;
    // -webkit-box-sizing: border-box;
    @include webkit(box-sizing, border-box);
}
.open{
  #main-wrap{left:$navMenu;}
}
.close{
  #main-wrap{left:64px;}
}
.main-content{
    width: 100%;
    height:100%;
    // padding-top:105px;
    // padding-left: 280px;
    // box-sizing:border-box;
    // -webkit-box-sizing: border-box
}
.content{
     width: 100%;
     height:100%;
    padding-top:30px;
    padding-left:30px;
    box-sizing:border-box;
    -webkit-box-sizing: border-box;
    background-color: #fff;
}
</style>
