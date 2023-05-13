<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData">
      <el-form-item>
        <el-button type="primary" @click="openAdd">添加</el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar height="500px">
      <el-table :data="channelList" class="sub-account-wrapper" border header-align="center" stripe>
        <el-table-column prop="channel_id" label="渠道ID" />
        <el-table-column prop="name" label="渠道名称" />
        <el-table-column prop="created_at" label="创建时间" width="150" />
        <el-table-column prop="UV" label="UV" />
        <el-table-column prop="promotion" label="推广连接" width="300" />

        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEdit(scope.$index)">
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- <div style="display: flex; justify-content: center">
      <el-pagination background layout="prev, pager, next" :total="100" />
    </div> -->
  </el-card>
  <el-dialog v-model="dialogVisible" title="Tips" width="50%" :before-close="handleClose">
    <el-form label-width="100px">
      <el-form-item label="渠道ID">
        <el-input v-model="channel_id" />
      </el-form-item>
      <el-form-item label="渠道名称">
        <el-input v-model="name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">重置</el-button>
        <el-button type="primary" @click="submitItem">
          立即提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { channelStore } from '@/pinia/modules/channel';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus'
const pageSize = ref(10)
const currentPage = ref(1)
const dialogVisible = ref(false);
const isAdd = ref(true);
const status = ref(true);
const channel_id = ref('');
const name = ref('');
const id = ref(0);
const {
  channelList
} = storeToRefs(channelStore());
const {
  getChannelList,
  addChannel,
  editChannel
} = channelStore()

onMounted(async () => {
  const response = await getChannelList()
})
const openAdd = () => {
  channel_id.value = '';
  name.value = '';
  isAdd.value = true;
  dialogVisible.value = true;
}
const openEdit = (index) => {
  console.log(index)
  console.log(channelList.value[index])
  id.value = channelList.value[index].id;
  isAdd.value = false;
  dialogVisible.value = true;
  channel_id.value = channelList.value[index].channel_id;
  name.value = channelList.value[index].name;
}
const submitItem = async () => {
  if (isAdd.value) {
    const response = await addChannel(channel_id.value, name.value);
    if (response.success) {
      await getChannelList()
      dialogVisible.value = false;
    } else {
      ElMessage(response.message)
    }
  } else {
    const response = await editChannel(id.value, channel_id.value, name.value);
    if (response.success) {
      await getChannelList()
      dialogVisible.value = false;
    } else {
      ElMessage(response.message)
    }
  }
}
</script>
<style lang="scss" scoped>
.sub-account-wrapper {
  width: 100%;
  margin: 10px 0px;
}
</style>
