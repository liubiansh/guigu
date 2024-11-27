<template>
  <div class="role">
    <el-card
      shadow="always"
      :body-style="{ padding: '20px', paddingBottom: '0' }"
    >
      <el-form :inline="true">
        <el-form-item label="职位搜索">
          <el-input
            placeholder="请输入搜索职位关键字"
            v-model="keyWord"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :disabled="!keyWord"
            >搜索</el-button
          >
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card
      shadow="always"
      style="margin: 10px 0"
      :body-style="{ padding: '20px' }"
    >
      <el-button type="primary" size="default" @click="addRole"
        >添加职位</el-button
      >
      <el-table border :data="allRole" stripe style="margin-top: 10px">
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="roleName" label="职位名称"></el-table-column>
        <el-table-column
          prop="createTime"
          show-overflow-tooltip
          label="创建时间"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          show-overflow-tooltip
          label="更新时间"
        ></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="setPermission(row)"
              icon="User"
              >分配权限</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="updateRole(row)"
              icon="Edit"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`你确定要删除${row.roleName}吗？`"
              @confirm="delRole(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 6, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="sizeChange"
      @current-change="getHasRole"
    />
    <!-- 添加与更新的结构 -->
    <!-- 关闭时销毁组件，可以间接清空表单的校验 -->
    <el-dialog
      :title="roleParams.id ? '更新职位' : '添加职位'"
      v-model="dialogVisible"
      @close="initRole"
      :destroy-on-close="true"
    >
      <!-- model代表收集到的地方，rule代表校验规则，prop代表校验的字段名称 -->
      <el-form
        :model="roleParams"
        :rules="rules"
        ref="form"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="职位名称" prop="roleName">
          <el-input
            v-model="roleParams.roleName"
            placeholder="请你输入职位名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="save">确认</el-button>
      </template>
    </el-dialog>
    <!-- 抽屉组件：用来分配职位的菜单与按钮的权限 -->
    <el-drawer title="分配菜单与按钮的权限" v-model="drawer">
      <template #default>
        <!-- 树形控件 -->
        <!-- data为数组，show-checkbox节点可被选，node-key每个节点的唯一标识
          default-expanded-keys默认展开的节点数组，default-checked-keys默认勾选的节点数组
          default-expand-all默认展开全部的数组,props配置项 -->
        <el-tree
          ref="tree"
          style="max-width: 600px"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="selectArr"
          :props="defaultProps"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="role">
import {
  reqAddOrUpdateRole,
  reqAllRoleList,
  reqAllUserMenuList,
  reqDeleteRole,
  reqSetPermission,
} from '@/api/acl/role';
import { AllRoleData, MenuData } from '@/api/acl/role/type';
import { RoleData } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
// 当前页码
let pageNo = ref(1);
// 页容量
let pageSize = ref(3);
// 总数量
let total = ref(0);
// 职位搜索关键字
let keyWord = ref('');
// 保存下当前的角色
let userRole = ref('');
// 全部已有的职位
let allRole = ref<AllRoleData[]>([]);
// 控制对话框的显示与隐藏
let dialogVisible = ref(false);
// 收集新增岗位数据
let roleParams = reactive<AllRoleData>({
  roleName: '',
});
// 获取form组件实例
let form = ref();
// 控制抽屉的现实与隐藏
let drawer = ref(false);
// 存储当前用户已有的权限
let menuArr = ref<MenuData[]>([]);
// 树形组件的配置项
let defaultProps = {
  // 子节点的字段
  children: 'children',
  // 展示的字段
  label: 'name',
};
// 存储勾选的节点 ID，最后一级的
let selectArr = ref([]);
// 获取树形控件的组件实例
let tree = ref();
// 挂载时调取下职位数据
onMounted(() => {
  // 获取所有职位列表
  getHasRole();
});
// 获取所有职位列表及当前页码发生变化时的回调
const getHasRole = async (page = 1) => {
  // 修改页码
  pageNo.value = page;
  let res = await reqAllRoleList(pageNo.value, pageSize.value, keyWord.value);
  if (res.code === 200) {
    allRole.value = res.data.records;
    total.value = res.data.total;
  }
};
// 页容量改变时的回调
const sizeChange = () => {
  getHasRole();
};
// 搜索按钮的回调
const search = () => {
  // 根据关键字获取对应的用户数据
  getHasRole();
};
// 重置按钮
const reset = () => {
  // 清空收集的关键字
  keyWord.value = '';
  // 重新发请求
  getHasRole();
};
// 添加职位按钮
const addRole = () => {
  // 显示对话框
  dialogVisible.value = true;
};
// 分配权限按钮
const setPermission = async (row: RoleData) => {
  // 显示抽屉
  drawer.value = true;
  // 收集当前要分配权限的职位 id
  roleParams.id = row.id;
  // 收集当前修改的角色名字
  userRole.value = row.roleName;
  // 获取权限的数据
  let res = await reqAllUserMenuList(row.id as number);
  if (res.code === 200) {
    // 保存数据
    menuArr.value = res.data;
    // 把数据中选中的筛选出来保存下
    selectArr.value = filterSelectArr(menuArr.value, []);
  }
};
// 更新已有的职位
const updateRole = (row: AllRoleData) => {
  // 显示对话框
  dialogVisible.value = true;
  // 存储已有的职位，有ID
  Object.assign(roleParams, row);
};
// 删除已有的职位
const delRole = async (id: number) => {
  let res = await reqDeleteRole(id);
  if (res.code === 200) {
    ElMessage.success('删除成功');
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};
/**
 * 对话框组件
 */
// 职位相关的校验规则
const rules = reactive({
  roleName: [
    { required: true, min: 2, message: '职位名称至少两位', trigger: 'blur' },
  ],
});
// 确定按钮的回调
const save = async () => {
  // 结果通过发请求，结果不通过退出
  await form.value.validate();
  // 添加或者更新职位的请求
  let res = await reqAddOrUpdateRole(roleParams);
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: roleParams.id ? '更新成功' : '添加成功',
    });
    dialogVisible.value = false;
    // 更新留在当前页
    getHasRole(roleParams.id ? pageNo.value : 1);
  } else {
    ElMessage({
      type: 'error',
      message: roleParams.id ? '更新失败' : '添加失败',
    });
  }
};
// 清空表单数据
const initRole = () => {
  // 清空数据
  Object.assign(roleParams, {
    id: 0,
    roleName: '',
  });
};
/**
 * 抽屉组件
 */

// 定义一个用来处理树形数据的方法，把已经选中的数据过滤出来
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    // 如果被选中，并且是四级菜单就把他的id添加到数组里面
    if (item.select && item.level === 4) {
      initArr.push(item.id);
    }
    // 如果有子菜单就继续递归
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr);
    }
  });
  return initArr;
};
// 确定的回调
const confirm = async () => {
  // 职位的id
  const roleId = roleParams.id;
  // 选中的节点 id，这个方法可以获取所有被选中的id
  const arr = tree.value.getCheckedKeys();
  // 半选中的父节点id，这个可以获取所有半选中的id
  const arr1 = tree.value.getHalfCheckedKeys();
  // 下发请求
  let res = await reqSetPermission(roleId as number, [...arr1, ...arr]);
  if (res.code === 200) {
    // 抽屉关闭
    drawer.value = false;
    // 提示信息
    ElMessage.success('分配权限成功');
    // 如果更新的是当前角色，则刷新当前页面
    if (userRole.value == localStorage.getItem('userRole')) {
      window.location.reload();
    }
  }
};
</script>

<style scoped>
.el-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
