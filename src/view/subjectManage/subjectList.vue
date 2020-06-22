<template>
  <div class="subject-list">
     <Row>
        <Col span="4" class="left-side">
        <div class="c-header" >
          <div>试题分类</div>
          <div><Button type='primary' @click="addCategoryClick">新增</Button></div>
          </div>
        <div :class="['c-item',item.isSelected==true?'selected-color':'']" v-for="item in cList" :key="item.cId" @click="selectClick(item)">{{item.name}}</div>
        </Col>
        <Col span="20" class="right-side">
         <myTable :searchable='true' :columns='columns' :value='dataList' :border='true'></myTable>
        </Col>
    </Row>
    <Modal
        v-model="isShowAddCategory"
        title="新增分类"
        @on-ok="addNewCategory()"
        @on-cancel="cancel">
        <Input placeholder="请输入分类名称" />
    </Modal>
  </div>
</template>
<script>
import myTable from '_c/tables'
export default {
  name: 'subject-list',
  components: {
    myTable
  },
  data () {
    return {
      isShowAddCategory: false,
      cList: [
        {
          cId: '0',
          isSelected: true,
          name: '数学'
        },
        {
          cId: '1',
          isSelected: false,
          name: '历史'
        },
        {
          cId: '2',
          isSelected: false,
          name: '音乐'
        }],
      dataList: [{
        'id': '0',
        'content': '中国最大的淡水湖是（）？',
        'status': '正常',
        'analysis': '最大的淡水湖是',
        'subjectType': '单选题',
        'answer': 'A'
      },
      {
        'id': '1',
        'content': '下列哪些选项可以提示身体免疫力？',
        'status': '停用',
        'analysis': '【解析】打篮球可以锻炼身体',
        'subjectType': '多选题',
        'answer': 'AD'
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
          title: '试题内容',
          key: 'content',
          width: 360,
          align: 'center'
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
              }, '编辑')
            ])
          }
        }
      ]
    }
  },
  methods: {
    cancel () {
      this.isShowAddCategory = false
    },
    addNewCategory () {
      console.log('新增分类')
    },
    addCategoryClick () {
      this.isShowAddCategory = true
    },
    getDataList () {

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
    }
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
