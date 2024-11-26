// 矢量图组件
import SvgIcon from './SvgIcon/index.vue';
// 筛选框组件
import Category from './Category/index.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const allGlobalComponent: any = { SvgIcon, Category };

/*
  全局组件注册插件
    对外暴露插件对象
*/
export default {
  // 方法名称必须是 install
  install(app: any) {
    // 先获取到对象里面所有的 键 并放到数组里面进行遍历
    // 然后对遍历出来的结果进行注册，注册方式为：名称，组件
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key]);
    });
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
