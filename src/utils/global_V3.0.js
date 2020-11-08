
import {MessageBox} from 'element-ui';
import { reactive, ref ,watch} from "@vue/composition-api";

export function global(){
    const str = ref('');
    const confirm = (params)=>{
        MessageBox.confirm(params.content, params.tip || "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: params.type || "warning",
            center: true
        }).then(() => {
            str.value = params.id || '';
            //传一个函数过来处理数据
            //先判断函数在不在
            // if(params.fn){params.fn()}
            params.fn && params.fn(params.id || '') //判断params.fn为true执行params.fn()这个办法 为false不执行
        }).catch(() => {
            params.catchFn && params.catchFn()
            // root.$message({
            //     type: "info",
            //     message: "已取消删除"
            // });
        });
    }
    return {
        str,
        confirm
    }
}