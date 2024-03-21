import request from '@/utils/request'

export function getQuery() {
  return request({
    url: 'order/query',
    method: 'get'
  })
}

export function getPage(data) {
  return request({
    url: '/order/page',
    method: 'post',
    data
  })
}

export function deleteOrder(data) {
  return request({
    url: 'order/del/' + data,
    method: 'get'
  })
}

export function createOrder(data) {
  return request({
    url: '/order/add',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: '/order/update',
    method: 'post',
    data
  })
}
