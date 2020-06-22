<template>
  <div class="test-paper-list">
   <myTable :searchable='true' :columns='columns' :value='dataList' :border='true'></myTable>
  </div>
</template>
<script>
import myTable from '_c/tables'
export default {
  name: 'test-paper-list',
  data () {
    return {
      dataList: [{
        'id': '0',
        'name': '1.高一上学期模拟考试试题1',
        'status': '正常',
        'totalNum': '100',
        'questionNum': '100'
      },
      {
        'id': '1',
        'name': '初一下学期模拟考试试题',
        'status': '停用',
        'totalNum': '100',
        'questionNum': '80'
      }
      ],
      columns: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '试卷名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '总分',
          key: 'totalNum',
          align: 'center'
        },
        {
          title: '题数',
          key: 'questionNum',
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
          render: (h, params) => {
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
                    this.$router.push({ path: '../testPaperManage/testPaperEdit?id=' + this.dataList[params.index].id })
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.popupIsShow = true
                    this.gcid = this.dataList[params.index].gcid
                  }
                }
              }, '选择试题')
            ])
          }
        }
      ]
    }
  },
  components: {
    myTable
  }
}
</script>
