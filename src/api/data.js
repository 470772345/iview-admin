import axios from '@/libs/api.request'

export const getUserList = (info) => {
  return axios.request({
    url: '/system/tUser/list',
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

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}
