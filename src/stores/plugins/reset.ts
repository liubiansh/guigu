import { easyDeepClone } from '@/utils/easyDeepClone';
// pinia插件的类型
import type { PiniaPlugin } from 'pinia';

// pinia仓库默认是没有 $reset方法的，但是使用选项式创建仓库可以自动实现
// 以下是在组合式仓库中使用 $reset方法的实现
export const piniaReset: PiniaPlugin = ({ store }) => {
  // 把当前仓库的状态进行一个深拷贝，方便后续重置
  const initialState = easyDeepClone(store.$state);
  // 给当前仓库动态添加一个函数，用来实现仓库的重置
  store.$reset = () => {
    // 使用$patch方法修改 store的状态，接收当前仓库的状态对象作为参数
    // 然后把初始化的状态进行赋值从而实现重置仓库状态的方法
    store.$patch(($state) => Object.assign($state, initialState));
  };
};
