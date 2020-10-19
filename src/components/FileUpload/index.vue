<template>
    <section class="FileUpload" :class="isImage?'img-uploader':'normal'">
       <div v-if="isImage">
        <div class="image-block" v-for="(item,index) in fileList" :key="index" >
            <!-- <div class="image-block"> -->
            <template v-if="item.status === 'finished'">
                <img :src="item.url | pathFilter" :onerror="errorImg" class="preview-img">
                <div class="action-mask">
                    <!-- <Icon type="ios-eye-outline" size="20" style="margin-right:3px;" @click="$preview.open(index,previewList)"></Icon> -->
                    <Icon type="ios-trash-outline" size="20" @click.native="handleDelete(item)" v-if="!readonly"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
         </div>
       </div>
        <Modal v-model="visiable" title="裁剪图片" @on-ok="modalOk" @on-cancel="modalCancel" :mask-closable="false">
            <div style="height: 400px">
                <template v-if="visiable">
                    <!-- <vue-cropper v-if="fixedNumber.length" ref="cropper" :img="blobImg" autoCrop :fixed="fixed" :fixedNumber="fixedNumber" :autoCropWidth="autoCropWidthUse" :autoCropHeight="autoCropHeightUse" :fixedBox="isFixedBox" centerBox :outputType="'png'" :original="original" full :info="false"/>
                    <vue-cropper v-else ref="cropper" :img="blobImg" autoCrop :autoCropWidth="autoCropWidthUse" :autoCropHeight="autoCropHeightUse" :fixedBox="isFixedBox" centerBox :outputType="'png'" :original="original" full :info="false"/> -->
                </template>
            </div>
        </Modal>
        <Upload ref="uploader" name="file" :type="(readonly || !isImage)?'select':type" :action="action" :multiple="multiple" :accept="acceptType" :max-size="maxSize" :show-upload-list="showUploadList" :default-file-list="defaultList" :on-success="handleSuccess" :on-error="handleError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :on-remove="handleRemove" v-show="!isImage || (isImage && fileList.length<maxLength)" class="posi-rela">
            <input v-if="isEdit" ref="getImageInput" type="file" @change="inputOnchange" class="hiddenInput" @click="replaceClickEvent" />
            <div class="upload-block" v-if="!readonly && isImage" :style="{width:iWidth,height:iHeight,lineHeight:iHeight}">
                <Icon type="md-camera" size="20"></Icon>
            </div>
            <Button icon="ios-cloud-upload-outline" v-if="!readonly && !isImage">{{btnText}}</Button>
        </Upload>
    </section>
</template>

<script>
// import util from '@/libs/util'
// import { VueCropper } from 'vue-cropper'
// import { 'http://120.77.211.97/' } from '@/services/http'

// console.log(VueCropper)
/**
 * 图片上传组件
 * @description 基于iview <Upload>封装的文件上传组件, 外部要拿到fileList需调用本组件的getData()方法
 */
export default {
  name: 'FileUpload', // 公用组件单词首字母大写，业务组件驼峰命名
  props: {
    value: {
      type: String,
      default: '' // 文件url 逗号连接
    },
    isImage: {
      type: Boolean,
      default: false // 是否图片
    },
    hideUploadList: {
      type: Boolean,
      default: false // 是否显示上传列表
    },
    action: {
      type: String,
      default: 'http://120.77.211.97/' + 'common/upload' // 上传地址
    },
    type: {
      validator (value) {
        return ['select', 'drag'].includes(value)
      },
      default: 'drag' // drag 可拖拽
    },
    accept: {
      type: String,
      default: '' // input[type="file"] 原生属性
    },
    maxSize: {
      type: Number,
      default: 2048 // 文件最大大小,单位kb
    },
    maxLength: {
      type: [String, Number],
      default: 1, // 文件个数, 大于一时, multiple=true
      validator (value) {
        value += ''
        return !isNaN(parseInt(value, 10))
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '上传文件' // isImage为false时, 上传按钮的文字
    },
    imgWidth: {
      type: [String, Number],
      default: '58' // isImage为true时, 图片宽度(px)
    },
    imgHeight: {
      type: [String, Number],
      default: '58' // isImage为true时, 图片高度(px)
    },

    /* 图片剪裁属性 */
    isEdit: { // 是否开启图片可编辑
      type: Boolean,
      default: false
    },
    fixed: { // 是否开启剪裁狂按比例缩放
      type: Boolean,
      default: false
    },
    fixedNumber: { // 设置剪裁框按比例缩放，默认[1,1]
      type: Array,
      default: () => {
        return []
      }
    },
    autoCropWidth: { // 设置剪裁框固定宽度
      type: Number,
      default: 0
    },
    autoCropHeight: { // 设置剪裁框固定高度
      type: Number,
      default: 0
    },
    original: { // 大图是否缩放，false缩放，true不缩放
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultList: [],
      fileList: [],
      errorImg: `this.src="${require('@/assets/images/talkingdata.png')}"`,
      filesLength: 0,
      previewList: [],
      visiable: false,
      blobImg: null,
      autoCropWidthUse: this.autoCropWidth,
      autoCropHeightUse: this.autoCropHeight
    }
  },
  computed: {
    multiple: function () {
      return this.maxLength > 1
    },
    showUploadList: function () {
      // !isImage || !hideUploadList
      let result = true
      if (this.hideUploadList) {
        result = false
      } else if (this.isImage) {
        result = false
      }
      return result
    },
    iWidth: function () {
      return this.imgWidth + 'px'
    },
    iHeight: function () {
      return this.imgHeight + 'px'
    },
    acceptType: function () {
      let result = this.accept
      if (!result && this.isImage) {
        result = 'image/png, image/jpeg'
      }
      return result
    },
    isFixedBox () { // 是否允许裁剪框改变大小
      if (this.autoCropWidth && this.autoCropHeight) {
        return true
      }
      return false
    }
  },
  methods: {
    getImageRealWHR (url) {
      // 获取屏幕宽度 大于768px宽度520px 小于768px宽度自动
      let clientWidth = document.documentElement.clientWidth
      // margin 0 10   padding 16
      let contentWidth = clientWidth > 768 ? 520 - 32 : clientWidth - 20 - 32
      let contentHeight = 400
      let img = new Image()
      img.src = url
      img.onload = () => {
        let realWidth = img.width
        let realHeight = img.height
        // let realRate = realWidth / realHeight
        let scale = 1
        // 判断是否需要压缩大图
        if (!this.original) {
          if (realWidth > contentWidth) {
            // 如果图片宽度大于容器宽度
            scale = contentWidth / realWidth
          }

          if (realHeight * scale > contentHeight) {
            scale = contentHeight / realHeight
          }
        } else {
          scale = 1
        }
        // 显示大小 realWidth * scale
        // 显示大小 realHeight * scale
        // 裁剪框大小 realWidth * scale * 0.8 || realHeight * scale * 0.8 对比选短边
        let fixedWidth = Math.min(realWidth * scale * 0.8, realHeight * scale * 0.8)
        let max = this.fixedNumber.length ? Math.max.apply(null, this.fixedNumber) : 1
        let avg = fixedWidth / max
        let [widthRate = 1, heightRate = 1] = this.fixedNumber
        this.autoCropWidthUse = this.autoCropWidthUse || widthRate * avg
        this.autoCropHeightUse = this.autoCropHeightUse || heightRate * avg
      }
    },
    inputOnchange (e) {
      console.log(e.target.files[0])
      this.blobImg = window.URL.createObjectURL(e.target.files[0])
      this.visiable = true
      this.getImageRealWHR(this.blobImg)
      this.$refs.getImageInput.value = null
    },
    replaceClickEvent (e) {
      console.log(1)
      // e.preventDefault()
      e.stopPropagation()
    },
    modalOk () {
      this.$refs.cropper.getCropBlob((data) => {
        console.log(data)
        this.$refs.uploader.uploadFiles([data])
      })
    },
    modalCancel () {
      console.log('cancel')
    },
    handleSuccess (res, file, fileList) {
      console.log('上传成功')
      file.url = file.response
      console.log(res)
      if (!this.isImage && this.hideUploadList) {
        this.$Messge.success({
          title: '上传成功'
        })
        this.$emit('success')
        this.clearFiles()
      }
      this.updateFileList()
    },
    handleError (res, file, fileList) {
      console.log('上传失败')
      console.log(res)
      console.log(file)
      console.log(fileList)
      this.$Notice.error({
        title: '上传失败',
        desc: file
      })
      this.filesLength--
    },
    handleMaxSize (file, fileList) {
      this.$Notice.warning({
        title: `文件应小于${this.maxSize / 1024}MB`,
        desc: `[ ${file.name} ]`
      })
      this.filesLength--
    },
    handleBeforeUpload (files) {
      this.filesLength++
      const check = this.filesLength <= this.maxLength
      if (!check) {
        this.$Notice.warning({
          title: `文件数量最多为 ${this.maxLength}`
        })
        this.filesLength--
      }
      return check
    },
    handleRemove () {
      console.log('remove')
      this.filesLength--
    },
    handleDelete (file) {
      // console.log('删除');
      const fileList = this.$refs['uploader'].fileList
      this.$refs['uploader'].fileList.splice(fileList.indexOf(file), 1)
      this.filesLength--
      this.updateFileList()
    },
    /**
         * 坑.
         * 更新 fileList。无法直接监听<Upload>的结果, 需要在做改变结果的操作后手动更新fileList
         */
    updateFileList (flag) {
      // flag 是否从外部更新进来的
      if (flag) {
        setTimeout(() => {
          this.fileList = this.$refs['uploader'].fileList
          this.filesLength = this.fileList.length
          // this.isImage && (this.previewList = util.getPreviewData(this.fileList))
          // console.log('1', this.previewList);
        }, 0)
      } else {
        this.fileList = this.$refs['uploader'].fileList
        // this.isImage && (this.previewList = util.getPreviewData(this.fileList))
        // console.log('2', this.previewList);
      }
    },
    /**
         * 供外部组件提取当前文件url
         * @return this.fileList[0].url,this.fileList[1].url,this.fileList[2].url ...
         */
    getData () {
      const temp = []
      this.fileList.forEach(v => {
        /^http?/.test(v.url) ? temp.push(v.url) : temp.push(v.url.data)
      })
      const result = temp.join(',')
      return result
    },
    clearFiles () {
      // console.log('清除');
      this.$refs['uploader'].clearFiles()
      this.filesLength = 0
      this.updateFileList()
    },
    init (val) {
      if (val) {
        // console.log('默认值(处理前)',val);
        const result = []
        debugger
        const files = val.split(/[,，]/)
        for (const f of files) {
          result.push({
            name: '解题录音.mp3',
            url: f
          })
        }
        this.defaultList = result
        console.log('默认值change', this.defaultList)
        this.updateFileList(true)
      } else {
        this.clearFiles()
      }
    }
  },
  // components: { VueCropper },
  filters: {
    pathFilter: function (input) {
      return /^http?/.test(input.data) ? input.data : input
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.init(val)
      }
    }
  },
  mounted () {
    // console.log(this.isImage);
    // 必须这样初始化一下，否则上传第一张图片时会没有进度条
    this.fileList = this.$refs['uploader'].fileList
    this.init(this.value)
    if (this.isImage) {
      this.$nextTick(() => {
        document.querySelectorAll('.FileUpload.img-uploader .ivu-upload')[1].style.width = this.iWidth
      })
    }
  }
}
</script>

<style lang="less">
.posi-rela {
  position: relative;
}
.FileUpload {
  display: table; // BFC
  line-height: 0;
  margin-bottom: -8px;
  &.img-uploader {
    position: relative;
    .ivu-upload {
      display: inline-block;
      .ivu-upload {
        margin-bottom: 8px;
      }
    }
    i {
      vertical-align: middle;
      cursor: pointer;
    }
    .image-block {
      position: relative;
      display: block;
      margin-right: 8px;
      margin-bottom: 8px;
      max-height: 120px;
      padding: 2px;
      line-height: 60px;
      text-align: center;
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 1px 1px 1px #0000001c;
      float: left;
      &:hover .action-mask {
        opacity: 1;
        z-index: 1;
      }
    }
    .hiddenInput {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      opacity: 0;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .action-mask {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      color: #e8e8e8;
      background-color: #0000009e;
      opacity: 0;
      transition: all 0.3s;
      z-index: -1;
    }
    .upload-block {
      width: 58px;
      height: 58px;
      line-height: 58px;
    }
  }

  &.normal {
    .ivu-progress {
      line-height: 18px;
    }
    .ivu-upload-list-remove {
      margin-left: 10px;
    }
  }
}
</style>
