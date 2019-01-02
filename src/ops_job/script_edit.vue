<template>
    <el-table
            size="mini"
            id="script_list"
            v-loading="loading"
            :data="tableData.filter(data => !search || data.job_name.toLowerCase().includes(search.toLowerCase()))"
            style="width: 100%">

        <el-table-column
                label="作业名"
                prop="script_job_name">
        </el-table-column>
        <el-table-column
                label="脚本名"
                prop="script_name">
        </el-table-column>
        <el-table-column
                label="最近修改时间"
                prop="mtime">
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
</template>

<script>
    import axios from '../assets/js/axios'


    export default {
        name: "script_list",
        data() {
            var data = [];
            //console.log(data);
            return {
                tableData: data,
                search: '',
                loading: true
            }
        },
        mounted () {
            axios.AxiosPost({
                url: 'ops_job/script/list',
                params: {
                },
                callback: (res) => {
                    //console.log(res.data.data);
                    this.tableData = res.data.data;
                    this.loading = false;
                }
            });
        },
        methods: {
            handleEdit(index, row) {
                //console.log(row.script_name);
                axios.AxiosPost({
                    url: 'ops_job/script/edit',
                    params: {
                        script_name: row.script_name
                    },
                    callback: (res) => {
                        this.$router.push({
                            name: "coder",
                            params:{
                                script_name: res.data.data.script_name,
                                script_content: res.data.data.script_content,
                                script_type: res.data.data.script_type,
                                script_job_name: res.data.data.script_job_name
                            }
                        });
                        console.log(res.data.data);
                    }
                });
                //console.log(index, row);
            },
            // delete
            deleteRow(index) {
                this.tableData.splice(index, 1);
            },
            remoteDelete(index, row){
                console.log("start delete");
                this.deleteRow(index);
                axios.AxiosPost({
                    url: 'ops_job/script/delete',
                    params: {
                        script_name: row.script_name
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
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.remoteDelete(index, row);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch((res) => {
                    console.log(res);
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
