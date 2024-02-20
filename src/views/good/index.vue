<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.price" placeholder="金额" clearable class="filter-item" style="width: 200px" />
      <el-select v-model="listQuery.isBan" style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in banOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="warning" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh-left" @click="handleReset">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" prop="id" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周期" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.cycle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="照片" width="60px" align="center">
        <template slot-scope="{ row }">
          <el-image v-if="row.photo" :src="row.photo" fit="cover" style="width: 40px; height: 40px"/>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="auto" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.profile !== null">{{ row.profile }}</span>
          <span v-else>这个产品还没有描述！</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="65px" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.isBan | banFilter">
            {{ row.isBan | isBanFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400px" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini"> 编辑 </el-button>
          <el-button v-if="row.isBan === 0" type="warning" size="mini" @click="handleBan(row.id, 1)"> 禁用 </el-button>
          <el-button v-else size="mini" @click="handleBan(row.id, 0)"> 启用 </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getGoodList"/>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination/index.vue'

export default {
  components: { Pagination },
  filters: {
    isBanFilter(isBan) {
      const isBanMap = {
        0: '启用',
        1: '禁用'
      }
      return isBanMap[isBan]
    },
    banFilter(isBan) {
      const BanMap = {
        0: '',
        1: 'danger'
      }
      return BanMap[isBan]
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
        name: undefined,
        price: undefined,
        isBan: undefined
      },
      banOptions: [{ label: '启用', key: 0 }, { label: '禁用', key: 1 }]
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    getGoodList() {
      this.listLoading = true
      this.$store.dispatch('good/getPage', this.listQuery).then((response) => {
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
      this.getGoodList()
    },
    handleReset() {
      this.listQuery.current = 1
      this.listQuery.name = undefined
      this.listQuery.price = undefined
      this.listQuery.isBan = undefined
      this.getGoodList()
    },
    handleBan(id, isban) {
      this.listLoading = true
      const banInfo = { id, isban }
      this.$store.dispatch('good/updateIsBan', banInfo).then((response) => {
        this.dialogFormVisible = false
        this.$message.success(response)
        this.getGoodList()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleDelete(id) {
      this.listLoading = true
      this.$store.dispatch('good/deleteGood', id).then((response) => {
        this.$message.success(response)
        this.getGoodList()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>

<style lang="scss">

</style>
