<template>
  <div>
    <div>
      <el-card class="box-card" style="width:420px;margin-top:20px">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >操作按钮</el-button
          >
        </div>
        <div>
          <div>
            <div style="display:flex;justify-content:center;margin-bottom:15px">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/">
                <img
                  title="点击修改头像"
                  class="photoImg"
                  :src="admin.userFace"
                  alt="头像"
                />
              </el-upload>
             ''
            </div>

            <div>
              用户昵称：<el-tag type="primary">{{ admin.name }}</el-tag>
            </div>
            <div>
              住宅电话：<el-tag type="primary">{{ admin.telephone }}</el-tag>
            </div>
            <div>
              手机号码：<el-tag type="primary">{{ admin.phone }}</el-tag>
            </div>
            <div>
              联系地址：<el-tag type="primary">{{ admin.address }}</el-tag>
            </div>
            <div v-for="(r, i) in admin.roles" :key="i">
              用户标签：<el-tag type="primary">{{ r.nameZh }}</el-tag>
            </div>
            <div>
              备注：<span class="remarkText">{{ admin.remark }}</span>
            </div>
            <div
              style="display:flex;justify-content:space-around;margin-top:20px"
            >
              <el-button type="primary" @click="showUpdate" size="mini"
                >修改信息</el-button
              >
              <el-button type="danger" @click="updatePassword" size="mini"
                >修改密码</el-button
              >
            </div>
          </div>
        </div>
      </el-card>
      <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="30%">
        <table>
          <tr>
            <td>用户昵称：</td>
            <td>
              <el-input
                type="text"
                v-model="admin2.name"
                placeholder="请输入用户名称···"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td>住宅电话：</td>
            <td>
              <el-input
                type="text"
                v-model="admin2.telephone"
                placeholder="请输入住宅电话···"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td>手机号码：</td>
            <td>
              <el-input
                type="text"
                v-model="admin2.phone"
                placeholder="请输入手机号码···"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td>联系地址：</td>
            <td>
              <el-input
                type="text"
                v-model="admin2.address"
                placeholder="请输入联系地址···"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td>备注：</td>
            <td>
              <el-input
                type="text"
                v-model="admin2.remark"
                placeholder="请输入备注···"
              ></el-input>
            </td>
          </tr>
        </table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateAdmin">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="更改用户密码" :visible.sync="pwdVisible" width="30%">
        <div>
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
          >
            <el-form-item label="原密码" prop="oldPass">
              <el-input
                ref="inputPwd"
                type="password"
                placeholder="请输入原密码"
                v-model="ruleForm.oldPass"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
              <el-input
                type="password"
                placeholder="请输入新密码"
                v-model="ruleForm.pass"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认新密码"  prop="checkPass">
              <el-input
                type="password"
                autocomplete="off"
                placeholder="请再次输入新密码"
                v-model="ruleForm.checkPass"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >提交</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "Admin",
  data() {
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      admin: {},
      admin2: {},
      dialogVisible: false,
      pwdVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        oldPass: [{ validator: validatePass3, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.initAdmin();
  },
  methods: {
    submitForm(formName) {
      console.log(this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.adminId = this.admin.id
          this.putRequest('/admin/pass',this.ruleForm).then(resp=>{
            if(resp){
              // this.pwdVisible = false
              //更新密码后推出登录
              this.postRequest('/logout')
              window.sessionStorage.removeItem('user')
              window.sessionStorage.removeItem('tokenStr')
              this.$store.commit('initRoutes',[])
              this.$router.replace('/')
            }
          })
        } else {
          this.$message({
            type:'warning',
            message:'表单验证不通过'
          })
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updatePassword() {
      this.pwdVisible = !this.pwdVisible;
      this.ruleForm = {
        oldPass: "",
        pass: "",
        checkPass: "",
      }
      // this.$nextTick(()=>{
      //   this.$refs.inputPwd.focus()
      // })
    },
    showUpdate() {
      this.dialogVisible = !this.dialogVisible;
      this.admin2 = {};
      this.admin2 = Object.assign({}, this.admin);
    },
    updateAdmin() {
      this.putRequest("/admin/info", this.admin2).then((resp) => {
        if (resp) {
          this.initAdmin();
          this.dialogVisible = false;
        }
      });
    },
    initAdmin() {
      this.getRequest("/admin/info").then((resp) => {
        if (resp) {
          this.admin = resp;
          this.admin2 = Object.assign({}, this.admin);
          window.sessionStorage.setItem("user", JSON.stringify(resp));
          this.$store.commit("INIT_ADMIN", resp);
          // console.log(this.admin)
        }
      });
    },
  },
};
</script>

<style>
.photoImg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.el-tag {
  margin-bottom: 10px;
}
.remarkText {
  font-size: 12px;
  color: #409eff;
  font-family: "宋体";
}
</style>
