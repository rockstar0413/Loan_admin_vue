<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData">
      <el-form-item>
        <el-input clearable v-model="phone_number_search" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="audit_result_search" placeholder="">
          <el-option v-for="item in auditResultList" :key="item.value" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="withdraw_status_search" placeholder="">
          <el-option v-for="item in withdrawStatusList" :key="item.value" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="withdraw_button_search" placeholder="">
          <el-option v-for="item in withdrawButtonList" :key="item.value" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar height="500px">
      <el-table :data="tableData" class="sub-account-wrapper" border header-align="center" stripe>
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="phone_number" label="用户名" width="100" />
        <el-table-column prop="id_card_name" label="姓名" />
        <el-table-column prop="created_at" label="注册时间" />
        <el-table-column prop="name" label="渠道来源" />
        <!-- <el-table-column prop="audit_result" label="审核结果" /> -->

        <el-table-column label="审核结果" width="120">
          <template #default="scope">
            {{ tableData[scope.$index].audit_result === 0 ? '未审' :
              tableData[scope.$index].audit_result === 1 ? '通过' :
                tableData[scope.$index].audit_result === 2 ? '不通过' :
                  null
            }}
          </template>
        </el-table-column>

        <el-table-column prop="apply_amount" label="申请金额" />
        <el-table-column prop="apply_period" label="申请期限" />
        <el-table-column prop="approved_amount" label="审批金额" />
        <el-table-column prop="withdraw_amount" label="提现金额" />
        <!-- <el-table-column prop="withdraw_status" label="提现状态" /> -->

        <el-table-column label="提现状态" width="120">
          <template #default="scope">
            {{
              tableData[scope.$index].withdraw_status === 1 ? '已签约' :
              tableData[scope.$index].withdraw_status === 2 ? '未提现' :
                null
            }}
          </template>
        </el-table-column>

        <el-table-column label="短信/提现按钮">
          <template #default="scope">
            {{ tableData[scope.$index] && tableData[scope.$index].SMS }}
            <el-switch v-model="switchList[scope.$index]" class="" inline-prompt @click="changeShowButton(scope.$index)"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #aaaaaa" active-text="显示" inactive-text="隐藏" />
          </template>
        </el-table-column>

        <el-table-column label="授信操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEdit(scope.$index)">
              修改提现金额
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="getProfile(scope.$index)">
              查看资料
            </el-button>
            <el-button type="primary" size="small" @click="() => openSMSDialog(scope.$index)">
              短信
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
        <el-input v-model="phone_number" disabled />
      </el-form-item>
      <el-form-item label="提现金额">
        <el-input v-model="withdraw_amount" type="number" placeholder="请输入登陆密码" />
      </el-form-item>
      <!-- <el-form-item label="状态">
        <el-radio-group v-model="withdraw_button">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item> -->
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
  <el-dialog v-model="detailVisible" title="查看资料" width="50%" :before-close="handleClose">
    <div>
      <table id="customers">
        <tr>
          <th>身份信息</th>
          <th></th>
        </tr>
        <tr>
          <td>真实姓名：{{ selectedUser.id_card_name }}</td>
          <td>身份证号：{{ selectedUser.id_card_number }}</td>
        </tr>
        <tr>
          <td>居住地址：{{ selectedUser.current_address }}</td>
          <td>性别：{{ selectedUser.gender }}</td>
        </tr>
      </table>

      <table id="customers">
        <tr>
          <th>银行卡信息</th>
          <th></th>
        </tr>
        <tr>
          <td>开户银行：{{ selectedUser.bank_address }}</td>
          <td>银行卡号：{{ selectedUser.bank_card_number }}</td>
        </tr>

      </table>

      <table id="customers">
        <tr>
          <th>其他信息</th>
          <th></th>
        </tr>
        <tr>
          <td>资金用途: {{ selectedUser.loan_way }}</td>
          <td>公司地址：{{ selectedUser.work_address }}</td>
        </tr>
        <tr>
          <td>工作年限: {{ selectedUser.loan_way }}</td>
          <td>工资：{{ selectedUser.work_address }}</td>
        </tr>
        <tr>
          <td>亲属姓名：{{ selectedUser.family_name }}</td>
          <td>朋友关系：{{ selectedUser.family_relationship }}</td>
        </tr>
        <tr>
          <td>亲属电话： {{ selectedUser.family_phone_number }}</td>
          <td>朋友姓名：{{ selectedUser.friend_name }}</td>
        </tr>
        <tr>
          <td>亲属联系关系： {{ selectedUser.friend_relationship }}</td>
          <td>朋友电话：{{ selectedUser.friend_phone_number }}</td>
        </tr>
      </table>
    </div>
  </el-dialog>
  <el-dialog v-model="SMSdialog" title="SMSdialog" width="50%" :before-close="handleClose">
    <el-form label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="phone_number" disabled />
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea" autosize placeholder="Please input message" v-model="message"></el-input>
      </el-form-item>
      <el-form-item style="display: inline-flex;">
        <el-button type="primary">立即发送</el-button>
        <el-button type="danger">重置</el-button>
      </el-form-item>
    </el-form>
    <span class="">
      <span>常用短信：</span>
      <el-button @click="setMessage">通过审核并授权额度</el-button>
    </span>
    <div>
      【1】点击上面常用按钮信息会自动加到发送框，再点发送；
    </div>
    <div>
      【2】如有需要增加和更改短信内容，请联系我
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { orderStore } from '@/pinia/modules/order';
import { userStore } from '@/pinia/modules/user';
import { storeToRefs } from 'pinia';
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

const tableData = ref([]);
const status = ref(true);
const switchList = ref([]);
const SMSdialog = ref(false);
const phone_number_search = ref('');
const audit_result_search = ref(-1);
const withdraw_status_search = ref(-1);
const withdraw_button_search = ref(-1);
const detailVisible = ref(false);
const message = ref('');
const auditResultList = ref([
  { label: '审核结果', value: -1 },
  { label: '未审核', value: 0 },
  { label: '通过', value: 1 },
  { label: '不通过', value: 2 }
]);
const withdrawStatusList = [
  { label: '提现状态', value: -1 },
  { label: '已签约', value: 1 },
  { label: '未提现', value: 2 },
]
const withdrawButtonList = [
  { label: '提现按钮', value: -1 },
  { label: '显示', value: 1 },
  { label: '隐藏', value: 2 },
];
const contract = ref();
const withdraw_amount = ref();
const phone_number = ref();
const id = ref();
const withdraw_button = ref();
const dialogVisible = ref(false);
const {
  getOrderList,
  updateOrder
} = orderStore()
const { orderList } = storeToRefs(orderStore());
const {
  getUserById,
} = userStore();
const {
  selectedUser
} = storeToRefs(userStore());
onMounted(async () => {
  getTableList();
})
const changeShowButton = async (index) => {
  await updateOrder(tableData.value[index].id, tableData.value[index].withdraw_amount, tableData.value[index].withdraw_button === 1 ? 2 : 1, tableData.value[index].contract);
  getTableList();
}
const getTableList = async () => {
  const response = await getOrderList(phone_number_search.value, audit_result_search.value, withdraw_status_search.value, withdraw_button_search.value, '', pageNum.value);
  tableData.value = orderList.value;
  pageNum.value = response.orderList.current_page;
  total.value = response.orderList.total;
  let temp = []
  tableData.value.map((item) => {
    temp.push(item.withdraw_button === 1 ? true : false)
  })
  switchList.value = temp;
}
const editItem = async () => {
  if (withdraw_amount.value && id.value) {
    await updateOrder(id.value, withdraw_amount.value, withdraw_button.value, contract.value);
    dialogVisible.value = false;
    getTableList();
  }
}
const openEdit = (index) => {
  dialogVisible.value = true;
  id.value = tableData.value[index].id;
  phone_number.value = tableData.value[index].phone_number;
  withdraw_button.value = tableData.value[index].withdraw_button;
  withdraw_amount.value = tableData.value[index].withdraw_amount;
  contract.value = tableData.value[index].contract;
}
const search = () => {
  getTableList();
}
const getProfile = async (id) => {
  const response = await getUserById(tableData.value[id].user_id);
  console.log(response.user);
  detailVisible.value = true;
}
const openSMSDialog = async (index) => {
  id.value = tableData.value[index].id;
  phone_number.value = tableData.value[index].phone_number;
  SMSdialog.value = true;
}
const handleClose = (done) => {
  dialogVisible.value = false;
  SMSdialog.value = false;
  detailVisible.value = false;
}
const setMessage = (index) => {
  message.value = "您的订单已通过，请登陆查看，已处理请忽略。系统自动发送，本条短信请勿回复，如果疑问请联系在线客服"
}
</script>
<style lang="scss" scoped>
.sub-account-wrapper {
  width: 100%;
  max-height: 500px;
  margin: 10px 0px;
}

#customers {
  margin-top: 10px;
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#customers td {
  border: 1px solid #ddd;
  padding: 8px;
}

#customers tr:nth-child(even) {
  background-color: #f2f2f2;
}

#customers tr:hover {
  background-color: #ddd;
}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}
</style>
