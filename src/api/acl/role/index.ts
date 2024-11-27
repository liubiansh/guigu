import { pageNationResponseData } from '@/api/product/trademark/type';
import request from '@/utils/request';
import { AllRoleData, MenuData } from './type';
import { ResponseData } from '@/api/product/attr/type';

// 角色管理接口
enum API {
  // 获取全部职位的接口
  ALLROLE_URL = '/admin/acl/role/',
  // 新增岗位
  ADDROLE_URL = '/admin/acl/role/save',
  // 修改岗位
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取某个角色全部的菜单与按钮的数据
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 给相应的职位分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  // 根据id删除岗位
  DELETEROLE_URL = '/admin/acl/role/remove/',
}
// 获取全部角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, pageNationResponseData<AllRoleData[]>>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`
  );
// 添加或更新已有职位
export const reqAddOrUpdateRole = (data: AllRoleData) => {
  // 判断是否有id，有就是修改，没有就是添加
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data);
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data);
  }
};
// 获取某个角色全部的菜单与按钮的数据
export const reqAllUserMenuList = (id: number) =>
  request.get<any, ResponseData<MenuData[]>>(API.ALLPERMISSION_URL + id);
// 给相应的职位下发权限，如果要使用axois的params传参，其第二个参数是请求体参数
// 需要放在第三个参数中，如果传的参数里面含有数组类型的数据，会把他通过序列化的方式转化
// 所以需要用字符串拼接的方式进行发送
export const reqSetPermission = (roleId: any, permissionId: any) =>
  request.post<any, any>(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`
  );
// 删除已有的职位
export const reqDeleteRole = (id: number) =>
  request.delete<any, any>(API.DELETEROLE_URL + id);
