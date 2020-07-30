import axios from '@/libs/api.request'

export const getList = (info) => {
  return axios.request({
    url: '/system/tCategoryExamination/list',
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
    url: '/system/tCategoryExamination/delete',
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
