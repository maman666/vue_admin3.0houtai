<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({type:'category_first_add'})">添加一级分类</el-button>
    <hr class="hr-e9e9e9">
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-warp">
            <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
              <!-- 一级分类 -->
              <h4>
                <svg-icon iconClass="jia" class="jia"></svg-icon>
                {{firstItem.category_name}}
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="editCategory({data:firstItem,type:'category_first_edit'})"
                  >编辑</el-button>
                  <el-button size="mini" type="success" round @click="handleAddChildren({data:firstItem,type:'category_children_add'})">添加子级</el-button>
                  <el-button size="mini" round @click="deleteCategoryConfirm({type:1,deleteCategoryId:firstItem.id})">删除</el-button>
                </div>
              </h4>
              <!-- 子极分类 -->
              <ul v-if="firstItem.children">
                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                  {{childrenItem.category_name}}
                  <div class="button-group">
                    <el-button size="mini" type="danger" round>编辑</el-button>
                    <el-button size="mini" round @click="deleteCategoryConfirm({type:2,deleteCategoryId:childrenItem.id})">删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16" style="width:64%;">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form :label-position="labelPosition" label-width="142px" class="form-wrap">
            <el-form-item label="一级分类名称：" v-if="category_first_input">
              <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称：" v-if="category_children_input">
              <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_button_loading"
                :disabled="category_button_disabled"
              >确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import {
  AddFirstCategory,
  GetCategory,
  DeleteCategory,
  EditCategory,
  AddChildrenCategory
} from "@/api/news";
import { global } from "@/utils/global_V3.0";
import { common } from "@/api/common";
export default {
  name: "infoCategory",
  setup(props, { root }) {
    //global 弹框提醒 vue3.0写法
    const { confirm } = global();
    //获取分类接口全局组件引入
    const {getInfoCategory,categoryItem,getInfoCategoryAll} = common();
    /**
     * reactive
     */
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    //注意：请求回来的数据在reactive最外层用对象表示
    const category = reactive({
      item: [],
      current: []
    });
    /**
     * ref
     */
    //来判断确定按钮是属于哪种类型
    const submit_button_type = ref("");
    const labelPosition = ref("center");
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    const submit_button_loading = ref(false);
    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const category_button_disabled = ref(true);
    const deleteId = ref("");

    /**
     * methods vue2.0
     */
    const submit = () => {
      //判断的类型为添加一级分类添加
      if (submit_button_type.value == "category_first_add") {
        addFirstCategory();
      }
      //判断的类型为添加一级分类编辑
      if (submit_button_type.value == "category_first_edit") {
        editFirstCategory();
      }
      //判断的类型为二级分类添加
      if (submit_button_type.value == "category_children_add") {
        addChildrenCategory();
      }
    };
    //添加一级分类的方法封装
    const addFirstCategory = () => {
      if (!form.categoryName) {
        root.$message({
          message: "分类名称不能为空",
          type: "error"
        });
        return false;
      }
      submit_button_loading.value = true;
      //添加一级分类api
      AddFirstCategory({ categoryName: form.categoryName })
        .then(response => {
          let data = response.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success"
            });
            /**
             * 1.调请求信息分类api（浪费资源）
             * 2.直接数组办法push，请求后返回的数据
             */
            category.item.push(data.data);
            submit_button_loading.value = false;
            form.categoryName = "";
          }
        })
        .catch(error => {
          submit_button_loading.value = false;
          form.categoryName = "";
        });
    };
    
    //添加一级分类
    const addFirst = params => {
      //按钮的类型区别
      submit_button_type.value = params.type;
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      category_button_disabled.value = false;
    };
    //添加二级分类的方法封装
    const addChildrenCategory = ()=>{
      if(!form.secCategoryName){
        root.$message({
          message:'子级分类名称不能为空！！',
          type:'error'
        })
        return false;
      }
      let resquestData = {
        categoryName:form.secCategoryName,
        parentId:category.current.id
      }
      AddChildrenCategory(resquestData).then(response=>{
        let resquestData = response.data;
        root.$message({
          message:resquestData.message,
          type:'success'
        })
        //调用获取信息分类接口（包含子级）
        getInfoCategoryAll();
        // 清空输入框
        form.secCategoryName = '';
      }).catch(error=>{
        console.log(error)
      })
    }
    //添加子级
    const handleAddChildren = (params)=>{
      //按钮的类型区别
      submit_button_type.value = params.type;
      //二级输入框打开
      category_children_disabled.value = false;
      //确定按钮打开
      category_button_disabled.value = false;
      //二级输入框显示
      category_children_input.value = true;
      //一级输入框禁用
      category_first_disabled.value = true;
      //存储数据
      category.current = params.data;
      console.log(category.current)
      //显示一级分类文本
      form.categoryName = category.current.category_name;
    }
    //获取分类信息
    // const getCategory = () => {
    //   GetCategory({})
    //     .then(response => {
    //       let data = response.data.data.data;
    //       category.item = data;
    //     })
    //     .catch(error => {});
    // };
    //封装删除弹框 3.0封装
    const deleteCategoryConfirm = params => {
      deleteId.value = params.deleteCategoryId;
      confirm({
        content: "确认删除此信息，删除后无法恢复！！",
        tip: "警告",
        fn: deleteCategory,
        catchFn: () => {
          deleteId.value = "";
        },
        //点击传过来的本身id
        id: params.deleteCategoryId,
        //判断删除的类型是父级还是子级
        categoryType:params.type
      });
    };
    // 删除
    const deleteCategory = params => {
      // console.log('categoryId:',categoryId)
      let categoryID = params.id;
      let parentId = params.parentId;
      //删除接口
      DeleteCategory({ categoryId: categoryID })
        .then(response => {
         if(params.categoryType===1){
            // 1.es6 findIndex办法找到数组对应的索引
            let categoryIndex = category.item.findIndex(
              item => item.id == categoryID
            );
            //采用数组的splice办法删除数据 splice('起始的位置','删除的条数','插入或者替换')
            category.item.splice(categoryIndex, 1);
         }
         if(params.categoryType===2){
           //直接调接口
           getInfoCategoryAll();
          
         }
          //2.数组过率的办法 选中id不相等的其他记录条数 在重新赋值
          // let newData = category.item.filter(item=>item.id!=categoryID)
          // category.item = newData;
        })
        .catch(error => {});
    };
    // 编辑
    const editCategory = params => {
      //按钮的类型区别
      submit_button_type.value = params.type;
      category_children_input.value = false;
      category_first_disabled.value = false;
      category_button_disabled.value = false;
      //点击编辑一级类名，显示一级类名的名称
      form.categoryName = params.data.category_name;
      //点击编辑把类名和id存进current数组里面
      category.current = params.data;
    };
    const editFirstCategory = () => {
      if(category.current.length==0){
        root.$message({
          message:'未选择分类！！',
          type:'error'
        })
        return;
      }
      let requestData = {
        id: category.current.id,
        categoryName: form.categoryName
      };
      EditCategory(requestData)
        .then(response => {
          root.$message({
            message: response.data.message,
            type: "success"
          });
          // //1.过滤的办法找到要修改的数据 数组
          // let editData = category.item.filter(item => item.id == category.current.id);
          // //对编辑的修改的这条数据重新赋值
          // editData[0].category_name = response.data.data.data.categoryName;
          // 2.直接拿到value值，直接重新赋值
          category.current.category_name = response.data.data.data.categoryName;
          //清空输入框名称
          form.categoryName = '';
          category.current = [];
        })
        .catch(error => {});
    };
    /**
     * vue3.0 生命周期
     * onMounted 挂载完成后执行
     */
    //监听一级分类接口
    watch(()=>categoryItem.item,(value)=>{
        console.log(value)
        category.item = value;
    })
    onMounted(() => {
      //获取一级分类接口
      // getCategory();
      //获取封装后全局组件一级信息分类（没有包含子级）
      // getInfoCategory();
      //获取封装后全局组件一级信息分类(包含子级)
      getInfoCategoryAll()
    });
    return {
      //reactive
      form,
      category,
      //ref
      labelPosition,
      category_first_input,
      category_children_input,
      submit_button_loading,
      category_first_disabled,
      category_children_disabled,
      category_button_disabled,
      //methods
      submit,
      addFirst,
      deleteCategoryConfirm,
      editCategory,
      handleAddChildren,
      addChildrenCategory
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-warp {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
}
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    border-left: 1px dotted #000;
  }
  h4 {
    padding-left: 40px;
    position: relative;
    font-weight: 500;
    font-size: 16px;
    svg {
      position: absolute;
      left: 14px;
      top: 14px;
      background: #fff;
      color: #000;
      font-size: 16px;
    }
  }
  li {
    position: relative;
    margin-left: 23px;
    padding-left: 38px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 22px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  z-index: 2;
  right: 11px;
  top: -1px;
  button {
    font-size: 12px;
  }
}
.form-wrap {
  width: 410px;
  padding-top: 26px;
}
// calc css计算属性通过 加后 margin拉回来（要空格隔开）hr把边框设置为none 重新设置边框
.hr-e9e9e9 {
  width: calc(100% + 30px);
  margin: 30px 0 30px -30px;
  border: none;
  border-bottom: 1px solid #e9e9e9;
}
</style>


