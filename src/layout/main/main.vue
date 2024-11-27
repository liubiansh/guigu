<template>
  <!-- 用插槽的形式展示内容 -->
  <RouterView v-slot="{ Component }">
    <!-- 外侧用动画标签包裹 -->
    <transition name="fade">
      <component :key="settingStore.refsh" :is="Component" />
    </transition>
  </RouterView>
</template>

<script setup lang="ts" name="contentMain">
import { useLayoutSettingStore } from '@/stores/modules/setting';

let settingStore = useLayoutSettingStore();
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.3s ease-out;
}

.fade-leave-to {
  transform: translateX(20px);
  opacity: 1;
}
</style>
