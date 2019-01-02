<template>
    <div>
        <el-table
                size="mini"
                id="model_list"
                v-loading="loading"
                :data="tableData.filter(data => !search || data.script_job_name.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%">
            <el-table-column
                    label="执行态名称"
                    prop="model_ame">
            </el-table-column>
            <el-table-column
                    label="作业名"
                    prop="script_job_name">
            </el-table-column>
            <el-table-column
                    label="执行参数"
                    prop="script_args">
            </el-table-column>
            <el-table-column
                    label="模块参数"
                    prop="module_args">
            </el-table-column>
            <el-table-column>
                <template slot="header" slot-scope="scope">
                    <label>启用</label>
                </template>
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            v-on:change="changeEnable(scope.row.enabled, scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    align="right">
                <template slot="header" slot-scope="scope">
                    <el-input
                            v-model="search"
                            size="mini"
                            placeholder="输入关键字搜索"/>
                </template>

                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" circle></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-left: 1px" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 20px;float:right">
            <el-button type="primary" v-on:click="addCron()">新增任务</el-button>
        </div>
    </div>
</template>



<script>
    import axios from '../assets/js/axios'


    export default {
        name: "script_list",
        data() {
            var data = [];
            return {
                tableData: data,
                search: '',
                loading: true
            }
        },
        mounted () {
            //console.log(this.tableData);
            axios.AxiosPost({
                url: 'ops_job/script/cronlist',
                params: {
                },
                callback: (res) => {
                    this.tableData = res.data.data;
                    console.log(res.data.data);
                    //console.log(this.tableData);
                    this.loading = false;
                }
            });
        },
        methods: {
            changeEnable(enabled, row) {
                const h = this.$createElement;
                axios.AxiosPost({
                    url: 'ops_job/script/enablecron',
                    params: {
                        enabled: enabled,
                        periodic_task_ame: row.periodic_task_ame
                    },
                    callback: (res) => {
                        if (res.data.result === 'success'){
                            this.$notify({
                                title: '启用/停用作业',
                                message: h('i', { style: 'color: teal'}, res.data.info),
                                type: 'success'
                            });
                        }else{
                            this.$notify.error({
                                title: '启用/停用作业',
                                message: h('i', { style: 'color: teal'}, res.data.info)
                            });
                        }
                    }
                });
            },
            editCron(index, row){
                //row.is_root  === 1 ? isRoot = true: isRoot = false;
                this.loading = true;
                //console.log(row.crontab);
                axios.AxiosPost({
                    url: 'ops_job/script/get_task_list',
                    params: {
                        "script_job_name": row.script_job_name
                    },
                    callback: (res) => {
                        this.loading = false;
                        this.$router.push({
                            name: "ops_job_script_cron_edit",
                            params:{
                                "periodic_task_name": row.periodic_task_ame,
                                "script_job_name": row.script_job_name,
                                "crontab": row.crontab,
                                "is_root": row.is_root,
                                "script_args": row.script_args,
                                "module_args": row.module_args,
                                "enabled": row.enabled,
                                "update": "Yes",
                                "task_list": res.data.data,
                                "selected_script_job": res.data.selected_script_job
                            }
                        });
                    }
                });
            },
            handleEdit(index, row) {
                this.editCron(index, row);
            },
            addCron(){
                axios.AxiosPost({
                    url: 'ops_job/script/get_task_list',
                    callback: (res) => {
                        this.$router.push({
                            name: "ops_job_script_cron_edit",
                            params:{
                                "script_job_name": '',
                                "crontab": '',
                                "is_root": false,
                                "script_args": '',
                                "module_args": '',
                                "enabled": false,
                                "update": "No",
                                "task_list": res.data.data,
                                "selected_script_job": res.data.selected_script_job
                            }
                        });
                    }
                });

            },
            // delete
            deleteRow(index) {
                this.tableData.splice(index, 1);
            },
            remoteDelete(index, row){
                this.deleteRow(index);
                axios.AxiosPost({
                    url: 'ops_job/script/delete_cron_job',
                    params: {
                        periodic_task_ame: row.periodic_task_ame
                    },
                    callback: (res) => {
                        console.log(res.data.result);
                    }
                });
            },
            handleDelete(index, row) {
                this.confirmDelete(index, row);
            },
            confirmDelete(index, row) {
                this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    this.remoteDelete(index, row);
                    this.loading = false;
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch((res) => {
                    //console.log(res);
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
        }
    }
</script>