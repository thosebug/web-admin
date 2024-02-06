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
            fit="cover"
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

import Pagination from '@/components/Pagination/index.vue'

export default {
  components: { Pagination }
}
</script>

<style lang="scss">

</style>
