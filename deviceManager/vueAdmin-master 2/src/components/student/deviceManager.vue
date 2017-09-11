<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="formInline.name" placeholder="设备名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <template>
            <el-table :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="70">
                </el-table-column>
                <el-table-column prop="name" label="设备名称" width="150" sortable>
                </el-table-column>
                <el-table-column prop="price" label="设备价格" width="150" sortable>
                </el-table-column>
                <el-table-column prop="status" label="设备状态" width="150" sortable>
                </el-table-column>
                <el-table-column prop="belong" label="设备所属实验室" width="180" sortable>
                </el-table-column>
                <el-table-column prop="fix" label="设备故障信息" width="180" sortable>
                </el-table-column>
                <el-table-column prop="info" label="设备信息" sortable>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="100">
					<span>
					<el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
					<el-button type="text" size="small" @click="handleDel(row)">删除</el-button>
				</span>
                </el-table-column>
            </el-table>
        </template>

        <!--分页-->
        <!--<el-col :span="24" class="toolbar" style="padding-bottom:10px;">-->
            <!--<el-pagination v-bind:current-Page="pageIndex" v-bind:page-size="pageSize" :total="total" layout="total,sizes,prev,pager,next,jumper" v-bind:page-sizes="pageSizes" v-on:size-change="sizeChange" v-on:current-change="pageIndexChange" style="float:right">-->
            <!--</el-pagination>-->
        <!--</el-col>-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination :page-sizes="[10, 20, 30, 40]" v-bind:current-Page="pageIndex" v-bind:page-size="pageSize" v-on:size-change="sizeChange" v-on:current-change="pageIndexChange" layout="total, sizes, prev, pager, next, jumper"
                           :total="total" style="float:right">
            </el-pagination>
        </el-col>
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                <el-form-item label="设备名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="设备状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio class="radio" :label="1">好</el-radio>
                        <el-radio class="radio" :label="0">坏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设备价格">
                    <el-input-number v-model="editForm.price"></el-input-number>
                </el-form-item>
                <el-form-item label="设备所属实验室">
                    <el-select v-model="editForm.belong" placeholder="请选择">
                        <el-option label="实验室1" value="1"></el-option>
                        <el-option label="实验室2" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备故障信息">
                    <el-input type="textarea" v-model="editForm.fix"></el-input>
                </el-form-item>
                <el-form-item label="设备信息">
                    <el-input type="textarea" v-model="editForm.info"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/util'
    import NProgress from 'nprogress'
    import $ from 'jquery'

    export default {
        mounted() {
            this.request();
        },
        data() {
            return {
                formInline: {
                    name: ''
                },
                value1:'',
                editFormVisible:false,//编辑界面显是否显示
                editFormTtile:'编辑',//编辑界面标题
                //编辑界面数据
                editForm: {
                    id:0,
                    name: '',
                    price: -1,
                    status: 0,
                    belong: '',
                    fix: '',
                    info:''
                },
                editLoading:false,
                btnEditText:'提 交',
                editFormRules:{
                    name:[
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                tableData: [],
                listLoading:false,
                //分页
                pageIndex:0,
                pageSize:10,
                total:40,
                pageSizes:[10,20,40,50],
            }
        },
        methods: {
            sizeChange: function(pageSize) {
                this.pageSize = pageSize;
                this.request();
            },
            pageIndexChange: function(pageIndex) {
                this.pageIndex = pageIndex;
                this.request();
            },
            request() {
                let _this = this;
                $.ajax({
                    url:'http://localhost:8080/device/getAll',
                    type: 'GET',
                    async: false,
                    data:{
                        pageSize: _this.pageSize,
                        pageNum: _this.pageIndex,
                    },
                    success:function(result){
                        if (result.code == 1) {
                            for (let i of result.data.content){
                                _this.tableData.push({
                                    id: i.deviceId,
                                    name: i.deviceName,
                                    price : i.devicePrice,
                                    status: i.deviceStatus,
                                    info: i.deviceInfo,
                                    fix: i.deviceFault,
                                    belong: i.roomId
                                });
                            }
                            console.log(result.data.content);
                        }
                    },
                    error:function(){
                        console.log('error');
                    }
                })
            },
            //查询设备通过名称
            search: function () {
              var _this = this;
                $.ajax({
                    url:'http://localhost:8080/device/getByName',
                    type: 'GET',
                    async: false,
                    data:{
                        name: _this.formInline.name,
                    },
                    success:function(result){
                        if (result.code == 1) {
                            alert("查询成功");
                            _this.tableData = [];
                            for (let i of result.data){
                                _this.tableData.push({
                                    id: i.deviceId,
                                    name: i.deviceName,
                                    price : i.devicePrice,
                                    status: i.deviceStatus,
                                    info: i.deviceInfo, 
                                    fix: i.deviceFault,
                                    belong: i.roomId
                                });
                            }
                            console.log(result.data);
                        }
                    },
                    error:function(){
                        console.log('error');
                    }
                })
            },
            //删除记录
            handleDel:function(row){
                //console.log(row);
                var _this=this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    _this.listLoading=true;
                    NProgress.start();
                    setTimeout(function(){
                        for(var i=0;i<_this.tableData.length;i++){
                            if(_this.tableData[i].id==row.id){
                                _this.tableData.splice(i,1);

                                _this.listLoading=false;
                                NProgress.done();
                                _this.$notify({
                                    title: '成功',
                                    message: '删除成功',
                                    type: 'success'
                                });

                                break;
                            }
                        }
                    },1000);
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit:function(row){
                this.editFormVisible = true;
                this.editFormTtile = '编辑';
                this.editForm.id = row.id;
                this.editForm.name = row.name;
                this.editForm.price = row.price;
                this.editForm.status = row.status;
                this.editForm.belong = row.belong;
                this.editForm.info = row.info;
                this.editForm.fix = row.fix;
            },
            //编辑 or 新增
            editSubmit:function(){
                var _this=this;
                _this.$refs.editForm.validate((valid)=>{
                    if(valid){

                        _this.$confirm('确认提交吗？','提示',{}).then(()=>{
                            _this.editLoading=true;
                            NProgress.start();
                            _this.btnEditText='提交中';
                            setTimeout(function(){
                                _this.editLoading=false;
                                NProgress.done();
                                _this.btnEditText='提 交';

                                _this.editFormVisible = false;

                                if(_this.editForm.id==0){
                                    //新增
                                    $.ajax({
                                        url:'http://localhost:8080/admin/addDevice',
                                        type: 'GET',
                                        async: false,
                                        data:{
                                            deviceName: _this.editForm.name,
                                            devicePrice : _this.editForm.price,
                                            deviceStatus: _this.editForm.status,
                                            deviceInfo: _this.editForm.info,
                                            deviceFault: _this.editForm.fix,
                                            roomId: _this.editForm.belong
                                        },
                                        success:function(result){
                                            if (result.code == 1) {
                                                alert("添加成功");
                                                _this.$notify({
                                                    title: '成功',
                                                    message: '提交成功',
                                                    type: 'success'
                                                });
                                                console.log(result.data);
                                                _this.request();
                                            }
                                        },
                                        error:function(){
                                            console.log('error');
                                        }
                                    })
                                }else{
                                    //编辑
                                    for(var i=0;i<_this.tableData.length;i++){
                                        if(_this.tableData[i].id == _this.editForm.id){
                                            alert(_this.editForm.id);
                                            alert(_this.tableData[i].id)
                                            $.ajax({
                                                url:'http://localhost:8080/admin/updateDevice',
                                                type: 'GET',
                                                async: false,
                                                data:{
                                                    deviceId: _this.editForm.id,
                                                    deviceName: _this.editForm.name,
                                                    devicePrice : _this.editForm.price,
                                                    deviceStatus: _this.editForm.status,
                                                    deviceInfo: _this.editForm.info,
                                                    deviceFault: _this.editForm.fix,
                                                    roomId: _this.editForm.belong
                                                },
                                                success:function(result){
                                                    if (result.code == 1) {
                                                        _this.$notify({
                                                            title: '成功',
                                                            message: '提交成功',
                                                            type: 'success'
                                                        });
                                                        console.log(result.data);
                                                    }
                                                },
                                                error:function(){
                                                    console.log('error');
                                                }
                                            })
                                        }
                                    }
                                }
                            },1000);

                        });

                    }
                });

            },
            //显示新增界面
            handleAdd:function(){
                var _this=this;

                this.editFormVisible=true;
                this.editFormTtile='新增';

                this.editForm.id=0;
                this.editForm.name='';
                this.editForm.price=1;
                this.editForm.status=0;
                this.editForm.info='';
                this.editForm.fix='';
            }
        }
    }
</script>

<style scoped>
    .toolbar .el-form-item {
        margin-bottom: 10px;
    }

    .toolbar {
        background: #fff;
        padding: 10px 10px 0px 10px;
    }
</style>