<template>
  <div class="center-map" ref="mapRef"> </div>
</template>

<script setup lang="ts" name="center-map">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
// 引入中国地图的JSON数据
import chinaJSON from './china.json';
let mapRef = ref();
// 注册中国地图
echarts.registerMap('china', chinaJSON as any);
onMounted(() => {
  let myChart = echarts.init(mapRef.value);
  // 设置配置项
  myChart.setOption({
    // 地图组件
    geo: {
      id: 'china',
      map: 'china', //中国地图
      roam: true, //鼠标缩放、平移
      zoom: 1.4, //初始缩放比例
      top: 190,
      left: 150,
      // 地图上文字的设置
      label: {
        show: true, //显示
        color: '#FFFFFB',
        fontSize: 14,
      },
      //每一个多边形的样式
      itemStyle: {
        color: {
          type: 'redial',
          x: 0.5, // 左
          y: 0.5, // 上
          r: 0.5,
          colorStops: [
            {
              offset: 0,
              color: '#2EA9DF', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#33A6B8', // 100% 处的颜色
            },
          ],
          global: false, //true为绝对像素位置，false为百分比
        },
        opacity: 0.8,
        borderColor: '#ddd',
      },
      // 地图高亮的效果
      emphasis: {
        label: {
          color: '#D7C4BB',
          fontSize: 38,
        },
      },
    },
    xAxis: {},
    yAxis: {},
    // 布局位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    // 系列
    series: [
      {
        type: 'lines', //航线系列
        data: [
          {
            // 坐标数据
            coords: [
              [126.642464, 45.756967], //起点
              [102.712251, 25.040609], //终点
            ],
            // 统一样式设置
            lineStyle: {
              color: '#f0f5',
              type: 'dashed',
              width: 2,
              curveness: 0.2,
            },
          },
          {
            // 坐标数据
            coords: [
              [116.405285, 39.904989], //起点
              [121.472644, 31.231706], //终点
            ],
            // 统一样式设置
            lineStyle: {
              color: '#f0f5',
              type: 'dashed',
              width: 2,
              curveness: 0.2,
            },
          },
        ],
        // 是否显示特效
        effect: {
          show: true,
          symbol: 'pin', // 箭头样式
          color: '#fff5',
          symbolSize: 30,
        },
      },
    ],
  });
});
</script>

<style scoped></style>
