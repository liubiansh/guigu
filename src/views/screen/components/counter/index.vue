<template>
  <div class="counter">
    <div class="counter-title">
      <p>数据统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="counter">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
let charts = ref();

onMounted(() => {
  // 一个容器可以同时展示多种类型的图形图表
  let myChart = echarts.init(charts.value);
  let option = {
    title: {
      text: '游客的消费水平',
      // 标题的位置
      left: 'right',
      top: 5,
      // 主标题的字体样式
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
    },
    // 名字配置
    radar: {
      indicator: [
        { name: '消费', max: 6500 },
        { name: '好感', max: 16000 },
        { name: '出行', max: 30000 },
        { name: '小吃', max: 38000 },
        { name: '爱好', max: 52000 },
        { name: '景点', max: 25000 },
      ],
    },
    itemStyle: {
      backgroundColor: false,
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',

        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget',
            itemStyle: {
              color: '#E16B8C',
            },
            areaStyle: {
              color: '#E16B8C55',
            },
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending',
            itemStyle: {
              color: '#F8C3CD',
            },
            areaStyle: {
              color: '#F8C3CD55',
            },
          },
        ],
      },
    ],
  };
  myChart.setOption(option);
});
</script>

<style scoped>
.counter {
  background: url(../../images/dataScreen-main-rb.png) no-repeat;
  background-size: cover;
  margin-top: 10px;
  .counter-title {
    margin-left: 20px;
    color: #fff;
    font-size: 20px;
  }
  .charts {
    height: calc(100% - 40px);
  }
}
</style>
