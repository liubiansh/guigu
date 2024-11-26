// 路由鉴权文件，路由能不能被访问的权限设置
// 在入口文件引入
// 引入进度条插件
import nprogress from 'nprogress';
// 引入进度条样式,在根目录下可以修改样式
import 'nprogress/nprogress.css';
// 获取用户相关的小仓库内部 token数据，判断用户是否登录
import { useUserStore } from '@/stores/modules/user';
import setting from '@/setting';
import router from '.';

// 全局守卫：项目当中任意路由切换都会触发的钩子
// 全局前置守卫
// to: 去哪 from: 从哪 next: 放行函数
// router.beforeEach(async (to, from, next) => {
//   // 在函数外部执行时会先于 pinia仓库创建执行，所以放在函数内部
//   let userStore = useUserStore();

//   // 访问某一个路由之前的守卫
//   // 访问前开启进度条
//   nprogress.start();
//   // 获取 token判断用户登录状态
//   let token = userStore.token;
//   // 获取用户名
//   let username = userStore.username;
//   if (token) {
//     //登录成功,访问login,不能访问,指向首页
//     if (to.path == '/login') {
//       next({ path: '/' });
//     } else {
//       //登录成功访问其余六个路由(登录排除)
//       //有用户信息
//       if (username) {
//         //放行
//         next();
//       } else {
//         //如果没有用户信息,在守卫这里发请求获取到了用户信息再放行
//         try {
//           //获取用户信息
//           await userStore.userInfo();
//           //放行
//           //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
//           next({ ...to });
//         } catch (error) {
//           //token过期:获取不到用户信息了
//           //用户手动修改本地存储token
//           //退出登录->用户相关的数据清空
//           await userStore.userLogout();
//           next({ path: '/login', query: { redirect: to.path } });
//         }
//       }
//     }
//   } else {
//     //用户未登录判断
//     if (to.path == '/login') {
//       next();
//     } else {
//       next({ path: '/login', query: { redirect: to.path } });
//     }
//   }
// });

// 全局后置守卫
router.afterEach((to) => {
  // 访问后结束进度条
  nprogress.done();
  // 展示在网页标题
  document.title = `${setting.title} - ${to.meta.title}`;
});
