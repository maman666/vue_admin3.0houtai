<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{'current':item.current}"
          v-for="item in menuTab"
          :key="item.id"
          @click="toggleMenu(item)"
        >{{item.txt}}</li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size = "medium"
      >
        <el-form-item  prop="username" class="item-form">
            <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item  prop="password" class="item-form">
            <label>密码</label>
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item  prop="passwords" class="item-form" v-show="model==='register'">
            <label>确认密码</label>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
            <label>验证码</label>
            <el-row :gutter="10">
                <el-col :span="15">
                    <el-input v-model="ruleForm.code"  minlength="6" maxlength="6"></el-input>
                </el-col>
                <el-col :span="9">
                    <el-button type="success" class="block">获取验证码</el-button>
                </el-col>
            </el-row>
          
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
          
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {stripscript,validateEmail,validatePass,validateVcode} from '@/utils/validate.js'
export default {
  name: "Login2.0",
  data() {
       //验证邮箱 用户名
      var validateUsername = (rule, value, callback) => {
    
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(validateEmail(value)){
            callback(new Error('请输入正确的格式'))
        } else{
            callback();
        }
      };
      //验证密码
      var validatePassword = (rule, value, callback) => {
       //过滤特殊符号后的数据
      this.ruleForm.password = stripscript(value);
      //重新赋值
      value = this.ruleForm.password;
      //密码为6至20位的数字+字母
      
        if (value === '') {
          callback(new Error('密码不能为空'));
        } else if(validatePass(value)){
            callback(new Error('密码长度为6至20位的数字+字母'));
        }else{
          callback();
        }
      };

      //确认密码
      var validatePasswords = (rule, value, callback) => {
        //当使用v-show还是会触发这里的规则  可以使用v-if直接删除dom节点 或者坐下处理
        if(this.model==='login'){
          callback();
        }

       //过滤特殊符号后的数据
      this.ruleForm.passwords = stripscript(value);
      //重新赋值
      value = this.ruleForm.passwords;
      //密码为6至20位的数字+字母
      
        if (value === '') {
          callback(new Error('请在次输入密码'));
        } else if(value != this.ruleForm.password){
            callback(new Error('两次输入的密码不一致'));
        }else{
          callback();
        }
      };

      //验证码 的验证
      var code = (rule, value, callback) => {
        //过滤特殊符号后的数据
      this.ruleForm.code = stripscript(value);
      //重新赋值
      value = this.ruleForm.code;
        //长度为6 格式a-z 0-9的字母或者数字
        
        if (!value) {
          return callback(new Error('请输入验证码'));
        }else if(validateVcode(value)){
             callback(new Error('验证码格式有误'));
        }else{
            callback();
        }
        
      };
    return {
      menuTab: [
        { txt: "登录", current: true ,type:'login'},
        { txt: "注册", current: false,type:'register'}
      ],
      //模块值
       model:'login',
       ruleForm: {
          username: '',
          password: '',
          passwords:'',
          code: ''
        },
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwords:[
            {validator: validatePasswords, trigger: 'blur'}
          ],
          code: [
            { validator: code, trigger: 'blur' }
          ]
        }
      };
  },
  mounted(){

  },
  methods: {
    toggleMenu(data) {
      // console.log(data)
      this.menuTab.forEach(item => (item.current = false));
      data.current = true;
      //点击切换为登录类型或者注册类型
      this.model = data.type;
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
     
  }
};
</script>

<style lang="scss" scoped>
#login {
  background-color: #344a5f;
  height: 100vh;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form{
    margin-top:29px;
    label{
        display: block;
        margin-bottom: 3px;
        font-size:14px;
        color: #fff; 
    }
    .item-form{
        margin-bottom: 13px;
    }
    .block{
        width: 100%;
        display: block;
    }
    .login-btn {
        margin-top:19px;
    }
}

</style>
