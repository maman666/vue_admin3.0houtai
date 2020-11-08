<template>
  <div>
    <el-dialog
      title="新增"
      :visible.sync="dialog_info_flag"
      @close="close"
      :modal="false"
      width="580px"
      @opened="openDialog"
    >
      <el-form :model="form">
        <el-form-item label="类别:" :label-width="formLabelWidth">
          <el-select v-model="form.category" placeholder="请选择活动区域">
            <el-option
              v-for="item in categoryOption.item"
              :label="item.category_name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题:" :label-width="formLabelWidth">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="概况:" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.content" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="danger" :loading="submitLoading" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AddInfo } from "@/api/news";
import { reactive, ref, watch } from "@vue/composition-api";
export default {
  name: "dialogInfo",
  //父级->子级 单项数据流(父级->子级) 不能做反向修改(子级->父级)
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },

  // 2.0watch写法
  watch: {
    flag: {
      handler(newValue, oldValue) {
        // newValue从父组件传递到子组件新的值
        console.log("newValue:", newValue);
        this.dialog_info_flag = newValue;
      }
    }
  },
  setup(props, { root, emit,refs}) {
    /** 
     * ref
    */
    const dialog_info_flag = ref(false);
    const formLabelWidth = ref("70px");
    const submitLoading = ref(false);
    /** 
     * reactive
    */
    const form = reactive({
      category: "",
      title: "",
      content: ""
    });
    const categoryOption = reactive({
      item: []
    });
    //watch 3.0写法
    // watch(()=>{
    //     // console.log('flag:',props.flag)
    //     dialog_info_flag.value = props.flag
    // })
    //加载顺序的问题,应该等数据加载进来在弹出这个弹框
    // console.log(props.category);//没有数据
    //vue2.0 methods
    const close = () => {
      dialog_info_flag.value = false;
      // this.$emit('update:flag',false) //修饰器改变父组件属性的值,不需要做逻辑性的东西
      emit("close", false); //回调的办法去触发父组件的事件,需要做逻辑性的东西
      //点击取消清空表单
      resetForm();
    };
    //打开弹窗后执行的办法
    const openDialog = () => {
      console.log("props:", props.category);
      categoryOption.item = props.category;
    };
    //清空表单内容
    const resetForm = ()=>{
      form.category = '';
      form.title = '';
      form.content = '';
    }
    //点击确定调用的方法
    const submit = () => {
      // let date = new Date().getTime();
      let requestData = {
        categoryId: form.category,
        title: form.title,
        content: form.content,
        // imgUrl:'',
        // createDate:date,
        // status:''
      };
      //做一下参数的判断不能为空
      if(!form.category || !form.title || !form.content){
        root.$message({
          message:'分类,标题或者内容不能为空!!',
          type:'error'
        })
        return;
      }
      
      submitLoading.value = true;
      AddInfo(requestData).then(response=>{
        let data = response.data;
        root.$message({
          message:data.message,
          type:'success'
        })
        submitLoading.value = false;
        //重置表单
        resetForm();
      }).catch(error=>{
        console.log(error);
        submitLoading.value = false;
      })
    };
    return {
      //ref
      dialog_info_flag,
      formLabelWidth,
      submitLoading,
      //reactive
      form,
      categoryOption,
      //methods
      close,
      openDialog,
      submit
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
