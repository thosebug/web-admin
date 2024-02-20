import request from '@/utils/request'

export function getPage(data) {
  return request({
    url: '/good/page',
    method: 'post',
    data
  })
}

export function updateIsBan(data) {
  return request({
    url: '/good/isBan',
    method: 'post',
    data
  })
}

export function deleteGood(data) {
  return request({
    url: 'good/del/' + data,
    method: 'get'
  })
}

export function createGood(data) {
  return request({
    url: '/good/add',
    method: 'post',
    data
  })
}

export function updateGood(data) {
  return request({
    url: '/good/update',
    method: 'post',
    data
  })
}
