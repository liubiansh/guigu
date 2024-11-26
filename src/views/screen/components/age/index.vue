<template>
  <div class="age">
    <div class="age-title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图表的容器 -->
    <div class="age-echarts" id="main"></div>
  </div>
</template>

<script setup lang="ts" name="age">
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted } from 'vue';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

onMounted(() => {
  let chartDom = document.getElementById('main');
  let myChart = echarts.init(chartDom);

  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '20%',
      right: '15%',
      orient: 'vertical', // 图例的排列方向
      textStyle: {
        color: '#fff', // 图例文字颜色
        fontSize: 14,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['35%', '58%'], //调整饼图的位置
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
        },
        // emphasis: { // 鼠标悬浮上去的效果
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold',
        //   },
        // },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '直播' },
          { value: 484, name: '娱乐' },
          { value: 300, name: '财经' },
        ],
      },
    ],
    //调整图形图标的位置
    grid: {
      left: 0,
    },
  };

  option && myChart.setOption(option);
});
</script>

<style scoped>
.age {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  & .age-title {
    margin-top: 5px;
    & p {
      color: #fff;
      font-size: 20px;
    }
  }
  & .age-echarts {
    width: 100%;
    height: 80%;
  }
}
</style>
