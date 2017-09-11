<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
    <h3 class="title">系统登录</h3>
    <el-form-item>
      <el-select v-model="ruleForm2.rule" placeholder="请选择角色" style="width: 100%">
        <el-option label="学生" value="学生"></el-option>
        <el-option label="老师" value="老师"></el-option>
        <el-option label="管理员" value="管理员"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked style="margin:0px 0px 35px 0px;">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>
<script>
  import $ from 'jquery'
  import cookie from '../common/CookieConfig.js'
  export default {
    data() {
      return {
        ruleForm2: {
          account: '',
          checkPass: '',
          rule: ''
        },
        rules2: {
          account: [{
              required: true,
              message: '请输入账号',
              trigger: 'blur'
            },
            //{ validator: validaePass }
          ],
          checkPass: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            if (_this.ruleForm2.rule == "学生") {
                // $.ajax({
                //     url:'http://127.0.0.1:8080/loginStudent',
                //     type: 'POST',
                //     async: false,
                //     dataType:'json',
                //     data:{
                //         studentNum: _this.ruleForm2.account,
                //         studentPassword : _this.ruleForm2.checkPass
                //     },
                //     success:function(result){
                //         if (result.code == 1) {
                //             cookie.setCookie('user',result.data.studentId,0.05);
                //             console.log(result.data);
                //             _this.$router.replace('/Mydevice');
                //         }
                //         if (result.code == 0) {
                //             console.log("fail");
                //             alert("登录失败")

                //         }
                //     },
                //     error:function(XMLHttpRequest){
                //         console.log("error"+XMLHttpRequest);

                //         if (result.code == 0) {
                //             console.log("fail");
                //             alert("登录失败")
                //             _this.$notify({
                //                 title: '登录',
                //                 message: '登录失败',
                //                 type: 'fail'
                //             });
                //         }

                //     }
                // })
                _this.$router.replace('/Mydevice');
            } else if(_this.ruleForm2.rule == "老师"){
                $.ajax({
                    url:'http://127.0.0.1:8080/loginTeacher',
                    type: 'GET',
                    async: false,
                    data:{
                        techerStaffId: _this.ruleForm2.account,
                        teacherPassword : _this.ruleForm2.checkPass
                    },
                    success:function(result){
                        if (result.code == 1) {
                            cookie.setCookie('user',result.data.techerStaffId,0.05);
                            console.log(result.data);
                            _this.$router.replace('/Mydevice/:id')
                        }
                    },
                    error:function(){
                        console.log('error');
                    }
                })
            } else {
                $.ajax({
                    url:'http://127.0.0.1:8080/loginManager',
                    type: 'POST',
                    async: false,
                    data:{
                        managerStaffId: _this.ruleForm2.account,
                        managerPassword : _this.ruleForm2.checkPass
                    },
                    success:function(result){
                        if (result.code == 1) {
                            cookie.setCookie('user',result.data.managerName,0.05);
                            cookie.setCookie('userNum',result.data.managerStaffId,0.05);
                            cookie.setCookie('userId',result.data.managerId,0.05);
                            _this.$router.replace('/Alldevice')
                        }
                        if (result.code == 0) {
                            console.log("fail");
                            alert("登录失败");
                            _this.$notify({
                                title: '登录',
                                message: '登录失败',
                                type: 'error'
                            });

                        }
                    },
                    error:function(result,XMLHttpRequest){
                        console.log(result.reason);
                        console.log(XMLHttpRequest);
                    }
                })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style scoped>
  .card-box {
    padding: 20px;
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin-bottom: 20px;
    background-color: #F9FAFC;
    margin: 120px auto;
    width: 400px;
    border: 2px solid #8492A6;
  }
  
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  
  .loginform {
    width: 350px;
    padding: 35px 35px 15px 35px;
  }
</style>