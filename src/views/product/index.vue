<template>
  <el-container>
    <div>
      <el-input v-model="keyword" placeholder="通过产品名搜索" prefix-icon="el-icon-search"></el-input>
      <el-button @click="searchProduct()" type="primary" icon="el-icon-search">查询</el-button>
    </div>

    <el-table :data="productList" v-loading="loading" stripe>
      <el-table-column prop="id" label="产品编号" sortable></el-table-column>
      <el-table-column prop="name" label="产品名"></el-table-column>
      <el-table-column prop="total" label="商品总量" sortable></el-table-column>
    </el-table>

    <el-footer>
      <el-pagination layout="total, sizes, prev, pager, next, jumper" background style="margin-top: 10px;" :total="total"
        :current-page="page" :page-size="pageSize" @current-change="onPageChange"></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import {getRequest, postRequest, deleteRequest} from "@/utils/api"

export default {
  name: "Product",
  data() {
    return {
      productList: [],
      total: 0,     // 查询到的产品总数
      page: 1,      // 当前页码
      pageSize: 10, // 当前页面大小
      keyword: "",
      loading: true
    }
  },

  mounted() {
    this.loadData("/product/list");
  },

  methods: {
    async loadProductList(url) {
      const res = await getRequest(url)
      console.log(res)
      this.productList = res.data.data.productList
      this.loading = false
    },

    searchProduct() {
      if (this.keyword.trim() === "") {
        this.$message.warning("请输入关键字");
        return;
      }
      this.loading = true;
      let url = "/products?page=" + this.page + "&pageSize=" + this.pageSize + "&keyword=" + this.keyword.trim();
      this.loadProductList(url);
    },

    onPageChange(val) {
      this.page = val;
      this.loading = true;
      let url = "/products?page=" + this.page + "&pageSize=" + this.pageSize;
      if (this.keyword !== "") {
        url += "&keyword=" + this.keyword.trim();
      }
      this.loadProductList(url);
    },

    onPageSizeChange(val) {
      this.pageSize = val;
      if (this.pageSize * (this.page - 1) >= this.total) {
        this.page = 1;
        this.pageSize = 10;
      }
      this.loading = true;
      let url = "/products?page=" + this.page + "&pageSize=" + this.pageSize;
      if (this.keyword !== "") {
        url += "&keyword=" + this.keyword.trim();
      }
      this.loadProductList(url);
    },
  }
};
</script>

<style>
.el-input {
  width: 250px;
  margin-right: 10px;
}
</style>
