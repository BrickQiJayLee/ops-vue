<template>
    <div>
        <div class="block" style="float:right">
            <span class="demonstration" style="font-size:10px;margin-right: 10px;color: gray">选择查询时间:</span>
            <el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="mini"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="getTime">
            </el-date-picker>
        </div>
        <el-table
                size="mini"
                v-loading="loading"
                :data="tableData"
                style="width: 100%"
                max-height="100%">
            <el-table-column
                    prop="dteventtime"
                    label="执行日期"
                    sortable
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="job_name"
                    label="任务名"
                    style="width: 30%">
            </el-table-column>
            <el-table-column
                    prop="host_ok_ip_count"
                    label="成功"
                    style="width: 10%">
            </el-table-column>
            <el-table-column
                    prop="host_failed_ip_count"
                    label="失败"
                    style="width: 10%">
            </el-table-column>
            <el-table-column
                    prop="host_unreachable_ip_count"
                    label="不可达"
                    style="width: 10%">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="进度"
                    style="width: 10%">
                <template slot="header" slot-scope="scope">
                    <label>进度</label>
                </template>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.exec_status">执行中...</el-tag>
                    <el-tag v-else type="success">执行成功</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="详情"
                    width="120">
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="showDetail(scope.$index, scope.row)"
                            type="text"
                            size="small">
                        详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="详情" :visible.sync="dialogVisible" width="90%"><pre class="detail_css">{{ detail }}</pre></el-dialog>
    </div>
</template>

<script>
    import axios from '../assets/js/axios'
    export default {
        methods: {
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            showDetail(index, rows) {
                this.$router.push({
                    name: "script_history_detail",
                    params:{
                        history_id: rows.id
                    }
                });
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            refreshTableData(startTime,endTime){
                axios.AxiosPost({
                    url: 'ops_job/script/script_history',
                    params: {
                        startTime: startTime,
                        endTime: endTime
                    },
                    callback: (res) => {
                        if (res.data.result === 'success'){
                            this.tableData = res.data.data;
                            this.loading = false;
                        }
                    }
                });
            },
            getTime(){
                let start_time = this.searchTime[0];
                let end_time = this.searchTime[1];
                let startTime = (start_time.getFullYear()) + "-" +
                    (start_time.getMonth() + 1) + "-" +
                    (start_time.getDate()) + " " +
                    (start_time.getHours()) + ":" +
                    (start_time.getMinutes()) + ":" +
                    (start_time.getSeconds());
                let endTime = (end_time.getFullYear()) + "-" +
                    (end_time.getMonth() + 1) + "-" +
                    (end_time.getDate()) + " " +
                    (end_time.getHours()) + ":" +
                    (end_time.getMinutes()) + ":" +
                    (end_time.getSeconds());
                this.refreshTableData(startTime, endTime);
            }
        },
        data() {
            return {
                dialogVisible: false,
                detail: '',
                tableData: [],
                loading: true,
                searchTime: '',
            }
        },
        mounted(){
            let d = new Date();
            let startTime = (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate()) + " " + "00:00:00";
            let nowTime = (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate()) + " " +
                (d.getHours()) + ":" +
                (d.getMinutes()) + ":" +
                (d.getSeconds());
            this.refreshTableData(startTime, nowTime)
        }
    }
</script>

<style>
    .detail_css {
        word-break: break-all;
        overflow-x:auto;
        font-size: 10px;
    }
</style>