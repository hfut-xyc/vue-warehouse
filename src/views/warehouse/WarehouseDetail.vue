<template>
  <el-card class="el-card-detail">
    <div slot="header">
      <el-page-header @back="goBack" content="详情页面">
      </el-page-header>
    </div>
    <el-collapse v-model="activeCollapseItems">
      <el-collapse-item name="基本信息">
        <template slot="title">
          <i class="el-icon-info"></i>基本信息
        </template>
        <div>
          <el-form ref="updateForm" :model="updateForm" :rules="rules" status-icon label-width="100px">
            <el-form-item label="仓库编号" prop="id">
              <el-input v-model="updateForm.id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="仓库名称" prop="name">
              <el-input v-model="updateForm.name" :disabled="false"></el-input>
              <el-button v-if="updateForm.name != info.name" icon="el-icon-edit" @click="updateWarehouseInfo()"
                type="primary">保存修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item name="仓库存储清单">
        <template slot="title">
          <i class="el-icon-box"></i>仓库存储清单
        </template>
        <el-table :data="productList" v-loading="productLoading" border stripe>
          <el-table-column prop="id" label="产品编号" sortable width="150"></el-table-column>
          <el-table-column prop="name" label="产品名"></el-table-column>
          <el-table-column prop="supplier" label="供应商"></el-table-column>
          <el-table-column prop="total" label="数量" sortable></el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" @current-change="onProductPageChange" :total="totalProduct">
        </el-pagination>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
export default {
  name: "WarehouseDetail",
  data: function () {
    const warehouseNameValidator = (rule, value, callback) => {
      if (value === '')
        callback(new Error('名称不能为空'))
      else
        callback()
    }
    return {
      // 路由接收的参数，包括id, name, operators
      info: {},
      // 产品列表
      productList: [],
      // el-collapse 默认打开的 item
      activeCollapseItems: ['基本信息', '仓库存储清单'],

      productLoading: false, // 产品列表是否在加载

      totalProduct: 0, // 总计产品数量
      totalEmployee: 0, // 总计员工数量

      updateForm: { // 修改仓库名称的Form
        id: 0,
        name: ""
      },
      rules: { // 表单验证器
        name: [{ validator: warehouseNameValidator, trigger: "blur" }]
      },
    }
  },

  mounted() {
    this.info = this.$route.params;
    this.updateForm.id = this.info.id;
    this.updateForm.name = this.info.name;
    this.loadProductList("/warehouse/" + this.info.id + "/products");
  },

  methods: {
    goBack() {
      this.$router.replace("/home/warehouse");
    },

    loadProductList(url) {
      this.productLoading = true;
      var that = this;
      this.$axios.get(url).then(res => {
        if (res.status === 200) {
          console.log(res);
          that.productList = res.data.productList;
          that.totalProduct = res.data.total;
          that.productLoading = false;
          that.$message.success("数据加载成功");
        } else {
          that.productLoading = false;
          that.$message.error("数据加载失败");
        }
      }).catch(res => {
        console.log(res);
        that.productLoading = false;
        that.$message.error("服务器异常");
      });
    },

    // 商品分页
    onProductPageChange(val) {
      let url = `/warehouse/${this.info.id}/products?page=${val}`;
      this.loadProductList(url);
    },

    // 更新 Warehouse 基本信息
    updateWarehouseInfo() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          var that = this;
          this.$axios.post("/warehouse", {
            id: this.updateForm.id,
            name: this.updateForm.name,
          })
            .then(res => {
              if (res.status === 200) {
                if (res.data === 1) {
                  that.$message.success("仓库名称修改成功");
                  that.info.name = that.updateForm.name;
                } else {
                  that.$message.warning("仓库名称修改失败");
                }
              } else if (res.status === 403) {
                that.$message.warning("权限不足，请联系管理员");
              }
            })
            .catch(err => {
              console.log(err);
              that.$message.error("服务器异常");
            });
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style>
.el-tag+.el-button,
.el-input+.el-button,
.el-tag+.el-button-like,
.el-button-like+.el-button {
  margin-left: 10px;
}

.el-input {
  max-width: 400px;
}

.el-card-detail {
  margin-top: 15px;
  width: 800px;
  margin-left: auto;
  margin-right: auto;
}
</style>