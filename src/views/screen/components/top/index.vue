<template>
  <div class="top">
    <div class="left">
      <span class="lBtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="center-title">智慧旅游可视化大数据展示平台</div>
    </div>
    <div class="right">
      <span class="rBtn">统计报告</span>
      <span class="time">当前时间{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts" name="top">
import moment from 'moment';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
// 获取路由器实例
let $router = useRouter();
// 存储当前时间
let time = ref(moment().format('YYYY-MM-DD HH:mm:ss'));
// 绑定当前的定时器
let timer = ref(0);
// 点击首页按钮回到首页
const goHome = () => {
  // 通过编程路由跳转，实现页面跳转
  $router.push('/');
};
// 组件挂载完毕实时更新当前的时间
onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY-MM-DD HH:mm:ss');
  }, 1000);
});
// 组件卸载的时候取消定时器
onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style scoped>
.top {
  width: 100%;
  height: 100%;
  display: flex;
  & .left {
    flex: 1.5;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: flex-end;
    & .lBtn {
      width: 150px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #29fcff;
      font-size: 20px;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
  & .center {
    flex: 2;
    & .center-title {
      width: 100%;
      height: 74px;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
      line-height: 74px;
      font-size: 30px;
      text-align: center;
      color: #29fcff;
    }
  }
  & .right {
    flex: 1.5;
    background: url(../../images/dataScreen-header-right-bg.png);
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & .rBtn {
      width: 150px;
      height: 40px;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
      cursor: pointer;
    }
    & .time {
      color: #29fcff;
      margin-right: 10px;
      font-size: 20px;
    }
  }
}
</style>
