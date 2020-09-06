import Vue from "vue";
import VueCompositionApi from '@vue/composition-api'
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//自定义组件icons
import "./icons/icons.js";

Vue.config.productionTip = false;




Vue.use(ElementUI);
Vue.use(VueCompositionApi);

//runtime(运行模式)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
