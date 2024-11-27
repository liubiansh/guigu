import { createApp } from 'vue';
// 使用 el组件
import ElementPlus from 'element-plus';
// 使用 el样式
import 'element-plus/dist/index.css';
// 使用 el暗黑样式
import 'element-plus/theme-chalk/dark/css-vars.css';
import App from './App.vue';
// 配置 element-plus国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// 引入自定义全局注册插件
import globalComponent from '@/components';
// 引入模版的全局样式
import '@/styles/index.scss';
// 引入路由
import router from './router';
// 引入 pinia仓库
import pinia from './stores';
// 路由鉴权
import '@/router/permission';
// pinia重置插件
import { piniaReset } from './stores/plugins/reset';
// svg插件需要配置代码
import 'virtual:svg-icons-register';

// 创建 app实例对象
const app = createApp(App);
// 使用 pinia
app.use(pinia);
// 使用 pinia的重置方法
pinia.use(piniaReset);
// 使用 element组件库并设置为中文
app.use(ElementPlus, {
  locale: zhCn,
});
// 使用自定义全局注册插件
app.use(globalComponent);
// 注册路由
app.use(router);
// 挂载 app
app.mount('#app');
