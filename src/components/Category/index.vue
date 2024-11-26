<template>
  <div class="Category">
    <el-card>
      <el-form :disabled="scene === 0 ? false : true" :inline="true">
        <el-form-item
          label="一级分类"
          placeholder="请选择"
          style="width: 20%; min-width: 200px"
        >
          <el-select v-model="categoryStore.c1Id" @change="getC2">
            <!-- 通过收集每项的 id来进行处理数据 -->
            <el-option
              v-for="c1 in categoryStore.c1Arr"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="二级分类"
          placeholder="请选择"
          style="width: 20%; min-width: 200px"
        >
          <el-select v-model="categoryStore.c2Id" @change="getC3">
            <el-option
              v-for="c2 in categoryStore.c2Arr"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="三级分类"
          placeholder="请选择"
          style="width: 20%; min-width: 200px"
        >
          <el-select v-model="categoryStore.c3Id">
            <el-option
              v-for="c3 in categoryStore.c3Arr"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="attrSelect">
import { useCategoryStore } from '@/stores/modules/category';
import { onMounted } from 'vue';
let categoryStore = useCategoryStore();
// 接收父组件传进来的值,用他来控制 form表单能不能正常使用
defineProps(['scene']);
// 通知仓库获取一级分类数据
const getC1 = async () => {
  categoryStore.getC1();
};
// 一级菜单change事件
const getC2 = () => {
  // 需要将二三级数据清空,不能清空二级的数据，不然就没办法显示
  categoryStore.c2Id = '';
  categoryStore.c3Id = '';
  categoryStore.c3Arr = [];
  // 通知仓库获取二级分类数据
  categoryStore.getC2();
};
// 二级菜单change事件
const getC3 = () => {
  // 清空三级数据的id
  categoryStore.c3Id = '';
  // 通知仓库获取二级分类数据
  categoryStore.getC3();
};
// 组件挂载完毕
onMounted(() => {
  // 获取一级分类数据
  getC1();
});
</script>

<style scoped></style>
