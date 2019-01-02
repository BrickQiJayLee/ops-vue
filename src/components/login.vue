
<template>
    <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-form :model="form" label-position="left" label-width="0px" class="demo-ruleForm">
                <h3 class="title">系统登录</h3>
                <el-form-item >
                    <el-input type="text" v-model="form.username" auto-complete="off" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input type="password" v-model="form.password" auto-complete="off" placeholder="密码" @keyup.enter.native="submit"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click="submit" :loading="logining">登录</el-button>
                </el-form-item>
            </el-form>
        </div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>


</template>

<script>
    import axios from 'axios'
    import getUrl from '../config/api_url'
    import qs from 'qs'
    export default {
        data() {
            return {
                logining: false,
                form: {
                    username:'',
                    password:'',
                },
                checked: true
            };
        },
        mounted() {
            const isLogin = sessionStorage.getItem('session_id');
            if (isLogin) {
                window.location.href='/cmdb/cmdb_pool';
            }else{

            }
        },
        methods: {
            authError() {
                this.$message({
                    showClose: true,
                    message: '密码或用户名错误',
                    type: 'error'
                });
            },
            submit(){
                var that = this;
                this.logining = true;
                axios.post(
                    getUrl('account/user_login'),
                    qs.stringify({
                        username:this.form.username,
                        password:this.form.password,
                    })).then(function(res){
                        if (res.data.hasOwnProperty('session_id')){
                            sessionStorage.setItem('username', res.data.username);
                            sessionStorage.setItem('session_id', res.data.session_id);
                            that.$notify({
                                title: '成功',
                                message: '登陆成功',
                                type: 'success'
                            });
                            //this.$router.replace('../assets/black');
                            window.location.href='/';
                            //that.$router.push({
                            //    name: "cmdb_pool"
                            //})
                        }else{
                            that.logining = false;
                            that.$notify.error({
                                title: '错误',
                                message: '用户名或密码错误'
                            });
                        }
                });
            },
        }
    }
</script>
