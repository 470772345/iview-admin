<template>
  <div class="subject-list">
    <Form ref="formData" :model="formData"  :label-width="95" style="width:90%;">
         <FormItem  style="padding:10px">
          <div class="anwser-item" v-for="(item,index) in settingObj" :key="item.title">
              <div style="font-size:20px;margin:5px 0" >分数阶段{{index+1}}</div>
              <div>
                <label style="margin-right:10px">开始分数:</label>
                <Input class="input-width" v-model="item.from_score" placeholder="试卷总分" />
                <label style="margin-right:10px">结束分数:</label>
                <Input class="input-width" v-model="item.from_score" placeholder="试卷总分" />
              </div>
                <Input v-model="item.comments" type="textarea" :rows="5" :maxlength="150" placeholder="请输入评语(最多150字符)"/>
              <div class="btn">
                <Button icon="md-close" type="error" size="small" v-if="index>0" @click="delAnwserItem(index)">删除</Button>
              </div>
          </div>
          <div class="btn">
            <Button icon="md-add" type="primary" size="small" @click="addAnwserItem" >添加</Button>
            <Button icon="md-add" type="success" size="small" style="margin-left:10px" @click="add" >保存</Button>
            </div>
        </FormItem>
        </Form>
  </div>
</template>
<script>
import { addComments, getComments } from '@/api/data'
export default {
  name: 'subject-list',
  data () {
    return {
      formData: {},
      settingObj: [
       	{
          'comments': '1111111111111',
          'create_time': '',
          'create_user': 0,
          'from_score': 20,
          'id': 0,
          'to_score': 30
        },
      	{
          'comments': '222222222',
          'create_time': '',
          'create_user': 0,
          'from_score': 10,
          'id': 0,
          'to_score': 20
        }
      ]
    }
  },
  methods: {
    addAnwserItem () {
      if (this.formData.answers >= 8) {
        this.$Message.warning('最多设置8个题目选项~')
        return
      }
      let obj = 	{
        'comments': '222222222',
        'create_time': '',
        'create_user': 0,
        'from_score': 10,
        'id': 0,
        'to_score': 20
      }
      this.settingObj.push(obj)
    },
    delAnwserItem (index) {
      this.settingObj.splice(index, 1)
    },
    getComments (searchVal) {
      getComments().then(res => {
        this.settingObj = res
      })
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
          name: 'subjectEdit',
          params: {
            handleType: 'add'
          }
        }
        )
      }
    },
    edit (row, status) {
      console.log('审核通过')
      const tempObj = {
        id: row.id,
        verify_status: status
      }
      addComments(tempObj).then(res => {
        this.$Message.success('操作成功')
        this.getList()
      })
      // 刷新列表
    },
    delAudit (obj) {
      delAudit(obj).then(res => {
        this.$Message.success('删除成功')
        this.getList()
      })
    },
    // updateStatus (obj, status) {
    //   obj.status = status
    //   update(obj).then(res => {
    //     this.$Message.success('操作成功')
    //   })
    // },
    async getList () {
      const { data } = await getList(this.paramsObj)
      if (data.data && data.data.records) {
        this.dataList = data.data.records
        this.dataRes = data.data
      }
    },
    cancel () {
      this.isShowAddCategory = false
    },
    addNewCategory () {
      console.log('新增分类')
    },
    addCategoryClick () {
      this.isShowAddCategory = true
    },
    selectClick (item) {
      // 切换选中样式
      this.switchSelectedStyle(item)
      // 刷新对应分类列表
    },
    switchSelectedStyle (item) {
      this.cList.map(function (arrayItem) {
        if (item.cId === arrayItem.cId) {
          arrayItem.isSelected = true
        } else {
          arrayItem.isSelected = false
        }
      })
      console.log(item.name)
    },
    playMp3 (value) {
      let id = value.row.id
      let i = document.getElementById(id).nextElementSibling
      let au = document.getElementById(id)
      console.log(au.src, 'url')
      if ((au.src.indexOf('mp3') === -1) && (au.src.indexOf('MP3') === -1)) {
        this.$Message.warning('音频格式不正确,请重新上传~')
        throw TypeError('音频格式不正确')
      }
      let endTime = au.duration
      if (au.dataset.flag === 'true') {
        if (this.preMp3Ids !== id && this.preMp3Ids) {
          let preId = this.preMp3Ids
          let preAu = document.getElementById(preId)
          if (preAu.dataset.flag === 'false') {
            let preEle = document.getElementById(preId).nextElementSibling
            preEle.textContent = '播放'
            preAu.dataset.flag = true
            preEle.style.cssText = 'color:#333333;font-style:normal;cursor:pointer'
            preAu.pause()
          }
        }
        this.preMp3Ids = id
        au.play()
        i.textContent = '暂停'
        i.style.cssText = 'color:red;font-style:normal;cursor:pointer'
        au.dataset.flag = false
      } else {
        au.pause()
        i.textContent = '播放'
        i.style.cssText = 'color:#2d8cf0;font-style:normal;cursor:pointer'
        au.dataset.flag = true
      }
      var interval = setInterval(function () {
        if (au.currentTime === endTime) {
          i.textContent = '播放'
          i.style.cssText = 'color:#2d8cf0;font-style:normal;cursor:pointer'
          au.dataset.flag = true
          clearInterval(interval)
        }
      }, 1000)
    },
    renderMp3Ele (h, params) {
      return h('div', {
        style: {

        }
      }, [
        h('audio', {
          style: {
            textAlign: 'center',
            padding: '4px',
            width: '100px'
          },
          attrs: {
            src: params.row.url,
            // src: 'http://120.77.211.97:80/common/uploadFile/20201014/91e21b7318c44d339e59442ee32df6a9.mp3',
            id: params.row.id,
            'data-flag': true
          }
        }, params.row.recordUrl),
        h('i', {
          style: {
            'font-style': 'normal',
            'color': '#2d8cf0',
            'cursor': 'pointer'
          },
          on: {
            click: () => {
              this.playMp3(params)
            }
          }
        }, '播放')
        // h('a', {
        //   'style': {
        //     'color': '#2d8cf0',
        //     'cursor': 'pointer',
        //     'margin': '0 2px'
        //   },
        //   attrs: {
        //     href: 'http://ai.foxcall.cn' + params.row.recordUrl
        //   }
        // }, '下载')
      ])
    },
    renderOptions2 (h, params) {
      let arr = params.row.answer_vos || []
      return h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }
        },
        arr.map((item, inde) => {
          if (item.type == 2) {
            return h('div', {
              style: {
                marginRight: '5px',
                marginTop: '5px'
              }
            }, `${item.code}: ${item.text} `)
          } else {
            return h('img', {
              attrs: {
                src: item.text
              },
              style: {
                width: 'auto',
                height: 'auto',
                maxWidth: '160px',
                marginTop: '5px',
                marginRight: '5px'
              }
            }, ``)
          }
        })
      )
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
              this.edit(params.row, 1)
            }
          }
        }, '审核通过'),
        h('Button', {
          props: {
            type: 'warning',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              this.edit(params.row, 2)
            }
          }
        }, '不通过'),
        h('Poptip', {
          props: {
            confirm: true,
            title: '确定删除此条信息吗?',
            transfer: true
          },
          on: {
            'on-ok': () => {
              this.delAudit(params.row)
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
    },
    renderVerifyStatus (h, status) {
      if (status === 0) {
        return h('span', {}, '待审核')
      } else if (status === 1) {
        return h('span', {style: {color: 'green'}}, '已通过')
      } else {
        return h('span', {
          style: {'color': '#ed5a36'}
        }, '不通过')
      }
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
 .c-item{
   padding:10px 0;
   color:#222;
   font-size: 14px;
   margin:5px;
   padding-left: 6px;
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
