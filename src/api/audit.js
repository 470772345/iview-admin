import axios from '@/libs/api.request'

export const getList = (info) => {
  return axios.request({
    url: '/system/tAnalysis/list',
    data: info,
    method: 'post'
  })
}

export const verify = (info) => {
  return axios.request({
    url: '/system/tAnalysis/verify',
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
