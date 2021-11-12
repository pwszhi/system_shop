<template>
  <div>
    <div style="width:40%">
      <el-input 
              ref="search"
              size='small'
              placeholder="输入部门名称进行搜索" 
              v-model="filterText"
              prefix-icon="el-icon-search">
      </el-input>

      <el-tree
        style="margin-top:10px"
        :data="deps"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node='false'
        ref="tree">
        <span class="custom-tree-node main" slot-scope="{ node,data }">
          <span>{{ node.label }}</span>
            <span>
              <el-button
                type="primary"
                size="mini"
                class="btn"
                @click="() => showAddDep(data)">
                添加部门
              </el-button>
              <el-button
                type="danger"
                size="mini"
                class="btn"
                @click="() => deleteDep(data)">
                删除部门
              </el-button>
            </span>
        </span>
      </el-tree>
      <el-dialog
        title="添加部门"
        size='small'
        :visible.sync="dialogVisible"
        width="30%">
        <div>
          <table>
            <tr>
              <td>
                <el-tag style="margin-right:8px">上级部门</el-tag>
              </td>
              <td>{{pname}}</td>
            </tr>
            <tr>
              <td>
                <el-tag>部门名称</el-tag>
              </td>
              <td>
                <el-input size='mini' ref="add" placeholder="请输入添加的部门名称" v-model="dep.name" @keydown.enter.native="addDep"></el-input>
              </td>
            </tr>
          </table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDep">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      filterText: "",
      deps:[],
      pname:'',
      dialogVisible:false,
      dep:{
        name:'',
        parentId:-1
      },
      defaultProps: {
          children: 'children',
          label: 'name'
        }
    };
  },
  mounted() {
    this.initDeps()
  },
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
   methods: {
     initDep(){
       this.dep = {
            name:'',
            parentId: -1
       }
       this.pname = ''
     },
     addDep2Deps(deps,dep){
      //  console.log(deps)
      //  console.log(dep)
       for(let i=0;i<deps.length;i++){
         let arr = deps[i]
        //  console.log(arr)
        if(arr.id == dep.parentId){
          arr.children = arr.children.concat(dep)
          if(arr.children.length>0){
            arr.isParent = true
          }
          this.dialogVisible = false
          this.initDep()
          return;
        }else{
          this.addDep2Deps(arr.children,dep)
        }
       }
     },
     addDep(){
       this.postRequest('/system/basic/department/',this.dep).then(resp=>{
         if(resp){
           this.addDep2Deps(this.deps,resp.obj)
           this.dialogVisible = false
          this.initDep()
         }
       })
     },
     showAddDep(data){
       this.pname = data.name
       this.dep.parentId = data.id
       this.dialogVisible = true 
       this.$nextTick(()=>{
         this.$refs.add.focus()
       },50) 
},
     deleteDep(data){
       if(data.isParent){
          this.$message.error("父部门含有子部门删除失败····")
       }else{
          this.$confirm(
            "此操作将永久删除[ " + data.name + " ]该部门, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          ).then(() => {
            this.deleteRequest("/system/basic/department/" + data.id).then(
              (resp) => {
                if (resp) {
                  this.removeDepFormDeps(null,this.deps,data.id);
                }
              }
            );
          }).catch(()=>{
            this.$message({
              type:'info',
              message:'已取消删除'
            })
          });
       }
     },
     removeDepFormDeps(p,deps,id){
       for(let i = 0; i < deps.length; i++ ){
         let arr = deps[i]
         if(arr.id == id){
           deps.splice(i,1)
           if(deps.length == 0){
             p.isParent = false
           }
           return
         }else{
           this.removeDepFormDeps(arr,arr.children,id)
         }
       }
     },
     initDeps(){
       this.$nextTick(()=>{
         this.$refs.search.focus()
       },50)
       this.getRequest('/system/basic/department/').then(resp => {
         if(resp){
           this.deps = resp
          //  console.log(resp)
         }
       })
     },
     filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    },
};
</script>

<style>
    .btn{
     padding: 5px;
    }
    .main{
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
</style>
