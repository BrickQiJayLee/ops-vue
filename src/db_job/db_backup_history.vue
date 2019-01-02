<template>
    <div>
        <el-table
                size="mini"
                v-loading="loading"
                :data="tableData"
                style="width: 100%"
                max-height="100%"
                >
            <el-table-column
                    fixed
                    prop="dtEventTime"
                    label="执行时间"
                    style="width: 20%"
                    width="135px"
                    column-key="dtEventTime"
                    :filters="date_filter"
                    :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                    prop="instance_name"
                    label="数据库实例名"
                    style="width: 30%"
                    width="120px">
            </el-table-column>
            <el-table-column
                    prop="dbs"
                    label="库名"
                    style="width: 30%"
                    width="70px">
            </el-table-column>
            <el-table-column
                    prop="tables"
                    label="表名"
                    style="width: 30%"
                    width="160px">
            </el-table-column>
            <el-table-column
                    prop="result"
                    label="备份文件列表"
                    style="width: 10%">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    import axios from '../assets/js/axios'
    export default {
        methods: {
            resetDateFilter() {
                this.$refs.filterTable.clearFilter('date');
            },
            clearFilter() {
                this.$refs.filterTable.clearFilter();
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] >= value;
            }
        },
        data() {
            return {
                dialogVisible: false,
                detail: '',
                tableData: [],
                loading: true,
                date_filter: []
            }
        },
        mounted(){
            axios.AxiosPost({
                url: 'db_job/db_backup/backup_list',
                callback: (res) => {
                    if (res.data.result === 'success'){
                        this.tableData = res.data.data;
                        this.date_filter = res.data.date_filter
                    }
                }
            });
            this.loading = false;
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