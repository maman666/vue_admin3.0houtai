<template>
    <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="信息分类：">
            <!-- el-select v-model 绑定数据传输过来显示的 form.categoryId el-option显示全部绑定的options-->
            <el-select v-model="form.categoryId">
                <el-option
                    v-for="item in data.category"
                    :key="item.id"
                    :value="item.id"
                    :label="item.category_name"
                ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="新闻标题：">
            <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="缩列图：">
          <!-- sync修饰符 -->
          <UploadImg :imgUrl.sync="form.imageUrl" :config="uploadImgConfig"></UploadImg>
        </el-form-item>

        <el-form-item label="发布日期：">
            <el-date-picker v-model="form.createTime" type="datetime" placeholder="选择日期时间" disabled></el-date-picker>
        </el-form-item>

        <el-form-item label="详细内容：">
            <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption"/>
        </el-form-item>

       <el-form-item>
            <el-button type="primary" @click="submit" :loading="data.submitLoading">保存</el-button>
       </el-form-item>
    </el-form>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import { GetList , EditInfo} from "@/api/news";
import { formatTime } from "@/utils/common";
//引入上传图片组件
import UploadImg from "@/components/UploadImg"
//引入富文本编辑器
import { quillEditor } from "vue-quill-editor"; 
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export default {
  name: "infoDetailed",
  components:{ quillEditor,UploadImg },
  setup(props, { root }) {
    //图片上传配置
    const uploadImgConfig = reactive({
      actions:"http://up-z2.qiniup.com",
      ak:"qxHkFefAwpFGOS36rwHJMd2QmlCtrtypsPHrps36", //密钥ak
      sk:"obOVCyY43Un3rCRHjW_gjp-3rASbBhc5ZCY4lE18",//密钥sk
      buckety:"webvue3" //空间存储名
    })
    const data = reactive({
      id:root.$route.params.id || root.$store.getters["infoDetailed/infoId"], //vuex 结合 HTML5本地储存 优势：参数不显示，劣势：微稍有点大材小用（解决第二种传参参数丢失）
      category: [], //拿取分类信息
      editorOption:{}, //富文本编辑
      submitLoading:false, //loading
    });
    const form = reactive({
      categoryId: "",
      title:"",
      createTime:"",
      content:"",
      imageUrl:''
    });
    // let id = root.$route.query.id;//明文传参 （ URL路径会显示传递的参数:优势：页面刷新参数不会丢失，劣势：参数公开）
    // let id = root.$route.params.id;//密文传参  URL路径不会显示传递的参数:优势：参数不显示，劣势：页面刷新参数消失）
    ////冒号的的形式传递传参 动态路由传参 (优势：页面刷新参数不会丢失，劣势：需要一一配置) 接受:params
    
    // let id = root.$route.params.id || root.$store.getters["infoDetailed/infoId"];
    // let title = root.$route.params.title || root.$store.getters["infoDetailed/infoTitle"]; //vuex 结合 HTML5本地储存 优势：参数不显示，劣势：微稍有点大材小用（解决第二种传参参数丢失）

    /** 
        获取信息分类（yong vuex的方式）
      */
    const getCategoryInfo = () => {
      root.$store
        .dispatch("common/getCategoryInfo")
        .then(response => {
          data.category = response.data.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    };
    /** 
     * 获取编辑详情的单条信息记录
    */
   const getInfo = ()=>{
        //请求参数这两个参数时必须的，请求1条记录
        let requestData = {
            pageNumber: 1,
            pageSize: 1,
            id:data.id
        }
        GetList(requestData).then(response=>{
            let responseData = response.data.data.data[0];
            console.log('responseData:',responseData)
            //重新赋值
                form.categoryId = responseData.categoryId;
                form.title = responseData.title;
                form.createTime = formatTime(responseData.createDate);
                form.content = responseData.content;
                form.imageUrl = responseData.imgUrl || '' //'https://oss.tool.lu/cache/202101/10/182418p603tth2i62rzp6q.jpg.optim.jpg' //(一个月到时过期再改)
        }).catch(error=>{

        })
    }


    //点击保存调用的方法
    const submit = () => {
      // let date = new Date().getTime();
      let requestData = {
        id:data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl:form.imageUrl,
      };
      data.submitLoading = true;
      EditInfo(requestData).then(response=>{
        let data = response.data;
        root.$message({
          message:data.message,
          type:'success'
        })
        data.submitLoading = false;
      }).catch(error=>{
        console.log(error);
        data.submitLoading = false;
      })
    };

    //挂载完成之后
    onMounted(() => {
      // 获取分类信息封装 vuex 管理接口
      getCategoryInfo();
      //获取编辑详情的单条信息记录
      getInfo();
    });

    return {
      /** reactive*/
      uploadImgConfig,
      data,
      form,
      /** methods*/
      submit
    };
  }
};
</script>

<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
