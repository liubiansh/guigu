/** * 这个文件是用来封装svg图标的 */
<template>
  <div class="index">
    <!-- 外侧容器节点为 svg标签，内部用 use标签包裹 -->
    <!-- 调整图标的大小可以在 svg标签上，用style属性 -->
    <svg :style="{ width, height }">
      <!-- 使用方法为属性 href 选择执行哪一个图标 -->
      <!-- fill属性可以设置图标的颜色，如果没办法修改要去 svg文件里面把其 fill属性删掉 -->
      <use :href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts" name="svg-icon">
// 接收父组件传递过来的参数
defineProps({
  // href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 图标名字
  name: String,
  // 颜色
  color: {
    type: String,
    default: '',
  },
  // 图标大小
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
});
</script>

<style scoped></style>
