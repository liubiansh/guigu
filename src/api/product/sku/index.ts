import request from '@/utils/request';
import { pageNationResponseData } from '../trademark/type';
import { ResponseData } from '../attr/type';
import { SkuData } from './type';

// SKU模块相关的接口
enum API {
  // 获取已有的商品数据
  SKU_URL = '/admin/product/list/',
  // 上架接口
  SALE_URL = '/admin/product/onSale/',
  // 下架接口
  CANCELSALE_URL = '/admin/product/cancelSale/',
  // 获取商品详情
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除已有的商品
  DELETESKU_URL = '/admin/product/deleteSku/',
}
// 获取商品
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, pageNationResponseData<SkuData[]>>(
    API.SKU_URL + page + '/' + limit
  );
// 上架请求
export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId);
// 下架请求
export const reqCancelSKu = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId);
// 获取商品详情的接口
export const reqSkuInfo = (skuId: number) =>
  request.get<any, ResponseData<SkuData>>(API.SKUINFO_URL + skuId);
// 删除某一个已有的商品
export const reqDeleteSku = (skuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId);
