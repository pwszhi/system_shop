<template>
  <div>
    <div>
      <el-table :data="emps" border stripe style="width:80%">
        <el-table-column type="selection" align="left" width="55">
        </el-table-column>
        <el-table-column label="工号" prop="workID" align="center" width="100">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center" width="100">
        </el-table-column>
        <el-table-column label="邮箱" prop="email" align="center" width="200">
        </el-table-column>
        <el-table-column
          label="手机号码"
          prop="phone"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="所属部门"
          prop="department.name"
          align="left"
          width="100"
        >
        </el-table-column>
        <el-table-column label="工资账套" prop="salary.name" align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right" v-if="scope.row.salary">
              <div slot="content">
                <table>
                  <tr>
                    <td>基本工资</td>
                    <td>{{ scope.row.salary.basicSalary }}</td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>{{ scope.row.salary.trafficSalary }}</td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>{{ scope.row.salary.lunchSalary }}</td>
                  </tr>
                  <tr>
                    <td>奖金</td>
                    <td>{{ scope.row.salary.bonus }}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>{{ scope.row.salary.pensionBase }}</td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>{{ scope.row.salary.pensionPer }}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>{{ scope.row.salary.medicalBase }}</td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>{{ scope.row.salary.medicalPer }}</td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>{{ scope.row.salary.accumulationFundBase }}</td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>{{ scope.row.salary.accumulationFundPer }}</td>
                  </tr>
                </table>
              </div>
              <el-tag size="medium" style="cursor:pointer" type="primary">{{
                scope.row.salary.name
              }}</el-tag>
            </el-tooltip>
            <el-tag size="medium" style="cursor:pointer" type="primary" v-else
              >暂未设置</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              title="编辑工资账套"
              @show="showPop(scope.row.salary)"
              @hide="hidePop(scope.row)"
              width="200"
              trigger="click"
            >
              <div>
                <el-select v-model="currentSalary" placeholder="请输入">
                  <el-option
                    v-for="item in salary"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <el-button
                slot="reference"
                size="mini"
                type="danger"
                @click="updateData(scope.row)"
                >修改工资账套</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div
        style="display:flex;justify-content:flex-start;margin:20px 0px 0px 50px"
      >
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          layout="sizes, prev, pager, next, jumper, ->, total"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalSobCfg",
  data() {
    return {
      emps: [],
      salary: [],
      currentSalary: null,
      currentPage: 1,
      size: 10,
      total: 0,
    };
  },
  mounted() {
    this.initDataEmps();
    this.initSalary();
  },
  methods: {
    hidePop(data) {
      if (data.salary) {
        if (this.currentSalary && this.currentSalary != data.salary.id) {
          this.putRequest(
            "/salary/sobcfg/?eid=" + data.id + "&sid=" + this.currentSalary
          ).then((resp) => {
            if (resp) {
              this.initDataEmps();
            }
          });
        }
      }else if(this.currentSalary){
          this.putRequest(
            "/salary/sobcfg/?eid=" + data.id + "&sid=" + this.currentSalary
          ).then((resp) => {
            if (resp) {
              this.initDataEmps();
            }
          });
      }
    },
    showPop(data) {
      if (data) {
        this.currentSalary = data.id;
      } else {
        this.currentSalary = null;
      }
    },
    initSalary() {
      this.getRequest("/salary/sobcfg/salaries").then((resp) => {
        if (resp) {
          this.salary = resp;
        }
      });
    },
    handleSizeChange(val) {
      this.size = val;
      this.initDataEmps();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initDataEmps();
    },
    updateData(data) {
      // console.log(data);
    },
    initDataEmps() {
      this.getRequest(
        "/salary/sobcfg/?currentPage=" + this.currentPage + "&size=" + this.size
      ).then((resp) => {
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      });
    },
  },
};
</script>

<style>
tag {
  cursor: pointer;
}
</style>
