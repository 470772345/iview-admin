import axios from '@/libs/api.request'

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
