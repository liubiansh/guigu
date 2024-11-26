import { ElMessage } from 'element-plus';

export function useInputRepeat(attrParams: any, row: any, index: number) {
  // 检查属性值是否为空
  if (row.valueName?.trim() === '') {
    attrParams.attrValueList.splice(index, 1);
    return ElMessage.error('属性值不能为空');
  }

  // 检查属性值是否重复
  attrParams.attrValueList.forEach((item: any) => {
    if (row !== item) {
      if (item.valueName === row.valueName) {
        attrParams.attrValueList.splice(index, 1);
        return ElMessage.error('属性值不能重复');
      }
    }
  });
}
