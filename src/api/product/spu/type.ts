// SPU的类型
export interface SpuData {
  // 新增的没有 id字段
  id?: number;
  // 品牌名字
  spuName: string;
  // 品牌ID，起始值有可能是空串
  tmId: number | string;
  // SPU描述
  description: string;
  // 初始值为空字符串
  category3Id: string | number;
  // 主页面获取到的数据为 null，但是收集的时候需要对应的数据
  spuSaleAttrList: null | SpuSaleAttr[];

  spuImageList: null | SpuImage[];
}
// 定义获取已有的SPU接口返回的数据
export interface HasSpuResponseData {
  code: number;
  message: string;
  ok: boolean;
  data: {
    records: SpuData[];
    total: number;
    size: number;
    current: number;
    searchCount: boolean;
    pages: number;
  };
}
// 商品图片的ts类型
export interface SpuImage {
  // 如果新增的没有 id
  id?: number;
  imgName?: string;
  imgUrl?: string;
  spuId?: number;
  createTime?: null;
  updateTime?: null;
  // el组件能识别的图片墙字段
  name?: string;
  url?: string;
}
// 销售属性对象类型
export interface SpuSaleAttr {
  // 新增的时候需要收集的：销售属性的名字、id
  id?: number;
  createTime?: null;
  updateTime?: null;
  spuId?: number;
  flag?: boolean;
  saleAttrValue?: string;
  baseSaleAttrId: number | string;
  saleAttrName: string;
  spuSaleAttrValueList: SpuSaleAttrValue[];
  saleIdAndValueId?: string; //添加SKU时收集的数据
}
// 已有的销售属性值对象类型
export interface SpuSaleAttrValue {
  // 新增时属性值列表需要：归属的属性id、属性值名称
  id?: number;
  saleAttrValueName: string;
  baseSaleAttrId: number | string;
  saleAttrName?: string;
  spuId?: number;
  isChecked?: boolean;
  createTime?: null;
  updateTime?: null;
}
// 所有的销售数据类型
export interface allSaleAttr {
  id: number;
  name: string;
}
