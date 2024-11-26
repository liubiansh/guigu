// SPU属性相关的接口

import request from '@/utils/request';
import {
  allSaleAttr,
  HasSpuResponseData,
  SpuData,
  SpuImage,
  SpuSaleAttr,
} from './type';
import { ResponseData } from '../attr/type';
import { TradeMark } from '../trademark/type';
import { SkuData } from '../sku/type';

enum API {
  // 获取已有的SPU数据
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某一个SPU下的全部的图片
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某一个SPU已有的销售属性
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加新的 SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的 SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加新的 SKU
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除已有的SPU
  DELETESPU_URL = '/admin/product/deleteSpu/',
}

// 获取某一个三级分类下已有的SPu数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`
  );
// 获取全部品牌的数据
export const reqAllTrademark = () =>
  request.get<any, ResponseData<TradeMark[]>>(API.ALLTRADEMARK_URL);
// 获取某一个SPU下的全部的图片
export const reqSpuImage = (spuId: number) =>
  request.get<any, ResponseData<SpuImage[]>>(API.IMAGE_URL + spuId);
// 获取某一个SPU已有的销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, ResponseData<SpuSaleAttr[]>>(API.SPUHASSALEATTR_URL + spuId);
// 获取全部的销售属性
export const reqAllSaleAttr = () =>
  request.get<any, ResponseData<allSaleAttr[]>>(API.ALLSALEATTR_URL);
// 追加或者更新新的 SPU
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 如果有 id就是更新已有的数据
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data);
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data);
  }
};
// 添加 SKU请求的方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data);
// 获取SKU的数据
export const reqSpuSkuList = (spuId: number) =>
  request.get<any, any>(API.SKUINFO_URL + spuId);
// 删除已有的SPU
export const reqDeleteSpu = (spuId: number) =>
  request.delete<any, any>(API.DELETESPU_URL + spuId);
