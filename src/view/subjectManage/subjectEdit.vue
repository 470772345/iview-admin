<template>
<div class="subject-edit">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="题目内容" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入题目内容"/>
        </FormItem>
        <FormItem label="题目选项" prop="age">
          <div class="anwser-item" v-for="(item,index) in anwserList" :key="item.id">
            <Input v-model="item.answer" placeholder="请输入选项内容"/>
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
            <Button icon="md-close" type="error" size="small" v-if="index>0" @click="delAnwserItem(index)"></Button>
           </div>
          </div>
          <div class="add-btn"> <Button icon="md-add" type="primary" size="small" @click="addAnwserItem" >添加</Button></div>
        </FormItem>
         <FormItem label="答案" prop="grade">
            <Input v-model="formValidate.mail" placeholder="请输入答题"/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
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
      anwserList: [
        { 'index': '0',
          'question': '',
          'answer': '111' },
        {
          'index': '1',
          'question': '',
          'answer': '222' }
      ],
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
    delAnwserItem (index) {
      this.anwserList.splice(index, 1)
    },
    addAnwserItem () {
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
  .anwser-item{
   margin-top: 10px;
   display: flex;
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
  }
}
</style>
