<template>
  <div class="rank">
    <div class="rank-title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图表容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="rank">
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
      text: '景区排行(多个图表)',
      link: 'http://www.baidu.com', //主标题的超链接
      // 标题的位置
      left: 'center',
      // 主标题的位置
      top: 15,
      // 主标题的字体样式
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
      // 副标题
      subtext: '各大景区Top 10',
      // 副标题的位置
      subtextStyle: {
        color: '#fff',
        fontSize: 16,
      },
    },
    xAxis: {
      type: 'category', //图形图表在x轴上均分
    },
    yAxis: {},
    // 布局
    grid: {
      left: 30,
      right: 20,
      bottom: 30,
      top: 80,
    },
    // 系列,可以放多个
    series: [
      // 柱状图
      {
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60, 70],
        // 柱状图上面的文本标签
        label: {
          show: true,
          position: 'insideTop',
          color: '#f9f26c',
        },
        // 背景色
        showBackground: true,
        // backgroundStyle: {
        // color: '#ccc',
        // },
        // 柱条的样式
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          // 柱条颜色（支持函数）
          color: function (params: any) {
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
            return arr[params.dataIndex];
          },
        },
        // 柱条的宽度
        barWidth: 20,
      },
      // 折线图
      {
        type: 'line',
        data: [10, 20, 30, 40, 50, 60, 70],
        smooth: true,
      },
    ],
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
.rank {
  background: url(../../images/dataScreen-main-rt.png) no-repeat;
  background-size: cover;
  margin-top: 10px;
  .rank-title {
    margin-top: 5px;
    margin-left: 20px;
    p {
      color: #fff;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
