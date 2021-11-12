import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import FriendChat from '../views/chat/FriendChat'
import AdminInfo from '../views/AdminInfo'
import Setting from '../views/Setting'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
  }
const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    hidden:true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [{
      path: '/chat',
      name: '在线聊天',
      component:FriendChat
    }, {
        path: '/userinfo',
        name: '个人中心',
        component:AdminInfo
      },
      {
        path: '/setting',
        name: '设置',
        component:Setting
    }]
  }
  
]

const router = new VueRouter({
  routes,
  // mode: 'history' //易渲染错误
})

export default router
