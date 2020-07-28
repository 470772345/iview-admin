<template>
  <div class="test-paper-list">
   <Row>
        <Col span="4" class="left-side">
        <div class="c-header" >
          <div>试卷分类</div>
          <div><Button type='primary' @click="addCategoryClick">新增</Button></div>
          </div>
        <div :class="['c-item',item.id==curCategoryId?'selected-color':'']" v-for="item in categoryList" :key="item.id" @click="selectClick(item)">{{item.name}}</div>
        </Col>
        <Col span="20" class="right-side">
         <myTable :searchable='true' :dataRes="dataRes" @handlePager="handlePager" :columns='columns' :value='dataList' :border='true' @addClick='addClick'></myTable>
        </Col>
    </Row>
    <Modal
        v-model="isShowAddCategory"
        title="新增分类"
        @on-ok="addNewCategory()"
        @on-cancel="cancel">
        <Input placeholder="请输入分类名称" v-model="categoryParams.name" />
    </Modal>
    <Modal
        width="60%"
        v-model="isShowQutList"
        title="题目列表"
        @on-ok="QutClick()"
        @on-cancel="cancel">
        <myTable :searchable='true' :dataRes="dataRes" @handlePager="handlePager" :columns='qutListCols' :value='qutDataList' :border='true' @on-selection-change="selectQutClick"></myTable>
    </Modal>
  </div>
</template>
<script>
import myTable from '_c/tables'
import Pager from '_c/pager'
// import { getList, update, delExam } from '@/api/testPaper'
import * as TestPaperApi from '@/api/testPaper'
export default {
  name: 'test-paper-list',
  data () {
    return {
      curCategoryId: 0,
      categoryList: [],
      categoryListParams: {
        'name': '',
        'page': 1,
        'size': 10
      },
      categoryParams: {
        'id': 0,
        'name': '',
        'sort': '',
        'url': ''
      },
      dataRes: {},
      paramsObj: {
        category_id: 0,
        page: 1,
        size: 10
      },
      isShowQutList: false,
      isShowAddCategory: false,
      qutDataList: [{
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
      },
      {
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
      dataList: [],
      qutListCols: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '试题内容',
          key: 'content',
          width: 300,
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
          align: 'center'
        },
        {
          title: '试题类型',
          key: 'subjectType',
          align: 'center'
        }
      ],
      columns: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '试卷名称',
          key: 'title',
          align: 'center',
          render: (h, params) => (<a onClick={() => this.edit(params.row)}>{params.row.title}</a>)
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
          render: (h, params) => this.renderOptions(h, params)
        }
      ]
    }
  },
  components: {
    myTable,
    Pager
  },
  methods: {
    // 操作分页组件
    handlePager (pager) {
      this.paramsObj.page = pager.current
      this.paramsObj.size = pager.size
      this.getList()
    },
    addClick (handleType) {
      if (handleType === 'add') {
        this.$router.push({
          name: 'testPaperEdit',
          params: {
            handleType: 'add'
          }
        }
        )
      }
    },
    edit (row) {
      this.$router.push({
        name: 'testPaperEdit',
        params: {
          handleType: 'edit',
          userObj: row
        }
      }
      )
    },
    delExam (obj) {
      TestPaperApi.delExam(obj).then(res => {
        this.$Message.success('删除成功')
        this.getList()
      })
    },
    updateStatus (obj, status) {
      obj.status = status
      TestPaperApi.update(obj).then(res => {
        this.$Message.success('操作成功')
      })
    },
    async getList () {
      const { data } = await TestPaperApi.getList(this.paramsObj)
      if (data.data && data.data.records) {
        this.dataList = data.data.records
        this.dataRes = data.data
      }
    },
    selectQutClick (selection) {
      console.log('选择', selection)
    },
    cancel () {
      this.isShowAddCategory = false
    },
    getCategoryList () {
      TestPaperApi.getCategoryList(this.categoryParams).then(data => {
        if (data.data && data.data.data && data.data.data.records) {
          this.categoryList = data.data.data.records
        }
      })
    },
    addNewCategory () {
      TestPaperApi.addCategory(this.categoryParams).then(data => {
        if (data.data && data.data.data) {
          this.$Message.success('操作成功')
          this.getList()
        }
      })
    },
    addCategoryClick () {
      this.isShowAddCategory = true
    },
    selectClick (item) {
      // 切换选中样式
      this.curCategoryId = item.id
      this.paramsObj.category_id = item.id
      // this.switchSelectedStyle(item)
      // 刷新对应分类列表
      this.getCategoryList()
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
    this.getList(this.paramsObj)
    this.getCategoryList(this.categoryListParams)
  }
}
</script>

<style  lang="less" scoped>
.test-paper-list{
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
