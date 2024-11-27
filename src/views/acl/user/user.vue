<template>
  <div class="user">
    <el-card :body-style="{ padding: '20px', paddingBottom: '0' }">
      <el-form class="user-form" ref="form" label-width="80px" :inline="true">
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :disabled="!keyword"
            >搜索</el-button
          >
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px" :body-style="{ padding: '15px' }">
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button
        type="primary"
        :disabled="!selectIdArr.length"
        @click="deleteUsers"
        >批量删除</el-button
      >
      <el-table
        @selection-change="selectionChange"
        :data="userInfoArr"
        style="margin: 10px 0"
        border
        stripe
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          align="center"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column
          min-width="81px"
          prop="username"
          label="用户名字"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="用户名称"
          min-width="81px"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="roleName"
          label="用户角色"
          min-width="81px"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="创建时间"
          min-width="81px"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="updateTime"
          label="更新时间"
          min-width="81px"
        ></el-table-column>
        <el-table-column label="操作" width="270px">
          <template #="{ row }">
            <el-button
              type="primary"
              icon="User"
              size="small"
              @click="setRole(row)"
              >分配角色</el-button
            >
            <el-button
              type="primary"
              icon="Edit"
              size="small"
              @click="updateUser(row)"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`你确定要删除【${row.username}】吗？`"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button type="primary" icon="Delete" size="small"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[5, 7, 9, 11]"
          :background="true"
          layout=" prev, pager, next, jumper,->,sizes, total"
          :total="total"
          @size-change="getHasUserInfo()"
          @current-change="getHasUserInfo"
        />
      </div>
    </el-card>
    <!-- 抽屉结构，添加用户和更新用户 -->
    <!-- wrapperClosable属性表示用户可以通过点击旁边的空白区域关闭 -->
    <el-drawer
      :title="userParams.id ? '修改用户' : '添加用户'"
      v-model="drawer1"
      :destroy-on-close="true"
      :wrapperClosable="true"
      style="min-width: 300px"
    >
      <el-form ref="form" :rules="rules" label-width="80px" :model="userParams">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请输入用户姓名"
            clearable
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请输入用户昵称"
            v-model="userParams.name"
            clearable
            @change=""
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!userParams.id" label="用户密码" prop="password">
          <el-input
            placeholder="请输入用户密码"
            clearable
            v-model="userParams.password"
            @change=""
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="save">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </template>
    </el-drawer>
    <!-- 用于某一个已有的账号的职位分配 -->
    <el-drawer
      title="分配角色"
      v-model="drawer2"
      :destroy-on-close="true"
      :wrapperClosable="true"
      style="min-width: 300px"
    >
      <el-form label-width="80px">
        <el-form-item label="用户姓名">
          <el-input
            :disabled="true"
            clearable
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <!-- 用 v-model控制当前复选框的状态 -->
          <!-- 给这里绑定 change事件是为了知道全选框的状态后对子项及不确定状态进行操作 -->
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
        </el-form-item>
        <el-form-item style="column-count: auto">
          <!-- 显示职位的复选框 -->
          <!-- 这里使用 v-model进行数据的收集和展示 -->
          <el-checkbox-group v-model="userRole" @change="handleCheckedChange">
            <el-checkbox
              v-for="(item, index) in allRole"
              :key="index"
              :value="item"
            >
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="cancel2">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="user">
import {
  reqAddOrUpdateUserInfo,
  reqAllRole,
  reqAllUserInfo,
  reqDeleteUser,
  reqDeleteUsers,
  reqSetUserRole,
} from '@/api/acl/user';
import { RoleData, UserInfo } from '@/api/acl/user/type';
import { useLayoutSettingStore } from '@/stores/modules/setting';
import { useUserStore } from '@/stores/modules/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
// 默认页码
let pageNo = ref(1);
// 页容量
let pageSize = ref(5);
// 总条数
let total = ref(0);
// 存储所有用户
let userInfoArr = ref<UserInfo[]>([]);
// 控制新增或添加用户抽屉的显示
let drawer1 = ref(false);
// 控制分配角色的抽屉
let drawer2 = ref(false);
// 收集用户信息
let userParams = reactive<UserInfo>({
  username: '',
  name: '',
  password: '',
});
// 获取 form组件实例
let form = ref();
// 当前用户编辑的账号信息
let editUser = ref();
// 使用用户仓库
let userStore = useUserStore();
// 存储全部职位的数据
let allRole = ref<RoleData[]>([]);
// 已有的职位
let userRole = ref<RoleData[]>([]);
// 全选框的控制
let checkAll = ref(false);
// 全选框的不确定状态
let isIndeterminate = ref(false);
// 存储表格复选框选中的用户对象
let selectIdArr = ref<UserInfo[]>([]);
// 收集用户输入进来的关键字
let keyword = ref('');
// 使用 setting仓库
let settingStore = useLayoutSettingStore();
// 获取已有的用户信息
const getHasUserInfo = async (page = 1) => {
  pageNo.value = page;
  let res = await reqAllUserInfo(pageNo.value, pageSize.value, keyword.value);
  if (res.code == 200) {
    total.value = res.data.total;
    userInfoArr.value = res.data.records;
  }
};
// 挂载时获取数据
onMounted(() => {
  getHasUserInfo();
});
// 搜索按钮的回调
const search = () => {
  // 根据关键字获取对应的用户数据
  getHasUserInfo();
};
// 重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh;
};
// table复选框勾选时触发
const selectionChange = (value: UserInfo[]) => {
  selectIdArr.value = value;
};
// 添加用户按钮的回调
const addUser = () => {
  drawer1.value = true;
  // 清空对象
  Object.assign(userParams, {
    id: '',
    username: '',
    name: '',
    password: '',
  });
};
// 批量删除按钮的回调
const deleteUsers = () => {
  // 弹框提示是否删除，这个组件会返回一个 Promise对象
  ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 整理复选框选中的用户的 id
    let idList = selectIdArr.value.map((item) => item.id as number);
    // 点击确定按钮删除已有账号
    let res = await reqDeleteUsers(idList);
    if (res.code === 200) {
      ElMessage.success('删除用户成功');
      getHasUserInfo();
    } else {
      ElMessage.error('删除用户失败');
    }
  });
};
// 分配角色按钮的回调
const setRole = async (row: UserInfo) => {
  // 清空不确定状态
  isIndeterminate.value = false;
  // 存储已有的用户信息
  Object.assign(userParams, row);
  // 如果已经有角色，再去进行裁剪
  if (userParams.roleName) {
    handleCheckedChange(userParams.roleName.split(','));
  }
  // 获取全部职位及已有职位
  let res = await reqAllRole(userParams.id as number);
  if (res.code === 200) {
    // 全部职位
    allRole.value = res.data.allRolesList;
    // 已有职位
    userRole.value = res.data.assignRoles;
    // 显示抽屉
    drawer2.value = true;
  }
};
// 编辑已有用户按钮的回调
const updateUser = (row: UserInfo) => {
  // 存储下当前用户编辑的账号信息，用来判断是否修改的自己
  editUser.value = row.username;
  drawer1.value = true;
  // 存储收集已有的账号信息
  Object.assign(userParams, row);
};
// 删除某一个账号
const deleteUser = async (id: number) => {
  let res = await reqDeleteUser(id);
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    getHasUserInfo(
      userInfoArr.value.length > 1 ? pageNo.value : pageNo.value - 1
    );
  } else {
    ElMessage({
      type: 'error',
      message: res.data,
    });
  }
};
/** ------------------- 抽屉 1 的结构 ------------------------ */
// 校验用户名字的回调函数
const validatorUsername = (rule: any, value: any, callback: any) => {
  //用户名字长度至少为五位
  if (value.trim().length < 5) {
    return callback(new Error('用户名长度至少为5位'));
  } else {
    callback();
  }
};
// 校验用户昵称的回调函数
const validatorName = (rule: any, value: any, callback: any) => {
  //用户昵称长度至少为五位
  if (value.trim().length < 5) {
    return callback(new Error('用户昵称长度至少为5位'));
  } else {
    callback();
  }
};
// 校验用户密码的回调
const validatorPassword = (rule: any, value: any, callback: any) => {
  //用户密码长度至少为五位
  if (value.trim().length < 6) {
    return callback(new Error('用户密码长度至少为6位'));
  } else {
    callback();
  }
};
// 表单校验的规则对象
const rules = {
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorUsername,
    },
  ],
  name: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorName,
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorPassword,
    },
  ],
};
// 提交按钮的回调
const save = async () => {
  // 点击保存按钮的时候，保证全部内容都符合条件
  await form.value.validate();
  let res = await reqAddOrUpdateUserInfo(userParams);
  if (res.code === 200) {
    drawer1.value = false;
    ElMessage({
      type: 'success',
      message: userParams.id ? '修改成功' : '添加成功',
    });
    // 判断下是否修改的当前账号
    if (userStore.$state.username === editUser.value) {
      // 进行一次强制刷新
      window.location.reload();
    }
    // 成功之后进行判断，是否留在当前页
    getHasUserInfo(userParams.id ? pageNo.value : 1);
  } else {
    drawer1.value = false;
    ElMessage({
      type: 'error',
      message: userParams.id ? '修改失败' : '添加失败',
    });
  }
};
// 取消按钮的回调
const cancel = () => {
  drawer1.value = false;
};
/*---------------------- 抽屉 2 的结构 ----------------------*/
// 全选框的改变事件
const handleCheckAllChange = (val: boolean) => {
  // 这里传过来的值是一个布尔值，如果全选的话，就把全部职位数组赋值给userRole，否则就清空数组
  userRole.value = val ? allRole.value : [];
  // 改变不确定的样式
  isIndeterminate.value = false;
};
// 底部全部的复选框改变事件，这里会把已经选择的数据数组传进来
const handleCheckedChange = (value: string[]) => {
  // 判断是否全选，勾选的个数和全部个数相等就代表全选了
  checkAll.value = value.length === allRole.value.length;
  // 不确定样式,已选择的数据长度大于零，并且不等于全部个数
  isIndeterminate.value =
    value.length > 0 && value.length < allRole.value.length;
};
// 确定按钮的回调
const confirm = async () => {
  // 收集参数
  let data = {
    // 分配的用户 id
    userId: userParams.id as number,
    // 职位 id
    roleIdList: userRole.value.map((item: RoleData) => item.id) as number[],
  };
  let res = await reqSetUserRole(data);
  if (res.code === 200) {
    ElMessage.success('分配角色成功');
    // 关闭抽屉
    drawer2.value = false;
    // 获取更新完毕的信息
    getHasUserInfo(pageNo.value);
  }
};
// 取消按钮的回调
const cancel2 = () => {
  drawer2.value = false;
};
</script>

<style scoped>
.user-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
