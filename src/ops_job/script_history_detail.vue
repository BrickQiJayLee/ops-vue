<template>
    <div>
        <el-alert
                title="提示: 若出现IP未执行情况，请检查root密码是否设置正确"
                type="info">
        </el-alert>
        <pre class="detail_css">
            {{detail}}
        </pre>
        <i v-loading="loading"></i>

    </div>
</template>

<script>
    import axios from '../assets/js/axios'
    export default {
        name: "script_create",
        data() {
            //var timestamp = Date.parse(new Date());
            return {
                history_id: this.$route.params.history_id,
                detail: "加载中...",
                ExecComplete: false,
                loading: true
            }
        },
        mounted () {
            this.$nextTick(function () {
                setInterval(this.refresh_detail, 1000);
            })
        },
        methods: {
            refresh_detail(){
                if (!this.ExecComplete) {
                    axios.AxiosGet({
                        url: 'ops_job/script/script_history_detail',
                        params: {
                            "history_id": this.history_id
                        },
                        callback: (res) => {
                            //console.log(res.data);
                            this.ExecComplete = res.data.data.ExecComplete;
                            if (res.data.result === 'success') {
                                this.detail = res.data.data;
                            } else {
                                this.detail = res.data.data;
                            }
                        }
                    });
                }else{
                    this.loading = false;
                }
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