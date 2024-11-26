<template>
  <div class="sex">
    <div class="sex-title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="sex-content">
      <div class="sex-content-man">
        <p>男士</p>
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="sex-content-woman">
        <p>女士</p>
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="sex-rate">
      <p>男士58%</p>
      <p>女性42%</p>
    </div>
    <div class="sex-echarts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="sex">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

let charts = ref();
onMounted(() => {
  let myChart = echarts.init(charts.value);
  myChart.setOption({
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category', //均分，如果只有一个就是铺满
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          borderRadius: 50,
          color: '#6DD5FA',
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        // 调整女士柱条的位置
        barGap: '-100%',
        itemStyle: {
          borderRadius: 50,
          // 设置渐变色
          color: {
            type: 'linear',
            x: 1, // 左
            y: 0, // 上
            x2: 0, // 右
            y2: 0, // 下
            colorStops: [
              {
                offset: 0,
                color: '#ee9ca7', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#ffdde1', // 100% 处的颜色
              },
            ],
            global: false, //true为绝对像素位置，false为百分比
          },
        },
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    label: {
      show: false,
      position: 'center',
    },
    emphasis: {
      label: {
        show: true,
        fontSize: '40',
        fontWeight: 'bold',
      },
    },
    labelLine: {},
  });
});
</script>

<style scoped>
.sex {
  background: url(../../images/dataScreen-main-lc.png) no-repeat;
  background-size: cover;
  margin-top: 10px;
  & .sex-title {
    color: #fff;
    font-size: 20px;
  }
  & .sex-content {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    & .sex-content-man,
    .sex-content-woman {
      margin: 20px;
      margin-bottom: 10px;
      width: 111px;
      height: 115px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      color: #fff;
      & img {
        margin-bottom: 15px;
      }
    }
    & .sex-content-man {
      background: url(../../images/man-bg.png);
    }
    & .sex-content-woman {
      background: url(../../images/woman-bg.png);
    }
  }
  & .sex-rate {
    padding: 0 18%;
    display: flex;
    font-size: 18px;
    justify-content: space-between;
    color: #fff;
  }
  & .sex-echarts {
    height: 50px;
    padding: 0 15%;
    margin-bottom: 10px;
  }
}
</style>
