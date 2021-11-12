<template>
  <div id="chat">
    <div class="sidebar">
      <card></card>
      <list></list>
    </div>
    <div class="main">
      <message></message>
      <userText></userText>
    </div>
  </div>
</template>

<script>
import card from '../../components/chats/card'
import list from '../../components/chats/list'
import message from '../../components/chats/message'
import userText from '../../components/chats/userText'

export default {
  name:'FriendChat',
  data(){
    return{
      
    }
  },
  mounted() {
    this.$store.dispatch('initData')
  },
  components: {
    card,
    list,
    message,
    userText
  },
}
</script>

<style>
#chat{
  margin: 10px 0 0 0;
  width: 1200px;
  height: 600px;
  overflow: hidden;
  border-radius: 3px;  
}
#chat .sidebar,
#chat .main{
  height: 100%;
  }
#chat .sidebar{
    float: left;
    color: #f4f4f4;
    background-color: #2e3238;
    width: 200px;
  }
#chat .main{
    position: relative;
    overflow: hidden;
    /* height: 700px; */
    background-color: #eee;
  }
</style>