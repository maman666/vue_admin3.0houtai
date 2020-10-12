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
        ref="loginForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            type="password"
            id="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-form" v-show="model==='register'">
          <label for="passwords">确认密码</label>
          <el-input
            type="password"
            id="passwords"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input id="code" v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms"
                :disabled="codeButtonStatus.status"
              >{{codeButtonStatus.text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disabled="loginButtonStatus"
          >{{model==='login'?'登录':'注册'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login.js";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVcode
} from "@/utils/validate.js";

export default {
  name: "Login3.0",
  setup(props, { refs, root }) {
    //验证邮箱 用户名
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("请输入正确的格式"));
      } else {
        callback();
      }
    };
    //验证密码
    var validatePassword = (rule, value, callback) => {
      //过滤特殊符号后的数据
      ruleForm.password = stripscript(value);
      //重新赋值
      value = ruleForm.password;
      //密码为6至20位的数字+字母

      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (validatePass(value)) {
        callback(new Error("密码长度为6至20位的数字+字母"));
      } else {
        callback();
      }
    };

    //确认密码
    var validatePasswords = (rule, value, callback) => {
      //当使用v-show还是会触发这里的规则  可以使用v-if直接删除dom节点 或者坐下处理
      if (model.value === "login") {
        callback();
      }

      //过滤特殊符号后的数据
      ruleForm.passwords = stripscript(value);
      //重新赋值
      value = ruleForm.passwords;
      //密码为6至20位的数字+字母

      if (value === "") {
        callback(new Error("请在次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };

    //验证码 的验证
    var code = (rule, value, callback) => {
      //过滤特殊符号后的数据
      ruleForm.code = stripscript(value);
      //重新赋值
      value = ruleForm.code;
      //长度为6 格式a-z 0-9的字母或者数字

      if (!value) {
        return callback(new Error("请输入验证码"));
      } else if (validateVcode(value)) {
        callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };

    //声明数据
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    //模块值
    const model = ref("login");
    //按钮默认为禁用状态
    const loginButtonStatus = ref(true);
    //倒计时
    const timer = ref(null);
    //对验证码的按钮做状态的处理和文字处理
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    //表单绑定数据
    const ruleForm = reactive({
      username: "maman@qq.com",
      password: "",
      passwords: "",
      code: ""
    });
    //表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: code, trigger: "blur" }]
    });

    //声明函数
    //切换模块
    /**
     * 建议不要再同一个方法做不同的事件（尽可能做自己的事，不要做其他的功能，其他的功能可以另外声明一个函数，在这里调用这个方法）
     * 尽量把相同的事情封装在一个方法里面，调用这个方法就可以
     */
    const toggleMenu = data => {
      // console.log(data)
      menuTab.forEach(item => (item.current = false));
      data.current = true;
      //点击切换为登录类型或者注册类型
      model.value = data.type;
      //重置表单内容
      refs["loginForm"].resetFields();
      //点击切换的时候重置一下验证码内容 停止倒计时
      clearCountDown();
      //注册和登录的禁用按钮
      loginButtonStatus.value = true;

    };

    //更新按钮状态（多个地方调用 封装成一个函数以传参的形式调用 建议一般用对象）
    const updateButtonStatus = (params)=>{
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    }

    //获取验证码----------------------------------------------------------------
    const getSms = () => {
      //1111111@qq.com 获取验证码一个账号
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空");
        return false;
      }
      //邮箱格式的验证
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误,请重新输入");
        return false;
      }
      //点击修改验证码的状态 内容
      updateButtonStatus({
        status:true,
        text:'发送中...'
      })
   

      let data = {
        username: ruleForm.username,
        module: model.value
      };
      //验证码接口
      GetSms(data)
        .then(response => {
          let res = response.data;
          root.$message({
            message: res.message,
            type: "success"
          });
          //发送成功后启用登录或者注册按钮
          loginButtonStatus.value = false;
          //请求成功 开始倒计时
          countDown(60);
        })
        .catch(error => {
          console.log(error);
        });
    };

    //提交表单---------------------------------------------------------------------
    const submitForm = formName => {
      // console.log(model.value);
      refs[formName].validate(valid => {
        if (valid) {
          if (model.value == "login") {
            let requestData = {
              username: ruleForm.username,
              password: sha1(ruleForm.password),
              code: ruleForm.code
            };
            //登录接口
            // Login(requestData).then(response => {
            //   let res = response.data;
            //     root.$message({
            //       message: res.message,
            //       type: "success"
            //     });
            //     root.$router.push({
            //       name:'Console'
            //     })
            // });

            //登录接口 action异步请求写法
            root.$store.dispatch('app/login',requestData).then(response => {
              let res = response.data;
                root.$message({
                  message: res.message,
                  type: "success"
                });
                root.$router.push({
                  name:'Console'
                })
            });
          } else if (model.value == "register") {
            let requestData = {
              username: ruleForm.username,
              password: sha1(ruleForm.password),
              code: ruleForm.code,
              module: model.value
            };
            //注册接口
            Register(requestData)
              .then(response => {
                let res = response.data;
                root.$message({
                  message: res.message,
                  type: "success"
                });
                //注册成功跳转到登录页面
                toggleMenu(menuTab[0]);
                //清除定时器 恢复默认状态
                clearCountDown();
              })
              .catch(error => {});
          } else {
            root.$message({
              message: res.message,
              type: "error"
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    //倒计时 方法
    const countDown = number => {
      //开始的时候判断定时器是否存在，把他清除掉 不然会累加
      if (timer.value) {
        clearInterval(timer.value);
      }
      var time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          updateButtonStatus({
            status:false,
            text:'再次获取'
          })
          
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };

    //清除倒计时
    const clearCountDown = () => {
      //清除定时器
      clearInterval(timer.value);
      updateButtonStatus({
        status:false,
        text:"获取验证码"
      })
    };
    // 生命周期 挂载完成后
    onMounted(() => {});
    return {
      menuTab,
      model,
      loginButtonStatus,
      codeButtonStatus,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getSms
    };
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
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    width: 100%;
    display: block;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
