// 已有品牌的数据类型
export interface TradeMark {
  // 新增的品牌是没有 id的，需要数据库进行自动生成
  id?: number;
  tmName: string;
  logoUrl: string;
}
// 包含全部品牌数据的类型,为已有品牌的数据类型的数组格式
export type Records = TradeMark[];

// 带有分页器组件的请求返回类型
export interface pageNationResponseData<T> {
  code: number;
  message: string;
  ok: boolean;
  data: {
    records: T;
    total: number;
    size: number;
    current: number;
    orders: [];
    optimizeCountSql: boolean;
    hitCount: boolean;
    countId: null;
    maxLimit: null;
    searchCount: boolean;
    pages: number;
  };
}
