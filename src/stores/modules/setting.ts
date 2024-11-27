// layout组件相关配置的仓库
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLayoutSettingStore = defineStore('SettingStore', () => {
  // 控制侧边栏是否折叠，默认不折叠
  let fold = ref(false);
  let refsh = ref(false);

  return {
    fold,
    refsh,
  };
});
