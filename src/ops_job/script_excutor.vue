<template>
    <el-form
            size="mini"
            ref="form"
            v-loading="loading"
            :model="form" label-width="80px">
        <el-form-item label="作业选择">
            <el-select v-model="form.job_name" placeholder="请选择作业" >
                <el-option
                        v-for="item in form.task_list"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="脚本参数">
            <el-input v-model="form.script_args" style="width: 70%;padding-left:2px;"></el-input>
            <el-radio-group v-model="form.params_type_radio" size="mini">
                <el-radio label="1" border>直接传参</el-radio>
                <el-radio label="2" border>文件传参</el-radio>
            </el-radio-group>
            <el-popover
                    placement="bottom"
                    title="说明"
                    width="200"
                    trigger="hover"
                    content="">
                直接传参将会直接将字符串拼接在脚本之后，通过入口参数获取。文件传参将会把参数生成一个ip 参数的字符串文件格式如:<br>
                10.0.0.1 arg1<br>
                10.0.0.2 arg2<br>
                使用时，如shell，执行cat $1获取参数<br>
                目前支持获取的参数有 <br>
                1.获取服务注册：--service <br>
                2.自定义参数: --custom 自定义参数
                <i slot="reference" class="el-icon-question"></i>
            </el-popover>
        </el-form-item>
        <el-form-item label="模块参数">
            <el-input v-model="form.module_args" style="width: 85%;padding-right:5px;"></el-input>
            <el-button type="primary" style="height:27px;" icon="el-icon-refresh" @click="getArgs">获取</el-button>
            <el-popover
                    placement="bottom"
                    title="说明"
                    width="200"
                    trigger="hover"
                    content="">
                使用需要结合模块分布树：<br>
                -s app节点名<br>
                -m module名称<br>
                -H ip<br>
                点击获取，将会把ip获取出来，如果选用文件传参，会显示文件内容
                <i slot="reference" class="el-icon-question"></i>
            </el-popover>
        </el-form-item>
        <div align="center"
             v-if="Params">
            <el-table
                    :data="paramData"
                    border
                    style="width: 50%;white-space: pre-line;">
                <el-table-column
                        prop="ip"
                        label="ip"
                        width="120%">
                </el-table-column>
                <el-table-column
                        prop="params"
                        label="params">
                </el-table-column>
            </el-table>
        </div>
        <el-form-item label="是否Root">
            <el-checkbox v-model="form.is_root">Root</el-checkbox>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="commitAndExcute(form)">执行</el-button>
            <el-button @click="backHistorylist()">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import axios from '../assets/js/axios'

    export default {
        name: "cronEdit",
        data() {
            return {
                isRoot: true,
                loading: true,
                form: {
                    "task_name": "一次性作业",
                    "job_name": "",
                    "tks_data_list": {},
                    "script_name": "",
                    "is_root": false,
                    "script_args": "",
                    "module_args": "",
                    "task_list": [],
                    "selected_script_job": "",
                    params_type_radio: '1'
                },
                paramData: [],
                taskselect: '',
                excutor_craeted_id: null,
                Params: false
            }

        },
        mounted () {
            axios.AxiosPost({
                url: 'ops_job/script/get_task_list',
                params: {
                    "task_name": "一次性作业",
                },
                callback: (res) => {
                    this.loading = false;
                    this.form.task_list = res.data.tks;
                    this.form.tks_data_list = res.data.data;
                }
            });
        },
        methods: {
            backHistorylist() {
                this.$router.push({
                    name: "script_history",
                });
            },
            getArgs() {
                axios.AxiosPost({
                    url: 'ops_job/script/get_args',
                    params: {
                        "args_type": (this.form.params_type_radio === '2')?"file":"normal",
                        "module_args": this.form.module_args,
                        "script_args": this.form.script_args
                    },
                    callback:(res) =>{
                        console.log(res.data);
                        if (res.data.result === 'success'){
                            this.paramData = res.data.data;
                            this.Params = true;
                        }
                        this.Params = true;
                    }
                })
            },
            commitAndExcute(formData) {
                let isRoot = '0';
                if (formData.is_root === true){
                    isRoot = '1';
                }else{
                    isRoot = '0';
                }
                const h = this.$createElement;

                // 创建任务
                axios.AxiosPost({
                    url: 'ops_job/script/exector_create',
                    params: {
                        "task_name": formData.task_name,
                    },
                    callback: (res) => {
                        this.excutor_craeted_id = res.data.data.history_id;
                        // 执行任务
                        axios.AxiosPost({
                            url: 'ops_job/script/script_http',
                            params: {
                                "kwargs": JSON.stringify({
                                    "args_type": (this.form.params_type_radio === '2')?"file":"normal",
                                    "task_name": "一次性作业",
                                    "job_name": formData.job_name,
                                    "script_name": '',
                                    "is_root": isRoot,
                                    "script_args": formData.script_args,
                                    "module_args": formData.module_args,
                                    "history_id": this.excutor_craeted_id
                                })
                            },
                            callback: (res) => {
                            }
                        });
                        this.$notify({
                            title: '任务已创建',
                            message: h('i', { style: 'color: teal'}, "创建成功"),
                            type: 'success'
                        });
                        this.$router.push({
                            name: "script_history_detail",
                            params: {
                                "history_id": this.excutor_craeted_id
                            }
                        });
                    }
                });


            }
        }
    }
</script>