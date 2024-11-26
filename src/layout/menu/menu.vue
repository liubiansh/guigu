<template>
  <!-- 可以在结构中用 template标签来包裹，这样不会生成具体的 DOM标签，更易于页面的管理 -->
  <template v-for="(item, index) in menuList" :key="index">
    <!-- 没有子路由 -->
    <el-menu-item v-if="!item.children && !item.meta.hidden" :index="item.path">
      <!-- 菜单图标 -->
      <el-icon>
        <!-- 使用 component 标签来渲染图标，用 is属性来动态选择图标 -->
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 菜单文字,折叠的时候会把标题内容隐藏 -->
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 只有一个子路由 -->
    <el-menu-item
      v-if="item.children && item.children.length === 1 && !item.meta.hidden"
      :index="item.children[0].path"
    >
      <el-icon>
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有两个及以上子路由 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1 && !item.meta.hidden"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!--  
        当有两个及以上的子路由时，其每个子路由可能会有更多的子路由，
          所以要使用递归的方法，让其自己调用自己进行创建
        也就相当于在这里又用了一次自己这个组件
      -->
      <!-- 传进去的值为遍历到的儿子项，会无限递归下去 -->
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts" name="Menu">
// 在组件内使用递归调用自己时
// 可以创建两个script标签，在另一个标签里向外暴露一个名字
// 也可以自己引入自己
import Menu from './menu.vue';

// 获取父组件传递过来的全部路由数组
defineProps(['menuList']);
</script>

<style scoped>
.el-menu-item {
  font-size: 13px;
}
</style>
