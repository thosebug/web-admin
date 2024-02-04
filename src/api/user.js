import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getPage(data) {
  return request({
    url: '/user/page',
    method: 'post',
    data
  })
}

export function changeRole(data) {
  return request({
    url: 'user/role',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: 'user/add',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: 'user/del/' + data,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
