<template>
  <el-container>
    <div>
      <el-date-picker v-model="period" :editable="false" type="datetimerange" placement="bottom-start" 
      range-separator="至" 
      start-placeholder="开始时间"
        end-placeholder="结束时间">
      </el-date-picker>
      <el-button @click="searchOrder()" type="primary" style="margin-left: 10px" icon="el-icon-search">按创建时间查询</el-button>
    </div>

    <el-table :data="orderList" v-loading="loading" stripe>
      <el-table-column prop="id" label="订单编号" sortable fixed></el-table-column>
      <el-table-column prop="eid" label="操作用户" sortable width="120"></el-table-column>
      <el-table-column prop="wid" label="仓库编号" sortable></el-table-column>
      <el-table-column prop="pid" label="产品编号" sortable></el-table-column>
      <el-table-column prop="amount" label="订单数量"
        :filters="[{ text: '入库订单', value: 'input' }, { text: '出库订单', value: 'output' }]" :filter-method="orderFilter">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="180"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button @click="deleteOrder(scope.row)" size="mini" icon="el-icon-delete" type="danger" plain>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-footer>
      <el-pagination layout="total, sizes, prev, pager, next, jumper" background style="margin-top: 10px;" :total="total"
        :current-page="page"></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import { getRequest, postRequest, deleteRequest } from "@/utils/api"

export default {
  name: "OrderList",
  data() {
    return {
      orderList: [],
      total: 0,     // 查询到的订单总数
      page: 1,      // 当前页码
      period: [],
      loading: true
    }
  },

  mounted() {
    this.loadOrderList("/order/list")
  },

  methods: {
    async loadOrderList(url) {
      const res = await getRequest(url)
      console.log(res)
      this.loading = false
      if (res.data.code === 0) {
        this.orderList = res.data.data.orderList
        this.$message.success(res.data.message)
      } else {
        this.$message.error(res.data.message)
      }
    },

    searchOrder() {
      if (this.period.length === 0) {
        this.$message.warning("请输入查询区间");
        return;
      }
      this.loading = true;
      let url = `/order/list?page=${this.page}&startTime=${this.period[0].getTime()}&endTime=${this.period[1].getTime()}`;
      this.loadOrderList(url);
    },

    onPageChange(val) {
      this.page = val;
      this.loading = true;
      let url = "/order/list?page=" + this.page + "&pageSize=" + this.pageSize;
      if (this.period.length !== 0) {
        url += "&startTime=" + this.period[0].getTime() + "&endTime=" + this.period[1].getTime();
      }
      this.loadOrderList(url);
    },

    orderFilter(value, row) {
      return value === "input" ? row.amount > 0 : row.amount < 0;
    },

    deleteOrder(row) {
      this.$confirm("是否删除该订单", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let that = this;
        let url = "/order/" + row.id;
        this.$axios.post(url, {}).then(res => {
          if (res.status === 200) {
            if (res.data === 1) {
              that.$message.success("订单删除成功");
              that.loadOrderList("/order/list?page=" + this.page + "&pageSize=" + this.pageSize);
            } else {
              that.$message.warning("订单删除失败");
            }
          }
        }).catch(err => {
          console.log(err);
          that.$message.error("服务器异常");
        });
      });
    },
  }
}
</script>

<style scoped>
.el-input {
  width: 250px;
  margin-right: 10px;
}
</style>