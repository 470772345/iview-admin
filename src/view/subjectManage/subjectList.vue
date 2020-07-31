<template>
  <div class="subject-list">
      <myTable @handleSearch="handleSearch" :searchable='true' :dataRes="dataRes" @handlePager="handlePager" :columns='columns' :value='dataList' :border='true' @addClick='addClick'></myTable>
  </div>
</template>
<script>
import myTable from '_c/tables'
import { getList, update, delQuestion } from '@/api/subject'
export default {
  name: 'subject-list',
  components: {
    myTable
  },
  data () {
    return {
      dataRes: {},
      paramsObj: {
        page: 1,
        size: 10
      },
      dataList: [],
      columns: [
        {
          title: '试题内容',
          key: 'description',
          width: 300,
          align: 'center',
          render: (h, params) => (<a onClick={() => this.edit(params.row)}>{params.row.description}</a>)
        },
        {
          title: '解析',
          key: 'analysis',
          width: 300,
          align: 'center'
        },
        {
          title: '标准答案',
          key: 'answer',
          width: 90,
          align: 'center'
        },
        {
          title: '试题类型',
          width: 90,
          key: 'subjectType',
          align: 'center',
          render: (h, params) => h('span', params.row.type === 0 ? '单选题' : '多选题')
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
          name: 'subjectEdit',
          params: {
            handleType: 'add'
          }
        }
        )
      }
    },
    edit (row) {
      this.$router.push({
        name: 'subjectEdit',
        params: {
          handleType: 'edit',
          userObj: row
        }
      }
      )
    },
    delQuestion (obj) {
      delQuestion(obj).then(res => {
        this.$Message.success('删除成功')
        this.getList()
      })
    },
    updateStatus (obj, status) {
      obj.status = status
      update(obj).then(res => {
        this.$Message.success('操作成功')
      })
    },
    async getList () {
      const { data } = await getList(this.paramsObj)
      if (data.data && data.data.records) {
        this.dataList = data.data.records
        this.dataRes = data.data
      }
    },
    cancel () {
      this.isShowAddCategory = false
    },
    addNewCategory () {
      console.log('新增分类')
    },
    addCategoryClick () {
      this.isShowAddCategory = true
    },
    selectClick (item) {
      // 切换选中样式
      this.switchSelectedStyle(item)
      // 刷新对应分类列表
    },
    switchSelectedStyle (item) {
      this.cList.map(function (arrayItem) {
        if (item.cId === arrayItem.cId) {
          arrayItem.isSelected = true
        } else {
          arrayItem.isSelected = false
        }
      })
      console.log(item.name)
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
                this.delQuestion(params.row)
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
                this.delQuestion(params.row)
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
    this.getList(this.paramsObj)
  }
}
</script>
<style lang="less" scoped>
.subject-list{
 .left-side{
   min-height: 800px;
   border-right: 1px solid #e8eaec;
   background-color: #fff;
  .c-header{
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    border-bottom: 1px solid #e8eaec;
    padding: 10px;
  }
 }
 .right-side{
   padding: 10px;
 }
 .c-item{
   padding:10px 0;
   color:#222;
   font-size: 14px;
   margin:5px;
   padding-left: 6px;
 }
 .c-item:hover{
   background-color: #edf7ff;
   color: #2d8cf0
 }
 .selected-color{
   background-color: #edf7ff;
   color: #2d8cf0
 }
}
</style>
