<template>
  <div>
    <div class="btnRight">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="showAddSob"
        >添加工资套账</el-button
      >
      <el-button size="mini" type="success" icon="el-icon-refresh" @click="initSobs"
        >刷新</el-button
      >
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%">
      <div style="display:flex;justify-content:space-around;align-items:center">
        <el-steps direction='vertical' :active='activeNum'>
          <el-step :title="item" v-for="(item,index) in salaryName" :key="index"></el-step>
        </el-steps>
        <el-input v-show="activeNum == index" v-model="salary[title]" style="width:250px" :placeholder="'请输入'+salaryName[index]+'  ···'" v-for="(val,title,index) in salary" :key="index"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='small' type='primary' @click="lastStep"> {{activeNum == '0'?'取 消':'上一步'}}</el-button>
        <el-button size='small' type="primary" @click="nextStep">{{activeNum!='10' ? '下一步':btnText}}</el-button>
      </span>
    </el-dialog>
    <div>
      <el-table :data="salaries" border stripe>
        <el-table-column align="center" type="selection" width="45">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="套账名称"
          width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="basicSalary"
          label="基本工资"
          width="80"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="trafficSalary"
          label="交通补助"
          width="80"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="lunchSalary"
          label="午餐补助"
          width="80"
        >
        </el-table-column>
        <el-table-column prop="bonus" align="center" label="奖金" width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createDate"
          label="启用时间"
          width="120"
        >
        </el-table-column>
        <el-table-column label="养老金" align="center">
          <el-table-column
            align="center"
            prop="pensionPer"
            label="比率"
            width="80"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="pensionBase"
            label="基数"
            width="80"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="医疗保险" align="center">
          <el-table-column
            align="center"
            prop="medicalPer"
            label="比率"
            width="80"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="medicalBase"
            label="基数"
            width="80"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="公积金" align="center">
          <el-table-column
            align="center"
            prop="accumulationFundPer"
            label="比率"
            width="80"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="accumulationFundBase"
            label="基数"
            width="80"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type='primary' @click="updateSob(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteSob(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalSob",
  data() {
    return {
      salaries: [],
      btnText:'',
      btneable:true,
      activeNum:0,
      title:'',
      dialogVisible:false,
      salaryName:[
        '账套名称',
        '基本工资',
        '交通补助',
        '午餐补助',
        '奖金',
        '养老金基数',  
        '养老金比率',
        '医疗保险基数', 
        '医疗保险比率',
        '公积金基数',
        '公积金比率',
      ],
      salary:{
        name:'',
        basicSalary:0,
        trafficSalary:0,
        lunchSalary:0,
        bonus:0,
        pensionPer:0, 
        pensionBase:0,
        medicalPer:0,
        medicalBase:0,
        accumulationFundPer:0,
        accumulationFundBase:0,
      }
    };
  },
  mounted() {
    this.initSobs();
  },
  methods: {
    updateSob(data){
      this.btnText = '确认编辑'
      this.title = '编辑工资账套'
      this.activeNum = 0
      this.dialogVisible = !this.dialogVisible
      this.salary.id = data.id
      this.salary.name = data.name
      this.salary.basicSalary = data.basicSalary
      this.salary.trafficSalary = data.trafficSalary
      this.salary.lunchSalary = data.lunchSalary
      this.salary.bonus = data.bonus
      this.salary.pensionBase = data.pensionBase
      this.salary.pensionPer = data.pensionPer
      this.salary.medicalBase = data.medicalBase
      this.salary.medicalPer = data.medicalPer
      this.salary.accumulationFundBase = data.accumulationFundBase
      this.salary.accumulationFundPer = data.accumulationFundPer
    },
    deleteSob(data){
      this.$confirm('此操作将永久删除'+ data.name +', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/salary/sob/'+ data.id).then(resp=>{
            if(resp){
              this.initSobs()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    lastStep(){
      if(this.activeNum != 0){
        this.activeNum -=1
        return
      }else{
        this.dialogVisible = false
      }
    },
    nextStep(){
      if(this.activeNum !=10){
         this.activeNum += 1
         return
        //  console.log(this.activeNum)
      }else{
        // console.log(this.salary)
        if(this.btneable){
          if(this.salary.name){
            this.btneable = false
            if(this.salary.id){
              this.putRequest('/salary/sob/',this.salary).then(resp=>{
                if(resp){
                  this.initSobs()
                  this.btneable = true
                  this.dialogVisible = false 
                }
              })
            }else{
              this.postRequest('/salary/sob/',this.salary).then(resp=>{
                if(resp){
                  this.initSobs()
                  this.btneable = true
                  this.dialogVisible = false
                }
              })
            }
          }else{
            this.$message({
              type:'warning',
              message:'请补全信息后添加···'
            })
            this.btneable = false
          }
        }
       
      }
    },    
    showAddSob(){
      this.btnText = '确认添加'
      this.title = '添加工资账套'
      this.activeNum = 0
      this.salary = {
        name:'',
        basicSalary:0,
        trafficSalary:0,
        lunchSalary:0,
        bonus:0,
        pensionBase:0,
        pensionPer:0,
        medicalBase:0,
        medicalPer:0,
        accumulationFundBase:0,
        accumulationFundPer:0
      }
      this.dialogVisible = !this.dialogVisible
    },
    initSobs() {
      this.getRequest("/salary/sob/").then((resp) => {
        if (resp) {
          this.salaries = resp;
        }
      });
    },
  },
};
</script>

<style>
      .btnRight{
        margin: 15px 0;
        display:flex;
        justify-content: flex-end;
      }
</style>
