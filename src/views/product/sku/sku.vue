<template>
  <div class="sku">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <el-table :data="skuArr" border stripe style="margin: 10px 0">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="60px"
        ></el-table-column>
        <el-table-column
          label="名称"
          prop="skuName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="描述"
          prop="skuDesc"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="图片" width="150px">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" />
          </template>
        </el-table-column>
        <el-table-column
          label="重量"
          prop="weight"
          width="150px"
        ></el-table-column>
        <el-table-column
          label="价格"
          prop="price"
          width="150px"
        ></el-table-column>
        <el-table-column label="操作" width="220px" fixed="right">
          <template #="{ row }">
            <!-- 判断这个字段的状态，转换上架和下架 -->
            <el-button
              type="primary"
              size="small"
              title="更换状态"
              :icon="row.isSale ? 'Bottom' : 'Top'"
              @click="updateSale(row)"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              title="更新SKU"
              icon="Edit"
              @click="EditSku"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              title="查看详情"
              icon="InfoFilled"
              @click="findSku(row)"
            ></el-button>
            <el-popconfirm
              :title="`你确定删除【${row.skuName}】吗`"
              @confirm="deleteSku(row.id)"
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
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          :background="true"
          layout=" prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSku"
          @size-change="changeSize"
        />
      </div>
      <!-- 抽屉组件 -->
      <div class="drawer">
        <el-drawer v-model="drawer" style="min-width: 350px">
          <!-- 标题 -->
          <template #header>
            <h4>查看商品的详情</h4>
          </template>
          <template #default>
            <el-row>
              <el-col :span="6" :offset="0">名称</el-col>
              <el-col :span="18" :offset="0">{{ skuInfo?.skuName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="0">描述</el-col>
              <el-col :span="18" :offset="0">{{ skuInfo?.skuDesc }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="0">价格</el-col>
              <el-col :span="18" :offset="0">{{ skuInfo?.price }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="0">平台属性</el-col>
              <el-col :span="18" :offset="0">
                <el-tag
                  type="primary"
                  v-for="item in skuInfo?.skuAttrValueList"
                  :key="item.id"
                  >{{ item.valueName }}</el-tag
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="0">销售属性</el-col>
              <el-col :span="18" :offset="0">
                <el-tag
                  type="primary"
                  v-for="item in skuInfo?.skuSaleAttrValueList"
                  :key="item.id"
                  >{{ item.saleAttrValueName }}</el-tag
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="0">销售图片</el-col>
              <el-col :span="18" :offset="0">
                <el-carousel :interval="4000" type="card" height="200px">
                  <el-carousel-item
                    v-for="item in skuInfo?.skuImageList"
                    :key="item.id"
                  >
                    <img :src="item.imgUrl" />
                  </el-carousel-item>
                </el-carousel>
              </el-col>
            </el-row>
          </template>
        </el-drawer>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="sku">
import {
  reqCancelSKu,
  reqDeleteSku,
  reqSaleSku,
  reqSkuInfo,
  reqSkuList,
} from '@/api/product/sku';
import { SkuData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
// 分页器当前页码
let pageNo = ref(1);
// 页容量
let pageSize = ref(10);
// 总数量
let total = ref(0);
// 展示的数据
let skuArr = ref<SkuData[]>([]);
// 控制抽屉的显示与隐藏
let drawer = ref(false);
// 存储已有的SKU数据
let skuInfo = ref<SkuData>();
// 获取数据的方法，默认调取第一页的数据，当分页器页码改变的时候，会注入当前页码
const getHasSku = async (page = 1) => {
  pageNo.value = page;
  await reqSkuList(pageNo.value, pageSize.value).then((res) => {
    total.value = res.data.total;
    skuArr.value = res.data.records;
  });
};
// 分页器下拉菜单发生变化时触发
const changeSize = (size: number) => {
  pageSize.value = size;
  getHasSku();
};
// 商品上架或下架
const updateSale = async (row: SkuData) => {
  // 如果当前商品的 isSale 为1，说明是上架状态
  if (row.isSale === 1) {
    // 下架
    await reqCancelSKu(row.id as number);
    // 提示信息
    ElMessage.success('下架成功');
    // 发请求获取当前更新完毕的全部已有SKU
    getHasSku(pageNo.value);
  } else {
    // 上架
    await reqSaleSku(row.id as number);
    // 提示信息
    ElMessage.success('上架成功');
    // 发请求获取当前更新完毕的全部已有SKU
    getHasSku(pageNo.value);
  }
};
// 更新已有的SKU
const EditSku = () => {
  ElMessage.success('程序员在努力的更新中···');
};
// 查看商品详情
const findSku = async (row: SkuData) => {
  drawer.value = true;
  // 根据商品的id获取数据
  let res = await reqSkuInfo(row.id as number);
  skuInfo.value = res.data;
};
// 删除某一个已有的商品
const deleteSku = async (id: number) => {
  let res = await reqDeleteSku(id);
  if (res.code === 200) {
    ElMessage.success('删除成功');
    // 如果当前的数据量大于1，则删除完留在当前页，否则去上一页
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage({
      type: 'error',
      message: res.data,
    });
  }
};
// 当组件挂载时获取
onMounted(() => {
  getHasSku();
});
</script>

<style scoped>
.el-row {
  margin: 10px 0;
  & .el-tag {
    margin: 5px;
  }
}
</style>
