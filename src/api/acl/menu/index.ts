import { ResponseData } from '@/api/product/attr/type';
import request from '@/utils/request';
import { MenuData } from '../role/type';

// 菜单管理相关的接口
enum API {
  // 获取全部菜单与按钮的标识数据
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 给某一级菜单新增一个子菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  // 更新某一个已有的菜单
  UPDATEMENU_URL = '/admin/acl/permission/update',
  // 根据已有菜单的 id进行删除
  DELETEMENU_URL = '/admin/acl/permission/remove/',
}
// 获取菜单数据
export const reqAllMenuList = () =>
  request.get<any, ResponseData<MenuData[]>>(API.ALLPERMISSION_URL);
// 添加与更新的方法
export const reqAddOrUpdateMenu = (data: MenuData) => {
  // 判断是否有id，如果有就是更新，没有就是添加
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data);
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data);
  }
};
// 删除已有菜单
export const reqDeleteMenu = (id: number) =>
  request.delete<any, any>(API.DELETEMENU_URL + id);
