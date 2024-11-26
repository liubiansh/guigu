// 品牌管理接口
import request from '@/utils/request';
import { Records, TradeMark, pageNationResponseData } from './type';
// 接口地址
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌接口
  ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save/',
  // 修改品牌接口
  UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除已有品牌
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}
// 获取已有品牌接口方法
// page：获取第几页，默认第一页
// limit：一页获取几个
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, pageNationResponseData<Records>>(
    API.TRADEMARK_URL + page + '/' + limit
  );
// 因为两个接口差不多，所以封装成一个方法
// 添加与修改已有品牌接口方法
export const reqAddOrUpdateTradeMark = (data: TradeMark) => {
  // 修改
  if (data.id) {
    return request.put<any, any>(API.UPDATE_TRADEMARK_URL, data);
  } else {
    // 新增
    return request.post<any, any>(API.UPDATE_TRADEMARK_URL + data);
  }
};
// 删除某一个已有品牌的数据
export const reqDeleteTradeMark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id);
