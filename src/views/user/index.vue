<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="selection" width="50" />
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
            :fit="cover"
            style="width: 40px; height: 40px"
          />
        </template>
      </el-table-column>
      <el-table-column label="简介" width="400px" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.profile !== null">{{ row.profile }}</span>
          <span v-else>用户很懒，什么都没有写！</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="65px">
        <template slot-scope="{ row }">
          <el-tag :type="row.role | roleFilter">
            {{ row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px">
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
          <el-button v-if="row.role !== 'ban'" size="mini"> 禁用 </el-button>
          <el-button v-else size="mini"> 启用 </el-button>
          <el-button type="danger" size="mini"> 删除 </el-button>
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
      this.$store.dispatch("user/getPage", this.listQuery).then((response) => {
        this.list = response.records
        this.total = parseInt(response.total)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>

<style lang="scss"></style>
