<template>
<div class="user-edit">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="95" style="width:90%">
        <FormItem label="试卷名称" prop="title">
            <Input class="input-width" v-model="formData.title" placeholder="请输入试卷名称" />
        </FormItem>
        <FormItem label="试卷总用时" >
           <InputNumber :max="200" :min="1" v-model="formData.minute_limit"></InputNumber>
        </FormItem>
        <FormItem label="试卷总分" prop="single_scores">
            <Input class="input-width" disabled  v-model="formData.total_scores" placeholder="试卷总分" />
        </FormItem>
        <FormItem label="试卷类别" prop="category_id">
            <Select v-model="formData.category_id" style="width:200px">
            <Option v-for="item in categoryList" :value="item.id" :key="item.value">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <div class="select-btn">
          <Button type="primary" @click="selectQuestion()">选择题目</Button>
          <Button type="error" style="margin-left:20px" @click="delQuestion()" >批量删除</Button>
       </div>
        <div>
          <myTable :hasPager="false" :columns='selectedCols' :value='selectedQstList' :border='true' :enableAdd='false' @on-selection-change="onSelectionChange"></myTable>
        </div>
        <div class="footer">
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="$router.go(-1)" style="margin-left: 8px">返回</Button>
        </div>
    </Form>
     <Modal
        v-model="isShowAddQuestion"
        width='80%'
        title="选择题目"
        @on-ok="commitSelect()"
        @on-cancel="cancel">
        <myTable :searchable='true' :columns='columns' :value='quesDataList' :border='true' :enableAdd='false' @on-selection-change="onSelection2" ></myTable>
    </Modal>
 </div>
</template>
<script>
import myTable from '_c/tables'
import { getCategoryList, add, getDetail, update } from '@/api/testPaper'
import { getList } from '@/api/subject'
export default {
  name: 'user-edit',
  data () {
    return {
      seletcedOnModalList: [],
      quesParamsObj: {
        page: 1,
        size: 10
      },
      categoryListParams: {
        'name': '',
        'page': 1,
        'size': 10
      },
      categoryList: [],
      isShowAddQuestion: false,
      formData: {
        'single_scores': 2,
        'category_id': 0,
        'id': 0,
        'minute_limit': 1,
        'question_ids': [],
        'sort': 0,
        'title': '',
        'total_scores': '0'
      },
      ruleValidate: {
        title: [
          { required: true, message: '请输入试卷标题', trigger: 'blur' }
        ],
        minute_limit: [
          { required: true, message: '请输入试卷总用时', trigger: 'blur' }
        ]
      },
      selectedQstList: [],
      quesDataList: [],
      selectedCols: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '试题内容',
          key: 'description',
          width: 360,
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
          title: '操作',
          key: 'actor',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => this.delHasSelectdQ(params.row.id)
                }
              }, '删除')
            ])
          }
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '试题内容',
          key: 'description',
          width: 360,
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
        }
      ]
    }
  },
  components: {
    myTable
  },
  methods: {
    commitSelect () {
      console.log('选中的题目')
      this.selectedQstList = this.seletcedOnModalList
    },
    getCategoryList () {
      getCategoryList(this.categoryListParams).then(data => {
        if (data.data && data.data.data && data.data.data.records) {
          this.categoryList = data.data.data.records
          this.formData.category_id = (this.categoryList[0] && this.categoryList[0].id)
        }
      })
    },
    onSelectionChange (selection) {
      console.log('当前选中：', selection)
    },
    // modal 选中的
    onSelection2 (selection) {
      this.seletcedOnModalList = selection
    },
    cancel () {
      this.isShowAddQuestion = false
    },
    delQuestion () {
      console.log('批量删除')
    },
    delHasSelectdQ (id) {
      for (let i = 0; i < this.selectedQstList.length; i++) {
        if (this.selectedQstList[i].id === id) {
          this.selectedQstList.splice(i, 1)
          break
        }
      }
    },
    selectQuestion () {
      console.log('选择题目')
      this.isShowAddQuestion = true
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.formData)
          let tempArr = []
          for (let i = 0; i < this.selectedQstList.length; i++) {
            tempArr.push(this.selectedQstList[i].id)
          }
          this.formData.total_ques = this.selectedQstList.length
          this.formData.total_scores = this.formData.total_ques * this.formData.single_scores
          this.formData.question_ids = tempArr
          // 判断是否编辑
          if (this.$route.params.handleType === 'edit') {
            update(this.formData).then(res => {
              if (res) {
                this.$Message.success('操作成功!')
                this.$router.go(-1)
              }
            })
          } else {
            add(this.formData).then(res => {
              if (res.data) {
                this.$Message.success('操作成功!')
                this.$router.go(-1)
              }
            })
          }
        }
      })
    },
    async getList () {
      const { data } = await getList(this.quesParamsObj)
      if (data.data && data.data.records) {
        this.quesDataList = data.data.records
        this.dataRes = data.data
      }
    }
  },
  created () {
    this.getCategoryList()
    this.getList()
    if (this.$route.params.handleType === 'edit') {
      this.formData.id = this.$route.params.examination_id
      let params = {
        examination_id: this.$route.params.examination_id,
        show: true,
        page: 1,
        size: 1
      }
      getDetail(params).then(res => {
        if (res.data && res.data.data && res.data.data.records) {
          this.selectedQstList = res.data.data.records
        }
      })
    }
  },
  watch: {
    quesDataList: {
      handler: function (val) {
        let total = 0
        for (const item of val) {
          total = total + item.score
        }
        this.formData.total_scores = total
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit{
  padding: 20px;
  display: flex;
  justify-content: center;
  .select-btn{
    padding: 20px 0;
  }
  .footer{
    display: flex;
    justify-content: center;
    padding: 10px;
  }
  .input-width{
    width:30%
  }
}
</style>
