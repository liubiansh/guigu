<template>
  <div class="screen">
    <!-- 数据大屏展示内容区 -->
    <div ref="screenContainer" class="screen-container">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="left-tourist" />
          <Sex class="left-sex" />
          <Age class="left-age" />
        </div>
        <div class="center">
          <Map class="center-map" />
          <Line class="center-line" />
        </div>
        <div class="right">
          <Rank class="right-rank" />
          <Year class="right-year" />
          <Counter class="right-counter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="screen">
// 引入上边的组件
import Top from './components/top/index.vue';
// 引入左边的组件
import Tourist from './components/tourist/index.vue';
import Sex from './components/sex/index.vue';
import Age from './components/age/index.vue';
// 引入中间的组件
import Map from './components/map/index.vue';
import Line from './components/line/index.vue';
// 引入右边的组件
import Rank from './components/rank/index.vue';
import Year from './components/year/index.vue';
import Counter from './components/counter/index.vue';
import { onMounted, ref } from 'vue';

// 获取数据大屏展示内容的盒子DOM元素
let screenContainer = ref<HTMLElement>();
onMounted(() => {
  (
    screenContainer.value as HTMLElement
  ).style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
});
// 定义大屏缩放的比例
function getScale(w = 1920, h = 1080) {
  //获取缩放比例
  const ww = window.innerWidth / w;
  const hh = window.innerHeight / h;
  return Math.min(ww, hh);
}
// 监听视口变化
window.onresize = () => {
  // 重新计算缩放比例
  (
    screenContainer.value as HTMLElement
  ).style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
};
</script>

<style scoped lang="scss">
.screen {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  box-sizing: content-box;
  & .screen-container {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 1920px;
    height: 1080px;
    transform-origin: 0 0;
    & .top {
      width: 100%;
      height: 40px;
    }
    & .bottom {
      display: flex;
      height: 1040px;
      // flex后面跟的数值是弹性内容的大小
      & .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        & .left-tourist {
          flex: 1.2;
        }
        & .left-sex {
          flex: 1;
        }
        & .left-age {
          flex: 1;
        }
      }
      & .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        margin-right: 20px;
        & .center-map {
          flex: 3.5;
        }
        & .center-line {
          flex: 1.5;
        }
      }
      & .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        & .right-rank {
          flex: 1.2;
        }
        & .right-year {
          flex: 1;
        }
        & .right-counter {
          flex: 1;
        }
      }
    }
  }
}
</style>
