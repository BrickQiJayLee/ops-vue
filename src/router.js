import Vue from 'vue'
import Router from 'vue-router'

import ScriptEdit from './ops_job/script_edit'
import ScriptCreate from './ops_job/script_create'
import coder from './components/coder'
import ScriptCronList from './ops_job/script_cron_list'
import ScriptCronEdit from './ops_job/script_cron_edit'
import ScriptHistory from './ops_job/script_history'
import ScriptHistoryDetail from './ops_job/script_history_detail'
import ScriptExcutor from './ops_job/script_excutor'
import CmdbMoudleTree from './cmdb/module_tree'
import CmdbPool from './cmdb/cmdb_pool'
import CmdbUserAuth from './cmdb/user_auth'
import DbJobInstance from './db_job/db_instance'
import DbJobBackup from './db_job/db_backup'
import DbJobBackupHistory from './db_job/db_backup_history'
import UserLogin from './components/login'

Vue.use(Router);

const NotFound = { template: '<p>Page not found</p>' };
const Home = { template: '<p>home page</p>' };
const About = { template: '<p>about page</p>' };

let run_mode = process.env.OPS_RUN_MODE;
let router_mode = 'hash';
if (run_mode==='DEPLOY'){
    router_mode = 'hash';
}else{
    router_mode = 'history';
}

const router = new Router ({
    mode: router_mode,
    routes: [
        {
            path: '/login/user_login',  // 登录
            name: 'Login',
            component: UserLogin,
            meta: {
                loginRequire: true
            }
        },

        {
            path: '/ops_job/script_cron_list',    //定时任务列表
            name: 'ops_job_script_cron_list',
            component: ScriptCronList
        },
        {
            path: '/ops_job/script_cron_edit',    //定时任务编辑
            name: 'ops_job_script_cron_edit',
            component: ScriptCronEdit,
        },
        {
            path: '/ops_job/script_create',    //创建脚本
            name: 'ops_job_script_create',
            component: ScriptCreate
        },
        {
            path: '/ops_job/script_edit',    //脚本列表
            name: 'ops_job_script_edit',
            component: ScriptEdit
        },
        {
            path: '/ops_job/script_history',    //执行历史记录列表
            name: 'script_history',
            component: ScriptHistory
        },
        {
            path: '/ops_job/script_history_detail',     //执行历史详细记录
            name: 'script_history_detail',
            component: ScriptHistoryDetail,
        },
        {
            path: '/ops_job/script_excutor',   //执行脚本
            name: 'script_excutor',
            component: ScriptExcutor,
        },

        {
            path: '/coder',
            name: 'coder',
            component: coder,
        },
        {
            path: '/cmdb/cmdb_pool',    //设备资源池
            name: 'cmdb_pool',
            component: CmdbPool,
        },
        {
            path: '/cmdb/module_tree',    //资源目录树
            name: 'cmdb_module_tree',
            component: CmdbMoudleTree,
        },
        {
            path: '/cmdb/user_auth',
            name: 'cmdb_user_auth',
            component: CmdbUserAuth,
        },
        {
            path: '/db_job/db_instance',
            name: 'db_job_db_instance',
            component: DbJobInstance,
        },
        {
            path: '/db_job/db_backup',
            name: 'db_backup',
            component: DbJobBackup,
        },
        {
            path: '/db_job/db_backup_history',
            name: 'db_job_db_backup_history',
            component: DbJobBackupHistory,
        }
    ],
    beforeEach(){
        console.log("test");
    }
});


router.beforeEach((to, from, next) => {
    const isLogin = sessionStorage.getItem('session_id');
    if (isLogin) {
        next()
    } else {
        if (to.path === '/login/user_login') { //这就是跳出循环的关键
            next()
        } else {
            next('/login/user_login')
        }
    }
});

export default router