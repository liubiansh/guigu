<template>
  <div class="tourist">
    <div class="tourist-title">
      <p class="tourist-title-text">实时游客统计</p>
      <p class="tourist-title-bg"></p>
      <p class="tourist-title-number">可预约总量<span>99999</span>人</p>
    </div>
    <div class="tourist-number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- echarts展示图形图表的节点 -->
    <div class="echarts" ref="charts">123</div>
  </div>
</template>

<script setup lang="ts" name="tourist">
import { onMounted, ref } from 'vue';
// 安装echarts的依赖，然后引入
import * as echarts from 'echarts';
// 安装水球图的依赖引入
import 'echarts-liquidfill';
let people = ref('216908人');
// 获取DOM组件实例
let charts = ref();
onMounted(() => {
  // 获取echarts实例
  let myChart = echarts.init(charts.value);
  // 设置实例的配置项
  myChart.setOption({
    // X轴组件
    xAxis: {},
    // Y轴组件
    yAxis: {},
    // 系列列表，决定展示什么样的图形图表
    series: {
      type: 'liquidFill',
      data: [0.6, 0.6, 0.6], //数据
      waveAnimation: true, //动画
      animationDuration: 2000, //入场动画时间
      animationDurationUpdate: 3000,
      radius: '85%', //半径
    },
    // 布局组件
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  });
});
</script>

<style scoped>
.tourist {
  background: url(../../images/dataScreen-main-lt.png) no-repeat;
  background-size: cover;
  margin-top: 10px;
  & .tourist-title {
    .tourist-title-text {
      color: aliceblue;
      font-size: 20px;
    }
    & .tourist-title-bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png);
      background-size: 100% 100%;
      margin: 10px 0;
    }
    & .tourist-title-number {
      float: right;
      color: whitesmoke;
      & span {
        color: yellowgreen;
        font-style: italic;
        margin: 0 3px;
      }
    }
  }
  & .tourist-number {
    display: flex;
    margin-top: 40px;
    padding: 10px;
    & span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 25px;
    }
  }
  & .echarts {
    width: 100%;
    height: 240px;
  }
}
</style>
