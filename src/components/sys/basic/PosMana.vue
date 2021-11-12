<template>
 <div>
    <div>
      <el-input
            type="text"
            size='small'
            class="addPosInput"
            placeholder="添加职位..."
            suffix-icon="el-icon-plus"
            @keydown.enter.native="addPosition"
            v-model="pos.name">
      </el-input>
      <el-button style="margin-left:10px" size="small" icon="el-icon-plus" type="primary" @click="addPosition">添加</el-button>
    </div>
    <div class="PosManaMain">
      <el-table
        :data="positions"
        size="small"
        border
        stripe
        @selection-change="handleSelectionChange"
        style="width: 60%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          label="职位"
          width="150">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
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
              @click="showEditView(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button class="deletePos" size="small" @click="deleteMany" :disabled="multipleSelection.length==0" type="danger">批量删除</el-button>
    <el-button size="small" @click="cancelAll" :disabled="multipleSelection.length==0">取消全部选择</el-button>
    <el-dialog
      title="编辑职位"
      :visible.sync="dialogVisible"
      width="30%">
      <table>
        <tr>
          <td>
            <el-tag>职位名称</el-tag>
          </td>
          <td>
            <el-input @keydown.enter.native="doUpdate" size="small" ref="name" class="updatePosition" v-model="updatePos.name" placeholder="请输入更改后的职位"></el-input>
          </td>
        </tr>
        <tr>
          <td>
            <el-tag>是否启用</el-tag>
          </td>
          <td>
            <el-switch
              style="margin-left:5px"
              v-model="updatePos.enabled"
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
        <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name:'PosMana',
  data(){
    return{
      pos:{
        name: ''
      },
      positions: [],
      dialogVisible: false,
      updatePos:{
        name:'',
        enabled:false
      },
      multipleSelection: []
        }
    },
    mounted() {
      this.initPositions()
    },
    methods: {
      initPositions(){
        this.getRequest('/system/basic/pos/').then(resp=>{
          if(resp){
            // console.log(resp)
            this.positions = resp
          }

        })
      },
      doUpdate(){
        this.putRequest('/system/basic/pos/',this.updatePos).then(resp=>{
          if(resp){
            this.initPositions()
            this.dialogVisible = false
          }
        })
      },
      addPosition(){
        if(this.pos.name){
          // console.log(this.pos.name)
          // console.log(this.pos)
          this.postRequest('/system/basic/pos/',this.pos).then(resp=>{
            if(resp){
              this.initPositions()
              this.pos.name=''
            }
          })
        }else{
          this.$message.error('职位名称不能为空！')
        }
      },
      showEditView(index, data) {
        Object.assign(this.updatePos,data)//进行数据的拷贝
        // this.updatePos = data //直接赋值  数据同步了
        this.updatePos.createDate = ''
        this.dialogVisible=true
        this.$nextTick(()=>{
          this.$refs.name.focus()
        },50)
      },
      handleDelete(index, data) {
        this.$confirm('此操作将永久删除[' + data.name + ']职位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/basic/pos/'+data.id).then(resp=>{
            if(resp){
              this.initPositions()
            }
          }) 
        })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     });          
      // })
    },
    deleteMany(){
      this.$confirm('此操作将永久删除' + this.multipleSelection.length + '个职位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = '?'
          this.multipleSelection.forEach(item=>{
            ids+= 'ids='+item.id+'&'

          })
          this.deleteRequest('/system/basic/pos/'+ids).then(resp=>{
            if(resp){
              this.initPositions()
            }
          }) 
        })
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
        // console.log(val)
    },
    cancelAll(){
      this.multipleSelection = []
      this.initPositions()
    }
      
  }
}
</script>

<style>
  .addPosInput{
    width: 300px;
  }
  .PosManaMain{
    margin-top: 10px;
  }
  .updatePosition{
    width: 300px;
    margin-left: 5px;
  }
  .deletePos{
    margin-left: 10px;
    margin-top: 10px;
  }
</style>