<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breakcrumb />
    </div>
    <div class="tabbar_right">
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts" name="tabbar">
import Breakcrumb from './breakcrumb/breakcrumb.vue';
import Setting from './setting/setting.vue';
</script>

<style scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  & .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  & .tabbar_right {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
}
</style>
