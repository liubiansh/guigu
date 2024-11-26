<template>
  <div class="trademark">
    <el-card>
      <!-- 卡片顶部的按钮 -->
      <el-button type="primary" icon="Plus" @click="add">添加品牌</el-button>
      <!-- 表格组件 -->
      <!-- border：纵向边框 -->
      <el-table style="margin: 10px 0" border :data="trademarkArr">
        <el-table-column label="序号" type="index"></el-table-column>
        <!-- 
          table-column:默认展示数据用的是 div
          可以用插槽展示，其回传参数为
            row:当前行的对象
            index:当前行索引
            column:当前列对象
          可以方便自定义内容
        -->
        <el-table-column label="品牌名称">
          <template #="{ row }">
            <h1>{{ row.tmName }}</h1>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row }">
            <!-- 检查属性中是否含有 http字符串，没有就添加 -->
            <img
              style="width: auto; height: 100px"
              :src="
                row.logoUrl.includes('http')
                  ? row.logoUrl
                  : `http://${row.logoUrl}`
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="update(row)"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${row.tmName}吗？`"
              width="200px"
              icon="Delete"
              icon-color="red"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 
        分页组件 
          v-model:current-page:设置分页器当前页码
          v-model:page-size:设置每一页展示多少条数
          :page-sizes:用于设置下拉菜单数据
          size：分页器尺寸
          :background：设置分页器按钮的背景
          layout：设置分页器六个子组件的布局位置,->的作用是把后面的组件推到最右边
          :disabled：是否禁用分页器
          size-change: page-size改变时触发	
          current-change:	current-page改变时触发
          change: 页码、页容量改变时触发
        当页容量发生变化的时候，需要跳转到第一页
      -->
      <div>
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes,total"
          :total="total"
          @change="getHasTrademark"
          @size-change="size"
        />
      </div>
    </el-card>
    <!-- 对话框组件：在添加品牌和修改已有品牌时弹出对话框 -->
    <!-- 在对话框组件的关闭事件中设置清空校验规则 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      @closed="resetForm"
    >
      <el-form
        label-width="100px"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <!-- 用 v-model把数据收集到对象中 -->
          <el-input
            style="width: 60%"
            placeholder="请输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" prop="logoUrl">
          <!-- 
            action属性：上传文件的请求地址 
          -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽:footer -->
      <template #footer>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="trademark">
import { onMounted, reactive, ref } from 'vue';
import {
  reqAddOrUpdateTradeMark,
  reqDeleteTradeMark,
  reqHasTrademark,
} from '@/api/product/trademark';
import { Records, TradeMark } from '@/api/product/trademark/type';
import { ElMessage, UploadProps } from 'element-plus';
// 当前页码
let pageNum = ref(1);
// 页容量
let pageSize = ref(3);
// 存储已有品牌数据的总数
let total = ref(0);
// 存储已有品牌的数据
let trademarkArr = ref<Records>([]);
// 控制对话框显示与隐藏
let dialogFormVisible = ref(false);
// 收集新增品牌的数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
});
// 获取el-form的组件实例
let formRef = ref();
// 品牌自定义校验规则,value为输入的值，callback为回调对象，可以理解为执行，rule为对应的规则对象
const validatorTmName = (rule: any, value: any, callback: any) => {
  // 当表单元素触发blur时，会触发
  // trim:去除空格
  if (value.trim().length >= 2) {
    callback();
  } else {
    // 校验未通过，返回错误信息
    callback(new Error('品牌名称必须大于等于2位'));
  }
};
// 品牌logo图片校验方法,因为这不是表单元素，所以需要在发送请求的时候对所有项进行校验
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  // value为图片的路径
  if (value) {
    callback();
  } else {
    callback(new Error('请上传品牌logo'));
  }
};
// 表单校验规则
const rules = {
  tmName: [
    // required:是否必填，trigger:触发时机,blur失去焦点
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
};
// 获取已有品牌的回调
const getHasTrademark = async (page = 1) => {
  // 当前页码
  pageNum.value = page;
  let result = await reqHasTrademark(pageNum.value, pageSize.value);
  if (result.code === 200) {
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
  }
};
// 修改页容量回调
const size = () => {
  pageNum.value = 1;
  getHasTrademark();
};
// 添加品牌按钮
const add = () => {
  // 在每次打开的时候清空已经收集的数据
  trademarkParams.id = undefined;
  trademarkParams.logoUrl = '';
  trademarkParams.tmName = '';
  // 清空校验信息

  // 展示对话框
  dialogFormVisible.value = true;
};
// 修改品牌按钮
const update = (row: TradeMark) => {
  dialogFormVisible.value = true;
  // 通过row对象获取到当前行的数据赋值给已有品牌数据，并添加id
  Object.assign(trademarkParams, row);
};
// 上传文件之前触发的回调函数，会自动传进来上传的文件对象
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 可以在这里约束文件的类型和大小
  // 格式要求：png、jpg、jpeg、gif 大小小于 2M
  // 判断 rawFile.name 代表的文件名是否以 .png、.jpg、.jpeg 或 .gif 结尾
  if (
    /\.(png|jpg|jpeg|gif)$/.test(rawFile.name) &&
    rawFile.size / 1024 / 1024 < 2
  ) {
    return true;
  } else {
    ElMessage.error('只允许上传文件小于2M的 png、jpg、jpeg、gif 文件');
    return false;
  }
};
// 文件上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // response是服务器返回的数据,UploadFile是上传的文件对象
  trademarkParams.logoUrl = response.data;
  // 图片上传成功后，清楚掉对应图片的校验结果
  formRef.value.clearValidate('logoUrl');
};
// 对话框取消按钮
const cancel = () => {
  dialogFormVisible.value = false;
};
// 对话框确定按钮
const confirm = async () => {
  // 在发请求之前，对整个表单进行校验,使用组件实例对象上面的 validate方法
  // 如果校验全部通过再执行后面的代码
  try {
    await formRef.value.validate();
  } catch (error) {
    return ElMessage.error('请按提示正确填写品牌信息');
  }
  let result: any = await reqAddOrUpdateTradeMark(trademarkParams);
  // 成功回调
  if (result.code === 200) {
    // 成功提示
    ElMessage({
      type: 'success',
      // 判断是否带有id进行动态展示
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    });
    // 隐藏对话框
    dialogFormVisible.value = false;
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    });
    dialogFormVisible.value = false;
  }
  // 再次发请求获取已有的全部品牌数据
  getHasTrademark(pageNum.value);
};
// 当对话框关闭的时候，重置表单项
const resetForm = () => {
  // 重置表单项
  formRef.value.resetFields();
};
// 删除气泡确认框确定按钮的回调
const removeTrademark = async (id: number) => {
  // 点击确定按钮删除已有品牌的请求
  let res = await reqDeleteTradeMark(id);
  if (res.code === 200) {
    // 删除成功提示信息
    ElMessage.success('删除品牌成功');
    // 再次获取已有的品牌列表,通过判断删除后的数据长度是否为零，选择留在当前页还是留在上一页
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNum.value : pageNum.value - 1
    );
  } else {
    ElMessage.error('删除品牌失败');
  }
};
// 组件挂载时发请求
onMounted(() => {
  getHasTrademark();
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
