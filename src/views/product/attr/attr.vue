<template>
  <div class="attr">
    <!-- 三局分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin-top: 30px">
      <div v-show="scene === 0">
        <el-button
          @click="addAttr"
          type="primary"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          >添加属性</el-button
        >
        <el-table :data="attrArr">
          <el-table-column
            width="80px"
            label="序号"
            type="index"
            algin="center"
          />
          <el-table-column label="属性名称" width="120px" prop="attrName" />
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag v-for="item in row.attrValueList" :key="item.id">{{
                item.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="editAttr(row)"
              />
              <el-popconfirm
                @confirm="deleteAttr(row.id)"
                :title="`你确定要删除【${row.attrName}】吗?`"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <!-- 展示添加与修改属性的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="!attrParams.attrName"
          type="primary"
          icon="Plus"
          >添加属性值</el-button
        >
        <el-button @click="cancel">取消</el-button>
        <el-table
          :data="attrParams.attrValueList"
          style="margin-top: 10px; margin-bottom: 10px"
          border
        >
          <el-table-column
            label="序号"
            type="index"
            width="80px"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row为当前属性值对象 -->
            <template #="{ row, $index }">
              <!-- 把数据收集到 valueName属性里面 -->
              <!-- ref里面可以写函数，会自动把当前的组件实例传入 -->
              <el-input
                v-show="row.flag"
                size="small"
                @blur="toLook(row, $index)"
                placeholder="请输入属性值"
                v-model="row.valueName"
                :ref="(row:any) => inputArr[$index] = row"
              />
              <!-- 添加一个 div用来展示其他的内容  -->
              <div v-show="!row.flag" @click="toEdit(row, $index)">{{
                row.valueName
              }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ $index }">
              <!-- 点击时删除对应下标的数据 -->
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="!attrParams.attrValueList[0]?.valueName"
          >保存</el-button
        >
        <el-button type="primary" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="attr">
// 使用属性仓库
import { reqAddOrUpdateAttr, reqAttr, reqDeleteAttr } from '@/api/product/attr';
import { Attr, AttrValueList } from '@/api/product/attr/type';
import { useCategoryStore } from '@/stores/modules/category';
import { ElMessage } from 'element-plus';
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
// 创建属性仓库
let categoryStore = useCategoryStore();
// 存储已有的属性和属性值
let attrArr = ref<Attr[]>([]);
// 定义内容切换变量，0展示table,1展示修改和添加
let scene = ref(0);
// 手机新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性名字
  attrValueList: [], //新增的属性值数组
  categoryId: '', //三级分类ID
  categoryLevel: 3, //三级分类
});
// 准备数组存储el-input对应的组件实例
let inputArr = ref<HTMLElement[]>([]);
// 监听三级分类的 id,有了三级id时，就请求属性数据
watch(
  () => categoryStore.c3Id,
  () => {
    getAttr();
  }
);
// 拿到属性值的数据并放在表格中
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore;
  if (c3Id) {
    await reqAttr(c1Id, c2Id, c3Id)
      .then((res) => {
        attrArr.value = res.data;
      })
      .catch((err) => console.log(err));
  }
};
// 添加属性的回调
const addAttr = () => {
  // 清空数据
  Object.assign(attrParams, {
    attrName: '', //新增的属性名字
    attrValueList: [], //新增的属性值数组
    // 在清空数据的同时，拿到三级分类的 id
    categoryId: categoryStore.c3Id,
    categoryLevel: 3, //三级分类
  });
  // 切换场景
  scene.value = 1;
};
// 修改属性的回调
const editAttr = (row: Attr) => {
  scene.value = 1;
  // 将已有的属性对象赋值给 attrParams，如果直接使用assign方法，row会跟 attrParams一样，导致数据混乱
  // 所以通过 JSON序列化再反序列化进行深拷贝，这样两个对象就是独立的
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
};
// 点击气泡提示框确认按钮触发删除属性的回调
const deleteAttr = async (id: number) => {
  let res = await reqDeleteAttr(id);
  if (res.code === 200) {
    ElMessage.success('删除属性成功');
    getAttr();
  } else {
    ElMessage.error('删除属性失败');
  }
};
// 添加属性值按钮
const addAttrValue = () => {
  // 点击添加属性值按钮，像数组添加一个属性对象
  attrParams.attrValueList.push({
    valueName: '',
    // 在这里添加一个 flag属性，用来控制属性值编辑模式与查看模式的切换
    // 如果直接在表格上控制的话，是会控制所有的属性，这样子有多个对象的时候就会出现bug
    flag: true,
  });
  // 获取数组里面最后一条数据并添加聚焦
  nextTick(() => inputArr.value[attrParams.attrValueList.length - 1].focus());
};
// input框失去焦点时触发的回调
const toLook = (row: AttrValueList, index: number) => {
  // 非法情况
  if (row.valueName?.trim() === '') {
    attrParams.attrValueList.splice(index, 1);
    return ElMessage.error('属性值不能为空');
  }
  attrParams.attrValueList.forEach((item) => {
    // 排除自己，这里的意思就是，只有当前循环到的对象和row对象不是同一个对象的时候，才执行下面的代码
    if (row !== item) {
      // 如果有其他属性值对象的属性值名称和自己一样，就删除并提示
      if (item.valueName === row.valueName) {
        attrParams.attrValueList.splice(index, 1);
        return ElMessage.error('属性值不能重复');
      }
    }
  });
  // 相应的属性值对象 flag属性变为 false 展示 div
  row.flag = false;
};
// 点击div的事件
const toEdit = (row: AttrValueList, index: number) => {
  // 相应的属性值对象 flag属性变为 true 展示 input
  row.flag = true;
  // 让组件实例数组的对应项触发焦点
  // inputArr.value[index].focus();
  // 如果对应的组件实例没有挂在完成，上述代码并不能正确获取到
  // 可以使用下面的 nextTick方法，当响应式数据发生变化时，获取到更新后的 DOM
  nextTick(() => inputArr.value[index].focus());
};
// 保存按钮
const save = async () => {
  // 发送请求添加数据
  const res = await reqAddOrUpdateAttr(attrParams);
  if (res.code === 200) {
    scene.value = 0;
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    });
    // 获取全部属性值
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    });
  }
};
// 取消按钮的回调
const cancel = () => {
  scene.value = 0;
};
// 组件销毁时清空仓库的数据
onBeforeUnmount(() => {
  // 清空改仓库数据的方法
  // 当使用组合式写的 pinia时，会用不了这个方法，需要手动实现这个功能
  // 在pinia仓库文件夹下面的plugins插件内实现，然后在主文件中引入即可
  categoryStore.$reset();
});
</script>

<style scoped></style>
