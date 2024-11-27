<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" class="avatar" alt="" />
      <div class="right">
        <!-- 使用封装的时间插件 -->
        <h3 class="title">{{ getTime() }}好{{ userStore.username }}</h3>
        <p class="subtitle">硅谷甄选运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottom">
    <svg-icon name="welcome" width="500px" height="400px"></svg-icon>
  </div>
</template>

<script setup lang="ts" name="home">
import { useUserStore } from '@/stores/modules/user';
import { getTime } from '@/utils/time';
// 获取存储用户信息的仓库对象
let userStore = useUserStore();
</script>

<style scoped>
.box {
  display: flex;
  & .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  & .right {
    margin-left: 30px;
    & .title {
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 30px;
      font-weight: bold;
    }
    & .subtitle {
      font-style: italic;
      font-size: 20px;
      color: rgba(140, 140, 141, 0.445);
    }
  }
}
.bottom {
  display: flex;
  justify-content: center;
  margin-top: 10%;
}
</style>
