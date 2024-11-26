// 所有职位的数据
export interface AllRoleData {
  id?: number;
  createTime?: string;
  updateTime?: string;
  roleName: string;
  remark?: null;
}
// 菜单与按钮数据的类型，这里的子类数据和父类数据是一样的
export interface MenuData {
  id?: number;
  createTime?: string;
  updateTime?: string;
  pid: number; //给谁添加的菜单，相当于父级id
  name: string;
  code: string;
  toCode?: string;
  type?: number;
  status?: null;
  level: number;
  children?: MenuData[];
  select?: boolean;
}
