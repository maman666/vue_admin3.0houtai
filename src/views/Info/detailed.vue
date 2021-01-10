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
          <!-- action 看空间命名的时候选的是哪个地区 这里选的是华南 :data属性额外附带的参数（token）-->
          <el-upload
            class="avatar-uploader"
            action="http://up-z2.qiniup.com"
            :data = "data.uploadKey"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
import { QiniuToken } from "@/api/common";
import { formatTime } from "@/utils/common";
//引入富文本编辑器
import { quillEditor } from "vue-quill-editor"; 
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export default {
  name: "infoDetailed",
  components:{ quillEditor },
  setup(props, { root }) {
    const data = reactive({
      id:root.$route.params.id || root.$store.getters["infoDetailed/infoId"], //vuex 结合 HTML5本地储存 优势：参数不显示，劣势：微稍有点大材小用（解决第二种传参参数丢失）
      category: [], //拿取分类信息
      editorOption:{}, //富文本编辑
      submitLoading:false, //loading
      uploadKey:{
        token:"",//上传需要获取七牛云的token
        key:"" //上传转码文件名
      }
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
                form.imageUrl = responseData.imgUrl || 'http://qmcwn2x0a.hn-bkt.clouddn.com/2.jpg' || 'https://oss.tool.lu/cache/202101/10/182418p603tth2i62rzp6q.jpg.optim.jpg' //(一个月到时过期再改)
        }).catch(error=>{

        })
    }

    //获取七牛云的token
    const getQiniuToken = () =>{
      let requestData = {
        "ak":"qxHkFefAwpFGOS36rwHJMd2QmlCtrtypsPHrps36", //密钥ak
        "sk":"obOVCyY43Un3rCRHjW_gjp-3rASbBhc5ZCY4lE18",//密钥sk
        "buckety":"webvue3" //空间存储名称
      }
      QiniuToken(requestData).then(response=>{
        data.uploadKey.token = response.data.data.token
        console.log("token:",data.uploadKey.token)
      }).catch(error=>{
        console.log(error)
      })
    }

    /**
     * unload上传两个方法
     * 
     */
    //上传成功就会来到这里
    const  handleAvatarSuccess = (res, file) =>{
      console.log('上传七牛云图片成功跑这里:',res)
        //上传成功图片会有一个(线上)外部的链接地址 把它显示在页面上就可以了 这里的token出问题 不会跑这里
        // form.imageUrl = `http://qmcwn2x0a.hn-bkt.clouddn.com/2.jpg`;
        form.imageUrl = `${root.$store.getters["common/qiniuUrl"]}${res.key}`; //qmcwn2x0a.hn-bkt.clouddn.com七牛云的二级域名 这里是试用(一个月失效)
      }
    //上传前做的事情
    const  beforeAvatarUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        // console.log(66669999,file)

        if (!isJPG) {
          root.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          root.$message.error('上传头像图片大小不能超过 2MB!');
        }

        //文件名转码
        let suffix = file.name;
        let key = encodeURI(`${suffix}`);
        data.uploadKey.key = key;

        return isJPG && isLt2M;
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
      //获取七牛云token
      getQiniuToken();
      
    });

    return {
      /** reactive*/
      data,
      form,
      /** methods*/
      submit,
      handleAvatarSuccess,
      beforeAvatarUpload
    };
  }
};
</script>

<style scoped>
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
