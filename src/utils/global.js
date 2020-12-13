
import {MessageBox} from 'element-ui'
//全局注册方法 多出调用
export default {
    install(Vue, options) {
        Vue.prototype.confirm =  (params) => {
            MessageBox.confirm(params.content, params.tip || "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: params.type || "warning",
                center: true
            }).then(() => {
                //传一个函数过来处理数据
                //先判断函数在不在
                // if(params.fn){params.fn()}
                params.fn && params.fn(params.id) //判断params.fn为true执行params.fn()这个办法 为false不执行
            }).catch(() => {
                // root.$message({
                //     type: "info",
                //     message: "已取消删除"
                // });
            });
        }
    }
}