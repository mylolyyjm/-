<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item>
					<el-input v-model="formInline.name" placeholder="姓名"></el-input>
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
				<el-table-column type="index" width="50">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="100" sortable>
				</el-table-column>
				<el-table-column prop="num" label="学号" width="120"  sortable>
				</el-table-column>
				<el-table-column prop="sex" label="性别" width="120" :formatter="formatSex" sortable>
				</el-table-column>
				<el-table-column prop="age" label="年龄" width="120" sortable>
				</el-table-column>
				<el-table-column prop="phone" label="电话" width="180" sortable>
				</el-table-column>
				<el-table-column prop="school" label="毕业学校" width="180" sortable>
				</el-table-column>
				<el-table-column prop="department" label="所属学院" width="180" sortable>
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
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="工号" prop="num">
					<el-input v-model="editForm.num" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="editForm.phone" ></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="100"></el-input-number>
				</el-form-item>
				<el-form-item label="毕业学校">
					<el-input v-model="editForm.school" ></el-input>
				</el-form-item>
				<el-form-item label="所属学院">
					<el-input v-model="editForm.department" ></el-input>
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
                    id:0,
                    name: '',
                    num: '',
                    phone: '',
                    sex: 0,
					age:'',
                    school:'',
                    department:''
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
        methods: {
            sizeChange: function(pageSize) {
                this.pageSize = pageSize;
                this.request();
            },
            pageIndexChange: function(pageIndex) {
                this.pageIndex = pageIndex;
                this.request();
            },
            search: function () {
                let _this = this;
                $.ajax({
                    url:'http://localhost:8080/teacher/getByName',
                    type: 'GET',
                    async: false,
                    data:{
                        name: _this.formInline.name
                    },
                    success:function(result){
                        if (result.code == 1) {
                            console.log(result.data);
                            let i = result.data;
                            _this.tableData = [];
                            for (let i of result.data){
                                _this.tableData.push({
                                    id: i.teacherId,
                                    name: i.teacherName,
                                    num : i.teacherStaffId,
                                    phone: i.teacherPhone,
                                    sex: i.teacherSex,
                                    age: i.teacherAge,
                                    department: i.teacherDepartment,
                                    school: i.teacherCollege
                                });
                            }
                        }
                    },
                    error:function(){
                        console.log('error');
                    }
                })
            },
            request() {
                let _this = this;
                $.ajax({
                    url:'http://localhost:8080/teacher/getAll',
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
                                    id: i.teacherId,
                                    name: i.teacherName,
                                    num : i.teacherStaffId,
                                    phone: i.teacherPhone,
                                    sex: i.teacherSex,
                                    age: i.teacherAge,
                                    department: i.teacherDepartment,
                                    school: i.teacherCollege
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
            //性别显示转换
            formatSex:function(row,column){
                return row.sex==1?'男':row.sex==0?'女':'未知';
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
                            if(_this.tableData[i].id == row.id){
                                alert(row.id);
                                $.ajax({
                                    url:'http://localhost:8080/admin/deleteTeacher',
                                    type: 'GET',
                                    async: false,
                                    data:{
                                        teacherId: row.id,
                                    },
                                    success:function(result){
                                        if (result.code == 1) {
                                            alert("删除成功");
                                            console.log(result.data);
                                        }
                                    },
                                    error:function(){
                                        console.log('error');
                                    }
                                });
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
                this.editForm.id=row.id;
                this.editForm.name=row.name;
                this.editForm.sex=row.sex;
                this.editForm.age=row.age;
                this.editForm.phone=row.phone;
                this.editForm.addr=row.addr;
                this.editForm.department= row.department;
                this.editForm.school= row.school;
                this.editForm.num= row.num;

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
                                    $.ajax({
                                        url:'http://localhost:8080/admin/addTeacher',
                                        type: 'GET',
                                        async: false,
                                        data:{
                                            teacherName: _this.editForm.name,
                                            teacherPhone : _this.editForm.phone,
                                            teacherDepartment: _this.editForm.department,
                                            teacherCollege: _this.editForm.school,
                                            teacherPassword: 123456,
                                            teacherStaffId: _this.editForm.num,
                                            teacherSex: _this.editForm.sex,
                                            teacherAge: _this.editForm.age
                                        },
                                        success:function(result){
                                            if (result.code == 1) {
                                                alert("添加成功");
                                                console.log(result.data);
                                                _this.tableData = [];
                                                _this.request();
                                            }
                                        },
                                        error:function(){
                                            console.log('error');
                                        }
                                    });
                                }else{
                                    //编辑
                                    for(var i=0;i<_this.tableData.length;i++){
                                        if(_this.tableData[i].id==_this.editForm.id){
                                            $.ajax({
                                                url:'http://localhost:8080/admin/addTeacher',
                                                type: 'GET',
                                                async: false,
                                                data:{
                                                    teacherName: _this.editForm.name,
                                                    teacherPhone : _this.editForm.phone,
                                                    teacherDepartment: _this.editForm.department,
                                                    teacherCollege: _this.editForm.school,
                                                    teacherPassword: 123456,
                                                    teacherStaffId: _this.editForm.num,
                                                    teacherSex: _this.editForm.sex,
                                                    teacherAge: _this.editForm.age
                                                },
                                                success:function(result){
                                                    if (result.code == 1) {
                                                        alert("添加成功");
                                                        console.log(result.data);
                                                        _this.tableData = [];
                                                        _this.request();
                                                    }
                                                },
                                                error:function(){
                                                    console.log('error');
                                                }
                                            });
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
                this.editFormVisible=true;
                this.editFormTtile='新增';

                this.editForm.id=0;
                this.editForm.name='';
                this.editForm.sex=1;
                this.editForm.age=0;
                this.editForm.phone='';
                this.editForm.department='';
                this.editForm.school='';
                this.editForm.num='';

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