// 通过 vue-router插件实现模版路由配置
import { createRouter, createWebHashHistory } from "vue-router";
// 引入定义好的路由常量
import { constantRoute } from "./routes";

// 创建路由器
let router = createRouter({
  // 路由模式 hash
  history: createWebHashHistory(),
  routes: constantRoute,
  // 配置滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
});
export default router;