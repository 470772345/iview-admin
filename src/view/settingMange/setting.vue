<template>
  <div class="subject-list">
    <Form ref="formData" :model="formData"  :label-width="95" style="width:90%;">
         <FormItem  style="padding:10px">
          <div class="anwser-item" v-for="(item,index) in settingArr" :key="item.title">
              <div style="font-size:20px;margin:5px 0" >分数阶段{{index+1}}</div>
              <div>
                <label style="margin-right:10px">开始分数:</label>
                <InputNumber :max="1000" :min="0" class="input-width" v-model="item.from_score" placeholder="请输入开始分数" />
                <label style="margin-right:10px">结束分数:</label>
                <InputNumber :max="1000" :min="0" class="input-width" v-model="item.to_score" placeholder="请输入结束分数" />
              </div>
                <Input v-model="item.comments" type="textarea" :rows="3" :maxlength="150" placeholder="请输入评语(最多150字符)"/>
              <div class="btn">
                <Button icon="md-close" type="error" size="small" v-if="index>0" @click="delAnwserItem(index)">删除</Button>
              </div>
          </div>
          <div class="btn">
            <Button icon="md-add" type="primary" size="small" @click="addAnwserItem" >添加</Button>
            <Button icon="md-add" type="success" size="small" style="margin-left:10px" @click="saveSetting" >保存</Button>
            </div>
        </FormItem>
        </Form>
  </div>
</template>
<script>
import { addComments, getComments } from '@/api/setting'
export default {
  name: 'subject-list',
  data () {
    return {
      formData: {},
      settingArr: [
        {
          comments: '非常给力,继续努力哦',
          create_time: '',
          create_user: 0,
          from_score: 0,
          id: 0,
          to_score: 10
        }
      ]
    }
  },
  methods: {
    saveSetting () {
      for (let i = 0; i < this.settingArr.length; i++) {
        if (!this.settingArr[i].to_score && this.settingArr[i].to_score !== 0) {
          this.$Message.warning(`请输入分数阶段评语${i + 1}的结束分数`)
          return
        }
        if (!this.settingArr[i].from_score && this.settingArr[i].from_score !== 0) {
          this.$Message.warning(`请输入分数阶段评语${i + 1}的开始分数`)
          return
        }
        if (!this.settingArr[i].comments) {
          this.$Message.warning(`请输入分数阶段评语${i + 1}的评语~`)
          return
        }
      }
      addComments({ 'comments': this.settingArr }).then(res => {
        this.$Message.success('操作成功')
      })
    },
    addAnwserItem () {
      if (this.settingArr.length >= 8) {
        this.$Message.warning('最多设置8个~')
        return
      }
      let obj = {
        comments: '非常给力,继续努力哦',
        create_time: '',
        create_user: 0,
        from_score: 10,
        id: 0,
        to_score: 20
      }
      this.settingArr.push(obj)
    },
    delAnwserItem (index) {
      this.settingArr.splice(index, 1)
    },
    getComments (searchVal) {
      getComments().then(res => {
        this.settingArr = res
      })
    }
  },
  created () {
    this.getComments()
  }
}
</script>
<style lang="less" scoped>
.subject-list{
 .input-width{
    width:30%;
    margin: 10px;
  }
  .btn{
    text-align: center;
  }
 .right-side{
   padding: 10px;
 }
}
</style>
