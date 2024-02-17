<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.account" placeholder="昵称" clearable class="filter-item" style="width: 200px" />
      <el-select v-model="listQuery.role" style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in roleOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="warning" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="info" icon="el-icon-refresh-left" @click="handleReset">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" prop="id" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="60px" align="center">
        <template slot-scope="{ row }">
          <el-image
            :src="row.avatar"
            fit="cover"
            style="width: 40px; height: 40px"
          />
        </template>
      </el-table-column>
      <el-table-column label="简介" width="auto" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.profile !== null">{{ row.profile }}</span>
          <span v-else>用户很懒，什么都没有写！</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="65px" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.role | roleFilter">
            {{ row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="400px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini"> 查看 </el-button>
          <el-button type="success" size="mini"> 编辑 </el-button>
          <el-button v-if="row.role !== 'ban'" size="mini" @click="handleRole(row.id, 'ban')"> 禁用 </el-button>
          <el-button v-else size="mini" @click="handleRole(row.id, 'user')"> 启用 </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getUserList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" show-password />
        </el-form-item>
        <el-form-item label="昵称" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="temp.avatar" />
        </el-form-item>
        <el-form-item label="简介" prop="profile">
          <el-input v-model="temp.profile" type="textarea" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="temp.role" class="filter-item" placeholder="请选择">
            <el-option v-for="item in roleOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'UserList',
  components: { Pagination },
  filters: {
    roleFilter(role) {
      const roleMap = {
        admin: '',
        user: 'success',
        ban: 'danger'
      }
      return roleMap[role]
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        username: undefined,
        account: undefined,
        role: undefined
      },
      roleOptions: [{ label: '管理员', key: 'admin' }, { label: '用户', key: 'user' }, { label: '禁用', key: 'ban' }],
      temp: {
        id: undefined,
        username: '',
        password: '',
        account: '',
        avatar: '',
        profile: '',
        role: 'user'
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      this.$store.dispatch('user/getPage', this.listQuery).then((response) => {
        this.list = response.records
        this.total = parseInt(response.total)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getUserList()
    },
    handleReset() {
      this.listQuery.current = 1
      this.listQuery.username = undefined
      this.listQuery.account = undefined
      this.listQuery.role = undefined
      this.getUserList()
    },
    handleRole(id, role) {
      this.listLoading = true
      const roleInfo = { id, role }
      this.$store.dispatch('user/updateRole', roleInfo).then((response) => {
        this.dialogFormVisible = false
        this.$message.success(response)
        this.getUserList()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleDelete(id) {
      this.listLoading = true
      this.$store.dispatch('user/deleteUser', id).then((response) => {
        this.$message.success(response)
        this.getUserList()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        password: '',
        account: '',
        profile: '',
        role: 'user'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.$store.dispatch('user/createUser', this.temp).then((response) => {
            this.$message.success(response)
            this.dialogFormVisible = false
            this.getUserList()
            setTimeout(() => {
              this.listLoading = false
            }, 0.5 * 1000)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>
