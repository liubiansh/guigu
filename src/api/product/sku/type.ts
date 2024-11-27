// sku展示页面的类型
// 销售属性
interface skuSaleAttrValueList {
  id?: number;
  createTime?: string;
  updateTime?: string;
  skuId?: number;
  spuId?: number;
  saleAttrValueId: number | string;
  saleAttrId: number | string;
  saleAttrName?: string;
  saleAttrValueName?: string;
}
// 平台属性
interface skuAttrValueList {
  id?: number;
  createTime?: string;
  updateTime?: string;
  attrId: number | string;
  valueId: number | string;
  skuId?: number;
  attrName?: string;
  valueName?: string;
}
// sku图片
interface skuImageList {
  id: number;
  createTime: string;
  updateTime: string;
  skuId: number;
  imgName: string;
  imgUrl: string;
  spuImgId: number;
  isDefault: string;
}
export interface SkuData {
  category3Id: number | string; //三级分类id
  spuId: number | string; //已有的spu的id
  tmId: number | string; //spu的品牌id
  skuName: string; //sku名字
  price: number | string; //价格
  weight: string | number; //重量
  skuDesc: string; //sku描述
  skuSaleAttrValueList?: skuSaleAttrValueList[];
  skuAttrValueList?: skuAttrValueList[];
  skuDefaultImg: string; //sku图片地址
  skuImageList?: skuImageList[];
  createTime?: '';
  id?: number;
  isSale?: number; //是否上架
  updateTime?: '';
}
