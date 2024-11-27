<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <!-- 动态设置 fold类名，条件是 LayoutSettingStore.fold值是否为真 -->
    <div class="layout_slider" :class="{ fold: LayoutSettingStore.fold }">
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar
        class="scrollbar"
        :class="{ fold: LayoutSettingStore.fold }"
      >
        <!-- 菜单组件 -->
        <!-- 可以直接使用 $route这个宏函数，内容是 useRoute实例对象,使用他里面的路径属性 -->
        <el-menu
          :collapse-transition="false"
          :collapse="LayoutSettingStore.fold"
          :default-active="$route.path"
          :router="true"
          background-color="#001529"
          text-color="#fff"
        >
          <!-- 把小仓库里面的路由数组传递给子组件 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayoutSettingStore.fold }">
      <!-- 顶部导航栏 -->
      <Tabbar />
    </div>
    <!-- 内容展示区域 -->
    <!-- 因为主页面是一级路由，同 login是一个层级的 -->
    <!-- 所以这里就相当于主页面的二级路由区 -->
    <div class="layout_main" :class="{ fold: LayoutSettingStore.fold }">
      <!-- 把这里展示路由区的内容封装成一个组件，方便设置效果 -->
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts" name="layout">
// 引入 logo组件
import Logo from '@/layout/logo/logo.vue';
// 引入导航栏组件
import Tabbar from './tabbar/tabbar.vue';
// 引入 菜单组件
import Menu from './menu/menu.vue';
// 引入路由切换组件
import Main from './main/main.vue';
// 引入用户相关的小仓库
import { useUserStore } from '@/stores/modules/user.ts';
// 引入 layout小仓库
import { useLayoutSettingStore } from '@/stores/modules/setting.ts';

// 使用用户相关的小仓库
let userStore = useUserStore();
// 使用layout小仓库
let LayoutSettingStore = useLayoutSettingStore();
</script>

<style scoped>
.layout_container {
  height: 100vh;

  & .layout_slider {
    width: 210px;
    height: 100vh;
    background-color: #001529;
    transition: all 0.3s;

    & .scrollbar {
      height: calc(100vh - 40px);

      & .el-menu {
        border: none;
      }
    }

    &.fold {
      width: 50px;
    }
  }

  & .layout_tabbar {
    position: fixed;
    width: calc(100% - 210px);
    height: 50px;
    top: 0;
    left: 210px;
    transition: all 0.3s;

    &.fold {
      width: calc(100% - 50px);
      left: 50px;
    }
  }

  & .layout_main {
    position: fixed;
    width: calc(100% - 210px);
    height: calc(100vh - 50px);
    top: 50px;
    left: 210px;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100% - 50px);
      left: 50px;
    }
  }
}
</style>
