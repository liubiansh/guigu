<template>
  <div class="404">
    <div class="container">
      <div class="title">找不到您的页面</div>
      <div class="img"> </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="404"></script>

<style scoped>
.container {
  margin-top: 2%;
}
.title {
  text-align: center;
  font-size: 30px;
  color: #666;
}
.img {
  width: 50vw;
  height: 70vh;
  margin: 0 auto;
  background-image: url(../../assets/images/error_images/404.png);
  background-size: cover;
}
</style>
