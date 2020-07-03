<template>
<div class="user-edit">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width:90%">
        <FormItem label="试卷名称" prop="name">
            <Input class="input-width" v-model="formValidate.name" placeholder="请输入试卷名称" />
        </FormItem>
        <FormItem label="每题分值" prop="age">
            <Input class="input-width"  v-model="formValidate.mail" placeholder="请输入每题分值" />
        </FormItem>
        <div class="select-btn">
          <Button type="primary" @click="selectQuestion()">选择题目</Button>
          <Button type="error" style="margin-left:20px" @click="delQuestion()" >批量删除</Button>
       </div>
        <div>
          <myTable :columns='selectedQstList' :value='dataList' :border='true' :enableAdd='false' @on-selection-change="onSelectionChange"></myTable>
        </div>
        <div class="footer">
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="$router.go(-1)" style="margin-left: 8px">返回</Button>
        </div>
    </Form>
     <Modal
        v-model="isShowAddQuestion"
        width='80%'
        title="选择题目"
        @on-ok="addNewCategory()"
        @on-cancel="cancel">
        <myTable :searchable='true' :columns='columns' :value='dataList' :border='true' :enableAdd='false' ></myTable>
    </Modal>
 </div>
</template>
<script>
import myTable from '_c/tables'
export default {
  name: 'user-edit',
  data () {
    return {
      isShowAddQuestion: false,
      formValidate: {
        name: '',
        mail: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        interest: [
          { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
          { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ],
        date: [
          { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
        ],
        time: [
          { required: true, type: 'string', message: 'Please select time', trigger: 'change' }
        ],
        desc: [
          { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
          { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
        ]
      },
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
      selectedQstList: [
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
                  click: () => {
                    console.log('删除')
                  }
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
                    this.$router.push({ path: '../subjectManage/subjectEdit?id=' + this.dataList[params.index].id })
                  }
                }
              }, '编辑')
            ])
          }
        }
      ]
    }
  },
  components: {
    myTable
  },
  methods: {
    onSelectionChange (selection) {
      console.log('当前选中：', selection)
    },
    cancel () {
      this.isShowAddQuestion = false
    },
    delQuestion () {
      console.log('批量删除')
    },
    selectQuestion () {
      console.log('选择题目')
      this.isShowAddQuestion = true
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('提交成功!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
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
