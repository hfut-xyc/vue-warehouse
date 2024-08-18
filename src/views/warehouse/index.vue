<template>
  <el-container>
    <div>
      <el-input v-model="keyword" placeholder="按仓库名搜索" prefix-icon="el-icon-search"></el-input>
      <el-button @click="search()" type="primary" icon="el-icon-search">查询</el-button>
      <el-button @click="isDialogVisible = true" type="primary" icon="el-icon-plus" plain>添加新仓库</el-button>
    </div>

    <el-table :data="warehouseList" v-loading="loading" stripe>
      <el-table-column prop="id" label="仓库ID" sortable width="100"></el-table-column>
      <el-table-column prop="name" label="仓库名" width="300">
        <!-- <el-table-column prop="address" label="仓库地址" width="300"> -->
        <template slot-scope="scope">
          <span style="color: #0083ee;cursor: pointer" @click="goToDetail(scope.row)" title="点击查看详情">{{ scope.row.name
          }}</span>
        </template>
      </el-table-column>

    </el-table>

    <el-footer>
      <el-pagination layout="total, sizes, prev, pager, next, jumper" background style="margin-top: 10px;"
        @size-change="onPageSizeChange" @current-change="onPageChange" :page-sizes="[5, 10, 15, 20, 25]"
        :page-size="pageSize" :current-page="page" :total="total"></el-pagination>
    </el-footer>

    <el-dialog title="添加新仓库" :visible.sync="isDialogVisible">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="120px">
        <el-form-item label="仓库名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addWarehouse()" type="primary">添加</el-button>
        <el-button @click="isDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import { getRequest, postRequest, deleteRequest } from "@/utils/api"

export default {
  name: "Warehouse",
  data: function () {
    return {
      total: 0, // 查询到的用户总数
      page: 1, // 当前页码
      pageSize: 10, // 当前页面大小
      keyword: "", // 查询仓库名的关键字
      warehouseList: [], // 获得的查询结果
      loading: true, // 页面表格是否处于加载状态
      isDialogVisible: false,
      addForm: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: "仓库名称不能为空", trigger: "blur" }],
      }

    };
  },
  mounted: function () {
    this.loading = true;
    this.loadWarehouseList("/warehouse/list");
  },

  methods: {
    goToDetail(row) {
      this.$router.push({ name: '仓库详情', params: row });
    },

    async loadWarehouseList(url) {
      const res = await getRequest(url)
      this.loading = false
      if (res.data.code === 0) {
        this.total = res.data.data.total
        this.warehouseList = res.data.data.warehouseList
        this.$message.success(res.data.message)
      } else {
        this.$message.error(res.data.message)
      }
    },

    search() {
      if (this.keyword.trim() === "") {
        this.$message.warning("请输入关键字");
        return;
      }
      let url = `/warehouse/list?page=${this.page}&pageSize=${this.pageSize}&keyword=${this.keyword.trim()}`
      this.loadWarehouseList(url);
    },

    onPageChange(val) {
      this.page = val;
      this.loading = true;
      let url = `/warehouse/list?page=${this.page}&pageSize=${this.pageSize}`
      if (this.keyword !== "") {
        url += "&keyword=" + this.keyword.trim();
      }
      this.loadWarehouseList(url);
    },

    onPageSizeChange(val) {
      this.pageSize = val;
      if (this.pageSize * (this.page - 1) >= this.total) {
        this.page = 1;
        this.pageSize = 10;
      }
      let url = `/warehouse/list?page=${this.page}&pageSize=${this.pageSize}`
      if (this.keyword !== "") {
        url += "&keyword=" + this.keyword.trim();
      }
      this.loadWarehouseList(url);
    },

    addWarehouse() {
      this.$refs["addForm"].validate(async valid => {
        if (!valid) {
          return false
        }
        const res = await postRequest('/warehouse', this.addForm)
        if (res.data.code === 0) {
          this.$message.success(res.data.message)
          this.isDialogVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  }
};
</script>

<style>
.el-input {
  width: 250px;
  margin-right: 10px;
}

.el-tag+.el-tag {
  margin-left: 10px;
}

.detail-form label {
  width: 100px;
  color: #99a9bf;
  text-align: end;
  margin-right: 20px;
}
</style>
