<template>
<div id="device">
    <div class="choose">
        <span style="margin-right:10px">选择实验室</span>
        <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span style="margin:0 10px">设备是否正在使用</span>
         <el-select v-model="use" placeholder="请选择">
            <el-option label="使用中" value="使用中"></el-option>
            <el-option label="未使用" value="未使用"></el-option>
        </el-select>
        <el-button style="margin-left:10px">筛选</el-button>
    </div>
    <el-row :gutter="80">
         <el-col :span="6" v-for="(o, index) in tableData" style="margin-bottom: 20px">
              <el-card :body-style="{ padding: '0px' }" style="background: #fff; width: 230px; height: auto">
                   <div slot="header">
                       <span class="deviceName"><strong>{{o.name}}</strong></span>
                       <span class="deviceStatus"><i v-bind:class="{flag: o.status == 1,flagError: o.status == 0, flagBad: o.status == 2}"></i>{{["未使用","使用中","维护中"][o.status]}}</span>
                   </div>
                   <div class="deviceInfo">
                       <div class="deviceContent"><span class="deviceDetail">设备信息：</span><div class="deviceTitle">{{o.info}}</div></div>
                       <div class="deviceContent"><span class="deviceDetail">设备价格：</span>&yen; {{o.price}}</div>
                       <div class="deviceContent"><span class="deviceDetail">设备故障：</span><div class="deviceTitle">{{o.fix}}</div></div>
                       <div class="deviceContent"><span class="deviceDetail">实验教室：</span>{{o.belong}}</div>
                   </div>
              </el-card>              
         </el-col>
    </el-row>
    <el-col :span="24" class="toolbar" style="">
		<el-pagination :current-page="1" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
			:total="40" style="float:right">
		</el-pagination>
    </el-col>
</div>
 </template>


<script>
    import $ from 'jquery'
    export default {
       data() {
           return {
               currentDate:new Date(),
               deviceArray:[],
               value:'',
               options:[{
                   label:'实验室1',
                   value:'实验室1'
               },{
                   label:'实验室2',
                   value:'实验室2'
               },{
                   label:'实验室3',
                   value:'实验室3'
               }],
               tableData: [],
               //分页
               pageIndex:0,
               pageSize:10,
               total:40,
               pageSizes:[10,20,40,50],
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
                           console.log(_this.tableData);
                       }
                   },
                   error:function(){
                       console.log('error');
                   }
               })
           }
       }
   }
</script>

<style scoped>
    #device{
        padding-top: 20px;
        font-size: 13px;
    }
    #device .choose{
        margin-bottom:15px
    }
    .el-card__header{
        background-color: #4a9def;
    }
    #device .deviceName1{
        font-size: 14px;
        color: #fff;
    }
    #device .roomId{
        color: #fff;
        border-radius: 4px;
        background-color: #ff4c4c;
        float: right;
    }
    #device .deviceStatus{
        font-size: 13px;
        color: #fff;
        padding-bottom:10px;
        float:right
    }
    #device .toolbar .el-form-item {
		margin-bottom: 10px;
	}
	#device .toolbar {
		background: #fff;
		padding: 10px 10px 0px 10px;
	}
    #device .flag{
        background: #6cfc6c;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
        margin-left: -20px;
        margin-right: 5px;
        vertical-align: middle;
        margin-top: -2px;
    }
    #device .bottom{
        position: absolute;
        bottom: 0px;
        right: 90px;
    }
    #device .el-card__body{
        position:relative;
        height:auto
    }
    #device .deviceInfo {
        padding: 14px;
        padding-top: 20px;
    }
    #device .deviceDetail {
        font-size: 12px;
        padding: 8px;
        color: rgb(32, 160, 255);
    }
    #device .deviceTitle{
        padding-left: 75px;
        margin-top: -17px;
        font-size: 12px;
    }
    #device .deviceContent{
        padding-top: 5px;
        font-size: 12px;
    }
</style>