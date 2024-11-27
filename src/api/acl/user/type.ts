// 全部账号信息的类型
export interface UserInfo {
  id?: number;
  createTime?: string;
  updateTime?: string;
  username?: string;
  password?: string;
  name?: string;
  phone?: null;
  roleName?: string;
}
// 职位类型
export interface RoleData {
  id?: number;
  createTime?: string;
  updateTime?: string;
  roleName: string;
  remark: null;
}
// 职位接口返回的数据
export interface ResAllRoleData {
  assignRoles: RoleData[];
  allRolesList: RoleData[];
}
// 分配角色携带的参数类型
export interface SetRoleData {
  roleIdList: number[];
  userId: number;
}
