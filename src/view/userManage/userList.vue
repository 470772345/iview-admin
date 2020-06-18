<template>
  <div>
      <i-table border :content="self" :columns="columns" :data="dataList"></i-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataList: [{
        'id': '0',
        'name': '小米',
        'status': '正常',
        'sex': '女',
        'grade': '初二',
        'type': '学生',
        'date': '2020-01-01'
      },
      {
        'id': '1',
        'name': '小明',
        'status': '停用',
        'sex': '男',
        'grade': '高一',
        'type': '学生',
        'date': '2020-01-12'
      }
      ],
      self: this,
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
          title: '班级',
          key: 'grade',
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
  }
}
</script>
