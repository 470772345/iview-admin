import axios from '@/libs/api.request'

export const getList = (info) => {
  return axios.request({
    url: '/system/tExamination/list',
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
