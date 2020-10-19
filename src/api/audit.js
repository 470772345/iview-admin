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

export const delAudit = (info) => {
  return axios.request({
    url: '/system/tAnalysis/delete',
    data: info,
    method: 'post'
  })
}
