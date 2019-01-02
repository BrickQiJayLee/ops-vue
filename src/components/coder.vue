<template>
    <div class="code_editor" style="height: 100%;" id="code_container" v-loading="commitLoading">
        <el-tag>脚本名: {{ script_name }}</el-tag>
        <br><br>
        <MonacoEditor
                height="600"
                :language="language"
                :code="codes"
                :options="options"
                :highlighted="highlightLines"
                :changeThrottle="500"
                theme="vs-dark"
                @mounted="onMounted"
                @codeChange="onCodeChange"
                ref="vscode"
        >
        </MonacoEditor>
        <div id="language_options">
            <el-radio-group v-model="language">
                <el-radio v-for="item in languageOptions" v-bind:label="item" value="item">
                    <span v-if="item==='powershell'">shell</span>
                    <span v-else>{{item}}</span>
                </el-radio>
            </el-radio-group>

        </div>
        <div>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="作业名称">
                    <el-input v-model="form.script_job_name" v-bind:value="form.script_job_name"></el-input>
                </el-form-item>
                <el-form-item label="脚本名称">
                    <el-input v-model="form.script_name" v-bind:value="form.script_name"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" style="float:right;margin-right: 10px" @click="commit_script(this)" :disabled="isdisabledFn">保存作业<i class="el-icon-upload el-icon--right"></i></el-button>
        </div>

    </div>
</template>

<script>
    import MonacoEditor from 'vue-monaco-editor'
    import axios from '../assets/js/axios'


    export default {
        name: 'code_container',
        components: {
            MonacoEditor
        },
        props: ['codes'],

        data () {

            if(this.$route.params.script_type === 'shell'){
                var _script_type = 'powershell'
            }else{
                var _script_type = this.$route.params.script_type
            }
            return {
                isdisabledFn: false,
                script_name: this.$route.params.script_name,
                code: '',		// 代码内容
                language: _script_type,	 //语言
                languageOptions: [
                    'powershell', 'python', 'perl'
                ],
                /*
                'typescript','javascript','html','css','bat','c',
                    'coffeescript','cpp','csharp','csp','dockerfile',
                    'fsharp','go','handlebars','ini','java','json','less',
                    'lua','markdown','msdax','mysql','objective-c','pgsql',
                    'php','plaintext','postiats','powershell','pug','python',
                    'r','razor','redis','redshift','ruby','rust','sb','scss',
                    'sol','sql','swift','vb','xml','yaml'*/
                highlightLines: [{ number: 0, class: 'red'}],  //高亮
                //theme: ['hc-black', 'vs-dark'],  // 编辑器样式
                options: {		//选项
                    selectOnLineNumbers: false,
                    roundedSelection: false,
                    readOnly: false,		// 只读
                    cursorStyle: 'line',		//光标样式
                    automaticLayout: false,	//自动布局
                    glyphMargin: true,  //字形边缘
                    useTabStops: false
                },
                newCode: '',
                form: {
                    script_job_name: '',
                    script_name: '',
                },
                commitLoading: false,
                leaveAnswer: true
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
            }else {
                next()
            }
        },
        mounted(){
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
        watch: {
            //  更换语言的时候需要延时后 再销毁并创建
            language(newLanguage, oldLanguage){
                this.reload();
            },
            // code 父组件传递的 code发生变化就需要重载一次
            codes(a,b){
                this.reload();
            }
        },
        methods: {
            //编辑器挂载时触发
            onMounted(editor) {
                //console.log(this.$route.params.script_content);
                this.form.script_job_name = this.$route.params.script_job_name;
                this.form.script_name = this.$route.params.script_name;
                editor.setValue(this.$route.params.script_content);
                //console.log('after mount!', editor, editor.getValue(), editor.getModel());
                this.editor = editor;
            },
            //代码发生变化时触发
            onCodeChange(editor) {
                //console.log('code changed!', 'code:' + this.editor.getValue());
            },
            clickHandler() {
                //console.log('here is the code:', this.editor.getValue());
            },
            // 获取代码
            getcodevalue(){
                return this.editor.getValue();
            },
            getlanguage(){
                return this.language;
            },
            // 重载编辑框
            reload(){
                clearTimeout(time);
                let time = setTimeout(()=>{
                    this.$refs.vscode.destroyMonaco();   // 销毁
                    this.$refs.vscode.createMonaco();		// 创建
                }, 600);
            },
            commit_script(){
                this.leaveAnswer = false;
                this.isdisabledFn = true;
                this.commitLoading = true;
                axios.AxiosPost({
                    url: 'ops_job/script/updatescript',
                    params: {
                        script_name: this.form.script_name,
                        script_content: this.getcodevalue(),
                        script_job_name: this.form.script_job_name,
                        old_job_name: this.$route.params.job_name,
                        old_script_name: this.$route.params.script_name
                    },
                    callback: (res) => {
                        //console.log(res.data.data);
                        console.log(res.data.result);
                        this.$router.push({
                            name: "ops_job_script_edit",
                        });
                    }
                });
            }
        }
    }



</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .code_editor #language_options{
        padding: 16px;
    }
    .code_editor #language_options select{
        height: 33px;
        width: 20%;
    }
</style>