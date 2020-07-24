<template>
  <div class="user-list">
   <myTable :searchable='true' :columns='columns' :value='dataList' :border='true' @addClick='addClick'></myTable>
  </div>
</template>
<script>
import myTable from '_c/tables'
import { getUserList } from '@/api/data'
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
      dataList: [{
        'id': '0',
        'name': '小米',
        'status': '正常',
        'sex': '女',
        'age': '14',
        'grade': '初二',
        'type': '学生',
        'mobile': '13824125333'
      },
      {
        'id': '1',
        'name': '小明',
        'status': '停用',
        'age': '15',
        'sex': '男',
        'grade': '高一',
        'type': '学生',
        'mobile': '13824125333'
      }
      ],
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
          align: 'center'
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
          key: 'mobile',
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
    async getList () {
      console.log('getlist')
      const { data } = await getUserList(this.paramsObj)
      console.log(data)
    }
  },
  created () {
    this.getList()
  }
}
</script>
