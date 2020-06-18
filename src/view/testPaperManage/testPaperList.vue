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
        'name': '小米',
        'status': '正常',
        'sex': '女',
        'grade': '初二',
        'type': '学生',
        'date': '2020-01-01',
        'mobile': '13824125333'
      },
      {
        'id': '1',
        'name': '小明',
        'status': '停用',
        'sex': '男',
        'grade': '高一',
        'type': '学生',
        'date': '2020-01-12',
        'mobile': '13824125565'
      }
      ],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          align: 'center'
        },
        {
          title: '注册时间',
          key: 'date',
          align: 'center'
        },
        {
          title: '年级',
          key: 'grade',
          align: 'center'
        },
        {
          title: '手机号',
          key: 'mobile',
          align: 'center'
        },
        {
          title: '性别',
          key: 'sex',
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
            if (this.dataList[params.index].status === '正常') {
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
                      this.$router.push({ path: '../userManage/userEdit?id=' + this.dataList[params.index].id })
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
                }, '停用')
              ])
            } else {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '../marketing_manage/gift_card_warehouse?gcid=' + this.giftCardsList[params.index].gcid })
                    }
                  }
                }, '启用')
              ])
            }
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
