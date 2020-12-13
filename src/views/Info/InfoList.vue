<template>
    <div>
        <el-row :gutter="14">
            <el-col :span="4">
                <div class="label-wrap category">
                    <label for="">类别：</label>
                    <div class="wrap-content">
                        <el-select v-model="categoryValue" placeholder="请选择" style="width:100%;">
                            <!-- label绑定option里面的子项 value绑定对应的索引-->
                            <el-option
                                v-for="item in options.category"
                                :key="item.id"
                                :label="item.category_name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="label-wrap date">
                    <label for="">日期：&nbsp;&nbsp;</label>
                    <div class="wrap-content">
                        <!-- format:设置格式 value-format想要拿到值的结果 -->
                        <el-date-picker
                            style="width:100%"
                            v-model="dateValue"
                            type="datetimerange"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['12:00:00', '08:00:00']"
                        ></el-date-picker>
                    </div>
                </div>
            </el-col>
            <el-col :span="3">
                <div class="label-wrap key-work">
                    <label for="">关键字：&nbsp;&nbsp;</label>
                    <div class="wrap-content">
                        <el-select v-model="search_key" placeholder="请选择" style="width:100%;">
                            <el-option
                                v-for="item in searchOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
            </el-col>
            <el-col :span="3">
                <el-input v-model="search_keyWork" placeholder="请输入内容" style="width:100%;"></el-input>
            </el-col>
            <el-col :span="2">
                <el-button type="danger" style="width:100%;" @click="search">搜索</el-button>
            </el-col>
            <el-col :span="2" style="visibility:hidden;">&nbsp;666</el-col>
            <el-col :span="2">
                <el-button
                    type="danger"
                    class="pull-right"
                    style="width:100%;"
                    @click="dialog_info=true"
                >新增</el-button>
            </el-col>
        </el-row>
        <!-- 间距 -->
        <div class="black-space-30"></div>
        <!-- 表格 -->
        <el-table
            :data="tableData.item"
            border=""
            style="width: 100%"
            v-loading="loadingData"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="title" label="标题" width="830"></el-table-column>
            <el-table-column prop="categoryId" label="类型" width="130" :formatter="handleCategory"></el-table-column>
            <el-table-column prop="createDate" label="日期" width="237" :formatter="handleTime"></el-table-column>
            <el-table-column prop="user" label="管理员" width="115"></el-table-column>
            <el-table-column label="操作">
                <!-- table只能生成数据，如果要生成标签要放在template标签里面  从scope里面拿数据 -->
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
                    <el-button type="success" size="mini" @click="editInfo(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 间距 -->
        <div class="black-space-30"></div>
        <!-- 底部分页 -->
        <el-row>
            <el-col :span="12">
                <el-button size="medium" @click="deleteAll">批量删除</el-button>
            </el-col>
            <el-col :span="12">
                <!-- total:页面总条数 layout控制页码样貌 page-size：控制页面的条数 current-page：当前页面高亮的位置 -->
                <el-pagination
                    class="pull-right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="1"
                    background=""
                    :page-sizes="[4, 10,20, 30, 40]"
                    layout="total,sizes,prev, pager,next,jumper"
                    :total="total"
                ></el-pagination>
            </el-col>
        </el-row>
        <!-- 新增的弹窗 -->
        <!-- 修饰器去修改 -->
        <!-- <DialogInfo :flag.sync="dialog_info"></DialogInfo> -->
        <DialogInfo
            :flag="dialog_info"
            @close="closeDialog"
            @getListAddEdit="getListAddEdit"
            :category="options.category"
        ></DialogInfo>
        <!-- 编辑弹窗 -->
        <DialogEditInfo
            :flag="dialog_info_edit"
            @close="closeDialog"
            :id="infoId"
            @getListAddEdit="getListAddEdit"
            :category="options.category"
        ></DialogEditInfo>
    </div>
</template>

<script>
import { GetCategory, GetList, DeleteInfo } from "@/api/news";
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
//3.0全局弹窗方法做法（监听方便）
import { global } from "@/utils/global_V3.0";
import { formatTime } from "@/utils/common";
import { common } from "@/api/common";
export default {
  name: "infoList",
  components: {
    DialogInfo,
    DialogEditInfo
  },
  /**
   * 数据
   */
  setup(props, { root }) {
    //3.0全局组件弹窗的引入
    //str:aaa 重命名解决命名空间的问题
    const { confirm } = global();
    //   watch(()=>console.log(aaa.value));
    /**
     * ref基础数据
     */
    //获取分类接口全局组件引入
    const { getInfoCategory, categoryItem } = common();

    //新增,编辑 弹窗显示
    const dialog_info = ref(false);
    const dialog_info_edit = ref(false);
    const categoryValue = ref("");
    const dateValue = ref("");
    const search_key = ref("id");
    const search_keyWork = ref("");
    const total = ref(0);
    const loadingData = ref(false);
    const deleteInfoId = ref("");
    const infoId = ref("");
    /***
     * reactive对象数据
     */
    //reactive请求数据回来是一个对象里面包含数组
    const options = reactive({
      category: []
    });
    //页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });
    //搜索关键字
    const searchOptions = reactive([
      { value: "id", label: "ID" },
      { value: "title", label: "标题" }
    ]);

    //表格数据
    const tableData = reactive({
      item: []
    });
    /**
     * 方法
     */
    const handleSizeChange = val => {
      console.log(`每页 ${val} 条`);
      page.pageSize = val;
      getList();
    };
    const handleCurrentChange = val => {
      console.log(`当前页: ${val}`);
      //页码索引发生改变时请求接口
      page.pageNumber = val;
      getList();
    };
    //触发父组件关闭弹窗的事件
    const closeDialog = () => {
      // 关闭新增弹窗
      dialog_info.value = false;
      //关闭编辑弹窗
      dialog_info_edit.value = false;
    };
    //父组件刷新列表数据
    const getListAddEdit = () => {
      getList();
    };
    //点击编辑
    const editInfo = id => {
      dialog_info_edit.value = true;
      infoId.value = id;
    };
    //格式化日期
    const handleTime = (row, column, cellValue, index) => {
      return formatTime(row.createDate);
    };
    //处理类型,把id转化为对应的文字
    const handleCategory = row => {
      console.log("row", row);
      let categoryId = row.categoryId;
      //  let categoryIdNewArr  =  [...new Set(categoryIdArr)]
      //  console.log('categoryIdNewArr:',categoryIdNewArr)
      let categoryData = options.category.filter(item => {
        return item.id == categoryId;
      });

      if(!categoryData[0]){
          return null
      }else{
          return categoryData[0].category_name
      }
    //   console.log("categoryData:", categoryData[0]);
    //   return categoryData[0].category_name;
    };
    /**
     *
     * 删除记录 批量删除
     */
    const deleteItem = id => {
      deleteInfoId.value = [id];
      //3.0全局组件的办法
      confirm({
        content: "确认删除此信息，删除后无法恢复！！",
        tip: "警告",
        fn: confirmDelete,
        id: "maman666"
      });
      //注入Vue全局办法
      //   root.confirm({
      //     content: "确认删除此信息，删除后无法恢复！！",
      //     tip: "警告",
      //     fn: confirmDelete,
      //     id: "maman666"
      //   });
    };

    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length == 0) {
        root.$message({
          message: "请选择要删除的数据！！",
          type: "error"
        });
        return;
      }
      confirm({
        content: "确认选中的数据，删除后无法恢复！！",
        type: "warning",
        tip: "警告",
        fn: confirmDelete
      });
    };
    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value })
        .then(response => {
          //删除成功把值清空（不然一直占内存）
          deleteInfoId.value = "";
          //删除成功调一下获取信息接口
          getList();
        })
        .catch(error => {
          console.log(error);
        });
    };
    //点击复选框触发的效果
    const handleSelectionChange = val => {
      // val拿到数据
      let id = val.map(item => item.id);
      deleteInfoId.value = id;
    };
    //点击搜索(模糊搜索)
    const search = () => {
      // console.log(categoryValue.value)
      // console.log(dateValue.value)
      // console.log(search_key.value)
      // console.log(search_keyWork.value)
      // console.log(formatData());
      //获取列表信息
      getList();
    };
    //搜索条件处理
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      //分类id
      if (categoryValue.value) {
        requestData.categoryId = categoryValue.value;
      }
      //日期
      if (dateValue.value.length > 0) {
        requestData.startTiem = dateValue.value[0];
        requestData.endTime = dateValue.value[1];
      }
      //关键字 根据id搜索 还是根据标题搜索
      if (search_keyWork.value) {
        requestData[search_key.value] = search_keyWork.value;
      }
      return requestData;
    };
    //获取列表数据
    const getList = () => {
      let requestData = formatData();
      //loading加载
      loadingData.value = true;
      GetList(requestData)
        .then(response => {
          console.log("response:", response.data.data);
          let data = response.data.data;
          tableData.item = data.data;
          total.value = data.total;
          //loading加载
          loadingData.value = false;
        })
        .catch(error => {
          console.log(error);
          //loading加载
          loadingData.value = false;
        });
    };
    //获取分类 这种写法不利于维护
    // const getCategory = ()=>{
    //     GetCategory({}).then(response=>{
    //         let data = response.data.data.data;
    //         options.category = data;
    //         //打印的时候按控制台的sources就可以看到是哪一行进行了打印
    //          console.log(options.category)
    //     }).catch(error=>{
    //         console.log(error)
    //     })
    // }
    /**
     * 生命周期
     */
    //监听3.0 信息分类数据监听
    watch(
      () => categoryItem.item,
      value => {
        console.log("value:", value);
        options.category = value;
      }
    );
    //挂载完成之后
    onMounted(() => {
      // 获取信息接口 不利于维护(多个地方调用这个接口)
      // getCategory();
      //利用全局组件调用获取信息分类接口 vue3.0管理接口
      getInfoCategory();
      //获取分类信息封装 vuex 管理接口
      // root.$store.dispatch('common/getCategoryInfo').then(response=>{
      //     options.category = response.data.data.data;
      // }).catch(error=>{
      //     console.log(error)
      // })

      //获取列表信息
      getList();
    });
    return {
      //ref
      dialog_info,
      dialog_info_edit,
      categoryValue,
      dateValue,
      search_key,
      search_keyWork,
      total,
      loadingData,
      infoId,
      // reactive
      tableData,
      options,
      searchOptions,
      //vue2.0 methods
      handleSizeChange,
      closeDialog,
      handleCurrentChange,
      deleteItem,
      deleteAll,
      handleTime,
      handleCategory,
      handleSelectionChange,
      search,
      editInfo,
      getListAddEdit
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";

.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.key-work {
    @include labelDom(right, 99, 40);
  }
}
</style>


