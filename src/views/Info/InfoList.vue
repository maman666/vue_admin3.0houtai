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
                        <el-date-picker
                            style="width:100%"
                            v-model="dateValue"
                            type="datetimerange"
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
                <el-button type="danger" style="width:100%;">搜索</el-button>
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
        <el-table :data="tableData.item" border="" style="width: 100%">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="title" label="标题" width="830"></el-table-column>
            <el-table-column prop="categoryId" label="类型" width="130"></el-table-column>
            <el-table-column prop="createDate" label="日期" width="237"></el-table-column>
            <el-table-column prop="user" label="管理员" width="115"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteItem">删除</el-button>
                    <el-button type="success" size="mini" @click="dialog_info=true">编辑</el-button>
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
        <DialogInfo :flag="dialog_info" @close="closeDialog" :category="options.category"></DialogInfo>
    </div>
</template>

<script>
import { GetCategory,GetList } from "@/api/news";
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import DialogInfo from "./dialog/info";
//3.0全局弹窗方法做法（监听方便）
import { global } from "@/utils/global_V3.0";
import { common } from "@/api/common";
export default {
  name: "infoList",
  components: {
    DialogInfo
  },
  /**
   * 数据
   */
  setup(props, { root }) {
    //3.0全局组件弹窗的引入
    //str:aaa 重命名解决命名空间的问题
    //   const {str:aaa,confirm} = global();
    //   watch(()=>console.log(aaa.value));
    /**
     * ref基础数据
     */
    //获取分类接口全局组件引入
    const {getInfoCategory,categoryItem} = common();

    //新增,编辑 弹窗显示
    const dialog_info = ref(false);
    const categoryValue = ref("");
    const dateValue = ref("");
    const search_key = ref("id");
    const search_keyWork = ref("");
    const total = ref(0);
    /***
     * reactive对象数据
     */
    //reactive请求数据回来是一个对象里面包含数组
    const options = reactive({
        category:[]
    });
    //页码
    const page = reactive({
        pageNumber:1,
        pageSize:10
    })
    //搜索关键字
    const searchOptions = reactive([
      { value: "id", label: "ID" },
      { value: "title", label: "标题" }
    ]);

    //表格数据
    const tableData = reactive({
        item:[]
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
    const closeDialog = () => {
      dialog_info.value = false;
    };
    const deleteItem = () => {
      //3.0全局组件的办法
      // confirm({
      //     content:'确认删除此信息，删除后无法恢复！！',
      //     tip:'警告',
      //     fn:confirmDelete,
      //     id:'maman666'
      // });
      //注入Vue全局办法
      root.confirm({
        content: "确认删除此信息，删除后无法恢复！！",
        tip: "警告",
        fn: confirmDelete,
        id: "maman666"
      });
    };
    const deleteAll = () => {
      root.confirm({
        content: "确认选中的数据，删除后无法恢复！！",
        type: "success",
        fn: confirmDelete,
        id: "maman666"
      });
    };
    const confirmDelete = value => {
      console.log(value);
    };
    //获取列表数据
    const getList = ()=>{
        let requestData = {
            categoryId: '',
            startTiem: '',
            endTime: '',
            title: '',
            id: '',
            pageNumber: page.pageNumber,
            pageSize:page.pageSize
        }
        GetList(requestData).then(response=>{
            console.log('response:',response.data.data)
            let data = response.data.data;
            tableData.item = data.data;
            total.value = data.total;
        }).catch(error=>{
            console.log(error)
        })
    }
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
    watch(()=>categoryItem.item,(value)=>{
        // console.log(value)
        options.category = value;
    })
    //挂载完成之后
    onMounted(()=>{
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
    })
    return {
      //ref
      dialog_info,
      categoryValue,
      dateValue,
      search_key,
      search_keyWork,
      total,
      // reactive
      tableData,
      options,
      searchOptions,
      //vue2.0 methods
      handleSizeChange,
      closeDialog,
      handleCurrentChange,
      deleteItem,
      deleteAll
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


