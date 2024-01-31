<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="编号" prop="id" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="110px" align="center">
        <template slot-scope="{row}">
          <el-image :src="row.avatar" :fit="`scale-down`"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.profile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini">
            查看
          </el-button>
          <el-button type="success" size="mini">
            编辑
          </el-button>
          <el-button type="danger" size="mini">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getUserList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'UserList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        id: undefined,
        account: undefined,
        role: undefined
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
        }, 1.5 * 1000)
      })
    }
  }
}
</script>

<style lang="scss">

</style>
