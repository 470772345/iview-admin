<template>
  <div class="subject-list">
      <myTable @handleSearch="handleSearch" :enableAdd='false' :searchable='false' :dataRes="dataRes" @handlePager="handlePager" :columns='columns' :value='dataList' :border='true' @addClick='addClick'></myTable>
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
          render: (h, params) => h('span', params.row.type === 0 ? '已通过' : '已拒绝')
        },
        {
          title: '选项',
          key: 'analysis',
          width: 400,
          align: 'center',
          render: (h, params) => this.renderOptions2(h, params)
        },
        {
          title: '审核状态',
          width: 90,
          key: 'subjectType',
          align: 'center',
          render: (h, params) => h('span', params.row.type === 0 ? '已通过' : '已拒绝')
        },
        {
          title: '解题音频',
          width: 90,
          key: 'mp3',
          align: 'center',
          render: (h, params) => this.renderMp3Ele(h, params)
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
      this.paramsObj.page = 1
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
      console.log('审核通过')
      // 刷新列表
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
    playMp3 (value) {
      let id = value.row.id
      let i = document.getElementById(id).nextElementSibling
      let au = document.getElementById(id)
      let endTime = au.duration
      if (au.dataset.flag === 'true') {
        au.play()
        i.textContent = '暂停'
        i.style.cssText = 'color:red;font-style:normal;cursor:pointer'
        au.dataset.flag = false
      } else {
        au.pause()
        i.textContent = '播放'
        i.style.cssText = 'color:#2d8cf0;font-style:normal;cursor:pointer'
        au.dataset.flag = true
      }
      var interval = setInterval(function () {
        if (au.currentTime === endTime) {
          i.textContent = '播放'
          i.style.cssText = 'color:#2d8cf0;font-style:normal;cursor:pointer'
          au.dataset.flag = true
          clearInterval(interval)
        }
      }, 1000)
    },
    renderMp3Ele (h, params) {
      return h('div', {
        style: {

        }
      }, [
        h('audio', {
          style: {
            textAlign: 'center',
            padding: '4px',
            width: '100px'
          },
          attrs: {
            src: 'http://ai.foxcall.cn' + params.row.recordUrl,
            id: params.row.id,
            'data-flag': true
          }
        }, params.row.recordUrl),
        h('i', {
          style: {
            'font-style': 'normal',
            'color': '#2d8cf0',
            'cursor': 'pointer'
          },
          on: {
            click: () => {
              this.playMp3(params)
            }
          }
        }, '播放')
        // h('a', {
        //   'style': {
        //     'color': '#2d8cf0',
        //     'cursor': 'pointer',
        //     'margin': '0 2px'
        //   },
        //   attrs: {
        //     href: 'http://ai.foxcall.cn' + params.row.recordUrl
        //   }
        // }, '下载')
      ])
    },
    renderOptions2 (h, params) {
      let arr = params.row.groupColor || ['red', 'yellow']
      return h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        },
        arr.map((item, inde) => {
          return h('div', {
            style: {
              borderRadius: '50%',
              marginRight: '10px'
            }
          }, `A选项${item}  `)
        })
      )
    },
    renderOptions (h, params) {
      return h('div', [
        h('Button', {
          props: {
            type: 'primary',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              this.edit(params.row)
            }
          }
        }, '审核通过'),
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
        }, '退回')])
      ])
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
