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
        <FormItem label="题目类型：" >
            <Select v-model="formData.type" style="width:200px">
               <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem  label="题目选项：" >
          <div class="anwser-item" v-for="(item,index) in formData.answers" :key="item.title">
             <div class="set-answer"><Checkbox v-model="item.is_true">答案</Checkbox></div>
             <div>
               <RadioGroup v-model="item.type" vertical>
                  <Radio label="2">
                      <Icon type="social-apple"></Icon>
                      <span>文本</span>
                  </Radio>
                  <Radio label="0">
                      <Icon type="social-android"></Icon>
                      <span>图片</span>
                  </Radio>
              </RadioGroup>
             </div>
            <Input v-model="item.text" v-if="item.type == '2'" type="textarea" :rows="2"  placeholder="请输入选项内容"/>
            <div class="img-upload" v-if="item.type == '0'" >
             <FileUpload accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp" ref="uploader" v-model="item.text" isImage :maxLength="1" />
            </div>
           <div class="del-btn">
            <Button icon="md-close" type="error" size="small" v-if="index>0" @click="delAnwserItem(index)">删除</Button>
           </div>
          </div>
          <div class="add-btn"> <Button icon="md-add" type="primary" size="small" @click="addAnwserItem" >添加</Button></div>
        </FormItem>
         <FormItem label="音频解析：" >
            <!-- <Input v-model="formData.analysis" type="textarea" :rows="2" placeholder="请输入题目解析"/> -->
            <FileUpload accept='audio/mp3' ref="uploader3" v-model="MP3List" :isImage='false' :maxLength="5" :maxSize ='2048*5' showUploadList />
            <span>(请上传mp3格式~ 此处只显示老师的录音)</span>
        </FormItem>
        <FormItem label="文字解析：" >
            <Input v-model="formData.analysis_text" type="textarea" :rows="5" :maxlength="150" placeholder="请输入题目文字解析(最多150字符)"/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="$router.go(-1)" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
 </div>
</template>
<script>
import { add, getQueDetail, update } from '@/api/subject'
import FileUpload from '_c/FileUpload'
export default {
  name: 'subject-edit', // 题目编辑页,
  components: {
    FileUpload
  },
  data () {
    return {
      MP3List: '',
      formData: {
        analysis: [],
        score: 2,
        url: '',
        description: '',
        type: 0, // 0选择题 1填空题 2论述题',
        answers: [
          {
            'code': '',
            'id': 0,
            'is_true': false,
            'sort': 0,
            'text': '',
            'type': '0'
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
      if (this.formData.answers.length >= 8) {
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
    getCode (index) {
      const map = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      return map[index]
    },
    checkLastTrue () {
      let tempArr = []
      for (let i = 0; i < this.formData.answers.length; i++) {
        tempArr.push(this.formData.answers[i].is_true)
      }
      return tempArr.indexOf(true)
    },
    handleSubmit (name) {
      const self = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formData.answers) {
            if (this.checkLastTrue() == -1) {
              this.$Message.warning('请设置至少一个正确答案~')
              return
            }
            let j = -1 // 因为self.$refs有多个,有时是文本,所以下标不能共用
            for (let i = 0; i < this.formData.answers.length; i++) {
              this.formData.answers[i].code = this.getCode(i)
              this.formData.answers[i].sort = i + 1
              if (self.formData.answers[i].type == 0) { // type有时候是字符串
                console.log('text===')
                j++
                debugger
                console.log(self.$refs['uploader'][j])
                self.formData.answers[i].text = self.$refs['uploader'] && self.$refs['uploader'][j] && self.$refs['uploader'][j].getData()
              }
            }
          }
          self.formData.url = self.$refs['uploader2'].getData()
          let tempArr = (self.$refs['uploader3'].getData().length > 0 && self.$refs['uploader3'].getData().split(',')) || []
          if (tempArr.length > 0) {
            self.formData.analysis = []
          }
          for (let i = 0; i < tempArr.length; i++) {
            let tempObj = {}
            tempObj.url = tempArr[i]
            self.formData.analysis.push(tempObj)
          }
          if (this.$route.query.handleType === 'edit') {
            update(this.formData).then(res => {
              console.log(res)
              this.$Message.success('操作成功!')
              this.$router.go(-1)
            }).catch(verr => {
              this.$Message.warning('操作失败,请稍后再试!')
            })
          } else {
            add(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增成功!')
              this.$router.go(-1)
            }).catch(verr => {
              this.$Message.warning('操作失败,请稍后再试!')
            })
          }
        }
      })
    }
  },
  created () {
    if (this.$route.query.handleType === 'edit') {
      this.formData.id = this.$route.query.question_id
      let quesObj = {
        question_id: this.$route.query.question_id
      }
      getQueDetail(quesObj).then(res => {
        if (res.data && res.data && res.data.data) {
          if (res.data.data.answers && res.data.data.answers.length > 0) {
            for (let item of res.data.data.answers) {
              item.type = item.type + ''
            }
          }
          if (res.data.data.analysis && res.data.data.analysis.length > 0) {
            let tempAr = []
            for (let item of res.data.data.analysis) {
              tempAr.push(item.url)
            }
            this.MP3List = tempAr.join(',')
            // this.MP3List = [{
            //   name: '11.mp3',
            //   url: tempAr[0]
            // }, {
            //   name: '11.mp3',
            //   url: tempAr[0]
            // }]
          } else {
            res.data.data.analysis = []
          }
          this.formData = res.data.data
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
