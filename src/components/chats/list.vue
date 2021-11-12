<template>
  <div id="list">
    <ul style="padding-left:0px">
      <li
        v-for="item in admins"
        :key="item.id"
        :class="{
          active: currentSession
            ? item.username === currentSession.username
            : false,
        }"
        @click="changeCurrentSession(item)"
      >
        <!--   :class="[item.id === currentSessionId ? 'active':'']" -->
        <img class="avatar" :src="item.userFace" :alt="item.name" />
        <el-badge :is-dot="isDot[user.username + '#' + item.username]">
          <p class="name">{{ item.name }}</p>
        </el-badge>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "list",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user"))
    };
  },
  computed: mapState(["admins", "isDot", "currentSession"]),
  methods: {
    changeCurrentSession: function(currentSession) {
      this.$store.commit("changeCurrentSession", currentSession);
    },
  },
};
</script>

<style>
#list li {
  padding: 15px 15px;
  border-bottom: 1px solid #292c33;
  cursor: pointer;
}
#list li:hover {
  background-color: rgba(255, 255, 255, 0.03);
}
li.active {
  /*注意这个是.不是冒号:*/
  background-color: rgba(255, 255, 255, 0.1);
}
#list .avatar {
  border-radius: 2px;
  width: 30px;
  height: 30px;
  vertical-align: middle;
}
#list .name {
  display: inline-block;
  margin: 0px 15px 0;
}
.el-badge__content.is-fixed.is-dot {
  margin-top: 12px;
}
</style>
