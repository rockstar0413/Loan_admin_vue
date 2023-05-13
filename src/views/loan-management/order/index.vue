<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData">
      <el-form-item>
        <el-input clearable v-model="phone_number_search" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="status_search" placeholder="">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar height="500px">
      <el-table :data="tableData" class="sub-account-wrapper" border header-align="center" stripe>
        <el-table-column prop="phone_number" label="手机号" width="100" />
        <el-table-column label="姓名/合同">
          <template #default="scope">
            {{ tableData[scope.$index] && tableData[scope.$index].id_card_name }}
            <el-switch v-model="contractSwitchList[scope.$index]" class="" inline-prompt
              @click="changeContract(scope.$index)" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #aaaaaa"
              active-text="显示" inactive-text="隐藏" />
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="注册时间" />
        <el-table-column prop="approved_amount" label="审批金额" />
        <el-table-column prop="withdraw_amount" label="余额" />
        <el-table-column prop="apply_period" label="期限" />
        <el-table-column prop="withdraw_time" label="提现时间" />

        <el-table-column label="短信/提现按钮">
          <template #default="scope">
            {{ tableData[scope.$index] && tableData[scope.$index].SMS }}
            <el-switch v-model="switchList[scope.$index]" class="" inline-prompt @click="changeShowButton(scope.$index)"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #aaaaaa" active-text="显示" inactive-text="隐藏" />
          </template>
        </el-table-column>

        <el-table-column label="转帐记录">
          <template #default="scope">
            <div>
              <el-button size="small">
                转帐截图
              </el-button>
              <el-button style="margin-left: 0px !important;" size="small">
                修改说明
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="保险截图">
          <template #default="scope">
            <div>
              <el-button size="small">
                保险截图
              </el-button>
              <el-button style="margin-left: 0px !important;" size="small" @click="openInsuranceEdit(scope.$index)">
                修改2.00
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="监管截图">
          <template #default="scope">
            <div>
              <el-button size="small">
                监管截图
              </el-button>
              <el-button style="margin-left: 0px !important;" size="small" @click="openRegulatoryEdit(scope.$index)">
                修改2
              </el-button>
            </div>
          </template>
        </el-table-column>


        <el-table-column label="资金操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openMoneyControl(scope.$index)">
              订单状态【{{ tableData[scope.$index].app_status }}】
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <div>
              <el-button size="small">
                合同
              </el-button>
              <el-button type="danger" size="small" @click="() => openLoanDialog(scope.$index)">
                放款
              </el-button>
              <el-button type="primary" style="margin-left: 0px !important; margin-top: 10px;" size="small"
                @click="() => openRecoverDialog(scope.$index)">
                恢复
              </el-button>
              <el-button style="margin-top: 10px;" size="small" @click="() => openSMSDialog(scope.$index)">
                短信
              </el-button>
            </div>
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

  <el-dialog v-model="dialogVisible" :title="isInsurance ? '保险金额' : '监管比例'" width="50%" :before-close="handleClose">
    <el-form label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="phone_number" disabled />
      </el-form-item>
      <el-form-item v-if="isInsurance" label="保险金额">
        <el-input v-model="insurance_amount" type="number" placeholder="" />
      </el-form-item>
      <el-form-item v-if="!isInsurance" label="监管比例">
        <el-input v-model="regulatory_ratio" type="number" placeholder="" />
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
        <el-button @click="() => SMSdialog = false">重置</el-button>
      </el-form-item>
    </el-form>
    <span class="">
      <span>常用短信：</span>
      <el-button @click="setSMSMessage(1)">银行卡异常</el-button>
      <el-button @click="setSMSMessage(2)">垫付失败</el-button>
      <el-button @click="setSMSMessage(3)">订单恢复</el-button>
      <el-button @click="setSMSMessage(4)">验资失败</el-button>
      <el-button @click="setSMSMessage(5)">银行卡流水不足</el-button>
      <el-button @click="setSMSMessage(6)">反洗钱中心介入</el-button>
      <el-button @click="setSMSMessage(7)">冻结</el-button>
    </span>
    <div>
      【1】点击上面常用按钮信息会自动加到发送框，再点发送；
    </div>
    <div>
      【2】如有需要增加和更改短信内容，请联系我
    </div>
  </el-dialog>

  <el-dialog v-model="mainDialog" title="Tips" width="50%" :before-close="handleClose">
    <el-form label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="phone_number" disabled />
      </el-form-item>
      <el-form-item label="提现按钮">
        <el-radio-group v-model="withdraw_button">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="2">不显示</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="!isMoneyControl" label="开户行">
        <el-input v-model="bank_account" disabled />
      </el-form-item>
      <el-form-item v-if="!isMoneyControl" label="银行卡号(错误)">
        <el-input v-model="bank_card_number" placeholder="" disabled />
      </el-form-item>
      <el-form-item v-if="!isMoneyControl" label="银行卡号(正确)">
        <el-input v-model="bank_card_number" placeholder="" disabled />
      </el-form-item>

      <el-form-item label="APP状态">
        <el-input v-model="app_status" />
      </el-form-item>

      <el-form-item label="APP备注">
        <el-input v-model="app_remarks" type="textarea" />
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="() => mainDialog = false">重置</el-button>
        <el-button type="primary" @click="editItem">
          立即提交
        </el-button>
      </span>
    </template>
    <div v-if="isMoneyControl">
      <span class="">
        <span>常用：</span>
        <el-button @click="setMessage(1)">到账钱包</el-button>
        <el-button @click="setMessage(2)">提现中</el-button>
        <el-button @click="setMessage(3)">垫付失败</el-button>
        <el-button @click="setMessage(4)">验资失败</el-button>
        <el-button @click="setMessage(5)">流水不足</el-button>
        <el-button @click="setMessage(6)">订单恢复</el-button>
        <el-button @click="setMessage(7)">认证失败</el-button>
        <el-button @click="setMessage(8)">休眠状态</el-button>
        <el-button @click="setMessage(9)">非法提现</el-button>

        <el-button @click="setMessage(10)">审核通过</el-button>
        <el-button @click="setMessage(11)">银行卡异常</el-button>
        <el-button @click="setMessage(12)">非法提现，资金二次冻结。</el-button>
        <el-button @click="setMessage(13)">认证未完成</el-button>
        <el-button @click="setMessage(14)">身份证信息异常</el-button>
        <el-button @click="setMessage(15)">系统认证失败！！！！！</el-button>
        <el-button @click="setMessage(16)">资金不匹配</el-button>
        <el-button @click="setMessage(17)">打款中</el-button>
        <el-button @click="setMessage(18)">审核未通过</el-button>
      </span>
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

const switchList = ref([]);
const contractSwitchList = ref([]);
const SMSdialog = ref(false);
const mainDialog = ref(false);
const phone_number_search = ref('');
const status_search = ref('');
const audit_result_search = ref(-1);
const withdraw_status_search = ref(-1);
const withdraw_button_search = ref(-1);
const insurance_amount = ref();
const isInsurance = ref(false);
const isLoan = ref(false);
const isMoneyControl = ref(false);
const regulatory_ratio = ref();
const detailVisible = ref(false);
const message = ref('');
const bank_account = ref('');
const bank_card_number = ref('');
const app_status = ref();
const app_remarks = ref();
const statusList = ref([
  { label: '订单状态', value: '' },
  { label: '提现成功', value: '提现成功' },
  { label: '资金冻结', value: '资金冻结' },
  { label: '二次冻结', value: '二次冻结' }
]);

const withdraw_amount = ref();
const phone_number = ref();
const id = ref();
const withdraw_button = ref();
const dialogVisible = ref(false);

const appStyle = ref([
  { status: '到账钱包', remark: '您的贷款金额已经下发到您的app钱包，请您提现……' },
  { status: '提现中', remark: '系统正在为您提现中，请耐心等待5至10分钟。' },
  { status: '垫付失败', remark: '垫付失败，请补足资金。' },
  { status: '验资失败', remark: '验资失败，请及时联系您的业务经理，重新完成资金流对接。' },
  { status: '流水不足', remark: '流水不足，系统检测到您的账户流水不足，请及时联系客户经理及时处理！' },
  { status: '订单恢复', remark: '订单已恢复。' },
  { status: '认证失败', remark: '由于认证资金不足认证超时请补足资金重新认证。' },
  { status: '休眠状态', remark: '高风险账户解除，系统自动跳转为休眠状态，如需提现请激活提现权限！请及时联系工作人员处理！' },
  { status: '非法提现', remark: '您好！尊敬的客户，由于您的电子合同未修改回来，擅自提现导致资金再次冻结，请联系业务经理及时处理！' },
  { status: '审核通过', remark: '您的订单已经审核通过，贷款资金已经下发到您的钱包，请联系专属业务员开通激活提现权限。' },
  { status: '银行卡异常', remark: '您好，由于您的银行卡信息与身份信息不符，导致放款失败，资金冻结！请您仔细核对您的个人收款账户信息及时处理！' },
  { status: '非法提现，资金二次冻结。', remark: '您好，由于您这边订单恢复打款过程中，未能按照正确指令提现，导致资金二次冻结！现需双倍认证，二次认证，请联系信贷人员处理，需按照要求提现，确保资金及时到账。' },
  { status: '认证未完成', remark: '您好，系统检测您的二次双倍认证只完成了一次，请速联系信贷人员完成剩下认证，确保资金及时到账。' },
  { status: '身份证信息异常', remark: '您好，您的身份信息异常，请您仔细核对身份信息是否填写有误，请及时联系专员解决处理！' },
  { status: '系统认证失败！！！！！', remark: '您好，系统检测到您的二次认证附言代码不一致，导致认证失败，现需再次双倍二次认证。' },
  { status: '资金不匹配', remark: '由于贷款资金和下款资金不匹配请联系业务经理及时处理。' },
  { status: '打款中', remark: '夜间打款，预计12小时到账！' },
  { status: '审核未通过', remark: '非常抱歉，您的订单审核未通过！' },

]);
const messageStyle = ref([
  '您的订单已驳回，请登陆查看，已处理请忽略。系统自动发送，本条短信请勿回复，如果疑问请联系在线客服',
  '您的订单已驳回，请登陆查看，已处理请忽略。系统自动发送，本条短信请勿回复，如果疑问请联系在线客服',
  '您的订单已驳回，请登陆查看，已处理请忽略。系统自动发送，本条短信请勿回复，如果疑问请联系在线客服',
  '您的订单已驳回，请登陆查看，已处理请忽略。系统自动发送，本条短信请勿回复，如果疑问请联系在线客服',
  '您的订单已驳回，请登陆查看，已处理请忽略。系统自动发送，本条短信请勿回复，如果疑问请联系在线客服',
  '您的订单已驳回，请登陆查看，已处理请忽略。系统自动发送，本条短信请勿回复，如果疑问请联系在线客服',
  '冻结',
])
const {
  getOrderList,
  updateOrder,
  updateOrderInsurance,
  updateAppStatus,
} = orderStore();
const { orderList } = storeToRefs(orderStore());
const {
  getUserById,
} = userStore();

onMounted(async () => {
  getTableList();
})
const changeShowButton = async (index) => {
  await updateOrder(tableData.value[index].id, tableData.value[index].withdraw_amount, tableData.value[index].withdraw_button === 1 ? 2 : 1, tableData.value[index].contract);
  getTableList();
}
const changeContract = async (index) => {
  console.log(index)
  await updateOrder(tableData.value[index].id, tableData.value[index].withdraw_amount, tableData.value[index].withdraw_button, tableData.value[index].contract === 1 ? 2 : 1);
  getTableList();
}
const getTableList = async () => {
  const response = await getOrderList(phone_number_search.value, audit_result_search.value, withdraw_status_search.value, withdraw_button_search.value, status_search.value, pageNum.value);
  tableData.value = orderList.value;
  pageNum.value = response.orderList.current_page;
  total.value = response.orderList.total;
  let temp = []
  tableData.value.map((item) => {
    temp.push(item.withdraw_button === 1 ? true : false)
  })
  switchList.value = temp;
  temp = [];
  tableData.value.map((item) => {
    temp.push(item.contract === 1 ? true : false)
  })

  contractSwitchList.value = temp;
}
const editItem = async () => {
  if (id.value) {
    if (isMoneyControl.value) {
      if (app_status.value === '' || app_remarks.value === '')
        return;
      await updateAppStatus(id.value, withdraw_button.value, app_status.value, app_remarks.value)
      mainDialog.value = false;
      getTableList();
    } else if (isInsurance.value) {
      if (app_status.value === '' || app_remarks.value === '')
        return;
      await updateAppStatus(id.value, withdraw_button.value, app_status.value, app_remarks.value)
      mainDialog.value = false;
      getTableList();
    } else {
      if (app_status.value === '' || app_remarks.value === '')
        return;
      await updateAppStatus(id.value, withdraw_button.value, app_status.value, app_remarks.value)
      mainDialog.value = false;
      getTableList();
    }
    // await updateOrderInsurance(id.value, insurance_amount.value, regulatory_ratio.value);
    // dialogVisible.value = false;
    // getTableList();
  }
}
const openMoneyControl = (index) => {
  mainDialog.value = true;
  isMoneyControl.value = true;
  id.value = tableData.value[index].id;
  phone_number.value = tableData.value[index].phone_number;
  withdraw_button.value = tableData.value[index].withdraw_button;
  app_status.value = tableData.value[index].app_status;
  app_remarks.value = tableData.value[index].app_remarks;
}
const openInsuranceEdit = (index) => {
  isInsurance.value = true;
  dialogVisible.value = true;
  id.value = tableData.value[index].id;
  phone_number.value = tableData.value[index].phone_number;
  insurance_amount.value = tableData.value[index].insurance_amount;
  regulatory_ratio.value = tableData.value[index].regulatory_ratio;
}
const openRegulatoryEdit = (index) => {
  isInsurance.value = false;
  dialogVisible.value = true;
  id.value = tableData.value[index].id;
  phone_number.value = tableData.value[index].phone_number;
  insurance_amount.value = tableData.value[index].insurance_amount;
  regulatory_ratio.value = tableData.value[index].regulatory_ratio;
}
const openLoanDialog = (index) => {
  isLoan.value = true;
  mainDialog.value = true;
  isMoneyControl.value = false;
  id.value = tableData.value[index].id;
  phone_number.value = tableData.value[index].phone_number;
  withdraw_button.value = tableData.value[index].withdraw_button;
  bank_account.value = tableData.value[index].bank_account;
  bank_card_number.value = tableData.value[index].bank_card_number;
  app_status.value = tableData.value[index].app_status;
  app_remarks.value = tableData.value[index].app_remarks;
}

const openRecoverDialog = (index) => {
  isLoan.value = false;
  mainDialog.value = true;
  isMoneyControl.value = false;
  id.value = tableData.value[index].id;
  phone_number.value = tableData.value[index].phone_number;
  withdraw_button.value = tableData.value[index].withdraw_button;
  bank_account.value = tableData.value[index].bank_account;
  bank_card_number.value = tableData.value[index].bank_card_number;
  app_status.value = tableData.value[index].app_status;
  app_remarks.value = tableData.value[index].app_remarks;
}

const search = () => {
  getTableList();
}

const openSMSDialog = async (index) => {
  id.value = tableData.value[index].id;
  phone_number.value = tableData.value[index].phone_number;
  SMSdialog.value = true;
}
const handleClose = (done) => {
  dialogVisible.value = false;
  SMSdialog.value = false;
  mainDialog.value = false;
}
const setMessage = (index) => {
  app_status.value = appStyle.value[index - 1].status;
  app_remarks.value = appStyle.value[index - 1].remark
}
const setSMSMessage = (index) => {
  message.value = messageStyle.value[index - 1];
  console.log(messageStyle.value[index - 1]);
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
