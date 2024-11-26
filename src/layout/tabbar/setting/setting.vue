<template>
  <!-- 刷新按钮 -->
  <el-button
    title="刷新"
    circle
    icon="Refresh"
    size="small"
    @click="updateRefsh"
  ></el-button>
  <!-- 全屏按钮 -->
  <el-button
    title="全屏"
    circle
    icon="FullScreen"
    size="small"
    @click="fullScreen"
  ></el-button>
  <el-popover placement="bottom" title="主题设置" trigger="hover" content="">
    <!-- 表单组件 -->
    <el-form label-width="80px">
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          show-alpha
          @change="setColor"
          :teleported="false"
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <!-- active激活，inactive未激活，inline-prompt出现在组件内部 -->
        <!-- change:切换开关状态的回调 -->
        <el-switch
          v-model="dark"
          active-icon="Moon"
          inactive-icon="Sunny"
          inline-prompt
          @change="changeDark"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <template #reference>
      <!-- 设置按钮 -->
      <el-button circle icon="Setting" size="small"></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="setting">
import { useLayoutSettingStore } from '@/stores/modules/setting';
import { useUserStore } from '@/stores/modules/user';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const color = ref('rgba(255, 69, 0, 0.68)');
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]);
let layoutSettingStore = useLayoutSettingStore();
let userStore = useUserStore();
//获取路由器对象
let $router = useRouter();
//获取路由对向
let $route = useRoute();
// 收集开关的数据
let dark = ref(false);
//刷新按钮点击回调
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh;
};
//全屏按钮点击的回调
const fullScreen = () => {
  //DOM对象的一个属性:可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  let full = document.fullscreenElement;
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //变为不是全屏模式->退出全屏模式
    document.exitFullscreen();
  }
};
// 设置按钮的点击
//退出登录点击回调
const logout = async () => {
  //第一件事情:需要向服务器发请求[退出登录接口]******
  //第二件事情:仓库当中关于用于相关的数据清空[token|username|avatar]
  //第三件事情:跳转到登录页面
  await userStore.userLogout();
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } });
};
// 主题颜色的设置
const setColor = () => {
  // 通过 js修改根节点的样式对象的属性与属性值
  let html = document.documentElement;
  html.style.setProperty('--el-color-primary', color.value);
};
// switch开关的点击回调
const changeDark = () => {
  // 获取 HTML根节点
  let html = document.documentElement;
  // 通过判断 dark的值动态添加类名，添加上类名就可以实现主题的切换了
  dark.value ? html.classList.add('dark') : html.classList.remove('dark');
};
</script>

<style scoped></style>
