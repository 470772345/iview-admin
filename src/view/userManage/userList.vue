<template>
  <div class="user-list">
   <myTable :searchable='true' :columns='columns' :value='dataList' :border='true' @addClick='addClick'></myTable>
  </div>
</template>
<script>
import myTable from '_c/tables'
import { getUserList, updateUser, delUser } from '@/api/data'
export default {
  name: 'user-list',
  data () {
    return {
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
          width: 60,
          align: 'center'
        },
        {
          title: '用户名称',
          key: 'name',
          align: 'center',
          render: (h, params) => (<a onClick={() => this.edit(params.row)}>{params.row.name}</a>)
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center'
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
          align: 'center'
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
  components: {
    myTable
  },
  methods: {
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
    edit () {
      console.log('edit')
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
      if (data.data && data.data.records) this.dataList = data.data.records
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
