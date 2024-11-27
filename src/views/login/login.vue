<template>
  <div class="login_container">
    <!-- layout布局方式 -->
    <!-- 行 -->
    <el-row>
      <!-- 列 :span用来设置分栏，总数是24 后面的xs是控制大小参考文档 -->
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 用 model属性绑定收集的对象，rules属性定义校验规则 -->
        <el-form
          class="login-form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <!-- 表单项 -->
          <!-- 用 prop定义每个表单项校验的规则，传入的字段是总规则里面的其中一项 -->
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              v-model="loginForm.password"
              :show-password="true"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login-btn"
              type="primary"
              size="default"
              @click="login"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="login">
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
// 引入用户相关的小仓库
import { useUserStore } from '@/stores/modules/user';
// 引入路由函数
import { useRouter } from 'vue-router';
// 引入 element消息提示窗
import { ElNotification } from 'element-plus';
// 引入获取当前时间的封装函数
import { getTime } from '@/utils/time';

// 使用 pinia仓库
let useStore = useUserStore();
// 使用 router
let $router = useRouter();

// 获取表单组件
let loginForms = ref();

// 按钮状态
let loading = ref(false);
// 收集账号与密码的数据,使用 v-model进行绑定，里面的值是初始值
let loginForm = reactive({ username: 'admin', password: '111111' });

// 登录按钮回调
// 点击后通知仓库发送登录请求
// 请求成功 -> 跳转到首页展示数据
// 请求失败 -> 弹出登录失败信息
// 使用 try-catch方法来进行结果的处理
const login = async () => {
  // 保证全部的表单项校验全部通过才能发请求
  await loginForms.value.validate();

  // 让按钮开始加载
  loading.value = true;
  try {
    // 可以用.then也可以用这个
    await useStore.userLogin(loginForm);
    // 如果请求成功就用编程式导航跳转到指定位置
    $router.push('/');
    // 登录成功的提示信息
    ElNotification({
      type: 'success',
      message: '登录成功',
      // 显示当前时间段
      title: `hi,${getTime()}好`,
    });
    loading.value = false;
  } catch (error: any) {
    // 登录失败的提示信息
    ElNotification({
      type: 'error',
      message: error || '登录失败，请稍后重试',
    });
    loading.value = false;
  }
};

// 自定义校验规则函数
// const validatorUserName = (rule:any,value:any,callback:any) => {
//   // rule：即为校验规则对象
//   // value为表单元素的文本内容
//   // callback为放行规则（可以写正则），成功直接放行，失败需要注入提示信息
//   if(value.length>=5 && value.length<=10 ){
//     callback()
//   }else{
//     callback(new Error('账号长度为5~10位'))
//   }
// }
// const validatorUserPassword = (rule:any,value:any,callback:any) => {
//   // rule：即为校验规则对象
//   // value为表单元素的文本内容
//   // callback为放行规则（可以写正则），成功直接放行，失败需要注入提示信息
//   if(value.length>=6 && value.length<=12 ){
//     callback()
//   }else{
//     callback(new Error('密码长度为6~12位'))
//   }
// }

// 定义校验配置对象
const rules = {
  /* 
    属性：
      require：确定该字段是否要校验
      message：提示信息
      trigger：触发时机：blur为失去焦点时，change为数据发生改变时
  */
  username: [
    {
      required: true,
      min: 5,
      max: 10,
      message: '账号长度为6~10位',
      trigger: 'change',
    },
    // {trigger:'change',validator:validatorUserName}
  ],
  password: [
    {
      require: true,
      min: 6,
      max: 15,
      message: '密码长度为6~15位',
      trigger: 'change',
    },
    // {trigger:'change',validator:validatorUserPassword}
  ],
};
</script>

<style scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}

.login-form {
  position: relative;
  width: 60%;
  top: 30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;

  & h1 {
    color: white;
    font-size: 40px;
  }

  & h2 {
    color: white;
    font-size: 20px;
    margin: 10px 0;
  }
}
.login-btn {
  width: 100%;
}
</style>
