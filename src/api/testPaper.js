import axios from '@/libs/api.request'

export const getList = (info) => {
  return axios.request({
    url: '/system/tExamination/list',
    data: info,
    method: 'post'
  })
}

export const getDetail = (info) => {
  return axios.request({
    url: '/system/tExamination/detail',
    data: info,
    method: 'post'
  })
}

// 获取试卷内的 问题列表
export const getQuestions = (info) => {
  return axios.request({
    url: '/system/tExamination/questions',
    data: info,
    method: 'post'
  })
}
export const add = (info) => {
  return axios.request({
    url: '/system/tExamination/add',
    data: info,
    method: 'post'
  })
}

export const update = (info) => {
  return axios.request({
    url: '/system/tExamination/update',
    data: info,
    method: 'post'
  })
}

export const delExam = (info) => {
  return axios.request({
    url: '/system/tExamination/delete',
    data: info,
    method: 'post'
  })
}

export const addCategory = (info) => {
  return axios.request({
    url: '/system/tCategory/add',
    data: info,
    method: 'post'
  })
}

export const delCategory = (info) => {
  return axios.request({
    url: '/system/tCategory/delete',
    data: info,
    method: 'post'
  })
}

export const getCategoryList = (info) => {
  return axios.request({
    url: '/system/tCategory/list',
    data: info,
    method: 'post'
  })
}

export const updateCategory = (info) => {
  return axios.request({
    url: '/system/tCategory/update',
    data: info,
    method: 'post'
  })
}
