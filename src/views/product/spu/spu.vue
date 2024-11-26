<template>
  <div class="spu">
    <Category :scene="scene" />
    <el-card style="margin-top: 20px">
      <div class="card-body">
        <!-- 已有属性页面 -->
        <div v-show="scene === 0">
          <el-button
            @click="addSpu"
            type="primary"
            icon="Plus"
            :disabled="!categoryStore.c3Id"
            >添加SPU</el-button
          >
          <!-- 展示数据 -->
          <el-table :data="records" style="margin-top: 10px" border>
            <el-table-column label="序号" width="80px" type="index" />
            <el-table-column label="SPU名称" min-width="100px" prop="spuName" />
            <el-table-column
              label="SPU描述"
              prop="description"
              min-width="210px"
            />
            <el-table-column label="SPU操作" min-width="210px">
              <template #="{ row }">
                <el-button
                  title="添加SKU"
                  type="primary"
                  size="small"
                  icon="Plus"
                  @click="addSku(row)"
                />
                <el-button
                  title="修改SPU"
                  type="primary"
                  size="small"
                  icon="Edit"
                  @click="updateSpu(row)"
                />
                <el-button
                  title="查看SKU列表"
                  type="primary"
                  size="small"
                  icon="View"
                  @click="findSkuList(row.id)"
                />
                <el-popconfirm
                  :title="`你确定删除【${row.spuName}】吗？`"
                  @confirm="deleteSpu(row.id)"
                >
                  <template #reference>
                    <el-button
                      title="删除SPU"
                      type="primary"
                      size="small"
                      icon="Delete"
                    />
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <div>
            <el-pagination
              :disabled="!categoryStore.c3Id"
              style="margin-top: 10px"
              v-model:current-page="pageNum"
              v-model:page-size="pageSize"
              :page-sizes="[3, 5, 7, 9]"
              :background="true"
              layout="prev, pager, next, jumper, ->, sizes,total"
              :total="total"
              @current-change="getHasSpu"
              @size-change="changeSize"
            />
          </div>
        </div>
        <!-- 添加spu及修改的子组件,加一个 ref标签，方便父组件拿到子组件的 vc实例 -->
        <SpuForm
          ref="spuForm"
          @changeScene="changeScene"
          v-show="scene === 1"
        />
        <!-- 添加 sku的子组件 -->
        <SkuForm
          ref="skuForm"
          @changeScene="changeScene"
          v-show="scene === 2"
        />
        <!-- dialog对话框，展示已有的SKU数据 -->
        <el-dialog title="SKU列表" v-model="dialogShow">
          <el-table :data="skuArr" border stripe>
            <el-table-column prop="skuName" label="SKU名字" />
            <el-table-column prop="price" label="SKU价格" />
            <el-table-column prop="weight" label="SKU重量" />
            <el-table-column label="SKU图片">
              <template #="{ row }">
                <img :src="row.skuDefaultImg" alt="" />
              </template>
            </el-table-column>
          </el-table>

          <!-- <span></span>
          <span slot="footer">
            <el-button @click=" = false">Cancel</el-button>
            <el-button type="primary" @click="">OK</el-button>
          </span> -->
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="spu">
import { reqDeleteSpu, reqHasSpu, reqSpuSkuList } from '@/api/product/spu';
import { SpuData } from '@/api/product/spu/type';
import { useCategoryStore } from '@/stores/modules/category';
import { onBeforeUnmount, ref, watch } from 'vue';
import SpuForm from './spuForm.vue';
import SkuForm from './skuForm.vue';
import { ElMessage } from 'element-plus';
import { SkuData } from '@/api/product/sku/type';

// 场景的数据
let scene = ref(0); // 0显示已有的spu，1添加spu，2添加sku
// 分页器默认页码
let pageNum = ref(1);
// 每一页的数据
let pageSize = ref(3);
// 总页数
let total = ref(0);
// 使用仓库
let categoryStore = useCategoryStore();
// 存储已有的SPU数据
let records = ref<SpuData[]>([]);
// 存储SKU的数据
let skuArr = ref<SkuData[]>([]);
// 获取子组件 spuForm的实例
const spuForm = ref();
// 获取子组件 skuForm的实例
const skuForm = ref();
// 控制对话框的显示
let dialogShow = ref(false);
// 监听三级分类ID
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return;
    getHasSpu();
  }
);
// 获取数据
let getHasSpu = async (page = 1) => {
  // 如果不传参的话会默认第一页，当我们绑定在分页器上的页码切换事件上时，
  // 会把点击的页码传入进来，从而进行对应页码的查询
  pageNum.value = page;
  await reqHasSpu(pageNum.value, pageSize.value, categoryStore.c3Id).then(
    (res) => {
      records.value = res.data.records;
      total.value = res.data.total;
    }
  );
};
// 改变页容量的回调
let changeSize = () => {
  getHasSpu();
};
// 添加新SPU的回调
const addSpu = () => {
  // 切换场景
  scene.value = 1;
  // 调用子组件的初始化方法
  spuForm.value.initAddSpu(categoryStore.c3Id);
};
// 添加SKU的回调
const addSku = (row: SpuData) => {
  // 切换场景
  scene.value = 2;
  // 调用子组件的方法，初始化添加sku的数据
  skuForm.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
};
// 修改已有的 SPU 的回调
const updateSpu = (row: SpuData) => {
  scene.value = 1;
  // 当点击这个回调的时候，调用一下子组件内部的方法，进行数据获取
  spuForm.value.initHasSpuData(row);
};
// 查看SKU列表
const findSkuList = async (spuId: number) => {
  let res = await reqSpuSkuList(spuId);
  if (res.code === 200) {
    skuArr.value = res.data;
    dialogShow.value = true;
  }
};
// 删除当前SPU
const deleteSpu = async (spuId: number) => {
  let res = await reqDeleteSpu(spuId);
  if (res.code === 200) {
    ElMessage.success('删除成功');
    // 获取已有的剩余SPU的数据，如果当前页的数据大于一个删除完留在当前页，否则去上一页
    getHasSpu(records.value.length > 1 ? pageNum.value : pageNum.value - 1);
  } else {
    ElMessage.error('删除失败');
  }
};
// 子组件SpuForm绑定自定义事件，目前是让子组件通知父组件切换场景为0
const changeScene = (data: any) => {
  // 子组件 spuForm点击取消边为场景0
  scene.value = data.flag;
  // 切换之后获取新的数据
  if (data.params == 'update') {
    // 更新留在当前页
    getHasSpu(pageNum.value);
  } else {
    // 添加回到第一页
    getHasSpu();
  }
};
// 组件卸载时，清空数据
onBeforeUnmount(() => {
  categoryStore.$reset();
});
</script>

<style scoped></style>
