// 属性管理相关的接口
import request from '@/utils/request';
import { Attr, AttrValueList, CategoryObj, ResponseData } from './type';
// 属性接口地址
enum API {
  // 分类地址
  C1_URL = '/admin/product/getCategory1',
  C2_URL = '/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  // 所有属性地址
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加或修改已有属性值的地址
  ADDORUPDATE_URL = '/admin/product/saveAttrInfo',
  // 删除某一个已有的属性
  DELETE_URL = '/admin/product/deleteAttr/',
}

// 一级分类
export const reqC1 = () => request.get<any, ResponseData<CategoryObj[]>>(API.C1_URL);
// 二级分类
export const reqC2 = (C1Id: number | string) =>
  request.get<any, ResponseData<CategoryObj[]>>(API.C2_URL + C1Id);
// 三级分类
export const reqC3 = (C2Id: number | string) =>
  request.get<any, ResponseData<CategoryObj[]>>(API.C3_URL + C2Id);
// 对应分类的属性值
export const reqAttr = (
  C1Id: number | string,
  C2Id: number | string,
  C3Id: number | string
) => request.get<any, ResponseData<Attr[]>>(`${API.ATTR_URL}${C1Id}/${C2Id}/${C3Id}`);
// 新增或修改已有属性，因为服务器返回的data数据为null，所以直接定义为any
export const reqAddOrUpdateAttr = (data: AttrValueList) =>
  request.post<any, any>(API.ADDORUPDATE_URL, data);
// 删除属性
export const reqDeleteAttr = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id);
