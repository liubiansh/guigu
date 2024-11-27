<template>
  <div class="center-line">
    <div class="line-title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="center-line">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
let charts = ref();
onMounted(() => {
  let myChart = echarts.init(charts.value);
  myChart.setOption({
    // 标题组件
    title: {
      text: '访问量',
      top: '13%',
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 两侧留白
      boundaryGap: false,
      // 分割线设置
      splitLine: {
        show: false,
      },
      axisLabel: {
        fontSize: 15,
      },
    },
    yAxis: {
      // 分割线设置
      splitLine: {
        show: false,
      },
      // 轴线设置
      axisLine: {
        show: true,
      },
      // 轴线刻度
      axisTick: {
        show: true,
      },
      axisLabel: {
        fontSize: 13,
      },
    },
    // 布局
    grid: {
      left: '5%',
      right: '2%',
      bottom: '10%',
      top: '25%',
    },
    // 系列
    series: [
      {
        type: 'line',
        data: [
          { value: 10, name: '周一' },
          { value: 35, name: '周二' },
          { value: 20, name: '周三' },
          { value: 40, name: '周四' },
          { value: 30, name: '周五' },
          { value: 55, name: '周六' },
          { value: 35, name: '周日' },
        ],
        // 平滑曲线
        smooth: true,
        // 区域填充样式
        areaStyle: {
          color: {
            type: 'redial',
            x: 0, // 左
            y: 0, // 上
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#2EA9DF', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#fff5', // 100% 处的颜色
              },
            ],
            global: false, //true为绝对像素位置，false为百分比
          },
        },
      },
    ],
  });
});
</script>

<style scoped>
.center-line {
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: cover;
  & .line-title {
    margin: 0 20px;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    & p {
      color: #fff;
      font-size: 20px;
    }
  }
  & .charts {
    height: calc(100% - 30px);
  }
}
</style>
