<template>
<div id="device">
    <div class="choose">
        <span style="margin-right:10px">选择实验室</span>
        <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button style="margin-left:10px" @click="screening">筛选</el-button>
    </div>
    <el-row :gutter="80">
         <el-col :span="6" v-for="(o, index) in tableData" style="margin-bottom: 20px">
              <el-card :body-style="{ padding: '0px' }" style="background: #fff; width: 250px; height: auto">
                   <div slot="header">
                       <span class="deviceName"><strong>{{o.name}}</strong></span>
                       <span class="deviceStatus" style="float:right"><i class="flag"></i>使用中</span>
                   </div>
                   <div style="padding: 14px;padding-top: 20px;">
                       <span class="deviceDetail">设备信息：</span><div style="padding-left: 80px;margin-top: -16px;">{{o.info}}</div>
                       <div style="padding-top: 5px;"><span class="deviceDetail">设备价格：</span>&yen; 1000{{o.price}}</div>
                       <div style="padding-top: 5px;"><span class="deviceDetail">设备故障：</span>{{o.fix}}</div>
                       <div style="padding-top: 5px;"><span class="deviceDetail">实验教室：</span>{{o.belong}}</div>                      
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
                                   price : i.deviceName,
                                   status: i.deviceStatus,
                                   info: i.deviceInfo,
                                   fix: i.deviceFault,
                                   belong: i.roomId
                               });
                           }
                       }
                   },
                   error:function(){
                       console.log('error');
                   }
               })
           },
           screening: function(){
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
           }
       }
   }
</script>

<style>
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
    #device .deviceName{
        font-size: 14px;
        color: #fff
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
    #device .deviceDetail {
        font-size: 12px;
        padding: 8px;
        color: rgb(32, 160, 255);
    }
</style>