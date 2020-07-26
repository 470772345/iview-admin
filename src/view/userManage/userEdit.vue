<template>
<div class="user-edit">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="用户名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入用户名称" ></Input>
        </FormItem>
        <FormItem label="年龄" prop="age">
            <Input v-model="formValidate.age" placeholder="请输入年龄"></Input>
        </FormItem>
         <FormItem label="年级" prop="grade">
            <Input v-model="formValidate.grade" placeholder="请输入年级"></Input>
        </FormItem>
         <FormItem label="手机号(账号)" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input type="password" v-model="formValidate.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="性别" prop="sex">
            <RadioGroup v-model="formValidate.sex">
                <Radio label="0">男</Radio>
                <Radio label="1">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="$router.go(-1)" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
 </div>
</template>
<script>
import * as User from '@/api/data'
export default {
  name: 'user-edit',
  data () {
    return {
      formValidate: {
        age: 0,
        grade: '',
        integral: 0,
        name: '',
        password: '',
        phone: '',
        sex: 0,
        status: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
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
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          User.addUser(this.formValidate).then(res => {
            if (res.data) {
              this.$router.go(-1)
              this.$Message.success('新增成功')
            }
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    getUserDetail (userObj) {
      User.updateUser(userObj).then(res => {
        if (res) {
          this.formValidate = res
        }
      })
    }
  },
  created () {
    console.log(this.$route.params.handleType)
    if (this.$route.params.handleType !== 'add') {
    // 编辑接口
      this.getUserDetail(this.$route.params.userObj)
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
