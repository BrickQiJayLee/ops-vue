<template style="height:100%;">
    <div class="tree-container"  >
        <div class="custom-tree-container" style="height:100%;width:40%;" v-loading="loading" >
            <div class="block" style="height:100%;width:100%;overflow:auto">
                <el-tree
                        :data="treeData"
                        node-key="id"
                        default-expand-all
                        highlight-current
                        check-on-click-node
                        v-bind:expand-on-click-node=false
                        @node-drop="handleDrop"
                        @node-click="nodeInfo"
                        draggable
                        :allow-drop="allowDrop"
                        :allow-drag="allowDrag"
                        :render-content="renderContent"
                >
                </el-tree>
                <el-button size="mini" @click="append({'node_type': 'root', })">添加根节点</el-button>
            </div>
        </div>
            <div style="width: 10%"></div>

        <div v-if="tableHidden" style="width: 90%; max-width: 600px;overflow:auto;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>节点详情</span>
                </div>
                <div class="text item">
                    <el-table
                            :data="tableData"
                            style="width: 100%"
                            size="mini"
                            v-loading="tableLoading"
                    >
                        <el-table-column
                                label="字段名"
                                width="180"
                                align="left">
                            <template slot-scope="scope">
                                <span>{{ scope.row.showField }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="内容">
                            <template slot-scope="scope">
                                <div v-if="scope.row.nameField==='service_info'">
                                    <el-tag
                                            :key="tag"
                                            v-for="tag in scope.row.valueField"
                                            closable
                                            size="small"
                                            :disable-transitions="false"
                                            type="info"
                                            @close="ServicehandleClose(scope.row.id, scope.row.nameField, scope.row.valueField, tag)">
                                        {{tag}}
                                    </el-tag>
                                    <div>
                                        <el-input
                                                class="input-new-tag"
                                                v-if="InputVisible.ServiceInputVisible"
                                                v-model="inputValue"
                                                ref="ServiceInputVisible"
                                                size="mini"
                                                @keyup.enter.native="ServiceHandleInputConfirm(scope.row.id, scope.row.nameField, scope.row.valueField)"
                                                @blur="ServiceHandleInputConfirm(scope.row.id, scope.row.nameField, scope.row.valueField)"
                                        >
                                        </el-input>
                                        <el-button size="mini" v-else class="button-new-tag" @click="showInput('ServiceInputVisible', null)" >+ 添加服务</el-button>
                                    </div>
                                </div>
                                <div v-else-if="scope.row.nameField==='ansible_ssh_user'">
                                    <el-input
                                            class="input-new-tag"
                                            v-model="scope.row.valueField"
                                            ref="AnsibleSshUserInput"
                                            v-if="InputVisible.AnsibleSshUserInput"
                                            size="mini"
                                            @keyup.enter.native="HandleInputConfirm(scope.row.id, scope.row.nameField, scope.row.valueField, 'AnsibleSshUserInput')"
                                            @blur="HandleInputConfirm(scope.row.id, scope.row.nameField, scope.row.valueField, 'AnsibleSshUserInput')"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-newother-tag" size="small" @click="showInput('AnsibleSshUserInput', null)">{{ scope.row.valueField }}</el-button>
                                </div>
                                <div v-else-if="scope.row.nameField==='ansible_ssh_port'">
                                    <el-input
                                            class="input-new-tag"
                                            v-model="scope.row.valueField"
                                            ref="AnsibleSshPortInput"
                                            v-if="InputVisible.AnsibleSshPortInput"
                                            size="mini"
                                            @keyup.enter.native="HandleInputConfirm(scope.row.id, scope.row.nameField, scope.row.valueField, 'AnsibleSshPortInput')"
                                            @blur="HandleInputConfirm(scope.row.id, scope.row.nameField, scope.row.valueField, 'AnsibleSshPortInput')"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-newother-tag" size="small" @click="showInput('AnsibleSshPortInput', null)">{{ scope.row.valueField }}</el-button>
                                </div>
                                <div v-else-if="scope.row.nameField==='ansible_sudo_pass'">
                                    <el-input
                                            type="password"
                                            class="input-new-tag"
                                            v-model="scope.row.valueField"
                                            ref="AnsibleSudoPassInput"
                                            v-if="InputVisible.AnsibleSudoPassInput"
                                            size="mini"
                                            @keyup.enter.native="HandleInputConfirm(scope.row.id, scope.row.nameField, scope.row.valueField, 'AnsibleSudoPassInput')"
                                            @blur="HandleInputConfirm(scope.row.id, scope.row.nameField, scope.row.valueField, 'AnsibleSudoPassInput')"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-newother-tag" size="small" @click="showInput('AnsibleSudoPassInput', scope.row)">*</el-button>
                                </div>
                                <div v-else>
                                    <span class="button-new-tag" size="small" >{{ scope.row.valueField }}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>

        </div>
        <el-dialog
                title="添加节点"
                :visible.sync="dialogAddNode.centerDialogVisible"
                width="30%"
                center>
            <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
                <el-form-item label="节点类型">
                    <el-tag size="small">{{addNodeType}}</el-tag>
                </el-form-item>
                <el-form-item v-if="is_add_ip" label="选择主机">
                    <el-select v-model="cmdbSelected" filterable placeholder="请选择">
                        <el-option
                                v-for="item in cmdb_list"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-else label="节点名称">
                    <el-input v-model="addNodeName"></el-input>
                </el-form-item>
                <el-form-item v-if="is_add_root" label="选择app">
                    <el-select v-model="addProductName" filterable placeholder="请选择">
                        <el-option
                                v-for="item in productList"
                                :key="item.value"
                                :label="item.lable"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="环境类型">
                    <el-select v-model="envSelected" filterable placeholder="请选择">
                        <el-option
                                v-for="item in envTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="CreateNode">立即创建</el-button>
                    <el-button @click="dialogAddNode.centerDialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    let id = 1000;

    import axios from '../assets/js/axios'
    export default {
        data() {
            return {
                treeData: [],
                tableData: [],
                tableLoading: true,
                loading: true,
                tableHidden: false,
                dialogAddNode: {
                    centerDialogVisible: false,
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                sizeForm: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                ServiceExists: [],
                InputVisible: {
                    ServiceInputVisible: false,
                    AnsibleSshUserInput: false,
                    AnsibleSshPortInput: false,
                    AnsibleSudoPassInput: false
                },
                inputValue: '',
                isEdit: true,
                cmdbSelected: '',
                cmdb_list: [],
                is_add_ip: false,
                addNodeHandler: null,
                addProductName: '',
                addNodeType: "App",
                addNodeName: '',
                addProductId: 0,
                addEnvironment: 0,
                addDepth: 0,
                addFatherId: 0,
                addNodeId: 0,
                productList: [],
                is_add_root: false,

                envTypeList: [
                    {
                        value: '正式环境',
                        label: '正式环境'
                    },
                    {
                        value: '测试环境',
                        label: '测试环境'
                    }
                ],
                envSelected: ''
            };
        },
        mounted () {
            axios.AxiosPost({
                url: 'cmdb/tree/tree_info',
                callback: (res) => {
                    this.loading = false;
                    this.treeData = res.data.data;
                }
            });
        },
        methods: {
            nodeInfo(index, row) {
                //console.log(row.data);
                this.tableLoading = true;
                this.tableHidden = true;
                this.InputVisible.ServiceInputVisible = false;
                axios.AxiosPost({
                    url: 'cmdb/tree/get_node_info',
                    params: {
                        "node_id": row.data.node_id
                    },
                    callback: (res) => {
                        let showLines = res.data.data.lines;
                        let data = res.data.data.node_info;
                        this.tableData = [];
                        console.log(res.data);
                        //console.log(showLines.length);
                        let NameToShow = {
                            "product_id": "业务id",
                            "product_name": "业务名",
                            "node_type": "节点类型",
                            "environment": "环境类型",
                            "service_info": "注册服务",
                            "create_time": "创建时间",
                            "inner_addr_ip": "内网地址",
                            "outer_addr_ip": "外网地址",
                            "ansible_ssh_user": "Ansible用户",
                            "ansible_ssh_port": "Ansible端口",
                            "ansible_sudo_pass": "Ansible sudo密码",
                        };
                        for (let i of showLines){
                            //console.log(i);
                            let pushData = {
                                nameField: i,
                                showField: NameToShow[i],
                                valueField: data[i],
                                id: data.id
                            };
                            this.tableData.push(pushData)
                        }
                        this.tableLoading = false;
                    }
                });

            },
            CreateNode(){
                let addNodeName = '';
                switch (this.addNodeType) {
                    case 'ip':
                        addNodeName = this.cmdbSelected;
                        this.addNodeName = this.cmdbSelected;
                        break;
                    case 'module':
                        addNodeName = this.addNodeName;
                        break;
                    case 'app':
                        addNodeName = this.addNodeName;
                        break;
                    default:
                        return -1;
                }
                console.log(this.addNodeName);
                axios.AxiosPost({
                    url: 'cmdb/tree/create_node',
                    params: {
                        node_type: this.addNodeType,
                        node_name: this.addNodeName,
                        product_id: this.addProductId,
                        environment: this.addEnvironment,
                        depth: this.addDepth,
                        father_id: this.addFatherId,
                    },
                    callback: (res) => {
                        if (res.data.result === 'success'){
                            this.$notify({
                                title: '成功',
                                message: '添加节点成功',
                                type: 'success'
                            });
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: res.data.info
                            });
                        }
                        this.addNodeId = res.data.data.created_id;
                        this.addTime = res.data.data.updatetime;
                        this.addProductName = res.data.data.product_name;
                        const newChild = {
                            id: id++,
                            node_id: this.addNodeId,
                            label: this.addNodeName,
                            children: [],
                            depth: this.addDepth,
                            father_id: this.addFatherId,
                            product_id: this.addProductId,
                            node_type: this.addNodeType,
                            environment: this.addEnvironment,
                            product_name: this.addProductName,
                            update_time: this.addTime
                        };
                        console.log(newChild);
                        this.dialogAddNode.centerDialogVisible = false;
                        if (!this.addNodeHandler.children) {
                            this.$set(this.addNodeHandler, 'children', []);
                        }
                        this.addNodeHandler.children.push(newChild);
                    }
                });


            },
            append(data) {
                //console.log(data);
                let father_type = data.node_type;
                let create_type = '';
                let father_id = '';
                this.addNodeName = '';
                switch (father_type) {
                    case 'root':
                        create_type = 'app';
                        father_id = 0;
                        this.is_add_ip = false;
                        this.is_add_root = true;
                        this.addNodeType = "app";
                        this.addFatherId = 0;
                        this.addDepth = 1;
                        this.addProductId = -1;
                        this.envSelected = '测试环境';
                        this.addEnvironment = '测试环境';
                        this.addProductName = '';
                        break;
                    case 'module':
                        create_type = 'ip';
                        father_id = data.id;
                        this.is_add_ip = true;
                        this.is_add_root = false;
                        this.addNodeType = "ip";
                        this.addFatherId = data.node_id;
                        this.addDepth = data.depth + 1;
                        this.addProductId = data.product_id;
                        this.addEnvironment = data.environment;
                        this.envTypeList = [
                            {
                                value: data.environment,
                                label: data.environment
                            }
                        ];
                        this.envSelected = data.environment;
                        break;
                    case 'app':
                        create_type = 'module';
                        father_id = data.id;
                        this.is_add_ip = false;
                        this.is_add_root = false;
                        this.addNodeType = "module";
                        this.addFatherId = data.node_id;
                        this.addDepth = data.depth + 1;
                        this.addProductId = data.product_id;
                        this.addEnvironment = data.environment;
                        this.envTypeList = [
                            {
                                value: data.environment,
                                label: data.environment
                            }
                        ];
                        this.envSelected = data.environment;
                        break;
                    default:
                        return -1
                }
                this.dialogAddNode.centerDialogVisible = true;
                axios.AxiosPost({
                    url: 'cmdb/tree/get_unused_ip_from_cmdb_pool',
                    callback: (res) => {
                        this.cmdb_list = res.data.data;
                    }
                });
                if (this.is_add_root){
                    axios.AxiosPost({
                        url: 'cmdb/tree/get_prod_list',
                        callback: (res) => {
                            this.productList = res.data.data;
                        }
                    });
                }
                this.addNodeHandler = data;

            },
            remove(node, data) {
                this.$confirm('此操作将永久删除该节点及其下所有内容, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.AxiosPost({
                        url: 'cmdb/tree/delete_node',
                        params: {
                            "node_id": data.node_id
                        },
                        callback: (res) => {
                            console.log(res.data);
                        }
                    });
                    const parent = node.parent;
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            renderContent(h, { node, data, store }) {
                let iconclass = '';
                let add_button = true;
                switch(node.data.node_type)
                {
                    case 'app':
                        iconclass = 'icon-apps';
                        break;
                    case 'module':
                        iconclass = 'icon-module-mokuai';
                        break;
                    case 'ip':
                        iconclass = 'icon-server';
                        add_button = false;
                        break;
                    default:
                        iconclass = 'icon-gaojing';
                }
                if (add_button){
                    return (
                        <span class={iconclass} style="width:100%;color:rgb(105,105,105);">
                            <i style="el-icon-caret-right" class={data.className} ></i>
                            <span style="line-height:28px;margin-left:5px; font-size: 10px; margin-left: 10px;">{node.label}</span>
                            <span style="float:right" >
                            <el-button style="color:rgb(100,149,237);" size="mini" type="text" on-click={ () => this.append(data) }>添加子节点</el-button>
                            <el-button style="color:rgb(100,149,237);" size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
                            </span>
                        </span>
                    );
                }else {
                    return (
                        <span class={iconclass} style="width:100%;color:rgb(128,128,128);">
                            <i style="el-icon-caret-right" class={data.className} ></i>
                            <span style="line-height:28px;margin-left:5px; font-size: 10px; margin-left: 10px;">{node.label}</span>
                            <span style="float:right" >
                                <el-button style="color:rgb(100,149,237);" size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
                            </span>
                        </span>
                    );
                }
            },
            handleDragAllow(node) {
                //console.log(node.data.node_type);
                return node.data.node_type === 'ip';
            },
            handleDropAllow(node) {
                //console.log(node.data);
                return node.data.node_type === 'module';
            },
            handleDragStart(node, ev) {
                console.log('drag start', node);
            },
            handleDragEnter(draggingNode, dropNode, ev) {
                console.log('tree drag enter: ', dropNode.label);
            },
            handleDragLeave(draggingNode, dropNode, ev) {
                console.log('tree drag leave: ', dropNode.label);
            },
            handleDragOver(draggingNode, dropNode, ev) {
                console.log('tree drag over: ', dropNode.label);
            },
            handleDragEnd(draggingNode, dropNode, dropType, ev) {
                console.log('tree drag end: ', dropNode && dropNode.label, dropType);
            },
            handleDrop(draggingNode, dropNode, dropType, ev) {
                //console.log('tree drop: ', dropNode.label, dropType);
                axios.AxiosPost({
                    url: 'cmdb/tree/change_father_node',
                    params: {
                        "node_id": draggingNode.data.node_id,
                        "father_id": dropNode.data.node_id
                    },
                    callback: (res) => {
                        let result = res.data.result;
                        if (result === 'success'){
                            this.$notify({
                                title: '成功',
                                message: "修改父节点成功",
                                type: 'success'
                            });
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: '移动节点失败'
                            });
                        }
                    }
                });
            },
            allowDrop(draggingNode, dropNode, type) {
                return this.handleDropAllow(dropNode) && type === 'inner';
            },
            allowDrag(draggingNode) {
                return this.handleDragAllow(draggingNode);
            },
            ServicehandleClose(rowid, rowKey, rowValue, tag) {
                //console.log(tag);
                rowValue.splice(rowValue.indexOf(tag), 1);
                let rowValueStr = rowValue.join(';');
                this.SubmitNodeInfoChange(rowid, rowKey, rowValueStr);

                //SubmitNodeInfoChange(rowid, rowKey, rowValue);
            },
            showInput(Name, inputHandler) {
                this.isEdit = true;
                this.InputVisible[Name] = true;
                if (Name === 'AnsibleSudoPassInput'){
                    console.log(inputHandler.valueField);
                    inputHandler.valueField = '';
                }
                //console.log(this.InputVisible);
                this.$nextTick(_ => {
                    this.$refs[Name].$refs.input.focus();
                });
            },
            ServiceHandleInputConfirm(rowid, rowKey, rowValue) {
                let inputValue = this.inputValue;
                if (inputValue) {
                    rowValue.push(inputValue);
                }
                let rowValueStr = rowValue.join(';');
                this.SubmitNodeInfoChange(rowid, rowKey, rowValueStr);
                this.inputValue = false;
                this.inputValue = '';
            },
            HandleInputConfirm(rowid, rowKey, rowValue, Name) {
                this.SubmitNodeInfoChange(rowid, rowKey, rowValue);
                this.InputVisible[Name] = false;
            },
            SubmitNodeInfoChange(rowid, rowKey, rowValue) {
                //console.log(rowid);
                if (rowKey==='service_info' && rowValue ===''){
                    console.log("服务字段为空");
                    return;
                }
                axios.AxiosPost({
                    url: 'cmdb/tree/save_node_change',
                    params: {
                        "rowid": rowid,
                        "rowKey": rowKey,
                        "rowValue": rowValue
                    },
                    callback: (res) => {
                        let result = res.data.result;
                        if (result === 'success'){
                            this.$notify({
                                title: '成功',
                                message: "修改成功",
                                type: 'success'
                            });
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: '修改失败'
                            });
                        }
                    }
                });
            }
        }
    };
</script>

<style>
    .tree-container {
        display: flex;
        height: 100%;
    }
    .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 30px;
        line-height: 20px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .button-newother-tag {
        margin-left: 10px;
        height: 25px;
        padding-top: 5px;
        width: 100px;
        padding-bottom: 5px;
        font-size: 8px;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .text {
        font-size: 14px;
    }
    .item {
        margin-bottom: 18px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        width: 90%;
    }
</style>