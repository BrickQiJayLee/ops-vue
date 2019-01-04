<template>
  <div>
  <el-table
          size="mini"
          :data="tableData.filter(data => !search || data.product_id.toLowerCase().includes(search.toLowerCase()) || data.product_name.toLowerCase().includes(search.toLowerCase()))"
          border
          style="width: 100%">
    <el-table-column
            fixed
            prop="id"
            label="ID"
            width="100">
    </el-table-column>
    <el-table-column
            prop="product_id"
            label="业务id"
            >
    </el-table-column>
    <el-table-column
            prop="product_name"
            label="业务名"
            >
    </el-table-column>
    <el-table-column
            prop="develop"
            label="开发人员"
            >
    </el-table-column>
    <el-table-column
            prop="ops"
            label="运维人员"
            >
    </el-table-column>
    <el-table-column
            prop="test"
            label="测试人员"
            >
    </el-table-column>
    <el-table-column
            fixed="right"
            >
      <template slot="header" slot-scope="scope">
        <el-input
                v-model="search"
                size="mini"
                placeholder="输入业务id或名称搜索"/>
      </template>
      <template slot-scope="scope">
        <el-button @click="handleEditClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button type="text" @click="handleDeleteClick(scope.row)" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

    <div>
    <el-button size="mini" style="float:right;margin-top:10px" @click="handleEditClick({
                    id: null,
                    inner_addr_ip: '',
                    outer_addr_ip: '',
                    region: '',
                    operating_system: '',
                    available_zone: '',
                })">新增业务</el-button>
    </div>
    <el-dialog title="业务编辑" :visible.sync="dialogFormVisible" >
      <el-form :model="prodEdit">
        <el-form-item label="业务id" :label-width="formLabelWidth">
          <el-input v-model="prodEdit.product_id" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="业务名" :label-width="formLabelWidth">
          <el-input v-model="prodEdit.product_name" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="开发人员" :label-width="formLabelWidth">
            <el-input v-model="prodEdit.develop" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="运维人员" :label-width="formLabelWidth">
          <el-input v-model="prodEdit.ops" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="测试人员" :label-width="formLabelWidth">
          <el-input v-model="prodEdit.test" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submmitData(prodEdit)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import axios from '../assets/js/axios'
    export default {
        data() {
            return {
                tableData: [],
                pageData: [],
                selectPage: 1,
                pageSize: 10,
                pageCount: 1000,
                prodEdit: {
                    product_id: -1,
                    product_name: '',
                    develop: '',
                    ops: '',
                    test: '',
                },
                editRow: '',
                formLabelWidth: '140px',
                dialogFormVisible: false,
                search: '',
            };
        },
        mounted(){
            this.refreshTable();
        },
        methods: {
            handleDeleteClick(row) {
                this.$confirm('此操作将永久该业务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.AxiosPost({
                        url: 'cmdb/product_info/delete_product',
                        params: {
                            "product_id": row.product_id,
                            "product_name": row.product_name,
                        },
                        callback: (res) => {
                            //console.log(row);
                            if (res.data.result === 'success'){
                                this.pageData.pop(row);
                                this.$notify({
                                    title: '成功',
                                    message: res.data.info,
                                    type: 'success'
                                });
                                this.refreshTable();
                            }else{
                                this.$notify.error({
                                    title: '错误',
                                    message: res.data.info
                                });
                            }
                        }
                    });
                }).catch((res) => {
                    console.log(res);
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleEditClick(row) {
                this.editRow = row;
                this.prodEdit.product_id = row.product_id;
                this.prodEdit.product_name = row.product_name;
                this.prodEdit.develop = row.develop;
                this.prodEdit.ops = row.ops;
                this.prodEdit.test = row.test;
                this.dialogFormVisible = true
            },
            submmitData(form) {
                this.dialogFormVisible = false;
                //this.editRow = row;
                this.prodEdit.product_id = form.product_id;
                this.prodEdit.product_name = form.product_name;
                this.prodEdit.develop = form.develop;
                this.prodEdit.ops = form.ops;
                this.prodEdit.test = form.test;
                this.dialogFormVisible = true;
                axios.AxiosPost ({
                    url: 'cmdb/product_info/commit_product',
                    params: {
                        product_id: form.product_id,
                        product_name: form.product_name,
                        develop: form.develop,
                        ops: form.ops,
                        test: form.test
                    },
                    callback:(res) => {
                        if (res.data.result === 'success'){
                            this.$notify({
                                title: '成功',
                                message: res.data.info,
                                type: 'success'
                            });
                            this.refreshTable();
                            this.dialogFormVisible = false;
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: res.data.info
                            });
                        }
                    }
                });
            },
            refreshTable() {
                axios.AxiosPost({
                    url: 'cmdb/product_info/product_list',
                    callback: (res) => {
                        if(res.data.result === 'success'){
                            console.log(res.data.data);
                            this.tableData = res.data.data;
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: res.data.info
                            });
                        }
                    }
                });
            }
        }

    }
</script>