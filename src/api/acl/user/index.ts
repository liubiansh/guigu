import { pageNationResponseData } from '@/api/product/trademark/type';
import request from '@/utils/request';
import { ResAllRoleData, SetRoleData, UserInfo } from './type';
import { ResponseData } from '@/api/product/attr/type';

// 用户管理模块的接口
enum API {
  // 获取全部已有用户账号信息
  ALLUSER_URL = '/admin/acl/user/',
  // 新增账号
  ADDUSER_URL = '/admin/acl/user/save',
  // 修改账号
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取全部职位及当前账号拥有的职位
  ALLROLEURL = '/admin/acl/user/toAssign/',
  // 分配角色
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 删除多个账号
  DELETEUSERS_URL = '/admin/acl/user/batchRemove',
}
// 获取用户账号信息
export const reqAllUserInfo = (
  pageNo: number,
  pageSize: number,
  username?: string
) =>
  request.get<any, pageNationResponseData<UserInfo[]>>(
    API.ALLUSER_URL + `${pageNo}/${pageSize}/?username=${username}`
  );
// 新增或更新账号信息
export const reqAddOrUpdateUserInfo = (data: UserInfo) => {
  // 有id是修改
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data);
  } else {
    // 没有id是新增
    return request.post<any, any>(API.ADDUSER_URL, data);
  }
};
// 获取全部职位以及当前账号拥有的职位
export const reqAllRole = (userId: number) =>
  request.get<any, ResponseData<ResAllRoleData>>(API.ALLROLEURL + userId);
// 分配角色
export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data);
// 删除某一个账号
export const reqDeleteUser = (id: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + id);
// 批量删除账号
export const reqDeleteUsers = (idList: number[]) =>
  request.delete<any, any>(API.DELETEUSERS_URL, { data: idList });
