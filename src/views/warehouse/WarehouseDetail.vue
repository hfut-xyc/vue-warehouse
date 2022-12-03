<template>
  <el-container>
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
            <el-button v-if="updateForm.name != info.name" icon="el-icon-edit" @click="updateWarehouseInfo()" type="primary">保存修改</el-button>
            </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>


        <el-collapse-item name="仓库负责人">
          <template slot="title">
            <i class="el-icon-user-solid"></i>仓库负责人
          </template>
          <template v-if="!isEditingEmployees">
            <span class="tags">
              <el-tooltip placement="top" v-for="operator in info.operators" :key="operator.name">
                <div slot="content">
                  工号：{{operator.id}}<br/>
                  姓名：{{operator.name}}<br/>
                  性别：{{operator.gender}}<br/>
                  电话号码：{{operator.phone}}
                </div>
                <el-tag>{{operator.name}}</el-tag>
              </el-tooltip>
              <el-button icon="el-icon-edit" size="small" @click="editEmployeeTag()">编辑</el-button>
            </span>
          </template>
          <template v-else>
            <span class="tags">
              <el-tooltip placement="top" v-for="operator in info.operators" :key="operator.name">
                <div slot="content">
                  工号：{{operator.id}}<br/>
                  姓名：{{operator.name}}<br/>
                  性别：{{operator.gender}}<br/>
                  电话号码：{{operator.phone}}<br/>
                </div>
                <el-tag closable @close="deleteEmployeeTag(operator.id)">{{operator.name}}</el-tag>
              </el-tooltip>
              <span class="el-button-like">
              <el-popover
                placement="bottom"
                width="400"
                trigger="click">
                <el-table 
                  :data="employeeListSelection" 
                  v-loading="employeeLoading" 
                  ref="employeeTable" 
                  @selection-change="handleEmployeeListSelction"
                  empty-text="本页员工已经全部分配"
                >
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column property="id" label="工号" width="100px"></el-table-column>
                  <el-table-column property="name" label="姓名"></el-table-column>
                </el-table>
                <el-pagination
                  layout="prev, pager, next"
                  @current-change="onEmployeePageChange"
                  :total="totalEmployee"
                  :page-size="5"
                  style="text-align: center;"
                >
                </el-pagination>
                <el-button slot="reference" :loading="employeeLoading" icon="el-icon-plus" size="small" type="primary" @click="updateEmployeeListSelction()">添加员工</el-button>
              </el-popover>
              </span>
              <el-button icon="el-icon-check" size="small" @click="updateWarehouseEmployee()" type="success">确定</el-button>
            </span>
            <p class="edit-tip">单击<i class="el-icon-close"></i>以移除该员工和仓库的管理关系</p>
          </template>
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
          <el-pagination
            layout="prev, pager, next"
            @current-change="onProductPageChange"
            :total="totalProduct">
          </el-pagination>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </el-container>
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
      };
      return {
        // 路由接收的参数，包括id, name, operators
        info: {},
        // 产品列表
        productList: [],
        // 雇员列表，懒加载
        employeeList: [],
        // 用于选择的雇员列表，会根据选择的情况进行列表的添加和移除操作
        employeeListSelection: [],
        // el-collapse 默认打开的 item
        activeCollapseItems: ['基本信息', '仓库负责人', '仓库存储清单'],

        productLoading: false, // 产品列表是否在加载
        employeeLoading: false, // 雇员列表是否在加载
        isEditingEmployees: false, // 是否在编辑雇员
        totalProduct: 0, // 总计产品数量
        totalEmployee: 0, // 总计员工数量

        updateForm: { // 修改仓库名称的Form
          id: 0,
          name: ""
        },
        rules: { // 表单验证器
          name: [{validator: warehouseNameValidator, trigger: "blur"}]
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

      loadEmployeeList(url) {
        this.employeeLoading = true;
        let that = this;
        this.$axios.get(url).then(res => {
          if (res.status === 200) {
            console.log(res);
            that.employeeList = res.data.employeeList;
            that.totalEmployee = res.data.total;
            // 深拷贝，此处为万不得以，修改了会导致没法恢复员工列表
            that.employeeListSelection = JSON.parse(JSON.stringify(res.data.employeeList));
            this.updateEmployeeListSelction();
            that.employeeLoading = false;
          } else {
            that.$message.error("数据加载失败");
            that.employeeLoading = false;
          }
        }).catch(res => {
          console.log(res);
          that.$message.error("服务器异常");
          that.employeeLoading = false;
        });
      },

      // 在打开选择气泡前，对employeeListSelction进行的筛除操作
      updateEmployeeListSelction() {
        this.info.operators.forEach((employee, index, array) => {
          this.employeeListSelection.find((v, i, obj) => {
            if(v.id === employee.id) {
              this.employeeListSelection.splice(i, 1);
              return true;
            }
          });
        });
      },

      // 在气泡中选中某(几)行，对employeeListSelction进行的筛除操作
      handleEmployeeListSelction(vals) {
        this.info.operators = this.info.operators.concat(vals);
        vals.forEach((employee, index, array) => {
          console.log(vals);
          this.employeeListSelection.find((v, i, obj) => {
            if(v.id === employee.id) {
              this.employeeListSelection.splice(i, 1);
              return true;
            }
          });
        });
        this.$refs.employeeTable.clearSelection();
      },

      // 商品分页
      onProductPageChange(val) {
        let url = `/warehouse/${this.info.id}/products?page=${val}`;
        this.loadProductList(url);
      },

      // 雇员分页
      onEmployeePageChange(val) {
        let url = `/employees?page=${val}&pageSize=5`;
        this.loadEmployeeList(url);
      },

      // “编辑”按钮绑定的事件
      editEmployeeTag() {
        this.isEditingEmployees = true;
        this.loadEmployeeList("/employees?pageSize=5");
      },

      // Tag删除触发的事件
      deleteEmployeeTag(eid) {
        this.info.operators.find((value, index, obj) => { 
          if(value.id === eid) {
            this.info.operators.splice(index, 1);
            this.employeeList.find((v, i, o) => {
              if (v.id === eid) {
                this.employeeListSelection.push(v);
                this.employeeListSelection.sort((a, b) => a.id - b.id);
                return true;
              }
            });
            return true;
          }
        });
      },

      // 更新 Warehouse 基本信息
      updateWarehouseInfo() {
        this.$refs["updateForm"].validate(valid => {
          if (valid) {
            var that = this;
            this.$axios.post("/warehouse/update/info", {
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

      // 更新 Warehouse 负责人信息
      updateWarehouseEmployee() {
        let that = this;
        let eidList = [];
        this.info.operators.forEach(v => eidList.push(v.id)); 
        this.$axios.post(`/warehouse/${this.info.id}/employees`, eidList)
        .then(res => {
          if (res.status === 200) {
            if (res.data === 1) {
              that.$message.success("仓库负责人修改成功");
              this.isEditingEmployees = false;
            } else {
              that.$message.warning("仓库负责人修改失败");
            }
          } else if (res.status === 403) {
            that.$message.warning("权限不足，请联系管理员");
          }
        })
        .catch(err => {
          console.log(err);
          that.$message.error("服务器异常");
        });
      },
    }
  }
</script>

<style>
.el-tag + .el-button, .el-input + .el-button, 
.el-tag + .el-button-like, .el-button-like + .el-button {
  margin-left: 10px;
}

.transfer-footer {
  text-align: center;
}

.transfer {
  text-align: center;
  max-width: 700px;
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

.edit-tip {
  color: gray;
  font-size: small;
}

.tags {
  line-height: 40px;
}
</style>