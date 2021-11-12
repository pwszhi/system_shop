<template>
  <div>
    <div>
      <div class="searchBox">
        <div>
          <el-input
            ref="search"
            style="width:300px;margin-right:8px"
            type="small"
            clearable
            @input="initEmps"
            v-model="empName"
            :disabled='showAdvanceSearchVisible'
            prefix-icon="el-icon-search"
            @keydown.enter.native="searchEmp"
            placeholder="请输入员工名进行搜索 ···"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" :disabled='showAdvanceSearchVisible' @click="searchEmp">
            搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible = !showAdvanceSearchVisible; inputDep = '请选择部门'"
            ><i :class=" showAdvanceSearchVisible ? 'fa fa-angle-double-down':'fa fa-angle-double-up'" aria-hidden="true"></i>
            高级搜索</el-button
          >
        </div>
        <div>
          <el-upload
            style="display:inline-flex;margin-right:10px"
            :headers="headers"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :disabled="enabled"
            action="/employee/basic/import"
          >
            <el-tooltip
              effect="dark"
              content="只能上传员工数据，且不超过500kb"
              placement="top-start"
            >
              <el-button
                type="success"
                :disabled="enabled"
                :icon="importDataBtnIcon"
              >
                {{ importDataBtnText }}
              </el-button>
            </el-tooltip>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
          <el-tooltip
            effect="dark"
            content="导出全部的员工数据"
            placement="top-start"
          >
            <el-button
              type="success"
              @click="exportData"
              icon="el-icon-download"
            >
              导出数据
            </el-button>
          </el-tooltip>
          <el-button type="primary" @click="showAddEmp" icon="el-icon-plus"
            >添加员工</el-button
          >
        </div>
      </div>
    </div>
    <el-collapse-transition>
      <div v-show="showAdvanceSearchVisible" class="moreSearch">
        <el-row style="margin-top:10px">
          <el-col style="margin-left:5px" :span="5"
            >政治面貌：
            <el-select
              v-model="searchValue.politicId"
              size="mini"
              style="width:150px"
              placeholder="政治面貌"
            >
              <el-option
                v-for="item in politicsStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4"
            >民族：
            <el-select
              v-model="searchValue.nationId"
              size="mini"
              style="width:140px"
              placeholder="民族"
            >
              <el-option
                v-for="item in nations"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职位：
            <el-select
              size="mini"
              style="width:140px"
              v-model="searchValue.posId"
              placeholder="职位"
            >
              <el-option
                v-for="item in positions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4"
            >职称：
            <el-select
              size="mini"
              style="width:140px"
              v-model="searchValue.jobLevelId"
              placeholder="职称"
            >
              <el-option
                v-for="item in joblevels"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col style="margin-top:5px" :span="6"
            >聘用形式：
            <el-radio-group v-model="searchValue.engageForm">
              <el-radio v-model="engage" label="劳动合同">劳动合同</el-radio>
              <el-radio v-model="engage" label="劳务合同">劳务合同</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin:15px 0">
          <el-col style="margin-left:5px" :span="6">
            所属部门：
            <el-popover
              placement="right"
              title="请选择部门"
              width="220"
              trigger="manual"
              v-model="visible2"
            >
              <el-tree
                :data="allDeps"
                :props="defaultProps"
                default-expand-all
                @node-click="searchHandleNodeClick"
              >
              </el-tree>
              <div
                slot="reference"
                class="depBoxView"
                style="width:150px;vertical-align: middle"
                @click="showDepView2"
              >
                {{ inputDep }}
              </div>
            </el-popover>
          </el-col>
          <el-col :span="8">
            入职日期：
            <el-date-picker
              v-model="searchValue.beginDateScope"
              size="mini"
              value-format='yyyy-MM-dd'
              style="width:250px"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="5" :offset="2">
            <el-button size="mini" @click="showAdvanceSearchVisible = false;visible2=false">取消</el-button>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchMore"
              >搜索</el-button
            >
          </el-col>
        </el-row>
      </div> 
    </el-collapse-transition>
    <div>
      <el-table
        stripe
        border
        size="small"
        :data="emps"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @selection-change="handleSelectionChange"
        style="width: 100%;margin-top:10px"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="workID"
          align="left"
          label="工号"
          fixed="left"
          width="85"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="left"
          fixed="left"
          width="60"
        >
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="50">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号码" width="170">
        </el-table-column>
        <el-table-column prop="birthday" label="生日" width="100">
        </el-table-column>
        <el-table-column prop="wedlock" label="婚姻状况" width="80">
        </el-table-column>
        <el-table-column prop="nation.name" label="民族" width="60">
        </el-table-column>
        <el-table-column prop="nativePlace" label="籍贯" width="80">
        </el-table-column>
        <el-table-column
          prop="politicsStatus.name"
          label="政治面貌"
          width="100"
        >
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="电话号码" width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="居住地址"
          align="left"
          width="280"
        >
        </el-table-column>
        <el-table-column prop="department.name" label="所属部门" width="95">
        </el-table-column>
        <el-table-column prop="joblevel.name" label="职称等级" width="100">
        </el-table-column>
        <el-table-column prop="position.name" label="职位" width="95">
        </el-table-column>
        <el-table-column prop="engageForm" label="聘用形式" width="80">
        </el-table-column>
        <el-table-column prop="tiptopDegree" label="学历" width="60">
        </el-table-column>
        <el-table-column prop="school" label="毕业学校" width="130">
        </el-table-column>
        <el-table-column prop="specialty" label="专业" width="150">
        </el-table-column>
        <el-table-column prop="workState" label="在职状态" width="80">
        </el-table-column>
        <el-table-column prop="beginDate" label="入职日期" width="100">
        </el-table-column>
        <el-table-column prop="conversionTime" label="转正日期" width="100">
        </el-table-column>
        <el-table-column prop="beginContract" label="合同开始日期" width="100">
        </el-table-column>
        <el-table-column prop="endContract" label="合同结束日期" width="100">
        </el-table-column>
        <el-table-column label="合同期限" width="80">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag
            >年
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="scope">
            <el-button size="mini" @click="updateEmp(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="primary">查看高级资料</el-button>
            <el-button size="mini" type="danger" @click="deleteEmp(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:center;margin-top:20px">
        <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="sizes,prev, pager, next, jumper, ->, total"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
      <div>
        <el-form ref="empForm" :model="emp" :rules="rules">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名：" prop="name">
                <el-input
                  size="mini"
                  prefix-icon="el-icon-edit"
                  style="width:180px"
                  v-model="emp.name"
                  placeholder="请输入员工姓名"
                  ref="empName"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="性别：" prop="gender">
                <el-radio-group style="margin-top:10px" v-model="emp.gender">
                  <el-radio v-model="radio" label="男">男</el-radio>
                  <el-radio v-model="radio" label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="出生日期：" prop="birthday">
                <el-date-picker
                  v-model="emp.birthday"
                  type="date"
                  size="mini"
                  style="width:200px"
                  value-format="yyyy-MM-dd"
                  placeholder="出生日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌：" prop="politicId">
                <el-select
                  size="mini"
                  style="width:200px"
                  v-model="emp.politicId"
                  placeholder="政治面貌"
                >
                  <el-option
                    v-for="item in politicsStatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="民族：" prop="nationId">
                <el-select
                  size="mini"
                  style="width:180px"
                  v-model="emp.nationId"
                  placeholder="民族"
                >
                  <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="籍贯：" prop="nativePlace">
                <el-input
                  size="mini"
                  prefix-icon="el-icon-edit"
                  placeholder="请输入籍贯"
                  style="width:125px"
                  v-model="emp.nativePlace"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电子邮箱：" prop="email">
                <el-input
                  v-model="emp.email"
                  placeholder="请输入电子邮箱"
                  size="mini"
                  style="width:200px"
                  prefix-icon="el-icon-message"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址：" prop="address">
                <el-input
                  v-model="emp.address"
                  size="mini"
                  style="width:200px"
                  placeholder="请输入联系地址"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位：" prop="posId">
                <el-select
                  size="mini"
                  style="width:180px"
                  v-model="emp.posId"
                  placeholder="职位"
                >
                  <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="职称：" prop="jobLevelId">
                <el-select
                  size="mini"
                  style="width:125px"
                  v-model="emp.jobLevelId"
                  placeholder="职称"
                >
                  <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="所属部门：" prop="departmentId">
                <el-popover
                  placement="right"
                  title="请选择部门"
                  width="220"
                  trigger="manual"
                  v-model="visible"
                >
                  <el-tree
                    :data="allDeps"
                    :props="defaultProps"
                    default-expand-all
                    @node-click="handleNodeClick"
                  >
                  </el-tree>
                  <div slot="reference" class="depBoxView" @click="showDepView">
                    {{ inputDep }}
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码：" prop="phone">
                <el-input
                  size="mini"
                  style="width:200px"
                  v-model="emp.phone"
                  prefix-icon="el-icon-phone"
                  placeholder="请输入电话号码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号：" prop="workID">
                <el-input
                  v-model="emp.workID"
                  size="mini"
                  disabled
                  style="width:180px"
                  placeholder="请输入工号"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="学历：" prop="tiptopDegree">
                <el-select
                  size="mini"
                  style="width:125px"
                  v-model="emp.tiptopDegree"
                  placeholder="选择学历"
                >
                  <el-option
                    v-for="(item, index) in tiptopDegrees"
                    :key="index"
                    :label="item"
                    :value="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="毕业院校：" prop="school">
                <el-input
                  v-model="emp.school"
                  size="mini"
                  style="width:200px"
                  placeholder="请输入学校"
                  prefix-icon="el-icon-school"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称：" prop="specialty">
                <el-input
                  v-model="emp.specialty"
                  size="mini"
                  style="width:200px"
                  placeholder="请输入专业"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期：" prop="beginDate">
                <el-date-picker
                  v-model="emp.beginDate"
                  type="date"
                  size="mini"
                  style="width:152px"
                  value-format="yyyy-MM-dd"
                  placeholder="入职日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="转正日期：" prop="conversionTime">
                <el-date-picker
                  v-model="emp.conversionTime"
                  type="date"
                  size="mini"
                  style="width:130px"
                  value-format="yyyy-MM-dd"
                  placeholder="转正日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期：" prop="beginContract">
                <el-date-picker
                  v-model="emp.beginContract"
                  type="date"
                  size="mini"
                  style="width:160px"
                  value-format="yyyy-MM-dd"
                  placeholder="合同起始日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="合同截止日期：" prop="endContract">
                <el-date-picker
                  v-model="emp.endContract"
                  type="date"
                  size="mini"
                  style="width:170px"
                  value-format="yyyy-MM-dd"
                  placeholder="合同截止日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码：" prop="idCard">
                <el-input
                  v-model="emp.idCard"
                  size="mini"
                  style="width:200px"
                  placeholder="请输入身份证号码"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式：" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio v-model="engage" border label="劳动合同"
                    >劳动合同</el-radio
                  >
                  <el-radio v-model="engage" border label="劳务合同"
                    >劳务合同</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况：" prop="wedlock">
                <el-radio-group style="margin-top:10px" v-model="emp.wedlock">
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false;visible=false">取 消</el-button>
        <el-button size="mini" type="primary" @click="doAddEmp"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      emps: [],
      radio: "男",
      title: "",
      value:'',
      showAdvanceSearchVisible:false,
      engage: "劳动合同",
      importDataBtnText: "导入数据",
      enabled: false,
      importDataBtnIcon: "el-icon-upload2",
      visible: false,
      visible2: false,
      multipleSelection: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      inputDep: "",
      empName: "",
      headers: {
        Authorization: window.sessionStorage.getItem("tokenStr"),
      },
      dialogVisible: false,
      nations: [],
      // joblevels: [],
      politicsStatus: [],
      positions: [],
      allDeps: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      joblevels: [],
      // ["正高级", "副高级", "中级", "初级", "员级"],
      tiptopDegrees: [
        "博士",
        "硕士",
        "研究生",
        "本科",
        "大专",
        "高中",
        "初中",
        "小学",
        "其他",
      ],
      emp: {
        id: null,
        name: "",
        gender: "男",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: null,
        nativePlace: "",
        politicId: null,
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: "在职",
        workID: "",
        contractTerm: null,
        conversionTime: "",
        notWorkDate: "",
        beginContract: "",
        endContract: "",
        workAge: null,
        salaryId: null,
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birthday: [{ required: true, message: "请选择生日", trigger: "blur" }],
        idCard: [
          { required: true, message: "请输入身份证号码", trigger: "blur" },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: "身份证号码格式不正确",
            trigger: "blur",
          },
        ],
        wedlock: [
          { required: true, message: "请选择婚姻状况", trigger: "blur" },
        ],
        nationId: [{ required: true, message: "请选择民族", trigger: "blur" }],
        nativePlace: [
          { required: true, message: "请输入籍贯", trigger: "blur" },
        ],
        politicId: [
          { required: true, message: "请选择政治面貌", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        address: [
          { required: true, message: "请输入联系地址", trigger: "blur" },
        ],
        departmentId: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
        jobLevelId: [
          { required: true, message: "请选择职称等级", trigger: "blur" },
        ],
        posId: [{ required: true, message: "请输入职位", trigger: "blur" }],
        engageForm: [
          { required: true, message: "请选择聘用形式", trigger: "blur" },
        ],
        tiptopDegree: [
          { required: true, message: "请选择学历", trigger: "blur" },
        ],
        specialty: [{ required: true, message: "请输入专业", trigger: "blur" }],
        school: [
          { required: true, message: "请输入毕业院校", trigger: "blur" },
        ],
        beginDate: [
          { required: true, message: "请选择入职日期", trigger: "blur" },
        ],
        contractTerm: [
          { required: true, message: "请选择合同期限", trigger: "blur" },
        ],
        conversionTime: [
          { required: true, message: "请选择转正日期", trigger: "blur" },
        ],
        notWorkDate: [
          { required: true, message: "请选择离职日期", trigger: "blur" },
        ],
        beginContract: [
          { required: true, message: "请选择合同起始日期", trigger: "blur" },
        ],
        endContract: [
          { required: true, message: "请选择合同结束日期", trigger: "blur" },
        ],
        workAge: [{ required: true, message: "请输入工龄", trigger: "blur" }],
      },
      searchValue:{
        politicId: null,
        nationId: null,
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: "",
        beginDateScope: null,
      }
    };
  },
  mounted() {
    this.initEmps();
    this.initData();
    this.intiPositions();
    this.$nextTick(() => {
      this.$refs.search.focus();
    });
  },
  methods: {
    searchMore(){
      this.initEmps('advanced')
    },
    onSuccess() {
      this.importDataBtnText = "导入数据";
      this.enabled = false;
      this.importDataBtnIcon = "el-icon-upload2";
      this.initEmps();
    },
    onError() {
      this.importDataBtnText = "导入数据";
      this.enabled = false;
      this.importDataBtnIcon = "el-icon-upload2";
    },
    beforeUpload() {
      this.importDataBtnText = "正在上传";
      this.enabled = true;
      this.importDataBtnIcon = "el-icon-loading";
    },
    exportData() {
      this.downloadRequest("/employee/basic/export");
    },
    deleteEmp(data) {
      this.$confirm(
        "此操作将永久删除员工" + data.name + ", 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/employee/basic/" + data.id).then((resp) => {
            if (resp) {
              this.initEmps();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    doAddEmp() {
      if (this.emp.id) {
        this.$refs["empForm"].validate((valid) => {
          if (valid) {
            this.putRequest("/employee/basic/", this.emp).then((resp) => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            });
          }
        });
      } else {
        this.$refs["empForm"].validate((valid) => {
          if (valid) {
            this.postRequest("/employee/basic/", this.emp).then((resp) => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            });
          }
        });
      }
    },
    showDepView2(){
      this.visible2 = !this.visible2
    },
    showDepView() {
      this.visible = !this.visible;
    },
    intiPositions() {
      this.getRequest("/employee/basic/positions").then((resp) => {
        if (resp) {
          this.positions = resp;
        }
      });
    },
    getMaxWorkId() {
      this.getRequest("/employee/basic/maxWorkID").then((resp) => {
        if (resp) {
          this.emp.workID = resp.obj;
        }
      });
    },
    initData() {
      //获取民族数据
      if (!window.sessionStorage.getItem("nations")) {
        this.getRequest("/employee/basic/nations").then((resp) => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem("nations", JSON.stringify(resp));
          }
        });
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
      }
      //获取全部职称
      if (!window.sessionStorage.getItem("joblevels")) {
        this.getRequest("/employee/basic/joblevels").then((resp) => {
          if (resp) {
            this.joblevels = resp;
            window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
          }
        });
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
      }
      //获取全部类型的政治面貌
      if (!window.sessionStorage.getItem("politicsStatus")) {
        this.getRequest("/employee/basic/politicsstatus").then((resp) => {
          if (resp) {
            this.politicsStatus = resp;
            window.sessionStorage.setItem(
              "politicsStatus",
              JSON.stringify(resp)
            );
          }
        });
      } else {
        this.politicsStatus = JSON.parse(
          window.sessionStorage.getItem("politicsStatus")
        );
      }
      //获取所有部门
      if (!window.sessionStorage.getItem("allDeps")) {
        this.getRequest("/employee/basic/deps").then((resp) => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("allDeps", JSON.stringify(resp));
          }
        });
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("allDeps"));
      }
    },
    showAddEmp() {
      this.title = "添加员工";
      this.emp = {
        id: null,
        name: "",
        gender: "男",
        birthday: "",
        idCard: "",
        wedlock: "未婚",
        nationId: 1,
        nativePlace: "",
        politicId: null,
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: "劳动合同",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: "在职",
        workID: "",
        contractTerm: null,
        conversionTime: "",
        notWorkDate: "",
        beginContract: "",
        endContract: "",
        workAge: null,
        salaryId: null,
      };
      this.inputDep = "请选择部门";
      this.getMaxWorkId();
      this.dialogVisible = true;
      // this.$nextTick(() => {
      //   this.$refs.empName.focus();
      // });
    },
    searchEmp() {
      this.initEmps();
    },
    updateEmp(data) {
      // console.log(data)
      this.title = "编辑员工信息";
      this.dialogVisible = true;
      this.intiPositions();
      this.emp = data;
      this.inputDep = data.department.name;
    },
    sizeChange(size) {
      this.size = size;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmps();
    },
    initEmps(type) {
      this.loading = true;
      let url = "/employee/basic/?currentPage=" +
          this.currentPage +
          "&size=" +
          this.size;
      if(type && type == 'advanced'){
        if(this.searchValue.politicId){
          url += '&politicId='+this.searchValue.politicId 
        }
        if(this.searchValue.nationId){
          url += '&nationId=' + this.searchValue.nationId
        }
        if(this.searchValue.departmentId){
          url += '&departmentId=' +this.searchValue.departmentId
        }
        if(this.searchValue.jobLevelId){
          url += '&jobLevelId=' + this.searchValue.jobLevelId
        }
        if(this.searchValue.posId){
          url += '&posId=' + this.searchValue.posId
        }
        if(this.searchValue.engageForm){
          url += '&engageForm=' + this.searchValue.engageForm
        }
        if(this.searchValue.beginDateScope){
          url += '&beginDateScope=' + this.searchValue.beginDateScope
        }
      }else{
        url += '&name=' + this.empName
      }
      this.getRequest(url).then((resp) => {
        this.loading = false;
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      });
    },
    searchHandleNodeClick(data){
      this.inputDep = data.name
      this.visible2 = !this.visible2
      this.searchValue.departmentId = data.id
    },
    handleNodeClick(data) {
      // console.log(data);
      this.inputDep = data.name;
      this.emp.departmentId = data.id;
      this.visible = !this.visible;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style>
.searchBox {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.moreSearch {
  border: 1px solid #409eff;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 5px;
  font-size: 14px;
  color: #606266;
  margin: 10px 0;
  font-family: Arial, Helvetica, sans-serif;
}
.depBoxView {
  width: 200px;
  display: inline-flex;
  border: 1px solid #dedede;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 12px;
  text-indent: 1em;
  box-sizing: border-box;
}
</style>
