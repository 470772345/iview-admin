import axios from '@/libs/api.request'

export const getList = (info) => {
  return axios.request({
    url: '/system/tQuestion/list',
    data: info,
    method: 'post'
  })
}

export const add = (info) => {
  return axios.request({
    url: '/system/tQuestion/add',
    data: info,
    method: 'post'
  })
}

export const update = (info) => {
  return axios.request({
    url: '/system/tQuestion/update',
    data: info,
    method: 'post'
  })
}

export const getQueDetail = (info) => {
  return axios.request({
    url: '/system/tQuestion/detail',
    data: info,
    method: 'post'
  })
}
export const delQuestion = (info) => {
  return axios.request({
    url: '/system/tQuestion/delete',
    data: info,
    method: 'post'
  })
}

export const upload = (info) => {
  return axios.request({
    url: '/common/upload',
    data: info,
    method: 'post',
    'Content-Type': 'multipart/form-data'
  })
}
