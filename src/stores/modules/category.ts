// 商品分类全局组件的小仓库
// 创建这个仓库主要是为了多个组件之间进行通信，不用每次都进行传值

import { reqC1, reqC2, reqC3 } from '@/api/product/attr';
import { CategoryObj, ResponseData } from '@/api/product/attr/type';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoryStore = defineStore('Category', () => {
  let c1Id = ref('');
  let c2Id = ref('');
  let c3Id = ref('');
  // 存储数据是返回的 data属性
  let c1Arr = ref<CategoryObj[]>([]);
  // 对应一级分类的二级数据
  let c2Arr = ref<CategoryObj[]>([]);
  // 对应二级分类的三级数据
  let c3Arr = ref<CategoryObj[]>([]);

  // 获取一级分类的方法
  const getC1 = async () => {
    // 发请求
    let res: ResponseData<CategoryObj[]> = await reqC1();
    if (res.code == 200) {
      c1Arr.value = res.data;
    }
  };
  const getC2 = async () => {
    let res: ResponseData<CategoryObj[]> = await reqC2(c1Id.value);
    if (res.code == 200) {
      c2Arr.value = res.data;
    }
  };
  const getC3 = async () => {
    let res: ResponseData<CategoryObj[]> = await reqC3(c2Id.value);
    if (res.code == 200) {
      c3Arr.value = res.data;
    }
  };
  return {
    c1Id,
    c2Id,
    c3Id,
    c1Arr,
    c2Arr,
    c3Arr,
    getC1,
    getC2,
    getC3,
  };
});
