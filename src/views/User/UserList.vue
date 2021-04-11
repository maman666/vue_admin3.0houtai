<template>
    <div>
        <el-row>
            <el-col :span="20">
                <div class="label-wrap">
                    <label>关键字：</label>
                    <div class="warp-content">
                        <el-row :gutter="16">
                            <el-col :span="3">
                                <SeleCtVue :config="data.configOption"></SeleCtVue>
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
//引入组件
import SeleCtVue from "@/components/Select";
export default {
  name: "userList",
  //注册组件
  components: { SeleCtVue },
  setup(props, { root }) {
    const data = reactive({
        // 配置的东西一般用对象 扩展性强
        // configOption:{
        //     init:["name","phone","email"]
        // },
        configOption:["name","phone","email"]
    });
    return {
      data
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";

.label-wrap {
  @include labelDom(left, 100%, 40);
}
</style>


