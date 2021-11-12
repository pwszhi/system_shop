<template>
  <div>
    <div class="addRole">
      <el-input
        size="small"
        placeholder="请输入角色英文名"
        @keydown.enter.native="addRole"
        v-model="role.name"
      >
        <template #prepend>ROLE_</template>
      </el-input>
      <el-input
        size="small"
        placeholder="请输入角色中文名"
        v-model="role.nameZh"
        @keydown.enter.native="addRole"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addRole"
        >添加角色</el-button
      >
    </div>
    <div class="roleMain">
      <el-collapse accordion v-model="activeName" @change="change">
        <el-collapse-item
          :title="r.nameZh"
          :name="r.id"
          :key="index"
          v-for="(r, index) in roles"
        >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button
                size="mini"
                style="float:right"
                type="danger"
                icon="el-icon-delete"
                @click="deleteRole(r)"
                >删除角色</el-button
              >
            </div>
            <div>
              <el-tree
                show-checkbox
                :data="allMenus"
                :props="defaultProps"
                node-key="id"
                ref="tree"
                :key="index"
                :default-checked-keys="selectMenus"
              ></el-tree>
              <div style="display:flex;justify-content:flex-end">
                <el-button size="mini" @click="cancelUpdate"
                  >取消修改</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="doUpdate(r.id, index)"
                  >确认修改</el-button
                >
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PromiseMana",
  data() {
    return {
      role: {
        name: "",
        nameZh: "",
      },
      roles: [],
      allMenus: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      activeName: -1,
      selectMenus: [],
    };
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    deleteRole(role) {
      this.$confirm(
        "此操作将永久删除[ " + role.nameZh + " ]角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.deleteRequest("/system/basic/permiss/role/" + role.id).then(
          (resp) => {
            if (resp) {
              this.initRoles();
            }
          }
        );
      });
    },
    addRole() {
      if (this.role.name && this.role.nameZh) {
        this.postRequest("/system/basic/permiss/role", this.role).then(
          (resp) => {
            if (resp) {
              this.initRoles();
              //清空输入框信息
              this.role.name = "";
              this.role.nameZh = "";
            }
          }
        );
      } else {
        this.$message.error("请补充所有信息后添加");
      }
    },
    cancelUpdate() {
      this.activeName = -1;
    },
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys(true);
      // console.log(selectedKeys)
      let url = "/system/basic/permiss/?rid=" + rid;
      selectedKeys.forEach((key) => {
        url += "&mids=" + key;
      });
      // console.log(url)
      this.putRequest(url).then((resp) => {
        if (resp) {
          this.activeName = -1;
        }
      });
    },
    initSelectedMenus(rid) {
      this.getRequest("/system/basic/permiss/mid/" + rid).then((resp) => {
        if (resp) {
          this.selectMenus = resp;
        }
      });
    },
    change(rid) {
      if (rid) {
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    initAllMenus() {
      this.getRequest("/system/basic/permiss/menus").then((resp) => {
        if (resp) {
          this.allMenus = resp;
        }
      });
    },
    initRoles() {
      this.getRequest("/system/basic/permiss/").then((resp) => {
        if (resp) {
          this.roles = resp;
        }
      });
    },
  },
};
</script>

<style>
.addRole {
  display: flex;
  justify-content: flex-start;
}
.addRole .el-input {
  width: 300px;
  margin-right: 8px;
}
.roleMain {
  margin-top: 10px;
  width: 60%;
}
</style>
