<template>
  <!-- 顶部左侧静态 -->
  <el-icon
    style="margin-right: 10px; cursor: pointer"
    top="top"
    @click="changeIcon"
  >
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包动态展示路由名字与标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 图标 -->
      <el-icon style="vertical-align: top">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配路由的标题 -->
      <span style="margin: 0 4px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useLayoutSettingStore } from '@/stores/modules/setting';
import { useRoute } from 'vue-router';
//获取layout配置相关的仓库
let LayOutSettingStore = useLayoutSettingStore();
//获取路由对象
let $route = useRoute();
//点击图标的方法
const changeIcon = () => {
  //图标进行切换
  LayOutSettingStore.fold = !LayOutSettingStore.fold;
};
</script>
<script lang="ts">
export default {
  name: 'Breadcrumb',
};
</script>

<style scoped></style>
