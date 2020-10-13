
import Vue from "vue";
import SvgIcon from "./SvgIcon.vue";

//自定义组件
Vue.component('svg-icon',SvgIcon);

//svg解析文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  console.log(requireContext.keys().map(requireContext))
  return requireContext.keys().map(requireContext)
}
requireAll(req)
