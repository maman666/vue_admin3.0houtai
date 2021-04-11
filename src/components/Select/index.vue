<template>
    <el-select v-model="data.selectValue" placeholder="请选择">
        <el-option v-for="item in data.initOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
export default {
    name:'Select',
    props:{
        config:{
            type:Array,
            default:()=>[]
        }
    },
    setup(props,{root}){
        const data = reactive({
            selectValue:"",//这里输入value值 显示对应的label
            initOptions:[],
            option:[
                {value:"name",label:"姓名"},
                {value:"phone",label:"手机号"},
                {value:"email",label:"邮箱"},
                {value:"id",label:"ID"},
                {value:"title",label:"标题"}
            ],
        })
        //初始化下拉菜单
        let initOption = ()=>{
            //数据校验 从源头处理数据 不需要在中途去加if判断
            if(props.config.length === 0){
                return;
            }
            let optionArr = [];//空数组去下标会报错 需要做判断
            props.config.forEach(item=>{
                let arr = data.option.filter(elem=>elem.value==item);//filter匹配后是数组 需要取对象push到数组
                // 数据校验
                if(arr.length>0){
                    optionArr.push(arr[0]);
                }
            })
            // 数据校验
            if(optionArr.length===0){
                return;
            }
            //初始化赋值
            data.initOptions = optionArr;
            //初始化默认搜索类型
            data.selectValue = optionArr[0].value;
        }
        //onMounted节点挂载后执行
        onMounted(()=>{
            initOption()
        })
        return {
            data
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
