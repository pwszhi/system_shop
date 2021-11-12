import Vue from 'vue'
import Vuex from 'vuex'
import {
  getRequest
} from '../utils/api'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Notification } from 'element-ui';

Vue.use(Vuex)

const now = new Date()

const store = new Vuex.Store({
  state: {
    routes: [],
    sessions: {},
    admins: [],
    currentAdmin: JSON.parse(window.sessionStorage.getItem('user')),
    currentSession: null,
    filterKey: '',
    stomp: null,
    isDot:{}
  },
  mutations: {
    INIT_ADMIN(state,admin) {
      state.currentAdmin = admin
    },
    initRoutes(state, data) {
      state.routes = data
    },
    changeCurrentSession(state, currentSession) {
      // console.log(currentSession)//列表切换到的用户角色
      state.currentSession = currentSession;
      Vue.set(state.isDot,state.currentAdmin.username + '#' +state.currentSession.username,false)
    },
    addMessage(state, msg) {
      let mesg = state.sessions[state.currentAdmin.username + '#' + msg.to]
      // console.log(msg)
      if (!mesg) {
        // state.sessions[state.currentAdmin.username+'#'+msg.to] = []
        Vue.set(state.sessions, state.currentAdmin.username + '#' + msg.to, [])
      }
      state.sessions[state.currentAdmin.username + '#' + msg.to].push({
        content: msg.content,
        date: new Date(),
        self: !msg.notSelf
      })
      // console.log(state.sessions)
    },
    INIT_DATA(state) {
      // 浏览器本地的历史聊天记录
      let data = localStorage.getItem('vue-chat-session');
      //console.log(data)
      if (data) {
        state.sessions = JSON.parse(data);
      }
    },
    initAdmins(state, data) {
      state.admins = data
      // console.log(state.admins)
    }
  },
  actions: {
    connect(context) {
      context.state.stomp = Stomp.over(new SockJS('/ws/ep'))
      let token = window.sessionStorage.getItem('tokenStr')
      context.state.stomp.connect({
        'Auth-Token': token
      }, success => {
        context.state.stomp.subscribe('/user/queue/chat', msg => {
          // console.log(msg.body)
          let receiveMsg = JSON.parse(msg.body)
          if (!context.state.currentSession || receiveMsg.from != context.state.currentSession.username) {
            Notification.success({
              title: '【' + receiveMsg.formNickName + '】发来一条消息',
              message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10)+'···' : receiveMsg.content,
              position: 'buttom-right'
            });
            Vue.set(context.state.isDot,context.state.currentAdmin.username + '#' +receiveMsg.from,true)
          }

          // console.log(receiveMsg)
          receiveMsg.notSelf = true
          receiveMsg.to = receiveMsg.from
          context.commit('addMessage', receiveMsg)
        })
      }, error => {
        console.log(error)
      })
    },
    initData(context) {
      context.commit('INIT_DATA')
      getRequest('/chat/admin').then(resp => {
        if (resp) {
          context.commit('initAdmins', resp)
        }
      })
    }
  }
})

store.watch(function (state) {
  return state.sessions
}, function (val) {
  // console.log('CHANGE: ', val);
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
  deep: true /*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;
