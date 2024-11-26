<template>
  <div class="spu-form">
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <!-- 用v-model绑定数据进行展示和收集 -->
        <el-input
          v-model="SpuParams.spuName"
          placeholder="请你输入SPU名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <!-- 这里的 tmId就是品牌的id -->
        <el-select
          style="width: 30%; min-width: 150px; max-width: 350px"
          placeholder="请你选择品牌"
          v-model="SpuParams.tmId"
          @change=""
        >
          <el-option
            v-for="item in allTrademark"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          v-model="SpuParams.description"
          type="textarea"
          placeholder="请你输入描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 
          v-model:file-list 用来展示数据 ,action上传图片的地址
          list-type显示上传图片的样式
        -->
        <el-upload
          v-model:file-list="imageList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeFileUpload"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img
            w-full
            :src="dialogImageUrl"
            alt="Preview Image"
            style="max-height: 80vh"
          />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <el-select
          v-model="noHasSaleIdName"
          style="width: 30%"
          :placeholder="
            noHasSaleAttr.length ? `可选${noHasSaleAttr.length}个属性` : '无'
          "
        >
          <el-option
            v-for="item in noHasSaleAttr"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          >
          </el-option>
        </el-select>
        <el-button
          :disabled="!noHasSaleIdName"
          style="margin-left: 10px"
          type="primary"
          @click="addSaleAttr"
          icon="Plus"
          >添加属性</el-button
        >
        <el-table
          style="margin-top: 10px"
          :data="hasSaleAttrList"
          border
          stripe
        >
          <el-table-column type="index" label="序号" width="60px" />
          <el-table-column
            prop="saleAttrName"
            label="销售属性名字"
            min-width="120px"
          />
          <el-table-column prop="" label="销售属性值" min-width="200px">
            <!-- row即为当前 SPU已有的销售属性对象 -->
            <template #="{ row }">
              <el-tag
                style="margin-right: 5px"
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="item.id"
                size="small"
                closable
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input
                v-show="row.flag"
                @blur="toLook(row)"
                v-model="row.saleAttrValue"
                size="small"
                style="width: 100px"
                placeholder="请输入属性值"
              ></el-input>
              <el-button
                v-show="!row.flag"
                type="primary"
                size="small"
                icon="Plus"
                @click="toEdit(row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" min-width="120px">
            <template #="{ $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="hasSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <!-- 保证至少要有一个属性才能保存 -->
        <el-button
          :disabled="!hasSaleAttrList.length"
          type="primary"
          @click="save"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="spu-form">
import {
  reqAddOrUpdateSpu,
  reqAllSaleAttr,
  reqAllTrademark,
  reqSpuHasSaleAttr,
  reqSpuImage,
} from '@/api/product/spu';
import {
  allSaleAttr,
  SpuData,
  SpuImage,
  SpuSaleAttr,
} from '@/api/product/spu/type';
import { TradeMark } from '@/api/product/trademark/type';
import { ElMessage, UploadProps } from 'element-plus';
import { computed, ref } from 'vue';

// 接收父组件的自定义事件
let $emit = defineEmits(['changeScene']);
// 点击取消按钮，通知父组件切换场景为 0
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' });
};
// 存储所有品牌的数据
let allTrademark = ref<TradeMark[]>([]);
// 存储所有照片的数据
let imageList = ref<SpuImage[]>([]);
// 已有的销售属性
let hasSaleAttrList = ref<SpuSaleAttr[]>([]);
// 所有的销售属性
let allSaleAttrList = ref<allSaleAttr[]>([]);
// 收集还未添加的销售属性值名字和 id
let noHasSaleIdName = ref('');
// 存储已有的 SPU对象，因为添加的时候是空的
let SpuParams = ref<SpuData>({
  category3Id: '',
  description: '',
  spuName: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
});
// 控制对话框的显示与隐藏
let dialogVisible = ref(false);
// 存储预览图片的地址
let dialogImageUrl = ref('');
//
// 在子组件写一个方法，让父组件进行调用，直接在子组件内部发请求，省去传数据的步骤
// 父组件触发的时候会传进来当前修改的数据的 vc实例，这边接收一下
const initHasSpuData = async (spu: SpuData) => {
  // 把已有的值进行赋值
  SpuParams.value = spu;
  // 此处传进来的参数即为已有的 spu数据，再进行别的请求获取到完整的数据
  // 获取全部品牌的数据
  let res1 = await reqAllTrademark();
  // 获取某个品牌下的全部售卖图片
  let res2 = await reqSpuImage(spu.id as number);
  // 获取已有的 SPU销售属性
  let res3 = await reqSpuHasSaleAttr(spu.id as number);
  // 获取所有的 SPU 销售属性
  let res4 = await reqAllSaleAttr();
  // 把数据进行收集展示
  allTrademark.value = res1.data;
  // 这里返回的字段 element组件不能识别，用 map方法转换一下
  imageList.value = res2.data.map((item: SpuImage) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    };
  });
  hasSaleAttrList.value = res3.data;
  allSaleAttrList.value = res4.data;
};
// 照片墙点击预览按钮触发的钩子,会把预览的图片对象传过来
const handlePictureCardPreview: UploadProps['onPreview'] = (file) => {
  // 弹出对话框
  dialogVisible.value = true;
  dialogImageUrl.value = file.url as string;
};
// 上传文件之前触发的回调函数，会自动传进来上传的文件对象
const beforeFileUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 可以在这里约束文件的类型和大小
  // 格式要求：png、jpg、jpeg、gif 大小小于 2M
  // 判断 rawFile.name 代表的文件名是否以 .png、.jpg、.jpeg 或 .gif 结尾
  if (/\.(png|jpg|jpeg|gif)$/.test(rawFile.name) && rawFile.size / 1024 < 500) {
    return true;
  } else {
    ElMessage.error('只允许上传文件小于500Kb的 png、jpg、jpeg、gif 文件');
    return false;
  }
};
// 照片墙删除文件的钩子
const handleRemove = () => {};
// 计算当前 SPU未拥有的销售属性
const noHasSaleAttr = computed(() => {
  // 过滤下所有销售属性的数组
  return allSaleAttrList.value.filter((item) => {
    // 看一下已有销售属性的id是否存在于所有销售属性中，存在就返回false，否则返回true
    // 前面添加的新的属性 id是字符串格式的，不能使用全等，会不匹配
    return !hasSaleAttrList.value.some(
      (item2) => item2.baseSaleAttrId == item.id
    );
  });
});
// 添加属性按钮
const addSaleAttr = () => {
  // 用数组的结构赋值方法，把分割好的字符串数组进行分别赋值
  const [baseSaleAttrId, saleAttrName] = noHasSaleIdName.value.split(':');
  // 创建一个新增的属性对象，把这个对象带给服务器
  let newSaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    // 初始值为空
    spuSaleAttrValueList: [],
  };
  // 追加到数组中
  hasSaleAttrList.value.push(newSaleAttr);
  // 清空收集到的数据
  noHasSaleIdName.value = '';
};
// 添加属性值按钮(表格右侧的加号),动态切换输入框的显示与隐藏
const toEdit = (row: SpuSaleAttr) => {
  // 往属性身上添加一个 flag属性，用于控制这两个组件的显示和隐藏
  row.flag = true;
  // 添加一个属性值变量，用来收集属性值,用这种单独添加的方式可以确保数据不会冲突
  row.saleAttrValue = '';
};
// 表单元素失去焦点的方法
const toLook = (row: SpuSaleAttr) => {
  // 整理收集到的属性ID与名字
  const { baseSaleAttrId, saleAttrValue } = row;
  let repeat = row.spuSaleAttrValueList.some(
    (item) => item.saleAttrValueName == saleAttrValue
  );
  // 判断非法情况
  if (saleAttrValue?.trim() == '') {
    row.flag = false;
    return ElMessage.error('属性值不能为空');
  } else if (repeat) {
    row.flag = false;
    return ElMessage.error('属性值不能重复');
  }
  // 变成服务器需要的属性值形式
  let newSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  };
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue);
  // 切换
  row.flag = false;
};
// 添加 SPU初始化请求方法
const initAddSpu = async (c3Id: number) => {
  // 清空已有的数据
  SpuParams.value = {
    category3Id: '',
    description: '',
    spuName: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  };
  // 清空照片数据
  imageList.value = [];
  // 清空已有的销售属性
  hasSaleAttrList.value = [];
  // 清空销售属性值与 ID
  noHasSaleIdName.value = '';
  // 获取全部品牌的数据
  let res = await reqAllTrademark();
  // 获取所有的销售属性
  let res1 = await reqAllSaleAttr();
  // 存储所有的品牌
  allTrademark.value = res.data;
  // 存储所有的销售属性
  allSaleAttrList.value = res1.data;
  // 存储 c3Id
  SpuParams.value.category3Id = c3Id;
};
// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 照片墙的数据
  SpuParams.value.spuImageList = imageList.value.map((item: any) => {
    return {
      imgName: item.name,
      // 这里需要判断下是否为新增的，如果是新增的要用服务器返回的地址
      imgUrl: item.response?.data || item.url,
    };
  });
  // 销售属性的数据
  SpuParams.value.spuSaleAttrList = hasSaleAttrList.value;
  // 发送请求:添加或者更新
  let res = await reqAddOrUpdateSpu(SpuParams.value);
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    });
    // 通知父组件切换场景 0，并进行判断
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    });
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    });
  }
};
// 在 setup语法糖里面，默认方法是不暴露的，所以暴露一下
defineExpose({ initHasSpuData, initAddSpu });
</script>

<style scoped></style>
