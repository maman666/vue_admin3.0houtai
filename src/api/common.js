import { GetCategory } from "@/api/news";
import { reactive } from "@vue/composition-api";

export function common() {
    // 声明对象存数据
    const categoryItem = reactive({
        item: []
    })
    //封装获取分类接口api
    const getInfoCategory = () => {
        GetCategory().then(response => {
            categoryItem.item = response.data.data.data;
        }).catch(error => { });
    }
    return {
        getInfoCategory,
        categoryItem
    }
}