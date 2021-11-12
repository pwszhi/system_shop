<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="DepMana"><DepMana /></el-tab-pane>
      <el-tab-pane label="职位管理" name="PosMana"><PosMana /></el-tab-pane>
      <el-tab-pane label="职称管理" name="JoblevelMana"><JoblevelMana /></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="EcMana"><EcMana /></el-tab-pane>
      <el-tab-pane label="权限组" name="PromiseMana"><PromiseMana /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import DepMana from '../../components/sys/basic/DepMana'
  import EcMana from '../../components/sys/basic/EcMana'
  import JoblevelMana from '../../components/sys/basic/JoblevelMana'
  import PosMana from '../../components/sys/basic/PosMana'
  import PromiseMana from '../../components/sys/basic/PromiseMana'

export default {
  name:'SysBasic',
  data(){
    return{
      activeName:'DepMana'
    }
  },
  components:{
    DepMana,
    EcMana,
    JoblevelMana,
    PosMana,
    PromiseMana
  }
}
</script>

<style>

</style>