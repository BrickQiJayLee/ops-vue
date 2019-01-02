<template>
  <div id="app" style="position:absolute; left:0; top:0; width:100%;height:100%;">
    <el-container style="height:100%; " direction="horizontal">
      <el-aside width="200px" style="height:100%; background-color: rgb(84, 92, 100);" v-if="isNotLogin">
          <el-menu
                  :default-openeds="['1', '2', '3']"
                  :default-active="activeIndex"
                  class="el-menu-vertical-demo add_border"
                  background-color="#545c64"
                  text-color="#fff"
                  active-text-color="#ffd04b"
                  >
          <el-submenu v-for="value in indexRoute" v-bind:index="value.index" style="overflow: hidden">
            <template slot="title">
              <i :class="value.icon"></i>
              <span>{{value.name}}</span>
            </template>
            <el-menu-item-group >
              <router-link v-for="item in value.data" :to="item.url" class="link-style">
                <el-menu-item class="el-menu-style" v-bind:index="item.index">{{item.name}}</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 14px; background-color: #545c64">
          <el-dropdown v-if="isNotLogin">
            <i class="el-icon-setting" style="margin-right: 1px;margin-top:23px;color:white;"></i>
            <el-dropdown-menu  slot="dropdown">
              <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span style="color: white;">{{username}}</span>
        </el-header>

        <el-main style="height: 100%">
          <router-view @showFatherPage="toShowPage"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
    import axios from "./assets/js/axios";

    export default {
        data() {
            return {
                isNotLogin: true,
                username: sessionStorage.getItem('username'),
                activeIndex: '1-1',
                indexRoute: {
                    cmdb: {
                        name: "资产管理",
                        index: '1',
                        icon: "icon-shujukanban",
                        data: [
                            {
                                url: '/cmdb/cmdb_pool',
                                index: '1-1',
                                name: '资源池'
                            },
                            {
                                url: '/cmdb/module_tree',
                                index: '1-2',
                                name: '业务模型'
                            },
                            {
                                url: '/cmdb/user_auth',
                                index: '1-3',
                                name: 'sshkey管理'
                            }
                        ]
                    },
                    db_job: {
                        name: "数据库管理",
                        index: '2',
                        icon: "icon-chucun",
                        data: [
                            {
                                url: '/db_job/db_instance',
                                index: '2-1',
                                name: '实例注册'
                            },
                            {
                                url: '/db_job/db_backup',
                                index: '2-2',
                                name: '数据库备份'
                            },
                            {
                                url: '/db_job/db_backup_history',
                                index: '2-3',
                                name: '备份历史'
                            }
                        ]
                    },
                    ops_job: {
                        name: "作业管理",
                        index: '3',
                        icon: "icon-shebeikaifa",
                        data: [
                            {
                                url: '/ops_job/script_create',
                                index: '3-1',
                                name: '新建作业'
                            },
                            {
                                url: '/ops_job/script_edit',
                                index: '3-2',
                                name: '作业编辑'
                            },
                            {
                                url: '/ops_job/script_excutor',
                                index: '3-3',
                                name: '作业执行'
                            },
                            {
                                url: '/ops_job/script_cron_list',
                                index: '3-4',
                                name: '执行态与定时管理'
                            },
                            {
                                url: '/ops_job/script_history',
                                index: '3-5',
                                name: '执行记录'
                            }
                        ]
                    },
                }
            };
        },
        mounted(){
            let currenturl = this.$route.fullPath;
            if (this.$route.path==='/login/user_login'){
                this.isNotLogin = false;
            }
            for (let topName in this.indexRoute){
                //console.log(topName);
                for (let route of this.indexRoute[topName].data){
                    let url = route.url;
                    if (currenturl===url){
                        this.activeIndex = route.index
                    }
                }
            }
        },
        methods: {
            toShowPage(){
                this.isNotLogin = true;
            },
            logout (){
                axios.AxiosPost({
                    url: 'account/user_logout',
                    callback: (res) => {
                        this.isNotLogin = false;
                        this.username = '';
                        sessionStorage.clear();
                        if (res.data.result==='success'){
                            this.$notify({
                                title: '成功',
                                message: '注销成功',
                                type: 'success'
                            });
                            this.$router.push({
                                name: "Login"
                            })
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: '注销失败'
                            });
                        }
                    }
                });
            }
        }

    }
</script>

<style>
  #app {
    font-family: Helvetica, sans-serif;
    text-align: left;
  }
  .el-menu-style {
    font-size: 12px;
  }

  .link-style {
    text-decoration:none;
  }
  .add_border{
    border: 1px;
  }


</style>

<style scoped>
  @import "static/fonts/icon/iconfont.css";
</style>
