<template>
<div class="subject-edit">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100" style="width:70%">
        <FormItem label="题目内容：" prop="description">
            <Input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入题目内容"/>
        </FormItem>
        <FormItem label="题目图片：" prop="url">
           <FileUpload ref="uploader2" v-model="formData.url" isImage :maxLength="1" />
        </FormItem>
         <FormItem label="题目分值：">
           <InputNumber :max="100" :min="1" v-model="formData.score"></InputNumber>
        </FormItem>
        <!-- <FormItem label="题目类型：" >
            <Select v-model="formData.type" style="width:200px">
               <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem> -->
        <FormItem  label="题目选项：" >
          <div class="anwser-item" v-for="(item,index) in formData.answers" :key="item.id">
             <div class="set-answer"><Checkbox v-model="item.is_true">答案</Checkbox></div>
             <div>
               <RadioGroup v-model="item.type" vertical>
                  <Radio label="0">
                      <Icon type="social-apple"></Icon>
                      <span>文本模式</span>
                  </Radio>
                  <Radio label="2">
                      <Icon type="social-android"></Icon>
                      <span>图片模式</span>
                  </Radio>
              </RadioGroup>
             </div>
            <Input v-model="item.text" v-if="item.type == '0'" type="textarea" :rows="2"  placeholder="请输入选项内容"/>
            <div class="img-upload" v-if="item.type == '2'" >
             <FileUpload ref="uploader" v-model="item.url" isImage :maxLength="1" />
            </div>
           <div class="del-btn">
            <Button icon="md-close" type="error" size="small" v-if="index>0" @click="delAnwserItem(index)">删除</Button>
           </div>
          </div>
          <div class="add-btn"> <Button icon="md-add" type="primary" size="small" @click="addAnwserItem" >添加</Button></div>
        </FormItem>
         <FormItem label="题目解析：" >
            <Input v-model="formData.analysis" type="textarea" :rows="2" placeholder="请输入题目解析"/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="$router.go(-1)" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
 </div>
</template>
<script>
import { add } from '@/api/subject'
import FileUpload from '_c/FileUpload'
export default {
  name: 'subject-edit', // 题目编辑页,
  components: {
    FileUpload
  },
  data () {
    return {
      formData: {
        analysis: '',
        score: 2,
        url: '',
        description: '',
        type: 0, // 0选择题 1填空题 2论述题',
        answers: [
          {
            'code': '',
            'id': 0,
            'is_true': true,
            'sort': 0,
            'text': '',
            'type': '0',
            'url': ''
          }
        ]
      },
      single: true,
      types: [
        {
          value: 0,
          label: '单选题'
        },
        {
          value: 1,
          label: '多选题'
        }
      ],
      ruleValidate: {
        description: [
          { required: true, message: '请输入题目内容', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入题目分值(正整数)', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    delAnwserItem (index) {
      this.formData.answers.splice(index, 1)
    },
    addAnwserItem () {
      if (this.formData.answers >= 8) {
        this.$Message.warning('最多设置8个题目选项~')
        return
      }
      let obj = {
        'code': '',
        'id': 0,
        'is_true': false,
        'sort': 0,
        'text': '',
        'type': '0',
        'url': ''
      }
      this.formData.answers.push(obj)
    },
    handleSubmit (name) {
      const self = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.formData.answers.length; i++) {
            self.formData.answers[i].url = self.$refs['uploader'][i].getData()
          }
          self.formData.url = self.$refs['uploader2'].getData()
          let tempArr = []
          if (!Array.isArray(this.formData.analysis)) {
            tempArr.push(self.formData.analysis)
            self.formData.analysis = tempArr
          }
          debugger
          add(this.formData).then(res => {
            console.log(res)
            this.$Message.success('提交成功!')
            this.$router.go(-1)
          }).catch(verr => {
            this.$Message.warning('操作失败,请稍后再试!')
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.subject-edit{
  display: flex;
  justify-content: center;
  .ivu-checkbox-wrapper{
   font-size: 14px;
  }
  .anwser-item{
   display: flex;
   align-items: center;
   margin-top: 10px;
   display: flex;
   border-bottom: solid 1px #ccc;
   padding-bottom: 10px;
   .set-answer{
     font-size: 14px;
     margin-left: 10px;
   }
   .img-upload{
     margin-left: 10px;
   }
   .del-btn{
     margin-left: 10px;
   }
  }
  .add-btn{
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
   .ivu-input-wrapper{
    width: 50%;
  }
}
</style>
