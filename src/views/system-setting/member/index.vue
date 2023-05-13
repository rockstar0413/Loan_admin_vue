<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData">
      <el-form-item>
        <el-input clearable v-model="name_search" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar height="500px">
      <el-table :data="adminUserList" class="sub-account-wrapper" border header-align="center" stripe>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="用户名" width="100" />
        <el-table-column prop="last_login" label="最后登陆时间" />
        <el-table-column prop="last_login_IP" label="最后登陆IP" />
        <el-table-column prop="status" label="状态" />

        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEdit(scope.$index, false)">
              修改
            </el-button>
            <el-button type="danger" size="small" @click="openEdit(scope.$index, true)">
              权辑
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
      <el-form-item label="用户名">
        <el-input v-model="name" />
      </el-form-item>
      <el-form-item label="IP" v-if="isRights">
        <el-input v-model="last_login_IP" />
      </el-form-item>
      <el-form-item label="密码" v-if="!isRights">
        <el-input v-model="password" placeholder="请输入登陆密码" type="password" />
      </el-form-item>
      <el-form-item label="状态" v-if="!isRights">
        <el-radio-group v-model="status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">禁用</el-radio>
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
import { adminUserStore } from '@/pinia/modules/adminUser';
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

const status = ref(1);
const name = ref('');
const password = ref('');
const name_search = ref('');
const dialogVisible = ref(false);
const last_login_IP = ref('');
const isRights = ref(false);
const id = ref(0);
const handleClose = (done) => {
  dialogVisible.value = false;
}
const {
  getAdminUserList,
  updateAdminUser,
} = adminUserStore()


const {
  adminUserList
} = storeToRefs(adminUserStore());
onMounted(async () => {
  getTableList();
})
const getTableList = async () => {
  const response = await getAdminUserList('', pageNum.value);
  pageNum.value = response.adminUserList.current_page;
  total.value = response.adminUserList.total;
}
const search = async () => {
  await getAdminUserList(name_search.value, pageNum.value);
}

const openEdit = (index, rights) => {
  isRights.value = rights;
  dialogVisible.value = true;
  console.log(adminUserList.value[index]);
  id.value = adminUserList.value[index].id;
  status.value = adminUserList.value[index].status;
  name.value = adminUserList.value[index].name;
  password.value = '';
  last_login_IP.value = adminUserList.value[index].last_login_IP;
}
const editItem = async () => {
  if (name.value) {
    await updateAdminUser(id.value, name.value, last_login_IP.value, password.value, status.value);
    dialogVisible.value = false;
    getTableList();
  }
}

</script>

<style lang="scss" scoped>
.sub-account-wrapper {
  width: 100%;
  margin: 10px 0px;
}
</style>
