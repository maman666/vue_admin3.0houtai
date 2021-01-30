<template>
<!-- action 看空间命名的时候选的是哪个地区 这里选的是华南 :data属性额外附带的参数（token）-->
    <el-upload
        class="avatar-uploader"
        :action="config.actions"
        :data = "data.uploadKey"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="data.image" :src="data.image" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
//获取七牛云的接口
import { QiniuToken } from "@/api/common";
export default {
   /** 
    *   1.组件要做什么?(七牛云的token,显示默认图片,选择图片后渲染自身图片)
    *   2.最终结果是什么?(返回选择后图片地址,才可以替换原来的地址)
    * */ 
   name:"uploadImg",
   props:{
       imgUrl:{
           type:String,
           default:""
       },
       config:{
          type:Object,
          default:()=>{} 
       }
   },
   setup(props,{root,emit}){
    // console.log(props.imgUrl,'669') //第一次没有跑 第二次才会跑 可能会没有值直接传过来（需要监听）
    // console.log(props.config,'669') //有值直接传过来（不需要监听）
    const data = reactive({
        image:"",
        uploadKey:{
            token:"",//上传需要获取七牛云的token
            key:"" //上传转码文件名
        }
    })
        /**
     * unload上传两个方法
     * 
     */
    //上传成功就会来到这里
    const  handleAvatarSuccess = (res, file) =>{
      console.log('上传七牛云图片成功跑这里:',res)
        //上传成功图片会有一个(线上)外部的链接地址 把它显示在页面上就可以了 这里的token出问题 不会跑这里
        // data.image= `http://qmcwn2x0a.hn-bkt.clouddn.com/2.jpg`;
        let img = `${root.$store.getters["common/qiniuUrl"]}${res.key}`; //qmcwn2x0a.hn-bkt.clouddn.com七牛云的二级域名 这里是试用(一个月失效)
        data.image = img
        // 这里使用的是组件，上传成功点击保存还是会保存原来的图片 这里就需要反向修改 emit("update:imgUrl")在把修改的值传回去 传过来的必须有修饰符 .sync
        emit("update:imgUrl",img);
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
    //获取七牛云的token
    const getQiniuToken = () =>{
      let requestData = {
        "ak":props.config.ak, //密钥ak
        "sk":props.config.sk,//密钥sk
        "buckety":props.config.buckety //空间存储名称 "webvue3"
      }
      QiniuToken(requestData).then(response=>{
        data.uploadKey.token = response.data.data.token
        console.log("token:",data.uploadKey.token)
      }).catch(error=>{
        console.log(error)
      })
    }

    //监听 （外面传参进来的时候就有参数，不需要做监听 如果传过来的数据需要接口请求，而接口请求又需要时间，所以需要做监听）
    watch(()=>props.imgUrl,(value)=>{
        console.log('value',value)
        //这是监听直接赋值会报错，需要重新定义一个新的变量在赋值
        data.image = value
    })
    onMounted(()=>{
     //获取七牛云token
      getQiniuToken();
      
    })
    return {
        // reactive
        data,
        //methods
        handleAvatarSuccess,
        beforeAvatarUpload
    }
   }
}
</script>

<style>

</style>
