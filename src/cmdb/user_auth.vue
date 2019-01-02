<template>
    <div>
    <el-table id="script_list"
              v-loading="loading"
              border
              size="small"
              :data="tableData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%">

        <el-table-column
                label="姓名"
                prop="username"
        width="100px">
        </el-table-column>

        <el-table-column
                label="ssh_key"
                prop="user_key"
                show-overflow-tooltip>
        </el-table-column>
        <el-table-column
                label="关联模块"
                prop="related_node"
                show-overflow-tooltip>
        </el-table-column>
        <el-table-column
                label="特殊ip"
                prop="special_ip">
        </el-table-column>
        <el-table-column
                label="同步状态"
                prop="status">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status==='synced'" size="mini">已同步</el-tag>
                <el-tag type="danger" v-else size="mini">未同步</el-tag>
            </template>
        </el-table-column>
        <el-table-column
                >
            <template slot="header" slot-scope="scope">
                <el-input
                        v-model="search"
                        size="mini"
                        placeholder="输入姓名"/>
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
        <el-button type="primary" size="mini" style="float:right;margin-top: 5px; margin-left: 10px" @click="syncAuth(-1,{})" :disabled="isSyncing">同步<i class="el-icon-refresh el-icon--right"></i></el-button>
        <el-button type="success" size="mini" style="float:right;margin-top: 5px;" @click="handleEdit(-1,{})">新增<i class="el-icon-plus el-icon--right"></i></el-button>
    <el-dialog
            title="编辑用户信息"
            :visible.sync="dialogEditVisable"
            width="30%"
            center>
        <el-form ref="form" label-width="80px" size="mini">
            <el-form-item label="姓名">
                <el-input v-model="dataEdit.username"></el-input>
            </el-form-item>
            <el-form-item label="ssh_key">
                <el-input v-model="dataEdit.user_key"></el-input>
            </el-form-item>
            <el-form-item label="关联模块">
                <el-select
                        v-model="dataEdit.related_node_selected"
                        multiple
                        filterable
                        default-first-option
                        placeholder="请选择模块">
                    <el-option
                            v-for="item in dataEdit.node_list"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="特殊IP">
                <el-input v-model="dataEdit.special_ip"></el-input>
            </el-form-item>
            <el-form-item size="large">
                <el-button type="primary" @click="commitUserInfoEdit()">提交</el-button>
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
                isSyncing: false,
                tableData: [],
                allData: [],
                search: '',
                loading: true,
                dialogEditVisable: false,
                dataEdit: {
                    username: '',
                    user_key: '',
                    related_node: '',
                    special_ip: '',
                    related_node_selected: [],
                    node_list: [],
                }
            }
        },
        mounted () {
            this.loading = false;
            this.refreshTableData();
        },
        methods:{
            commitUserInfoEdit(){
                this.dataEdit.related_node_selected = this.dataEdit.related_node_selected.join(',');
                axios.AxiosPost({
                    url: 'cmdb/user_auth/commit_user_auth',
                    params: this.dataEdit,
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
            refreshTableData(){
                axios.AxiosPost({
                    url: 'cmdb/user_auth/get_user_info',
                    params: {
                    },
                    callback: (res) => {
                        this.tableData = res.data.data.user_key_auth;
                        console.log(this.tableData);
                    }
                });
                this.dialogEditVisable = false;
            },
            handleEdit(index,row){
                if (index===-1){
                    this.dataEdit = {
                        username: '',
                        user_key: '',
                        related_node: '',
                        special_ip: '',
                        related_node_selected: [],
                        node_list: [],
                    }
                }else{
                    this.dataEdit.related_node_selected = [];
                    this.dataEdit.node_list = [];
                    //console.log(row.related_node.split(','));
                    for (let i of row.related_node.split(',')){
                        if(i===''){
                            continue
                        }
                        this.dataEdit.related_node_selected.push(i);
                    }
                }
                // get node list
                axios.AxiosPost({
                    url: 'cmdb/user_auth/tree_node_list',
                    params: {
                    },
                    callback: (res) => {
                        console.log(res.data.data);
                        for (let i of res.data.data){
                            this.dataEdit.node_list.push({
                                value: i.node_name,
                                label: i.node_name
                            });
                        }
                        if(index===-1){

                        }else{
                            this.dataEdit.username = row.username;
                            this.dataEdit.user_key = row.user_key;
                            this.dataEdit.related_node = row.related_node;
                            this.dataEdit.special_ip = row.special_ip;
                        }

                    }
                });
                this.dialogEditVisable = true;
            },
            handleDelete(index, row){
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.AxiosPost({
                        url: 'cmdb/user_auth/delete_user',
                        params: {
                            delete_user_name: row.username
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
                this.isSyncing = true;
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
                        this.isSyncing = false;
                    }
                });
            }
        }
    }
</script>