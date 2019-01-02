<template>
    <div class="tree-container"  >
        <div class="custom-tree-container" style="float:left;height:100%;width:60%;">
            <el-form
                    size="mini"
                    ref="form"
                    v-loading="loading"
                    :model="form" label-width="80px">
                <el-form-item label="实例选择">
                    <el-select v-model="form.selected_db_instance" placeholder="请选择作业">
                        <el-option
                                v-for="item in form.db_instance"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="填写库名">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 8}"
                            style="width:500px"
                            placeholder="多库每行一个库名"
                            v-model="form.dbs"
                            input-new-tag>
                    </el-input>
                </el-form-item>
                <el-form-item label="填写表名">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 8}"
                            style="width:500px"
                            placeholder="一行一个表"
                            v-model="form.tables">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled='exec_disable' @click="commitAndExcute">执行</el-button>
                    <el-button :disabled="exec_disable" led='exec_disable' @click="backHistorylist()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="excuting" style="float:left; width: 40%; max-width: 600px;overflow:auto;">
            <el-card class="box-card" style="font-size: small;">
                <div slot="header" class="clearfix">
                    <span>执行结果:</span>
                </div>
                <pre class="detail_css">{{history}}</pre>
            </el-card>
        </div>
    </div>
</template>

<script>
    import axios from '../assets/js/axios'

    export default {
        name: "cronEdit",
        data() {
            return {
                loading: true,
                form: {
                    selected_db_instance: '',
                    db_instance: [],
                    dbs: '',
                    tables: ''
                },
                taskselect: [],
                excuting: false,
                history: '',
                instance_info: {},
                exec_disable: false
            }

        },
        mounted () {
            axios.AxiosPost({
                url: 'db_job/db_backup/backup_excute_page',
                callback: (res) => {
                    this.loading = false;
                    //console.log(res.data.data.db_marks);
                    this.instance_info = res.data.data.db_info;
                    this.form.db_instance = res.data.data.db_marks;
                }
            });
        },
        methods: {
            backHistorylist() {
                this.$router.push({
                    name: "script_history",
                });
            },
            commitAndExcute() {
                this.exec_disable = true;
                this.excuting = true;
                this.history = '正在执行，请等待...';
                //console.log(this.instance_info);
                //this.history = this.instance_info[this.form.selected_db_instance];
                console.log(this.instance_info[this.form.selected_db_instance]);
                // 创建任务
                axios.AxiosPost({
                    url: 'db_job/db_backup/db_backup_start',
                    params: {
                        db_instance: this.form.selected_db_instance,
                        dbs: this.form.dbs,
                        tables: this.form.tables,
                        selectdb: JSON.stringify(this.instance_info[this.form.selected_db_instance])
                    },
                    callback: (res) => {
                        console.log(res.data);
                        if (res.data.result === 'success'){
                            this.$notify({
                                title: '成功',
                                message: res.data.info,
                                type: 'success'
                            });
                            this.history = res.data.data;
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: res.data.info
                            });
                            this.history = res.data.data;
                        }
                        this.exec_disable = false;
                    }
                });


            }
        }
    }
</script>

<style>
    .detail_css {
        word-break: break-all;
        white-space: pre-wrap;
        overflow: auto;
        font-size: 10px;
    }
</style>