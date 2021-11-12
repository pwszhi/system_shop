<template>
  <div id="uesrtext">
    <el-input type='textarea' :rows='20' placeholder="按 Enter 发送" v-model="content" @keyup.enter.native="addMessage"></el-input>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'uesrText',
  data () {
    return {
      content:''
    }
  },
   computed:mapState([
  	'currentSession'
  ]),
  methods: {
  	addMessage (e) {
      // console.log(e)
  		if (this.content!='\n') {
        let msgObj = new Object()
        // console.log(msgObj)
        msgObj.to = this.currentSession.username
        msgObj.content = this.content
        this.$store.state.stomp.send('/ws/chat',{},JSON.stringify(msgObj))
        // console.log(msgObj)
  			this.$store.commit('addMessage',msgObj);
  			this.content='';
      } else{
        this.$message({
          type:'warning',
          message:'不能发送空消息'
        })
        this.content = ''
      }
  	}
  }
}
</script>

<style>
#uesrtext {
	position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #DDD;
}
#uesrtext textarea {
  	padding: 10px;
  	width: 100%;
  	height: 100%;
  	border: none;
  	outline: none;
  }
</style>
