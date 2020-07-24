<template>
<div class="subject-edit">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100" style="width:70%">
        <FormItem label="题目内容：" prop="name">
            <Input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入题目内容"/>
        </FormItem>
        <FormItem label="题目类型：" prop="name">
            <Select v-model="formData.type" style="width:200px">
               <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem v-if="formData.type == 0" label="题目选项：" prop="age">
          <div class="anwser-item" v-for="(item,index) in anwserList" :key="item.id">
             <div class="set-answer"><Checkbox v-model="item.isAnwser">答案</Checkbox></div>
            <Input v-model="item.answer" type="textarea" :rows="2"  placeholder="请输入选项内容"/>
            <div class="img-upload">
              <Upload ref="uploader" name="file" :type="(readonly || !isImage)?'select':type" :action="action" :multiple="multiple" :accept="acceptType" :max-size="maxSize" :show-upload-list="showUploadList" :default-file-list="defaultList" :on-success="handleSuccess" :on-error="handleError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :on-remove="handleRemove" v-show="!isImage || (isImage && fileList.length<maxLength)" class="posi-rela">
                  <input v-if="isEdit" ref="getImageInput" type="file" @change="inputOnchange" class="hiddenInput" @click="replaceClickEvent" />
                  <div class="upload-block" v-if="!readonly && isImage" :style="{width:iWidth,height:iHeight,lineHeight:iHeight}">
                      <Icon type="ios-camera" size="20"></Icon>
                  </div>
                  <Button icon="ios-cloud-upload-outline" v-if="!readonly && !isImage">{{btnText}}</Button>
              </Upload>
            </div>
           <div class="del-btn">
            <Button icon="md-close" type="error" size="small" v-if="index>0" @click="delAnwserItem(index)">删除</Button>
           </div>
          </div>
          <div class="add-btn"> <Button icon="md-add" type="primary" size="small" @click="addAnwserItem" >添加</Button></div>
        </FormItem>
         <FormItem label="题目解析：" prop="grade">
            <Input v-model="formData.a" type="textarea" :rows="2" placeholder="请输入题目解析"/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="$router.go(-1)" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
 </div>
</template>
<script>
export default {
  name: 'subject-edit', // 题目编辑页
  data () {
    return {
      formData: {
        description: '我是题目内容',
        type: 0 // 0选择题 1填空题 2论述题',
      },
      single: true,
      types: [
        {
          value: 0,
          label: '选择题'
        },
        {
          value: 1,
          label: '填空题'
        },
        {
          value: 2,
          label: '判断题'
        }
      ],
      anwserList: [
        {
          'index': '0',
          'question': '',
          'answer': '111',
          'isAnwser': true
        },
        {
          'index': '1',
          'question': '',
          'answer': '222',
          'isAnwser': false
        }
      ],
      ruleValidate: {
        name: [
          { required: true, message: '请输入题目内容', trigger: 'blur' }
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
      }
    }
  },
  methods: {
    handleUploadicon (file) {
      let splic = file.name.split('.')
      if (
        splic[splic.length - 1] === 'png' ||
                    splic[splic.length - 1] === 'jpg' ||
                    splic[splic.length - 1] === 'gif' ||
                    splic[splic.length - 1] === 'jpeg'
      ) {
        let formData = new FormData()
        formData.append('file', file)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.http
          .post(BASE_URL + '/fileUpload', formData, config)
          .then(resp => {
            if (resp.code === 'success') {
              this.formData.labelUrl = resp.data
              this.formData.productlogo = resp.data
            } else {
            }
          })
          .catch(() => {})
        return false
      }
    },
    handleFormatError1 (file) {
      this.$Message.info('图片格式不正确,请上传正确的图片格式')
    },
    delAnwserItem (index) {
      this.anwserList.splice(index, 1)
    },
    addAnwserItem () {
      if (this.anwserList.length >= 8) {
        this.$Message.warning('最多设置8个题目选项~')
        return
      }
      let obj = {
        question: '',
        answer: '111'
      }
      this.anwserList.push(obj)
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
