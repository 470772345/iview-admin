import axios from '@/libs/api.request'

export const login = ({ name, password }) => {
  const data = {
    name,
    password
  }
  return axios.request({
    url: '/common/syslogin',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
