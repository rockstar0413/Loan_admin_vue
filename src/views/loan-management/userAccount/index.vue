<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData">
      <el-form-item>
        <el-input clearable v-model="phone_number_search" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="card_name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="channel" placeholder="">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar height="500px">
      <el-table :data="userList.data" class="sub-account-wrapper" border header-align="center" stripe>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="phone_number" label="用户名" width="100" />
        <el-table-column prop="id_card_name" label="姓名" />
        <el-table-column prop="id_card_number" label="身份证" />
        <el-table-column prop="name" label="来源渠道" />
        <el-table-column prop="device" label="来源设备" />
        <el-table-column prop="created_at" label="新增时间" />

        <el-table-column label="登陆状态">
          <template #default="scope">
            <el-switch v-model="switchList[scope.$index]" class="" inline-prompt @click="changeLoginStatus(scope.$index)"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #aaaaaa" active-text="正常" inactive-text="禁用" />
          </template>
        </el-table-column>

        <!-- <el-table-column fixed="right" label="Operations" width="120">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
              Remove
            </el-button>
          </template>
        </el-table-column> -->

        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEdit(scope.$index)">
              修改
            </el-button>
            <el-button type="danger" size="small" @click="deleteItem(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div style="display: flex; justify-content: center">
      <!-- <el-pagination background layout="prev, pager, next" :total="100" /> -->
      <el-pagination v-if="paginationConfig.show && total > 0" class="pagination" :style="paginationConfig.style"
        @size-change="handleSizeChange" @prev-click="handlePreClick" @next-click="handleNextClick"
        v-model:currentPage="pageNum" @current-change="handleCurrentChange" :page-sizes="paginationConfig.pageSizes"
        v-model:pageSize="pageSize" :layout="paginationConfig.layout" :total="total"></el-pagination>

    </div>
  </el-card>
  <el-dialog v-model="dialogVisible" title="Tips" width="50%" :before-close="handleClose">
    <el-form label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="phone_number" />
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="status" />
      </el-form-item>
      <el-form-item label="登陆密码">
        <el-input v-model="password" placeholder="请输入登陆密码" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="login_status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
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
import { userStore } from '@/pinia/modules/user';
import { channelStore } from '@/pinia/modules/channel';
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
const handleSizeChange = (number) => {
  console.log(number);
}
const handleCurrentChange = (number) => {
  console.log(number);
  pageNum.value = number
  getTableList()
}
const handlePreClick = (number) => {
  //console.log(number);
}
const handleNextClick = (number) => {
  //console.log(number);
}
const status = ref(1);
const login_status = ref(0);
const phone_number = ref('');
const password = ref('');
const phone_number_search = ref('');
const card_name = ref('');
const channel = ref('');
const switchList = ref([])
const dialogVisible = ref(false);
const id = ref(0);
const handleClose = (done) => {
  dialogVisible.value = false;
}
const {
  getUserList,
  updateUserLoginStatus,
  updateUserMainInformation,
  deleteUser,
} = userStore()
const {
  getChannelList
} = channelStore()
const {
  channelList
} = storeToRefs(channelStore())

const {
  userList
} = storeToRefs(userStore());
onMounted(async () => {
  getTableList();
  await getChannelList()
})
const getTableList = async () => {
  await getUserList('', '', '', pageNum.value);
  let temp = [];
  pageNum.value = userList.value.current_page;
  total.value = userList.value.total;
  userList.value.data.map((item) => {
    temp.push(item.login_status === 1 ? true : false)
  })

  console.log(temp)

  switchList.value = temp;
}
const search = async () => {
  await getUserList(phone_number_search.value, card_name.value, channel.value, pageNum.value);
  let temp = []
  pageNum.value = userList.value.currentPage;
  total.value = userList.value.total;
  userList.value.data.map((item) => {
    temp.push(item.login_status === 1 ? true : false)
  })
  switchList.value = temp;
}

const changeLoginStatus = async (index) => {
  console.log(index);
  console.log(userList.value.data[index]);
  await updateUserLoginStatus(userList.value.data[index].id, userList.value.data[index].login_status === 1 ? 0 : 1);
}

const openEdit = (index) => {
  dialogVisible.value = true;
  console.log(userList.value.data[index]);
  id.value = userList.value.data[index].id;
  login_status.value = userList.value.data[index].login_status;
  phone_number.value = userList.value.data[index].phone_number;
  status.value = userList.value.data[index].status;
  password.value = '';
}
const editItem = async () => {
  console.log(login_status.value)
  if (phone_number.value) {
    await updateUserMainInformation(id.value, phone_number.value, status.value, password.value, login_status.value);
    dialogVisible.value = false;
    getTableList();
  }
}
const deleteItem = (index) => {
  ElMessageBox.confirm('确定删除操作？')
    .then(async () => {
      const response = await deleteUser(userList.value.data[index].id);
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
