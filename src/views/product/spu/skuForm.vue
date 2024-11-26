<template>
  <div class="skuForm">
    <el-form ref="form" label-width="100px" :inline="false">
      <el-form-item label="SKU名称">
        <el-input
          placeholder="请输入SKU名称"
          v-model="skuParams.skuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input-number
          controls-position="right"
          size="default"
          v-model="skuParams.price"
        >
          <template #suffix>
            <span>RMB</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="重量">
        <el-input-number
          controls-position="right"
          size="default"
          v-model="skuParams.weight"
        >
          <template #suffix>
            <span>g</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="SKU描述">
        <el-input
          placeholder="请输入描述信息"
          v-model="skuParams.skuDesc"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form inline>
          <el-form-item
            v-for="item in attrArr"
            :key="item.id"
            :label="item.attrName"
          >
            <el-select
              style="min-width: 120px; margin-bottom: 0.3em"
              v-model="item.attrIdAndValueId"
            >
              <!-- 把这两个值进行拼接然后收集到当前数组的属性上 -->
              <el-option
                v-for="attrValue in item.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${item.id}:${attrValue.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form inline>
          <el-form-item
            v-for="item in saleArr"
            :key="item.id"
            :label="item.saleAttrName"
          >
            <el-select
              v-model="item.saleIdAndValueId"
              style="min-width: 120px; margin-bottom: 0.3em"
            >
              <el-option
                v-for="saleArrValue in item.spuSaleAttrValueList"
                :key="saleArrValue.id"
                :label="saleArrValue.saleAttrValueName"
                :value="`${item.id}:${saleArrValue.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table :data="imgArr" border stripe ref="table">
          <el-table-column type="selection" width="80px" align="center" />
          <el-table-column label="图片">
            <template #="{ row }">
              <img :src="row.imgUrl" alt="" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" />
          <el-table-column label="操作">
            <template #="{ row }">
              <el-button type="primary" size="small" @click="handler(row)"
                >设置默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="skuForm">
import { reqAttr } from '@/api/product/attr';
import { Attr } from '@/api/product/attr/type';
import { SkuData } from '@/api/product/sku/type';
import { reqAddSku, reqSpuHasSaleAttr, reqSpuImage } from '@/api/product/spu';
import { SpuData, SpuImage, SpuSaleAttr } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
// 获取父组件的自定义函数
let $emit = defineEmits(['changeScene']);
// 平台属性
let attrArr = ref<Attr[]>([]);
// 销售属性
let saleArr = ref<SpuSaleAttr[]>([]);
// 照片数据
let imgArr = ref<SpuImage[]>([]);
// 获取table组件实例
const table = ref();
// 收集SKU的参数
let skuParams = reactive<SkuData>({
  // 父组件传来的数据
  category3Id: '', //三级分类id
  spuId: '', //已有的spu的id
  tmId: '', //spu的品牌id
  // 通过v-model收集数据
  skuName: '', //sku名字
  price: 0, //价格
  weight: 0, //重量
  skuDesc: '', //sku描述
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '', //sku图片地址
});
// 取消按钮回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' });
};
// 暴露子组件的方法
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: SpuData
) => {
  // 先进行数据收集
  skuParams.category3Id = spu.category3Id;
  skuParams.spuId = spu.id as number;
  skuParams.tmId = spu.tmId;
  // 获取全部平台属性
  let res = await reqAttr(c1Id, c2Id, spu.category3Id);
  // 获取对应的销售属性
  let res1 = await reqSpuHasSaleAttr(spu.id as number);
  // 获取照片墙的数据
  let res2 = await reqSpuImage(spu.id as number);
  // 平台属性
  attrArr.value = res.data;
  // 销售属性
  saleArr.value = res1.data;
  // 照片数据
  imgArr.value = res2.data;
};
// 设置默认图片的方法回调
const handler = (row: SpuImage) => {
  // 只能选中一行，所以遍历下数组，让所有行都先不选中
  imgArr.value.forEach((item) => {
    table.value.toggleRowSelection(item, false);
  });
  // 选中当前行
  table.value.toggleRowSelection(row, true);
  // 把当前图片的地址放到参数里面
  skuParams.skuDefaultImg = row.imgUrl as string;
};
// 保存按钮的回调
const save = async () => {
  // 整理参数,使用 reduce方法进行数组的重新整理
  // 平台属性的属性ID和属性值ID
  skuParams.skuAttrValueList = attrArr.value.reduce(
    // prev代表起始值，next代表当前项
    (prev, next) => {
      // 判断数组里面每一项是否含有 attrIdAndValueId项
      if (next.attrIdAndValueId) {
        // 把该属性里面的值分割出来
        let [attrId, valueId] = next.attrIdAndValueId.split(':');
        prev?.push({
          // 把选中的属性值id和属性id收集到数组里面
          attrId,
          valueId,
        });
      }
      // reduce方法默认返回的是最后一次的结果，最后一次执行的时候是undefined
      // 所以需要返回整个数据
      return prev;
    },
    // 这个参数就是想要的数据格式,即为初始值
    // 如果没有初始值，会把第一次遍历出来的内容当成初始值
    skuParams.skuAttrValueList
  );
  // 销售属性的属性ID和属性值ID
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev, next) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
      prev?.push({
        saleAttrId,
        saleAttrValueId,
      });
    }
    return prev;
  }, skuParams.skuSaleAttrValueList);
  // 发送请求
  let res = await reqAddSku(skuParams);
  // 对结果进行判断
  if (res.code == 200) {
    ElMessage.success('添加SKU成功');
    // 通知父组件切换场景 0
    $emit('changeScene', { flag: 0, params: '' });
  } else {
    ElMessage.error('添加SKU失败');
  }
};
defineExpose({
  initSkuData,
});
</script>

<style scoped></style>
