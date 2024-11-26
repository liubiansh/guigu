<template>
  <div class="logo">
    <!-- 通过一个文件来配置这些属性，可以做到不同属性的切换 -->
    <img :src="setting.logo" />
    <p v-show="!show.fold">{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts" name="logo">
import setting from '@/setting';
import { useLayoutSettingStore } from '@/stores/modules/setting';
let show = useLayoutSettingStore();
</script>

<style scoped>
.logo {
  color: #fff;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 13px;
  padding-right: 0;
  & img {
    width: 35px;
    height: 35px;
  }
  & p {
    font-size: 17px;
    margin-left: 10px;
  }
}
</style>
