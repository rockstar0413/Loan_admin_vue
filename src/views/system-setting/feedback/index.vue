<template>
  <el-card shadow="never">
    <el-scrollbar height="500px">
      <el-table :data="feedbackList" class="sub-account-wrapper" border header-align="center" stripe>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="title" label="用户名" width="100" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="created_at" label="状态" />
        <!-- <el-table-column prop="status" label="时间" /> -->
        <el-table-column label="时间" width="120">
          <template #default="scope">
            {{ feedbackList[scope.$index].status === 0 ? '未审' :
              feedbackList[scope.$index].status === 1 ? '通过' :
                feedbackList[scope.$index].status === 2 ? '不通过' :
                  null
            }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button v-if="feedbackList[scope.$index].status === 0" type="primary" size="small"
              @click="openCheck(scope.$index)">
              审核
            </el-button>
            <el-button type="danger" size="small" @click="deleteItem(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div style="display: flex; justify-content: center">
      <el-pagination v-if="paginationConfig.show && total > 0" class="pagination" :style="paginationConfig.style"
        v-model:currentPage="pageNum" @current-change="handleCurrentChange" :page-sizes="paginationConfig.pageSizes"
        v-model:pageSize="pageSize" :layout="paginationConfig.layout" :total="total"></el-pagination>
    </div>
  </el-card>
  <el-dialog v-model="dialogVisible" title="Tips" width="50%" :before-close="handleClose">
    <el-form label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="title" disabled />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="contents" type="textarea" disabled />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="status">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">重置</el-button>
        <el-button type="primary" @click="editItem">
          立即提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { feedbackStore } from '@/pinia/modules/feedback';
import { storeToRefs } from 'pinia';
import { ElMessageBox } from 'element-plus'
const pageSize = ref(5)
const pageNum = ref(1)
const total = ref(0);
const paginationConfig = {
  show: true,
  layout: 'prev, pager, next',
  pageSizes: [10, 20, 30, 40, 50, 100],
  style: {},
}

const handleCurrentChange = (number) => {
  console.log(number);
  pageNum.value = number
  getTableList()
}
const status = ref(0);
const contents = ref('');
const title = ref('');
const dialogVisible = ref(false);
const id = ref(0);
const handleClose = (done) => {
  dialogVisible.value = false;
}
const {
  getFeedbackList,
  updateFeedbackStatus,
  deleteFeedback,
} = feedbackStore()

const {
  feedbackList
} = storeToRefs(feedbackStore())

onMounted(async () => {
  getTableList();
})
const getTableList = async () => {
  const response = await getFeedbackList(pageNum.value);
  pageNum.value = response.feedbackList.current_page;
  total.value = response.feedbackList.total;
}

const openCheck = (index) => {
  dialogVisible.value = true;
  console.log(feedbackList.value[index]);
  id.value = feedbackList.value[index].id;
  title.value = feedbackList.value[index].title;
  status.value = feedbackList.value[index].status;
  contents.value = feedbackList.value[index].content;
}
const editItem = async () => {
  console.log(status.value)
  if (title.value && status.value !== 0 && contents.value) {
    await updateFeedbackStatus(id.value, title.value, contents.value, status.value);
    dialogVisible.value = false;
    getTableList();
  }
}
const deleteItem = (index) => {
  ElMessageBox.confirm('确定删除操作？')
    .then(async () => {
      const response = await deleteFeedback(feedbackList.value[index].id);
      if (response.success)
        getTableList();
    })
    .catch(() => {
    })
}
</script>

<style lang="scss" scoped>
.sub-account-wrapper {
  width: 100%;
  margin: 10px 0px;
}
</style>
