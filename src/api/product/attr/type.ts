// 分类相关数据的类型

export interface ResponseData<T> {
  code: number;
  message: string;
  ok: boolean;
  data: T;
}

// 分类ts类型
export interface CategoryObj {
  id: number | string;
  name: string;
  Category1Id?: number;
  Category2Id?: number;
}

// 属性与属性值的类型
// 属性值的类型
export interface AttrValueList {
  id?: number;
  createTime?: string | null;
  updateTime?: string | null;
  valueName?: string;
  attrId?: number;
  flag?: boolean;
}
// 属性对象
export interface Attr {
  id?: number;
  createTime?: string | null;
  updateTime?: string | null;
  attrName: string;
  categoryId: number | string;
  categoryLevel: number | string;
  attrValueList: AttrValueList[];
  attrIdAndValueId?: string; //添加SKU时收集的数据
}
