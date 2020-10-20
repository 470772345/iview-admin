<template>
<div class="user-edit">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="用户名称" prop="name">
            <Input v-model="formData.name" placeholder="请输入用户名称" ></Input>
        </FormItem>
        <FormItem label="年龄" prop="age">
            <InputNumber :max="150" :min="1" v-model="formData.age"></InputNumber>
        </FormItem>
         <FormItem label="年级" prop="grade">
            <Input v-model="formData.grade" placeholder="请输入年级"></Input>
        </FormItem>
         <FormItem label="手机号(账号)" prop="phone">
            <Input v-model="formData.phone" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Row>
            <Col span="16" class="left-side" >
              <Input type="password" disabled v-model="formData.password" placeholder="请输入密码" />
            </Col>
          <Col span="4" class="left-side" >
            <Tooltip content="重置初始密码: 888888" placement="top">
               <Button style="margin-left:10px" @click="resetPsw">重置密码</Button>
            </Tooltip>
            </Col>
        </Row>
        </FormItem>
        <FormItem label="性别" prop="sex">
            <RadioGroup v-model="formData.sex">
                <Radio label="0">男</Radio>
                <Radio label="1">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="$router.go(-1)" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
 </div>
</template>
<script>
import * as User from '@/api/data'
import md5 from 'js-md5'
export default {
  name: 'user-edit',
  data () {
    return {
      formData: {
        age: 0,
        grade: '',
        integral: 0,
        name: '',
        password: '',
        phone: '',
        sex: '0',
        status: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        sex: [
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
    resetPsw () {
      const yan = '02j9em'
      this.formData.password = md5(yan + '888888').toUpperCase()
      this.$Message.success('已重置,提交保存后生效~~')
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$route.query.handleType === 'add') {
            User.addUser(this.formData).then(res => {
              if (res.data) {
                this.$router.go(-1)
                this.$Message.success('新增成功')
              }
            })
          } else {
            User.updateUser(this.formData).then(res => {
              if (res.data) {
                this.$router.go(-1)
                this.$Message.success('操作成功')
              }
            })
          }
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    getUserDetail (userObj) {
      User.getUserDetail(userObj).then(res => {
        if (res && res.data && res.data.data) {
          this.formData = res.data.data
          this.formData.sex = '' + this.formData.sex
        }
      })
    }
  },
  created () {
    if (this.$route.query.handleType !== 'add') {
      // 编辑接口
      this.getUserDetail(this.$route.query.userObj)
    }
  }
}
</script>

<style scoped>
.user-edit{
  display: flex;
  justify-content: center
}
</style>
