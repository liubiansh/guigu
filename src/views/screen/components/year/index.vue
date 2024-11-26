<template>
  <div class="year">
    <div class="year-title">
      <p>年度游客对比</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="year">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
let charts = ref();

onMounted(() => {
  // 一个容器可以同时展示多种类型的图形图表
  let myChart = echarts.init(charts.value);
  myChart.setOption({
    // 标题组件
    title: {
      // 主标题
      text: '散点图',
      // 标题的位置
      left: 'center',
      // 主标题的字体样式
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
    },
    xAxis: {
      type: 'category',
      show: false,
    },
    yAxis: {
      show: false,
    },
    // 布局
    grid: {
      left: 20,
      right: 0,
      bottom: 20,
      top: 50,
    },
    // 系列,可以放多个
    series: {
      type: 'scatter',
      data: [
        28, 48, 73, 116, 157, 147, 35, 13, 197, 36, 79, 188, 44, 12, 59, 128,
        153, 128, 80, 95, 103, 55, 181, 110, 161, 21, 33, 117, 200, 21,
      ],
      // 图形的样式
      symbol: 'diamond',
      symbolSize: 16,
      label: {
        show: true,
        position: 'top',
        color: '#F4A7B9',
      },
      // 散点图标记的样式
      itemStyle: {
        // 圆角的设置
        borderRadius: [10, 10, 0, 0],
        // 柱条颜色（支持函数）
        color: function () {
          // params.dataIndex: 当前柱条的索引
          // params.data: 当前柱条的数据
          // params.name: 当前柱条的name
          // params.value: 当前柱条的值
          // params.seriesName: 当前柱条的seriesName
          // params.seriesType: 当前柱条的seriesType
          // params.seriesIndex: 当前柱条的seriesIndex
          // params.seriesData: 当前柱条的seriesData
          // 给每一个柱条设置背景颜色
          let arr = [
            '#E16B8C',
            '#DC9FB4',
            '#F8C3CD',
            '#F4A7B9',
            '#F596AA',
            '#E87A90',
            '#B9887D',
          ];
          return arr[Math.floor(Math.random() * 8)];
        },
      },
    },
    // 提示框
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#F8C3CD',
    },
    // 图例组件
    legend: {
      data: ['销量', '访问量'],
    },
  });
});
</script>

<style scoped>
.year {
  background: url(../../images/dataScreen-main-rc.png) no-repeat;
  background-size: cover;
  margin-top: 10px;
  .year-title {
    margin-left: 20px;
    color: #fff;
    font-size: 20px;
  }
  .charts {
    height: calc(100% - 40px);
  }
}
</style>
