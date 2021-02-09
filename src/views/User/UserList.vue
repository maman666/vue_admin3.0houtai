<template>
    <div>
        <el-row>
            <el-col :span="20">
                <div class="label-wrap">
                    <label>关键字：</label>
                    <div class="warp-content">
                        <el-row :gutter="16">
                            <el-col :span="3">
                                <el-select v-model="data.selectValue" placeholder="请选择">
                                    <el-option v-for="item in data.option" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <el-input placeholder="请输入搜索关键字"></el-input>
                            </el-col>
                            <el-col :span="13">
                                <el-button type="danger">搜索</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
            <el-col :span="4">
                <el-button type="danger" class="pull-right">添加用户</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
export default {
   name:"userList",
   setup(props,{root}){
       const data = reactive({
           selectValue:"name",//这里输入value值 显示对应的label
           option:[
               {value:"name",label:"姓名"},
               {value:"phone",label:"手机号"},
               {value:"email",label:"邮箱"}
            ],
            
       })
       return {
           data
       }
      
   } 

}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";

.label-wrap {
  @include labelDom(left, 100%, 40);
}
</style>


