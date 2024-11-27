<template>
  <div class="permission">
    <!-- 当绑定的数据里面含有 children项时，会触发树形表格，row-key就是每一项的唯一标识 -->
    <el-table :data="menuList" row-key="id" border stripe>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column
        label="修改时间"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="220px">
        <!-- row已有的菜单或按钮对象 -->
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="addPermission(row)"
            :disabled="row.level === 4"
            >{{ row.level >= 3 ? '添加功能' : '添加菜单' }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="editPermission(row)"
            :disabled="row.level === 1"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`你确定要删除${row.name}吗？`"
            @confirm="delPermission(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" :disabled="row.level === 1"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用于添加或更新已有的菜单数据 -->
    <el-dialog
      :title="menuData.id ? '更新菜单' : '添加菜单'"
      v-model="dialogVisible"
      @close="initForm"
    >
      <!-- 表单元素:收集新增与已有的菜单的数据 -->
      <el-form label-width="80px" :inline="false">
        <el-form-item label="名称">
          <el-input
            v-model="menuData.name"
            placeholder="请输入菜单名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="权限值">
          <el-input
            v-model="menuData.code"
            placeholder="请输入权限值"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="permission">
import {
  reqAddOrUpdateMenu,
  reqAllMenuList,
  reqDeleteMenu,
} from '@/api/acl/menu';
import { MenuData } from '@/api/acl/role/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
// 存储菜单数据
let menuList = ref<MenuData[]>([]);
// 控制对话框的显示与隐藏
let dialogVisible = ref(false);
// 发送请求时携带的参数
let menuData = reactive<MenuData>({
  name: '',
  code: '',
  pid: 0,
  level: 0,
});
// 获取菜单数据的方法
const getHasPermission = async () => {
  let res = await reqAllMenuList();
  if (res.code === 200) {
    menuList.value = res.data;
  }
};
// 添加菜单按钮的回调
const addPermission = (row: MenuData) => {
  dialogVisible.value = true;
  // 收集新增菜单的 level数值，因为添加的是子菜单，所以需要 +1
  menuData.level = row.level + 1;
  // 新增的父级 id(pid)其实就是当前选择的 id
  menuData.pid = row.id as number;
};
// 编辑按钮的回调
const editPermission = (row: MenuData) => {
  // 点击编辑按钮，将当前行数据收集
  Object.assign(menuData, row);
  // 弹出对话框
  dialogVisible.value = true;
};
/**
 * dialog组件
 */
// 确定按钮的回调
const save = async () => {
  // 新增子菜单或者更新某一个已有的菜单数据
  let res = await reqAddOrUpdateMenu(menuData);
  if (res.code === 200) {
    // 隐藏对话框
    dialogVisible.value = false;
    // 提示信息
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新菜单成功' : '添加菜单成功',
    });
    // 再次获取全部最新的菜单数据
    getHasPermission();
  } else {
    ElMessage({
      type: 'error',
      message: res.data,
    });
  }
};
// 关闭时的回调
const initForm = () => {
  // 清空数据
  Object.assign(menuData, {
    name: '',
    code: '',
    pid: 0,
    level: 0,
    id: 0,
  });
};
/**
 * 泡泡提示框
 */
// 确定回调
const delPermission = async (id: number) => {
  let res = await reqDeleteMenu(id);
  if (res.code === 200) {
    ElMessage.success('删除菜单成功');
    getHasPermission();
  } else {
    ElMessage({
      type: 'error',
      message: res.data,
    });
  }
};
// 挂载时获取下数据
onMounted(() => {
  getHasPermission();
});
</script>

<style scoped></style>
