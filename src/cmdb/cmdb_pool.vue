<template>
  <div>
  <el-table
          size="mini"
          :data="pageData.filter(data => !search || data.outer_addr_ip.toLowerCase().includes(search.toLowerCase()) || data.inner_addr_ip.toLowerCase().includes(search.toLowerCase()))"
          border
          style="width: 100%">
    <el-table-column
            fixed
            prop="id"
            label="ID"
            width="100">
    </el-table-column>
    <el-table-column
            prop="inner_addr_ip"
            label="内网地址"
            >
    </el-table-column>
    <el-table-column
            prop="outer_addr_ip"
            label="外网地址"
            >
    </el-table-column>
    <el-table-column
            prop="operating_system"
            label="操作系统"
            >
    </el-table-column>
    <el-table-column
            prop="region"
            label="地区"
            >
    </el-table-column>
    <el-table-column
            prop="available_zone"
            label="可用区"
            >
    </el-table-column>
    <el-table-column
            prop="status"
            label="状态"
            >
    </el-table-column>
    <el-table-column
            fixed="right"
            >
      <template slot="header" slot-scope="scope">
        <el-input
                v-model="search"
                size="mini"
                placeholder="输入ip搜索"/>
      </template>
      <template slot-scope="scope">
        <el-button @click="handleEditClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button type="text" @click="handleDeleteClick(scope.row)" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

    <div>
      <el-pagination
              style="float:left;margin-top:10px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="selectPage"
              :page-size="10"
              layout="total, prev, pager, next"
              :total="pageCount">
      </el-pagination>
    </div>
    <div>
    <el-button size="mini" style="float:right;margin-top:10px" @click="handleEditClick({
                    id: null,
                    inner_addr_ip: '',
                    outer_addr_ip: '',
                    region: '',
                    operating_system: '',
                    available_zone: '',
                })">新增资源</el-button>
    </div>
    <el-dialog title="资源编辑" :visible.sync="dialogFormVisible" >
      <el-form :model="resEdit">
        <el-form-item label="内网ip" :label-width="formLabelWidth">
          <el-input v-model="resEdit.inner_addr_ip" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="外网ip" :label-width="formLabelWidth">
          <el-input v-model="resEdit.outer_addr_ip" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="地区" :label-width="formLabelWidth">
            <el-input v-model="resEdit.region" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="操作系统" :label-width="formLabelWidth">
          <el-input v-model="resEdit.operating_system" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="可用区" :label-width="formLabelWidth">
          <el-input v-model="resEdit.available_zone" autocomplete="off" style="width:500px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submmitResData(resEdit)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import axios from '../assets/js/axios'
    export default {
        data() {
            return {
                tableData: [[]],
                pageData: [],
                selectPage: 1,
                pageSize: 10,
                pageCount: 1000,
                resEdit: {
                    id: 0,
                    inner_addr_ip: '',
                    outer_addr_ip: '',
                    region: '',
                    operating_system: '',
                    available_zone: '',
                },
                editRow: '',
                formLabelWidth: '140px',
                dialogFormVisible: false,
                search: '',
            };
        },
        mounted(){
            this.refreshTable('None', 0);
        },
        methods: {
            handleDeleteClick(row) {
                this.$confirm('此操作将永久该资源, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.AxiosPost({
                        url: 'cmdb/cmdb_pool/cmdb_delete',
                        params: {
                            "id": row.id,
                            "inner_ip": row.inner_addr_ip,
                            "outer_ip": row.outer_addr_ip,
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
            handleSizeChange(val) {
                this.pageSize = val;
                this.refreshTable('pageSize', val);
            },
            handleCurrentChange(val) {
                this.selectPage = val;
                this.refreshTable('selectPage', val);
            },
            handleEditClick(row) {
                this.editRow = row;
                this.resEdit.id = row.id;
                this.resEdit.inner_addr_ip = row.inner_addr_ip;
                this.resEdit.outer_addr_ip = row.outer_addr_ip;
                this.resEdit.region = row.region;
                this.resEdit.operating_system = row.operating_system;
                this.resEdit.available_zone = row.available_zone;
                this.dialogFormVisible = true
            },
            submmitResData(form) {
                this.dialogFormVisible = false;
                this.editRow.inner_addr_ip = form.inner_addr_ip;
                this.editRow.outer_addr_ip = form.outer_addr_ip;
                this.editRow.region = form.region;
                this.editRow.operating_system = form.operating_system;
                this.editRow.available_zone = form.available_zone;
                if (this.selectPage===this.tableData.length){
                    this.pageData.push(this.editRow);
                }
                axios.AxiosPost ({
                    url: 'cmdb/cmdb_pool/cmdb_update',
                    params: {
                        id: form.id,
                        inner_addr_ip: form.inner_addr_ip,
                        outer_addr_ip: form.outer_addr_ip,
                        region: form.region,
                        operating_system: form.operating_system,
                        available_zone: form.available_zone,
                    },
                    callback:(res) => {
                        console.log(res.data);
                        if (res.data.result === 'success'){
                            this.$notify({
                                title: '成功',
                                message: res.data.info,
                                type: 'success'
                            });
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: res.data.info
                            });
                        }
                    }
                });
            },
            refreshTable(change_type, val) {
                switch (change_type) {
                    case 'selectPage':
                        this.selectPage = val;
                        break;
                    case 'pageSize':
                        this.pageSize = val;
                        break;
                    default:
                        break;
                }
                this.tableData = [[]];
                this.pageData = [];
                this.pageCount = 1000;
                axios.AxiosPost({
                    url: 'cmdb/cmdb_pool/cmdb_pool',
                    callback: (res) => {
                        //this.allData = res.data.data;
                        //let data = [[]];
                        //console.log(res.data);
                        let index = 0;
                        this.pageCount = res.data.data.length;
                        for (let i of res.data.data){
                            if (this.tableData[index].length >= this.pageSize) {
                                index += 1;
                                this.tableData[index] = [];
                            }
                            //console.log(this.tableData);
                            this.tableData[index].push(i);
                        }
                        this.pageData = this.tableData[this.selectPage-1];
                    }
                });
            }
        }

    }
</script>