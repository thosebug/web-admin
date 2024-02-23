<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.price"
        placeholder="金额"
        clearable
        class="filter-item"
        style="width: 200px"
      />
      <el-select
        v-model="listQuery.cycle"
        placeholder="周期"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="item in cycleOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.userId"
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in userOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.goodId"
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in goodOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="warning"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        type="info"
        icon="el-icon-refresh-left"
        @click="handleReset"
      >
        重置
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
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
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.goodName }}</span>
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
      <el-table-column label="备注" width="auto" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.context !== ''">{{ row.context }}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400px" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="success" size="mini"> 编辑</el-button>
          <el-button v-if="row.isBan === 0" type="warning" size="mini">禁用</el-button>
          <el-button v-else size="mini">启用</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getGoodList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="金额" prop="price">
          <el-input v-model="temp.price" />
        </el-form-item>
        <el-form-item label="周期" prop="cycle">
          <el-select v-model="temp.cycle" class="filter-item" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in cycleOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="photo">
          <el-input v-model="temp.photo" />
        </el-form-item>
        <el-form-item label="简介" prop="profile">
          <el-input v-model="temp.profile" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.isBan" class="filter-item" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in banOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
import item from '@/layout/components/Sidebar/Item.vue'

export default {
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
        price: undefined,
        cycle: undefined,
        userId: undefined,
        goodId: undefined
      },
      cycleOptions: [
        { label: 1, key: 1 },
        { label: 3, key: 3 },
        { label: 6, key: 6 },
        { label: 12, key: 12 }
      ],
      userOptions: [],
      goodOptions: [],
      temp: {
        id: undefined,
        name: '',
        price: '',
        cycle: 1,
        photo: '',
        profile: '',
        isBan: 0
      },
      rules: {
        name: [{ required: true, trigger: 'blur' }],
        price: [{ required: true, trigger: 'blur' }]
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
    this.getQuery()
    this.getOrderList()
  },
  methods: {
    getQuery() {
      this.$store.dispatch('order/getQuery', this.listQuery).then((response) => {
        if (response !== null) {
          response.user.map((item) => {
            this.userOptions.push({ label: item.account, key: item.id })
          })
          response.good.map((item) => {
            this.goodOptions.push({ label: item.name, key: item.id})
          })
        }
      })
    },
    getOrderList() {
      this.listLoading = true
      this.$store.dispatch('order/getPage', this.listQuery).then((response) => {
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
      this.getOrderList()
    },
    handleReset() {
      this.listQuery.current = 1
      this.listQuery.price = undefined
      this.listQuery.cycle = undefined
      this.listQuery.userId = undefined
      this.listQuery.goodId = undefined
      this.getOrderList()
    },
    handleDelete(id) {
      this.listLoading = true
      this.$store.dispatch('order/deleteGood', id).then((response) => {
        this.$message.success(response)
        this.getGoodList()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        price: '',
        cycle: 1,
        photo: '',
        profile: '',
        isBan: 0
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
          this.$store
            .dispatch('good/createGood', this.temp)
            .then((response) => {
              this.$message.success(response)
              this.dialogFormVisible = false
              this.getGoodList()
              setTimeout(() => {
                this.listLoading = false
              }, 0.5 * 1000)
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.$store.dispatch('good/updateGood', tempData).then((response) => {
            this.$message.success(response)
            this.dialogFormVisible = false
            this.getGoodList()
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
