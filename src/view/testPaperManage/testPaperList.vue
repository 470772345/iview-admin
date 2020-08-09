<template>
  <div class="test-paper-list">
   <Row>
        <Col span="4" class="left-side">
        <div class="c-header" >
          <div>试卷分类</div>
          <div><Button type='primary' @click="showCategoryModal">新增</Button></div>
          </div>
        <div :class="['c-item',item.id==curCategoryId?'selected-color':'']" v-for="item in categoryList" :key="item.id" @click="selectClick(item)">
          <div>{{item.name}}</div>
          <div class="c-btns">
            <Poptip
              confirm
              title="删除该分类后,分类下的试卷也会被删除,确定操作吗?"
              @on-ok="delCategoryClick(item)"
              @on-cancel="cancel">
             <Button  type="primary" shape="circle" icon="ios-create-outline" @click="showCategoryModal('edit',item)"></Button>
             <Button style="margin-left:10px" type='error' shape="circle" icon="md-close"></Button>
            </Poptip>
          </div>
        </div>
        </Col>
        <Col span="20" class="right-side" >
        <div v-if="categoryList.length>0">
         <myTable  @handleSearch="handleSearch" :searchable='true' :dataRes="dataRes" @handlePager="handlePager" :columns='columns' :value='dataList' :border='true' @addClick='addClick'></myTable>
        </div>
        <div class="no-tips" v-else>
          <div>请先添加一个试卷分类~~</div>
        </div>
        </Col>
    </Row>
    <Modal
        v-model="isShowAddCategory"
        :title="handleText"
        @on-ok="handleCategoryClick()"
        @on-cancel="cancel">
        <Input placeholder="请输入分类名称(最多8位)" :maxlength="maxLen" v-model="categoryParams.name" />
    </Modal>
  </div>
</template>
<script>
import myTable from '_c/tables'
import Pager from '_c/pager'
import * as TestPaperApi from '@/api/testPaper'
export default {
  name: 'test-paper-list',
  data () {
    return {
      handleCType: 'add',
      handleText: '新增分类',
      maxLen: 8,
      curCategoryId: 0,
      categoryList: [],
      categoryListParams: {
        'name': '',
        'page': 1,
        'size': 20
      },
      categoryParams: {
        'id': 0,
        'name': '',
        'sort': '',
        'url': ''
      },
      dataRes: {},
      paramsObj: {
        name: '',
        category_id: 0,
        page: 1,
        size: 10
      },
      isShowQutList: false,
      isShowAddCategory: false,
      qutDataList: [], // 题目列表
      dataList: [],
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
          key: 'total_scores',
          align: 'center'
        },
        {
          title: '题数',
          key: 'total_ques',
          align: 'center'
        },
        {
          title: '试卷总时长(分钟)',
          key: 'minute_limit',
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
          examination_id: row.id
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
    delCategoryClick (item) {
      TestPaperApi.delCategory(item).then(res => {
        if (res.data) {
          this.$Message.success('操作成功')
          this.getCategoryList()
        }
      })
    },
    getCategoryList () {
      TestPaperApi.getCategoryList(this.categoryListParams).then(data => {
        if (data.data && data.data.data && data.data.data.records) {
          this.categoryList = data.data.data.records
          if (!this.curCategoryId) {
            this.paramsObj.category_id = this.categoryList[0] && this.categoryList[0].id
            this.curCategoryId = this.categoryList[0] && this.categoryList[0].id
          }
          this.getList(this.paramsObj)
        }
      })
    },
    handleCategoryClick () {
      if (this.handleCType === 'add') {
        if (!this.categoryParams.name) {
          this.$Message.warning('分类名称不能空~')
          return
        }
        TestPaperApi.addCategory(this.categoryParams).then(data => {
          if (data.data && data.data.data) {
            this.$Message.success('操作成功')
            this.getCategoryList()
          }
        })
      } else if (this.handleCType === 'edit') {
        TestPaperApi.updateCategory(this.categoryParams).then(data => {
          if (data.data && data.data.data) {
            this.$Message.success('操作成功')
            this.getCategoryList()
          }
        })
      }
    },
    showCategoryModal (handleType, item) {
      if (handleType === 'edit') {
        this.categoryParams = JSON.parse(JSON.stringify(item))
        this.handleCType = 'edit'
        this.handleText = '编辑分类'
      } else {
        this.categoryParams.name = ''
        this.handleCType = 'add'
        this.handleText = '新增分类'
      }
      this.isShowAddCategory = true
    },
    selectClick (item) {
      // 切换选中样式
      this.curCategoryId = item.id
      this.paramsObj.category_id = item.id
      // this.switchSelectedStyle(item)
      // 刷新对应分类试卷列表
      this.getList()
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
        }, '编辑'),
        h('Poptip', {
          props: {
            confirm: true,
            title: '确定删除此条信息吗?',
            transfer: true
          },
          on: {
            'on-ok': () => {
              this.delExam(params.row)
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
  },
  created () {
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
   .no-tips{
     display: flex;
     justify-content: center;
     color: red;
     font-size: 20px;
     align-items: center;
     margin-top: 200px;
   }
 }
 .c-item{
   display: flex;
   justify-content: space-between;
   padding:10px 0;
   color:#222;
   font-size: 14px;
   margin:5px;
   padding-left: 6px;
   border-bottom: solid 1px #eee;
 }
 .c-item div:nth-child(2){
   display: none;
 }
 .c-item:hover div:nth-child(2){
   display: block;
 }
//  .c-item:hover~.c-btns {
//    background-color: red;
//    color: #2d8cf0
//  }
  .c-btns{
    display: flex;
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
