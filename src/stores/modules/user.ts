// 创建用户相关的小仓库
import { defineStore } from 'pinia';
// 引入接口
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user';
// 引入数据类型
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type';
import { ref } from 'vue';
// 引入本地存储方法
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token';
// 引入常量路由
import { constantRoute } from '@/router/routes';

// 创建用户小仓库并暴露
export const useUserStore = defineStore('User', () => {
  // 存储数据
  // 获取用户的唯一标识 token
  let token = ref(GET_TOKEN());
  // 存储生成菜单需要的数组(路由)
  let menuRoutes = ref(constantRoute);
  // 用户名
  let username = ref('');
  // 头像
  let avatar = ref('');

  // 异步|逻辑处理
  //用户登录的方法
  async function userLogin(data: loginFormData) {
    //登录请求
    let result: loginResponseData = await reqLogin(data);
    //登录请求:成功200->token
    //登录请求:失败201->登录失败错误的信息
    if (result.code == 200) {
      //pinia仓库存储一下token
      //由于pinia|vuex存储数据其实利用js对象
      token.value = result.data as string;
      //本地存储持久化存储一份
      SET_TOKEN(result.data as string);
      //能保证当前async函数返回一个成功的promise
      return 'ok';
    } else {
      return Promise.reject(result.data);
    }
  }
  //获取用户信息方法
  async function userInfo() {
    //获取用户信息进行存储仓库当中[用户头像、名字]
    let result: userInfoResponseData = await reqUserInfo();
    //如果获取用户信息成功，存储一下用户信息
    if (result.code == 200) {
      username.value = result.data.name;
      localStorage.setItem('userRole', result.data.roles[0]);
      avatar.value = result.data.avatar;
      return 'ok';
    } else {
      return Promise.reject(new Error(result.message));
    }
  }
  //退出登录
  async function userLogout() {
    //退出登录请求
    let result: any = await reqLogout();
    if (result.code == 200) {
      // 退出登录接口(通知服务器本地用户唯一标识失效)
      token.value = '';
      username.value = '';
      avatar.value = '';
      REMOVE_TOKEN();
      return 'ok';
    } else {
      return Promise.reject(new Error(result.message));
    }
  }
  // 计算属性
  getters: {
  }
  return {
    token,
    username,
    avatar,
    userLogin,
    userInfo,
    userLogout,
    menuRoutes,
  };
});
