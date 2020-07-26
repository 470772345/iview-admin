<template>
    <section class="pager">
        <Page :total="pager.total" :current="pager.current" :page-size="pager.size"
        :page-size-opts="pager.pageSizeOpts" :show-sizer="showSizer" :show-elevator="showElevator"
        :show-total="showTotal" :simple="simple" :size="sizeSelf" @on-change="handleChange"
        @on-page-size-change="handlePageSizeChange"></Page>
    </section>
</template>

<script>
/**
 * 分页组件
 * @param {Object} config {total: 0,size: 10, current: 1}
 * @returns {Function} on-change({current: '', size:''})
 */
export default {
  name: 'Pager', // 公用组件单词首字母大写，业务组件驼峰命名
  props: {
    config: {
      type: Object
    },
    showSizer: {
      type: Boolean,
      default: true
    },
    showElevator: {
      type: Boolean,
      default: true
    },
    showTotal: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      validator (value) {
        return ['small'].includes(value)
      }
    },
    simple: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    pager: function () {
      // console.log('===设置分页数据===');
      const _config = {
        total: 0,
        size: 10,
        pageSizeOpts: [10, 20, 30, 40],
        current: 1
      }
      const _result = Object.assign({}, _config, this.config)
      // console.log(_result.total, _result.size, _result.current);
      return _result
    },
    sizeSelf: function () {
      let _result = this.size
      // if (window.innerWidth < 768) {
      //     _result = 'small'
      // }
      return _result
    }
  },
  methods: {
    handleChange (currentPage) {
      this.$emit('on-change', { current: currentPage, size: this.pager.size })
    },
    handlePageSizeChange (size) {
      this.$emit('on-change', { current: this.pager.current, size: size })
    }
  },
  components: {},
  filters: {},
  watch: {},
  mounted () { }
}
</script>

<style lang="less">
.pager {
  text-align: center;
  .ivu-page {
    display: inline-block;
  }
  @media screen and (max-width: 768px) {
    .ivu-page-total {
      display: none;
      height: 24px;
      line-height: 24px;
    }
    .ivu-page-next,
    .ivu-page-prev {
      margin: 0;
      min-width: 24px;
      height: 24px;
      line-height: 22px;
      border: 0;
    }
    .ivu-page-item {
      border: 0;
      margin: 0;
      min-width: 24px;
      height: 24px;
      line-height: 24px;
    }
    .ivu-page-options-elevator input {
      padding: 1px 7px;
      height: 24px;
      border-radius: 3px;
      width: 44px;
    }
    .ivu-select-single .ivu-select-selection {
      height: 24px;
      border-radius: 3px;
      .ivu-select-placeholder,
      .ivu-select-selected-value {
        height: 22px;
        line-height: 22px;
      }
    }
  }
}
</style>
