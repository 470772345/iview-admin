<template>
  <div class="user-list">
   <myTable @handleSearch="handleSearch" :searchable='true' :dataRes="dataRes" @handlePager="handlePager" :columns='columns' :value='dataList' :border='true' @addClick='addClick'></myTable>
  </div>
</template>
<script>
import myTable from '_c/tables'
import { getUserList, updateUser, delUser } from '@/api/data'
export default {
  name: 'user-list',
  components: {
    myTable
  },
  data () {
    return {
      dataRes: {},
      paramsObj: {
        'name': '',
        'page': 1,
        'phone': '',
        'size': 10
      },
      dataList: [],
      self: this,
      columns: [
        {
          title: '序号',
          key: 'index',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '用户名称',
          key: 'name',
          align: 'center',
          render: (h, params) => (<a onClick={() => this.edit(params.row)}>{params.row.name || '匿名'}</a>)
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center',
          render: (h, params) => h('span', params.row.sex === 1 ? '男' : '女')
        },
        {
          title: '年龄',
          key: 'age',
          align: 'center'
        },
        {
          title: '年级',
          key: 'grade',
          align: 'center'
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => h('span', params.row.status === 1 ? '启用' : '停用')
        },
        {
          title: '操作',
          key: 'actor',
          align: 'center',
          render: (h, params) => this.renderOptions(h, params)
        }
      ]
    }
  },
  methods: {
    handleSearch (searchVal) {
      this.paramsObj.name = searchVal
      this.getList()
    },
    // 操作分页组件
    handlePager (pager) {
      this.paramsObj.page = pager.current
      this.paramsObj.size = pager.size
      this.getList()
    },
    addClick (handleType) {
      if (handleType === 'add') {
        this.$router.push({
          name: 'userEdit',
          params: {
            handleType: 'add'
          }
        }
        )
      }
    },
    edit (row) {
      this.$router.push({
        name: 'userEdit',
        params: {
          handleType: 'edit',
          userObj: row
        }
      }
      )
    },
    delUser (obj) {
      delUser(obj).then(res => {
        this.$Message.success('删除成功')
        this.getList()
      })
    },
    updateStatus (obj, status) {
      obj.status = status
      updateUser(obj).then(res => {
        this.$Message.success('操作成功')
      })
    },
    async getList () {
      console.log('getlist')
      const { data } = await getUserList(this.paramsObj)
      if (data.data && data.data.records) {
        this.dataList = data.data.records
        this.dataRes = data.data
      }
      console.log(data)
    },
    renderOptions (h, params) {
      if (params.row.status === 0) {
        return h('div', [
          h('Button', {
            props: {
              type: 'success',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.updateStatus(params.row, 1)
              }
            }
          }, '启用'),
          h('Poptip', {
            props: {
              confirm: true,
              title: '确定删除此条信息吗?',
              transfer: true
            },
            on: {
              'on-ok': () => {
                this.delUser(params.row)
              }
            }
          }, [h('Button', {
            props: {
              type: 'error',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            }
          }, '删除')])
        ])
      } else if (params.row.status === 1) {
        return h('div', [
          h('Button', {
            props: {
              type: 'warning',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.updateStatus(params.row, 0)
              }
            }
          }, '停用'),
          h('Poptip', {
            props: {
              confirm: true,
              title: '确定删除此条信息吗?',
              transfer: true
            },
            on: {
              'on-ok': () => {
                this.delUser(params.row)
              }
            }
          }, [h('Button', {
            props: {
              type: 'error',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            }
          }, '删除')])
        ])
      }
    }
  },
  created () {
    this.getList()
  }
}
</script>
