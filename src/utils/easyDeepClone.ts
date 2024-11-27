// 简易版深拷贝方法
export function easyDeepClone<T = any>(target: T): T {
  return JSON.parse(JSON.stringify(target));
}
