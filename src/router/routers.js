import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  // {
  //   path: '/',
  //   name: '_home',
  //   redirect: '/home',
  //   component: Main,
  //   meta: {
  //     hideInMenu: true,
  //     notCache: true
  //   },
  //   children: [
  //     {
  //       path: '/home',
  //       name: 'home',
  //       meta: {
  //         hideInMenu: true,
  //         title: '首页',
  //         notCache: true,
  //         icon: 'md-home'
  //       },
  //       component: () => import('@/view/single-page/home')
  //     }
  //   ]
  // },
  {
    path: '/userManage',
    name: 'userManage',
    // redirect: '/userList',
    // meta: {
    //   icon: 'md-person', // 出现在面包屑
    //   title: '用户管理' // 不写此处代码，面包屑菜单名为 userManage
    // },
    component: Main,
    children: [
      {
        path: 'userList',
        name: 'userList',
        meta: {
          icon: 'md-person',
          title: '用户管理'
        },
        component: () => import('@/view/userManage/userList.vue')
      },
      {
        path: 'userEdit',
        name: 'userEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-person',
          title: '用户编辑'
        },
        component: () => import('@/view/userManage/userEdit.vue')
      }
    ]
  },
  {
    path: '/subjectManage',
    name: 'subjectManage',
    meta: {
      icon: 'ios-paper',
      title: '题库管理'
    },
    component: Main,
    children: [
      {
        path: 'subjectList',
        name: 'subjectList',
        meta: {
          icon: 'ios-paper',
          title: '题库管理'
        },
        component: () => import('@/view/subjectManage/subjectList.vue')
      },
      {
        path: 'subjectEdit',
        name: 'subjectEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-person',
          title: '题目编辑'
        },
        component: () => import('@/view/subjectManage/subjectEdit.vue')
      }
    ]
  },
  {
    path: '/testPaperManage',
    name: 'testPaperManage',
    meta: {
      icon: 'md-card',
      title: '试卷管理'
    },
    component: Main,
    children: [
      {
        path: 'testPaperList',
        name: 'testPaperList',
        meta: {
          icon: 'md-card',
          title: '试卷管理'
        },
        component: () => import('@/view/testPaperManage/testPaperList.vue')
      },
      {
        path: 'testPaperEdit',
        name: 'testPaperEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-person',
          title: '试卷编辑'
        },
        component: () => import('@/view/testPaperManage/testPaperEdit.vue')
      }
    ]
  },
  {
    path: '/auditManage',
    name: 'auditManage',
    meta: {
      icon: 'md-card',
      title: '解题审核'
    },
    component: Main,
    children: [
      {
        path: 'auditList',
        name: 'auditList',
        meta: {
          icon: 'md-card',
          title: '解题审核'
        },
        component: () => import('@/view/auditManage/auditList.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
