<template>
  <div>
    <div>
      <el-input v-model="jl.name" placeholder="请输入添加的职称" prefix-icon="el-icon-plus" style="width:260px" size="small"></el-input>
      <el-select style="margin-left:5px" size="small" v-model="jl.titleLevel" placeholder="职称等级">
        <el-option
                v-for="item in jobLevels"
                :key="item"
                :label="item"
                :value="item">
        </el-option>
      </el-select>
      <el-button style="margin-left:5px" size="small" type="primary" @click="addJobLevel">确认添加</el-button>
    </div>
    <div>
      <el-table
        :data="jls"
        size="small"
        border
        stripe
        @selection-change="handleSelectionChange"
        style="width: 60%;margin-top:8px">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          label="职称名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="titleLevel"
          label="职称等级"
          width="100">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建日期"
          width="150">
        </el-table-column>
        <el-table-column
          prop="enabled"
          label="是否启用"
          width="100">
          <!-- 自定义模板 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
            <el-tag v-else type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showEditJob(scope.row)">编辑</el-button>
            <el-button 
                size="mini"
                type="danger"
                @click="deleteJob(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin:8px 8px 0 0;" size="small" :disabled="multipleSelection.length === 0" type="danger" @click="deleteMany">批量删除</el-button>
      <el-button style="margin:8px 8px 0 0;" size="small" :disabled="multipleSelection.length === 0" @click="cancelMany">取消全部选择</el-button>
    </div>
    <el-dialog
      title="编辑职称"
      :visible.sync="dialogVisible"
      width="30%" >
      <table>
        <tr>
          <td>
            <el-tag>职称名称</el-tag>
          </td>
          <td>
            <el-input ref="update" size="small" v-model="updateJl.name" placeholder="输入更改后的职称"></el-input>
          </td>
        </tr>
        <tr>
          <td>
            <el-tag>职称等级</el-tag>
          </td>
          <td>
            <el-select size="small" v-model="updateJl.titleLevel" placeholder="职称等级">
              <el-option
                      v-for="item in jobLevels"
                      :key="item"
                      :label="item"
                      :value="item">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>
            <el-tag>是否启用</el-tag>
          </td>
          <td>
            <el-switch
              style="margin-left:5px"
              v-model="updateJl.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="已启用"
              inactive-text="未启用">
            </el-switch>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdateJl">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'JoblevelMana',
  data(){
    return{
      jl:{
        name:'',
        titleLevel:''
      },
      jobLevels:[
        "正高级",
        '副高级',
        '中级',
        '初级',
        '员级'
      ],
      updateJl: {
        name:'',
        titleLevel:'',
        enabled:false
      },
      multipleSelection: [],
      jls:[],
      dialogVisible:false
    }
  },
  mounted() {
    this.initJls()
  },
  methods: {
    deleteMany(){
      this.$confirm('此操作将永久删除' + this.multipleSelection.length + '个职称, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = '?'
          this.multipleSelection.forEach(item=>{
            ids+= 'ids='+item.id+'&'
          })
          this.deleteRequest('/system/basic/joblevel/'+ids).then(resp=>{ 
            if(resp){
              this.initJls()
            }
          }) 
        })
    },
    handleSelectionChange(val){
      this.multipleSelection = val

    },
    doUpdateJl(){
      this.putRequest('/system/basic/joblevel/',this.updateJl).then(resp=>{
        if(resp){
          this.initJls()
          this.dialogVisible = false
        }
      })
    },
    cancelMany(){
      this.multipleSelection=[]
      this.initJls()
    },
    showEditJob(data){
      Object.assign(this.updateJl,data)//进行数据的拷贝
      //   // this.updatePos = data //直接赋值  数据同步了
        this.updateJl.createDate = ''
        this.dialogVisible=true
        this.$nextTick(()=>{
          this.$refs.update.focus()
        },50)
      // console.log(data)
    },
    deleteJob(data){
      this.$confirm('此操作将永久删除[ ' + data.name + ' ]职称, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/basic/joblevel/'+ data.id).then(resp=>{
            if(resp){
              this.initJls()
            }
          }) 
        })
    },
    initJls(){
      this.getRequest('/system/basic/joblevel/').then(resp=>{
        if(resp){
          // console.log(resp)
          this.jls = resp
          this.jl.name=''
          this.jl.titleLevel=''
        }
      })
    },
    addJobLevel(){
      if(this.jl.name&&this.jl.titleLevel){
        this.postRequest('/system/basic/joblevel/',this.jl).then(resp=>{
          if(resp){
            this.initJls()
          }
        })
      }else{
        this.$message.error("请补全信息后添加")
      }
    }
  },
}
</script>

<style>

</style>