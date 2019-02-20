<template>
    <el-form
            size="mini"
            ref="form" :model="form" label-width="100px">
        <el-form-item label="任务名(唯一)">
            <el-input v-model="form.periodic_task_name"></el-input>
        </el-form-item>
        <el-form-item label="作业选择">
            <el-select v-model="form.script_job_name" placeholder="请选择作业">
                <el-option
                        v-for="item in form.task_list"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="脚本参数">
            <el-input v-model="form.script_args" style="width: 70%;padding-right:5px;"></el-input>
            <el-radio-group v-model="form.args_type" size="mini">
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
        <el-form-item label="是否启用定时">
            <el-switch active-color="#13ce66"
                       v-model="form.enabled"></el-switch>
        </el-form-item>
        <el-form-item label="定时规则">
            <el-input v-model="form.crontab"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="commitCron(form)">提交</el-button>
            <el-button @click="backCronlist()">取消</el-button>
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
                form: {
                    "periodic_task_name": this.$route.params.periodic_task_name,
                    "script_job_name": this.$route.params.script_job_name,
                    "crontab": this.$route.params.crontab,
                    "is_root": this.$route.params.is_root,
                    "script_args": this.$route.params.script_args,
                    "module_args": this.$route.params.module_args,
                    "enabled": this.$route.params.enabled,
                    "task_list": this.$route.params.task_list,
                    "selected_script_job": this.$route.params.selected_script_job,
                    "args_type": this.$route.params.args_type
                },
                taskselect: '',
                leaveAnswer: true,
                Params: false,
                paramData: []
            }

        },
        beforeRouteLeave (to, from , next) {
            if (this.leaveAnswer){
                const answer = window.confirm('修改尚未提交，确认离开？');
                if (answer) {
                    next()
                } else {
                    next(false)
                }
            }else{
                next();
            }
        },
        mounted () {
            console.log(this.form);
            window.onbeforeunload = function (e) {
                e = e || window.event;
                // 兼容IE8和Firefox 4之前的版本
                if (e) {
                    e.returnValue = '关闭提示';
                }
                // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
                return '关闭提示';
            };

        },
        methods: {
            backCronlist() {
                this.$router.push({
                    name: "ops_job_script_cronlist",
                });
            },
            commitCron(formData) {
                let isRoot = '0';
                this.leaveAnswer = false;
                if (formData.is_root === true){
                    isRoot = '1';
                }else{
                    isRoot = '0';
                }
                const h = this.$createElement;
                console.log(this.$route.params.script_job_name);
                axios.AxiosPost({
                    url: 'ops_job/script/commitcron',
                    params: {
                        "periodic_task_name": formData.periodic_task_name,   //新名称
                        "script_job_name": formData.script_job_name,
                        "crontab": formData.crontab,
                        "is_root": isRoot,
                        "script_args": formData.script_args,
                        "module_args": formData.module_args,
                        "args_type": formData.args_type,
                        "enabled": formData.enabled,
                        "old_name": this.$route.params.periodic_task_name,  //旧名称
                        "update": this.$route.params.update
                    },
                    callback: (res) => {
                        if (res.data.result === 'success'){
                            this.$notify({
                                title: '提交任务',
                                message: h('i', { style: 'color: teal'}, res.data.info),
                                type: 'success'
                            });
                            this.$router.push({
                                name: "ops_job_script_cron_list",
                            });
                        }else{
                            this.$notify.error({
                                title: '提交任务',
                                message: h('i', { style: 'color: teal'}, res.data.info)
                            });
                        }
                    }
                });
            },
            getArgs() {
                axios.AxiosPost({
                    url: 'ops_job/script/get_args',
                    params: {
                        "args_type": (this.form.args_type === '2')?"file":"normal",
                        "module_args": this.form.module_args,
                        "script_args": this.form.script_args
                    },
                    callback:(res) =>{
                        console.log(res.data);
                        if (res.data.result === 'success'){
                            this.paramData = res.data.data;
                            this.Params = true;
                        } else {
                            this.paramData = [];
                        }
                        this.Params = true;
                    }
                })
            },
        }
    }
</script>