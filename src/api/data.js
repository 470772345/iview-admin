import axios from '@/libs/api.request'

export const getUserList = (info) => {
  return axios.request({
    url: '/system/tUser/list',
    data: info,
    method: 'post'
  })
}
export const getUserDetail = (info) => {
  return axios.request({
    url: '/system/tUser/detail',
    data: info,
    method: 'post'
  })
}

export const addUser = (info) => {
  return axios.request({
    url: '/system/tUser/add',
    data: info,
    method: 'post'
  })
}

export const updateUser = (info) => {
  return axios.request({
    url: '/system/tUser/update',
    data: info,
    method: 'post'
  })
}

export const delUser = (info) => {
  return axios.request({
    url: '/system/tUser/delete',
    data: info,
    method: 'post'
  })
}

export const addComments = info => {
  return axios.request({
    url: '/system/tComments/add',
    data: info,
    method: 'post'
  })
}

export const getComments = info => {
  return axios.request({
    url: '/system/tComments/list',
    data: info,
    method: 'post'
  })
}
