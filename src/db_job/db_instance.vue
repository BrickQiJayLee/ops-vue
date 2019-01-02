<template>
    <div>
        <el-table id="script_list"
                  v-loading="loading"
                  border
                  size="small"
                  :data="tableData.filter(data => !search || data.db_master.toLowerCase().includes(search.toLowerCase()) || data.db_slave.toLowerCase().includes(search.toLowerCase()))"
                  style="width: 100%">

            <el-table-column
                    label="主"
                    prop="db_master"
                    show-overflow-tooltip>
            </el-table-column>

            <el-table-column
                    label="备"
                    prop="db_slave"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    label="备注"
                    prop="db_mark"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    label="App"
                    prop="db_product"
                    width="80px"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    label="环境"
                    prop="db_env"
                    width="80px">
            </el-table-column>
            <el-table-column
                    label="DB服务类型"
                    prop="db_service_type"
                    width="87px">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.db_service_type==='container'" size="mini">容器</el-tag>
                    <el-tag type="success" v-else size="mini">服务</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    label="主:服务名"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <span type="success" v-if="scope.row.db_service_type==='container'" size="mini">{{scope.row.db_container_name}}</span>
                    <span type="success" v-else size="mini">{{scope.row.db_service_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="备:服务名"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <span type="success" v-if="scope.row.db_service_type==='container'" size="mini">{{scope.row.db_container_name_slave}}</span>
                    <span type="success" v-else size="mini">{{scope.row.db_service_name_slave}}</span>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot="header" slot-scope="scope">
                    <el-input
                            v-model="search"
                            size="mini"
                            placeholder="输入IP"/>
                </template>
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="success" size="mini" style="float:right;margin-top: 5px;" @click="handleEdit(-1,{})">新增<i class="el-icon-plus el-icon--right"></i></el-button>
        <el-dialog
                title="编辑DB信息"
                :visible.sync="dialogEditVisable"
                width="30%"
                center>
            <el-form ref="form" label-width="120px" size="mini">
                <el-form-item label="主(IP:PORT)">
                    <el-input v-model="dataEdit.db_master"></el-input>
                </el-form-item>
                <el-form-item v-if="dataEdit.db_service_type==='container'" label="主-容器名">
                    <el-input v-model="dataEdit.db_container_name"></el-input>
                </el-form-item>
                <el-form-item v-else label="主-服务名">
                    <el-input v-model="dataEdit.db_service_name"></el-input>
                </el-form-item>
                <el-form-item label="备(IP:PORT)">
                    <el-input v-model="dataEdit.db_slave"></el-input>
                </el-form-item>
                <el-form-item v-if="dataEdit.db_service_type==='container'" label="备-容器名">
                    <el-input v-model="dataEdit.db_container_name_slave"></el-input>
                </el-form-item>
                <el-form-item v-else label="备-服务名">
                    <el-input v-model="dataEdit.db_service_name_slave"></el-input>
                </el-form-item>
                <el-form-item label="实例名(自定义)">
                    <el-input v-model="dataEdit.db_mark"></el-input>
                </el-form-item>

                <el-form-item label="App">
                    <el-select
                            v-model="dataEdit.db_product"
                            filterable
                            default-first-option
                            placeholder="请选择APP">
                        <el-option
                                v-for="item in elseData.app_info"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="环境">
                    <el-select
                            v-model="dataEdit.db_env"
                            filterable
                            default-first-option
                            placeholder="请选择环境">
                        <el-option
                                v-for="item in elseData.env_info"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务类型">
                    <el-select
                            v-model="dataEdit.db_service_type"
                            filterable
                            default-first-option
                            placeholder="请选择APP">
                        <el-option
                                v-for="item in elseData.service_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据库用户名">
                    <el-input v-model="dataEdit.db_user_name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" @focus="passChange" v-model="dataEdit.db_passwd"></el-input>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="commitDbInfoEdit()">提交</el-button>
                    <el-button @click="dialogEditVisable = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>


<script>
    import axios from '../assets/js/axios'

    export default {
        name: "script_list",
        data() {
            return {
                tableData: [],
                allData: [],
                search: '',
                loading: true,
                dialogEditVisable: false,
                dataEdit: {
                    id: -1,
                    db_master: '',
                    db_slave: '',
                    db_product: '',
                    special_ip: '',
                    db_env: '',
                    db_mark: '',
                    db_passwd: '',
                    db_container_name: '',
                    db_container_name_slave: '',
                    db_user_name: '',
                    db_service_type: '',
                    db_service_name: '',
                    db_service_name_slave: '',
                    pass_change: 0
                },
                elseData: {},
            }
        },
        mounted () {
            this.loading = false;
            this.refreshTableData();
        },
        methods:{
            commitDbInfoEdit(){
                if(this.dataEdit.db_mark === ''){
                    this.$notify.error({
                        title: '错误',
                        message: "实例名不能为空!"
                    });
                    return
                }
                axios.AxiosPost({
                    url: 'db_job/db_instance/commit_db_instance',
                    params: this.dataEdit,
                    callback: (res) => {
                        if (res.data.result === 'success'){
                            this.$notify({
                                title: '成功',
                                message: res.data.info,
                                type: 'success'
                            });
                            this.refreshTableData();
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: res.data.info
                            });
                        }
                    }
                });
            },
            refreshTableData(){
                axios.AxiosPost({
                    url: 'db_job/db_instance/db_registry',
                    callback: (res) => {
                        this.tableData = res.data.data;
                        this.elseData = res.data.elseData;
                        console.log(this.tableData);
                    }
                });
                this.dialogEditVisable = false;
            },
            handleEdit(index,row){
                if (index===-1){
                    this.dataEdit = {
                        id: -1,
                        db_master: '',
                        db_slave: '',
                        db_product: '',
                        special_ip: '',
                        db_env: '',
                        db_mark: '',
                        db_passwd: '',
                        db_container_name: '',
                        db_container_name_slave: '',
                        db_user_name: '',
                        db_service_type: 'container',
                        db_service_name: '',
                        db_service_name_slave: '',
                        pass_change: 1,
                    }
                }else{
                    this.dataEdit = {
                        id: row.id,
                        db_master: row.db_master,
                        db_slave: row.db_slave,
                        db_product: row.db_product,
                        special_ip: row.special_ip,
                        db_env: row.db_env,
                        db_mark: row.db_mark,
                        db_passwd: row.db_passwd,
                        db_container_name: row.db_container_name,
                        db_container_name_slave: row.db_container_name_slave,
                        db_user_name: row.db_user_name,
                        db_service_type: row.db_service_type,
                        db_service_name: row.db_service_name,
                        db_service_name_slave: row.db_service_name_slave,
                        pass_change: 0,
                    }
                }
                this.dialogEditVisable = true;
            },
            handleDelete(index, row){
                this.$confirm('此操作将永久删除该实例, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.AxiosPost({
                        url: 'db_job/db_instance/delete_instance',
                        params: {
                            id: row.id
                        },
                        callback: (res) => {
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
                            this.refreshTableData();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            syncAuth(){
                axios.AxiosPost({
                    url: 'cmdb/user_auth/sync_auth',
                    params: {
                        apps: 'all_set'
                    },
                    callback: (res) => {
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
                        this.refreshTableData();
                    }
                });
            },
            passChange(){
                this.dataEdit.db_passwd = '';
                console.log(this.dataEdit);
                this.dataEdit.pass_change = 1;
            }
        }
    }
</script>