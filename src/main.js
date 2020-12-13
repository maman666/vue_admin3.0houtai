import Vue from "vue";
import VueCompositionApi from '@vue/composition-api'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引进路由守卫(没有暴露东西 直接引进)
import './router/premit';

//自定义全局办法
import global from '@/utils/global.js'

//自定义组件icons
import "./icons/icons.js";

Vue.config.productionTip = false;

// console.log(process.env.VUE_APP_ABC)//打印开发模式的环境变量

Vue.use(global);
Vue.use(ElementUI);
Vue.use(VueCompositionApi);

//runtime(运行模式)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
