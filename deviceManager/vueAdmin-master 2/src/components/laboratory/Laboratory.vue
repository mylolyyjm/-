<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="formInline.num" placeholder="实验室编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="searchNum">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <template>
            <el-table :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="num" label="实验室编号" width="150" sortable>
                </el-table-column>
                <el-table-column prop="name" label="实验室名称" width="180" :formatter="formatSex" sortable>
                </el-table-column>
                <el-table-column prop="managerId" label="实验室管理员id" width="180" sortable>
                </el-table-column>
                <el-table-column prop="status" label="实验室状态" width="150" sortable>
                </el-table-column>
                <el-table-column prop="coId" label="实验室所属学院" sortable>
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
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination :current-page="1" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
                           :total="400" style="float:right">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="实验室编号" label-width="200" prop="num">
                    <el-input v-model="editForm.num" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="实验室名称" label-width="200">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="实验室管理员id" label-width="200">
                    <el-input v-model="editForm.managerId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="实验室状态" label-width="200">
                    <el-input v-model="editForm.status" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="实验室所属学院" label-width="200">
                    <el-input v-model="editForm.coId"></el-input>
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
    import $ from 'jquery'
    import util from '../../common/util'
    import NProgress from 'nprogress'

    export default {
        data() {
            return {
                formInline: {
                    id: ''
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                value1:'',
                editFormVisible:false,//编辑界面显是否显示
                editFormTtile:'编辑',//编辑界面标题
                //编辑界面数据
                editForm: {
                    id: '',
                    num: '',
                    name: '',
                    managerId: '',
                    status: '',
                    coId: ''
                },
                editLoading:false,
                btnEditText:'提 交',
                editFormRules:{
                    name:[
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                tableData: [],
                listLoading:false
            }
        },
        mounted(){
           this.request();
       },
        methods: {
            request() {
               var _this = this;
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
                                   romId: i.roomId,
                                   num: i.roomNum,
                                   name: i.roomName,
                                   managerId : i.roomManagerId,
                                   status: i.roomStatus,
                                   coId: i.collegeId,
                               });
                           }
                           console.log(result.data.content);
                           console.log(_this.tableData);
                       }
                   },
                   error:function(){
                       console.log('error');
                   }
               })
           },
           //查询设备通过名称
            searchNum: function () {
              var _this = this;
                $.ajax({
                    url:'http://localhost:8080/room/getByNum',
                    type: 'GET',
                    async: false,
                    data:{
                        roomNum: _this.formInline.num,
                    },
                    success:function(result){
                        if (result.code == 1) {
                            alert("查询成功");
                            _this.tableData = [];
                            for (let i of result.data){
                                _this.tableData.push({
                                   num: i.roomNum,
                                   name: i.roomName,
                                   managerId : i.roomManagerId,
                                   status: i.roomStatus,
                                   coId: i.collegeId,
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
                this.editFormVisible=true;
                this.editFormTtile='编辑';
                this.editForm.num=row.num;
                this.editForm.name=row.name;
                this.editForm.managerId=row.managerId;
                this.editForm.status=row.status;
                this.editForm.coId=row.coId;
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
                                _this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                _this.editFormVisible = false;

                                if(_this.editForm.id==0){
                                    //新增
                                    _this.tableData.push({
                                        num : _this.editForm.num,
                                        name: _this.editForm.name,
                                        managerId: _this.editForm.managerId,
                                        status: _this.editForm.status,
                                        coId: _this.editForm.coId,
                                    });
                                }else{
                                    //编辑
                                    for(var i=0;i<_this.tableData.length;i++){
                                        if(_this.tableData[i].num==_this.editForm.num){
                                            _this.tableData[i].name=_this.editForm.name;
                                            _this.tableData[i].managerId=_this.editForm.managerId;
                                            _this.tableData[i].status=_this.editForm.status;
                                            _this.tableData[i].coId=_this.editForm.coId;
                                            break;
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

                this.editForm.num='';
                this.editForm.name='';
                this.editForm.managerId='';
                this.editForm.status='';
                this.editForm.coId='';
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