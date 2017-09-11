<template>
	<div id="myDevice">
		<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px">
			<el-form-item label="修改姓名" prop="name">
		    <el-input type="text" v-model="ruleForm2.name" auto-complete="off" class="inputwidth"></el-input>
		  </el-form-item>
      <el-form-item label="电话号码" prop="phone">
		    <el-input type="text" v-model="ruleForm2.phone" auto-complete="off" class="inputwidth"></el-input>
		  </el-form-item>
      <el-form-item label="修改密码" prop="password">
		    <el-input type="password" v-model="ruleForm2.password" auto-complete="off" class="inputwidth"></el-input>
		  </el-form-item>
		  <el-form-item label="确认密码" prop="checkPassword">
		    <el-input type="password" v-model="ruleForm2.checkPassword" auto-complete="off" class="inputwidth"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
		    <el-button  @click="resetForm('ruleForm2')">重置</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
  import $ from 'jquery'
  function GetCookieValue(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = $.trim(cookies[i]);
              //PYYH=USERNAME=steven&PASSWORD=111111&UserID=1&UserType=1
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  //USERNAME=steven&PASSWORD=111111&UserID=1&UserType=1
                  break;
              }
          }
      }
      return cookieValue;
  }
  export default {
      data() {
          var validatePass2 = (rule, value, callback) => {
              if (value === '') {
                  callback(new Error('请再次输入密码'));
              } else if (value !== this.ruleForm2.password) {
                  callback(new Error('两次输入密码不一致!'));
              } else {
                  callback();
              }
          };
          return {
              ruleForm2: {
                  name: '',
                  phone: '',
                  password: '',
                  checkPassword: '',
              },
              rules2: {
                  password: [
                      { required: true, message: '请输入密码', trigger: 'blur' }
                  ],
                  checkPassword: [
                      { validator: validatePass2, trigger: 'blur' }
                  ],
                  name: [
                      { required: true, message: '请输入姓名', trigger: 'blur' },
                      { min: 3, max: 5, message: '姓名长度须在3到5之间', trigger: 'blur' }
                  ],
                  phone: [
                      { required: true, message: '请输入电话', trigger: 'blur' },
                      { min: 8, max: 11, message: '电话号码长度须在8到11之间', trigger: 'blur' }
                  ],
              }
          }
      },
      methods: {

          submitForm(formName) {
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                      console.log(GetCookieValue('userId'));
                      var _this = this;
                      $.ajax({
                          url:'http://localhost:8080/admin/update',
                          type: 'GET',
                          async: false,
                          data:{
                              managerId: GetCookieValue('userId'),
                              managerName: _this.ruleForm2.name,
                              managerPhone: _this.ruleForm2.phone,
                              managerPassword: _this.ruleForm2.password
                          },
                          success:function(result){
                              if (result.code == 1) {
                                  alert("修改成功");
                                  console.log(result.data.content);
                              }
                          },
                          error:function(){
                              console.log('error');
                          }
                      })
                  } else {
                      console.log('error submit!!');
                      return false;
                  }
              });
          },
          resetForm(formName) {
              this.$refs[formName].resetFields();
          }
      }
  }
</script>
<style scoped>
    #myDevice{
        padding-top: 20px;
        font-size: 13px;
    }
		#myDevice .inputwidth{
			width: 300px;
		}
</style>
