<template>
  <div>
    <div class="search">
      <el-input v-model="keywords" ref="admin" style='width:400px' @keydown.enter.native="doSearch" prefix-icon="el-icon-search" placeholder="通过用户名搜索用户"></el-input>
      <el-button icon="el-icon-search" type="primary" @click="doSearch" style="margin-left:8px">搜索</el-button>
    </div>
    <div class="admin-main">
      <el-card class="admin-card" v-for="(admin,index) in admins" :key="index">
        <div slot="header" class="clearfix">
          <span>{{admin.name}}</span>
          <el-button style="float: right;color:red" type="text" icon="el-icon-delete" @click="deleteAdmin(admin)"></el-button>
        </div>
        <div>
          <div class="imgcenter">
            <img :src="admin.userFace" alt="头像" :title="admin.name" class="pic-img">
          </div>
        </div>
        <div class="userMain">
          <div>用户名：{{admin.name}}</div>
          <div>手机号码：{{admin.phone}}</div>
          <div>电话号码：{{admin.telephone}}</div>
          <div>用户地址：{{admin.address}}</div>
          <div>用户状态：
            <el-switch
              v-model="admin.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              @change="enableChange(admin)"
              inactive-text="禁用">
            </el-switch>
          </div>
          <div>
            用户角色：
            <el-tag type="success" v-for="(role,indexj) in admin.roles" style="margin:5px 0 0 8px" :key="indexj">{{role.nameZh}}</el-tag>
              <el-popover
                size="small"
                placement="right"
                title="角色列表"
                width="200"
                @hide="addRoles(admin)"
                @show="showRoles(admin)"
                trigger="click">
                <el-select v-model="selectRoles" multiple placeholder="请选择角色">
                  <el-option
                    v-for="(r,index) in allRoles"
                    :key="index"
                    :label="r.nameZh"
                    :value="r.id">
                  </el-option>
                </el-select>
                <el-button slot="reference" style="margin-left:8px" type="text" icon="el-icon-more"></el-button>
              </el-popover>
          </div>
          <div>
            备注：{{admin.remark}}
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name:'SysAdmin',
  data(){
    return{
      admins:[],
      keywords:'',
      allRoles:[],
      selectRoles:[]
    }
  },
  mounted() {
    this.initAdmins()
    this.$nextTick(()=>{
      this.$refs.admin.focus()
    })
  },
  methods: {
    addRoles(admin){
      let roles = []
      Object.assign(roles,admin.roles)
      let flag = false;
      if(roles.length!=this.selectRoles.length){
        flag = true
      }else{
        for(let i=0;i<roles.length;i++){
          let role = roles[i]
          for(let j=0;j<this.selectRoles.length;j++){
            if(role.id == this.selectRoles[j]){
              roles.splice(i,1)
              i--;
              break
            }
          }
        }
        if(roles.length != 0){
          flag = true
        }
      }
      if(flag){
        let url = '/system/admin/role?adminId='+admin.id
        this.selectRoles.forEach(sr=>{
          url += '&rids='+sr
        })
        this.putRequest(url).then(resp=>{
          if(resp){
            this.initAdmins()
          }
        })
      }
    },
    showRoles(admin){
      this.initAllRoles()
      let roles = admin.roles
      this.selectRoles = []
      roles.forEach(r=>{
        this.selectRoles.push(r.id)
      })
    },
    initAllRoles(){
      this.getRequest('/system/admin/roles').then(resp=>{
        if(resp){
          this.allRoles = resp
        }
      })
    },
    enableChange(admin){
      this.putRequest('/system/admin/',admin).then(resp=>{
        if(resp){
          this.initAdmins()
        }
      })
    },
    doSearch(){
      this.initAdmins()
    },
    deleteAdmin(admin){
      // console.log(admin)
      this.$confirm('此操作将永久删除['+ admin.name +']操作员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/admin/'+ admin.id).then(resp=>{
            if(resp){
              this.initAdmins()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    initAdmins(){
      this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp=>{
        if(resp){
          this.admins = resp
        }
      })
    }
  },
}
</script>

<style>
    .search{
      margin-top: 15px;
      display: flex;
      justify-content: center;
    }
    .admin-main{
      display: flex;
      justify-content: space-around;
      flex-flow: wrap;
      margin-top: 15px;
    }
    .admin-card{
      width: 350px;
      margin-bottom: 20px;
    }
    .imgcenter{
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .userMain{
      font-size: 12px;
      color: #409eff;
      margin-top: 15px;
      line-height: 1.5;
      margin-left: 20px;
    }
    .pic-img{
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
</style>